import React, { useState, useEffect, useRef } from 'react';
import { Zap, ArrowUpCircle, ScrollText, Pickaxe, RotateCcw } from 'lucide-react';
import type { Realm, GameState, Facility } from './types/game';
import { isValidSaveData, migrateSaveData } from './utils/save';

// --- Constants & Data ---
const REALMS: Realm[] = [
  { name: "練氣期", threshold: 1000, multiplier: 1 },
  { name: "筑基期", threshold: 50000, multiplier: 5 },
  { name: "金丹期", threshold: 2000000, multiplier: 25 },
  { name: "元嬰期", threshold: 100000000, multiplier: 125 },
  { name: "化神期", threshold: 5000000000, multiplier: 625 },
  { name: "大乘期", threshold: Infinity, multiplier: 3125 }
];

const INITIAL_FACILITIES: Facility[] = [
  { id: 'array', name: '聚靈陣', baseCost: 10, baseProduction: 1, level: 0 },
  { id: 'garden', name: '藥園', baseCost: 100, baseProduction: 10, level: 0 },
  { id: 'vein', name: '靈脈', baseCost: 1100, baseProduction: 80, level: 0 },
  { id: 'furnace', name: '煉丹爐', baseCost: 12000, baseProduction: 470, level: 0 },
  { id: 'tree', name: '悟道樹', baseCost: 130000, baseProduction: 2600, level: 0 }
];

const INITIAL_STATE: GameState = {
  saveVersion: 1,
  qi: 0,
  realmIndex: 0,
  facilities: INITIAL_FACILITIES,
  logs: ["【系統】歡迎來到凡人修仙傳：放置篇。開始你的修仙之旅吧！"],
};

// --- Helper Functions ---
/**
 * 格式化大數字 (如 1.5k, 2.0M)
 */
const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  const suffixIndex = Math.floor(Math.log10(num) / 3);
  
  if (suffixIndex >= suffixes.length) {
    return num.toExponential(2);
  }
  
  const shortValue = num / Math.pow(1000, suffixIndex);
  return Number(shortValue.toFixed(1)) + suffixes[suffixIndex];
};

/**
 * 數值公式與邏輯說明：
 * 
 * 1. 設施成本計算 (calculateCost):
 *    公式：成本 = 基礎成本 * (1.15 ^ 當前等級)
 *    說明：每次購買設施後，下一次購買的成本會增加 15%。這是一個標準的放置遊戲指數增長模型，
 *          確保玩家需要不斷提升產量才能購買更高級的設施。
 */
const calculateCost = (baseCost: number, level: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, level));
};

/**
 * 2. 靈氣產量計算 (calculateProduction):
 *    公式：總產量 = 總和(設施基礎產量 * 設施等級) * 境界倍率
 *    說明：每個設施的產量是線性的（等級 * 基礎產量）。
 *          境界突破會提供一個全域的倍率加成（multiplier），這是遊戲中後期數值爆發的關鍵。
 */
const calculateProduction = (facilities: Facility[], realmMultiplier: number): number => {
  let total = 0;
  facilities.forEach(f => {
    total += f.baseProduction * f.level;
  });
  return total * realmMultiplier;
};

export default function App() {
  // --- State Management ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('xianxia_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = migrateSaveData(parsed);
        if (!isValidSaveData(migrated)) {
          return INITIAL_STATE;
        }

        // 合併初始狀態以處理未來可能新增的設施
        return { 
          ...INITIAL_STATE, 
          ...migrated,
          facilities: INITIAL_STATE.facilities.map(f => {
            const savedF = migrated.facilities.find((sf) => sf.id === f.id);
            return savedF ? { ...f, level: savedF.level } : f;
          }) 
        };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // 使用 ref 來儲存最新狀態，避免在 requestAnimationFrame 迴圈中產生閉包陷阱
  const stateRef = useRef(gameState);
  const lastTickRef = useRef(performance.now());
  const saveTimerRef = useRef(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // 同步 React state 到 ref
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  // 自動滾動日誌到底部
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.logs]);

  // --- Game Loop ---
  useEffect(() => {
    let animationFrameId: number;

    const loop = (time: number) => {
      const delta = (time - lastTickRef.current) / 1000; // 轉換為秒
      lastTickRef.current = time;

      const currentState = stateRef.current;
      const currentRealm = REALMS[currentState.realmIndex];
      const qps = calculateProduction(currentState.facilities, currentRealm.multiplier);

      if (qps > 0) {
        const generatedQi = qps * delta;
        
        // 直接更新 ref 以提高效能
        stateRef.current = {
          ...currentState,
          qi: currentState.qi + generatedQi
        };
        
        // 每幀更新 React state 以保持 UI 流暢
        setGameState(stateRef.current);
      }

      // 每 10 秒自動存檔
      saveTimerRef.current += delta;
      if (saveTimerRef.current >= 10) {
        localStorage.setItem('xianxia_save', JSON.stringify(stateRef.current));
        saveTimerRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- Interactions ---
  const handleMeditate = () => {
    const currentRealm = REALMS[stateRef.current.realmIndex];
    // 3. 冥想點擊收益: 單次點擊收益 = 1 * 境界倍率
    const clickPower = 1 * currentRealm.multiplier;
    
    setGameState(prev => ({
      ...prev,
      qi: prev.qi + clickPower
    }));
  };

  const handleBuy = (facilityId: string) => {
    setGameState(prev => {
      const facilityIndex = prev.facilities.findIndex(f => f.id === facilityId);
      const facility = prev.facilities[facilityIndex];
      const cost = calculateCost(facility.baseCost, facility.level);

      if (prev.qi >= cost) {
        const newFacilities = [...prev.facilities];
        newFacilities[facilityIndex] = {
          ...facility,
          level: facility.level + 1
        };
        
        const newLogs = [...prev.logs, `【建設】你花費了 ${formatNumber(cost)} 靈氣，升級了 ${facility.name} (Lv.${facility.level + 1})`];
        if (newLogs.length > 50) newLogs.shift(); // 保持日誌長度

        return {
          ...prev,
          qi: prev.qi - cost,
          facilities: newFacilities,
          logs: newLogs
        };
      }
      return prev;
    });
  };

  const handleBreakthrough = () => {
    setGameState(prev => {
      const currentRealm = REALMS[prev.realmIndex];
      if (prev.qi >= currentRealm.threshold && prev.realmIndex < REALMS.length - 1) {
        const nextRealm = REALMS[prev.realmIndex + 1];
        const newLogs = [...prev.logs, `【突破】天降祥瑞！你成功突破至 ${nextRealm.name}，靈氣獲取倍率提升至 ${nextRealm.multiplier}x！`];
        if (newLogs.length > 50) newLogs.shift();

        return {
          ...prev,
          qi: prev.qi - currentRealm.threshold,
          realmIndex: prev.realmIndex + 1,
          logs: newLogs
        };
      }
      return prev;
    });
  };

  const handleReset = () => {
    if (confirm('確定要散功重修嗎？這將清除所有進度！')) {
      localStorage.removeItem('xianxia_save');
      setGameState(INITIAL_STATE);
      stateRef.current = INITIAL_STATE;
    }
  };

  // --- Render ---
  const currentRealm = REALMS[gameState.realmIndex];
  const qps = calculateProduction(gameState.facilities, currentRealm.multiplier);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col selection:bg-amber-900/50">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-amber-900/50 p-6 shadow-md shadow-amber-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 tracking-widest flex items-center gap-2">
            <ScrollText className="w-8 h-8" />
            凡人修仙傳<span className="text-lg text-zinc-500 ml-2 font-normal">放置篇</span>
          </h1>
          <div className="mt-2 text-xl flex items-center gap-2">
            當前境界：<span className="text-amber-400 font-semibold">{currentRealm.name}</span>
            <span className="text-sm text-zinc-500 ml-2 bg-zinc-800 px-2 py-1 rounded-md">產量倍率: {currentRealm.multiplier}x</span>
          </div>
        </div>
        <div className="text-left sm:text-right bg-zinc-950 p-4 rounded-xl border border-zinc-800 min-w-[200px]">
          <div className="text-sm text-zinc-400 flex items-center sm:justify-end gap-1 mb-1">
            <Zap className="w-4 h-4 text-amber-500" /> 天地靈氣
          </div>
          <div className="text-4xl font-mono text-amber-300 font-bold tracking-tight">{formatNumber(gameState.qi)}</div>
          <div className="text-sm text-green-400/80 mt-1 font-mono">+{formatNumber(qps)} / 秒</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-0">
        
        {/* Left: Interaction */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Meditate Area */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden shadow-inner shadow-black/50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            
            <button 
              onClick={handleMeditate}
              className="w-48 h-48 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border-4 border-amber-700/50 shadow-[0_0_30px_rgba(217,119,6,0.15)] hover:shadow-[0_0_50px_rgba(217,119,6,0.3)] hover:border-amber-500 hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center group relative z-10"
            >
              <span className="text-5xl mb-2 transition-transform group-hover:-translate-y-1 duration-300">🧘‍♂️</span>
              <span className="text-2xl font-bold text-amber-500 tracking-widest group-hover:text-amber-400">冥想</span>
              <span className="text-xs text-zinc-500 mt-2 font-mono">點擊凝聚靈氣</span>
            </button>
          </div>

          {/* Breakthrough Panel */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-zinc-100 mb-4 border-b border-zinc-800 pb-3 flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-amber-500" /> 境界突破
            </h2>
            {gameState.realmIndex < REALMS.length - 1 ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-zinc-400">目標境界：</span>
                  <span className="text-amber-400 font-bold text-lg">{REALMS[gameState.realmIndex + 1].name}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-zinc-400">所需靈氣：</span>
                  <span className={`font-mono ${gameState.qi >= REALMS[gameState.realmIndex].threshold ? "text-green-400" : "text-red-400"}`}>
                    {formatNumber(gameState.qi)} / {formatNumber(REALMS[gameState.realmIndex].threshold)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-zinc-950 rounded-full h-3 border border-zinc-800 overflow-hidden relative">
                  <div 
                    className="bg-gradient-to-r from-amber-700 to-amber-500 h-full rounded-full transition-all duration-300 relative" 
                    style={{ width: `${Math.min(100, (gameState.qi / REALMS[gameState.realmIndex].threshold) * 100)}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>

                <button
                  onClick={handleBreakthrough}
                  disabled={gameState.qi < REALMS[gameState.realmIndex].threshold}
                  className="mt-2 w-full py-4 rounded-xl font-bold tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-amber-700 hover:bg-amber-600 text-white shadow-lg shadow-amber-900/20 active:scale-[0.98]"
                >
                  嘗試突破
                </button>
              </div>
            ) : (
              <div className="text-center text-amber-500 py-8 font-bold text-lg border border-amber-900/30 rounded-xl bg-amber-900/10">
                已達修仙之巔，傲視群雄！
              </div>
            )}
          </div>
        </div>

        {/* Right: Shop */}
        <div className="lg:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Pickaxe className="w-5 h-5 text-amber-500" /> 洞府設施
            </h2>
            <span className="text-xs text-zinc-500">自動採集天地靈氣</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {gameState.facilities.map(facility => {
              const cost = calculateCost(facility.baseCost, facility.level);
              const canAfford = gameState.qi >= cost;
              
              return (
                <div key={facility.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-lg font-bold text-zinc-200">{facility.name}</h3>
                      <span className="text-sm font-mono text-amber-500/80 bg-amber-900/20 px-2 py-0.5 rounded">Lv.{facility.level}</span>
                    </div>
                    <div className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                      <span>基礎產出: <span className="text-zinc-300">{formatNumber(facility.baseProduction)}</span></span>
                      <span className="text-zinc-700">|</span>
                      <span>實際產出: <span className="text-green-400/80">+{formatNumber(facility.baseProduction * currentRealm.multiplier)}</span> 靈氣/秒</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBuy(facility.id)}
                    disabled={!canAfford}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono font-bold transition-all duration-200 min-w-[160px] flex flex-col items-center justify-center gap-1
                      ${canAfford 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 hover:border-amber-500/50 shadow-md' 
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}
                  >
                    <span className="tracking-widest">建設</span>
                    <span className="text-xs font-normal opacity-80">{formatNumber(cost)} 靈氣</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer: Logs */}
      <footer className="h-48 bg-zinc-950 border-t border-zinc-900 p-4 relative z-20">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">修行日誌</h3>
            <button 
              onClick={handleReset}
              className="text-xs text-zinc-600 hover:text-red-400 flex items-center gap-1 transition-colors"
              title="清除存檔"
            >
              <RotateCcw className="w-3 h-3" /> 散功重修
            </button>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1.5 flex flex-col p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50 custom-scrollbar">
            {gameState.logs.map((log, i) => (
              <div key={i} className={`${i === gameState.logs.length - 1 ? 'text-zinc-300 font-semibold' : 'text-zinc-600'}`}>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(82, 82, 91, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.8);
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

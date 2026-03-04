import { PlayerAttributes } from '../types/game';

/**
 * 依照設計決策產出初始屬性：
 * 每個屬性的基礎值為 10，並額外增加 0 到 5 之間的隨機整數。
 */
export const generateInitialAttributes = (): PlayerAttributes => {
  const generateValue = () => 10 + Math.floor(Math.random() * 6);

  return {
    aptitude: generateValue(),
    fortune: generateValue(),
    opportunity: generateValue(),
    nature: generateValue(),
    darkness: generateValue(),
  };
};

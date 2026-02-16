
export enum GamePhase {
  INPUT = 1,
  SHAKE = 2,
  DRAW = 3,
  INTERPRET = 4,
  SHARE = 5,
}

export interface GameState {
  phase: GamePhase;
  petitionText: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const ACHIEVEMENT_LIST: AchievementDef[] = [
  {
    id: 'FAIL_10',
    title: '大力出奇迹',
    desc: '单局投掷阶段累计失败10次',
    icon: '💪'
  },
  {
    id: 'CPS_8',
    title: '薯力超凡',
    desc: '点击手速突破天际 (CPS > 7)',
    icon: '⚡'
  },
  {
    id: 'COLLECT_5',
    title: 'W门智者',
    desc: '收集 5 种不同的上上签',
    icon: '🍟'
  }
];

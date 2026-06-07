export interface Truck {
  id: string;
  name: string;
  owner: string;
  category: string;
  healthScore: number;
  rank: number;
  activeViolations: number;
  licensePlate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Violation {
  id: string;
  truckId: string;
  type: string;
  description: string;
  inspector: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface SystemConfig {
  id: string;
  minHealthScore: number;
  maxConsecutiveSameCategory: number;
}

export interface RankValidationResult {
  valid: boolean;
  reason?: string;
  warnings?: string[];
  displayList: Truck[];
}

export type UserRole = 'owner' | 'admin' | 'inspector' | 'display';

export const CATEGORIES = [
  '烧烤',
  '麻辣烫',
  '奶茶饮品',
  '炸鸡汉堡',
  '臭豆腐',
  '烤冷面',
  '手抓饼',
  '寿司刺身',
  '甜品冰淇淋',
  '炸物',
  '饮品',
  '面食',
  '甜品',
  '其他'
];

export const VIOLATION_TYPES = [
  '卫生不达标',
  '占道经营',
  '超时营业',
  '噪音扰民',
  '未明码标价',
  '使用过期食材',
  '其他违规'
];

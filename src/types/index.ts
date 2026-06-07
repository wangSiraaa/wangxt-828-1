export interface Truck {
  id: string;
  name: string;
  owner: string;
  category: string;
  healthScore: number;
  rank: number;
  activeViolations: number;
  licensePlate?: string;
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
  warnings: string[];
  displayList: Truck[];
}

export type UserRole = 'owner' | 'admin' | 'inspector' | 'display';

export const CATEGORIES = [
  '烧烤', '炸物', '饮品', '面食', '甜品', '海鲜', '火锅', '主食', '小吃', '其他'
];

export const VIOLATION_TYPES = [
  '卫生不达标', '占道经营', '超时经营', '油烟扰民', '证照不全', '价格欺诈', '其他'
];

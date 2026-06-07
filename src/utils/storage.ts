import { Truck, Violation, SystemConfig, Remark } from '../types';

const STORAGE_KEYS = {
  TRUCKS: 'night_market_trucks',
  VIOLATIONS: 'night_market_violations',
  CONFIG: 'night_market_config',
  ROLE: 'night_market_role',
};

const defaultConfig: SystemConfig = {
  id: 'default',
  minHealthScore: 60,
  maxConsecutiveSameCategory: 2,
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export const storage = {
  getTrucks: (): Truck[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRUCKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setTrucks: (trucks: Truck[]): void => {
    localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(trucks));
  },

  getViolations: (): Violation[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setViolations: (violations: Violation[]): void => {
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(violations));
  },

  getConfig: (): SystemConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return data ? JSON.parse(data) : defaultConfig;
    } catch {
      return defaultConfig;
    }
  },

  setConfig: (config: SystemConfig): void => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  getRole: (): string => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'admin';
  },

  setRole: (role: string): void => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TRUCKS);
    localStorage.removeItem(STORAGE_KEYS.VIOLATIONS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  },

  generateId,
};

export const initializeMockData = () => {
  const existingTrucks = storage.getTrucks();
  if (existingTrucks.length === 0) {
    const mockTrucks: Truck[] = [
      { 
        id: generateId(), 
        name: '老王烧烤', 
        owner: '王建国', 
        category: '烧烤', 
        healthScore: 85, 
        rank: 1, 
        activeViolations: 0, 
        licensePlate: '夜市A001', 
        status: 'active', 
        remarks: [
          {
            id: generateId(),
            truckId: '',
            type: 'suggestion',
            title: '上屏建议',
            content: '经营状况良好，卫生达标，建议优先上屏展示。',
            author: '市场管理员',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
          }
        ],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: generateId(), 
        name: '小李奶茶', 
        owner: '李美丽', 
        category: '饮品', 
        healthScore: 92, 
        rank: 2, 
        activeViolations: 0, 
        licensePlate: '夜市A002', 
        status: 'active', 
        remarks: [],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: generateId(), 
        name: '张记麻辣烫', 
        owner: '张老三', 
        category: '面食', 
        healthScore: 55, 
        rank: 3, 
        activeViolations: 0, 
        licensePlate: '夜市A003', 
        status: 'active', 
        remarks: [
          {
            id: generateId(),
            truckId: '',
            type: 'deduction',
            title: '卫生检查扣分说明',
            content: '操作台未及时清洁，食材摆放不规范，扣除卫生评分10分。当前评分55分，低于60分及格线。',
            author: '市场管理员',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: generateId(),
            truckId: '',
            type: 'suggestion',
            title: '上屏建议：暂不通过',
            content: '虽然摊主态度积极，但卫生评分低于最低标准60分。根据规则，即使有通过建议也不能上屏。建议整改后重新检查。',
            author: '市场管理员',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            updatedAt: new Date(Date.now() - 43200000).toISOString(),
          }
        ],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: generateId(), 
        name: '刘哥炸串', 
        owner: '刘大强', 
        category: '炸物', 
        healthScore: 78, 
        rank: 4, 
        activeViolations: 1, 
        licensePlate: '夜市A004', 
        status: 'active', 
        remarks: [
          {
            id: generateId(),
            truckId: '',
            type: 'review',
            title: '复查结论：待整改',
            content: '占道经营问题已部分整改，但仍有超出范围5公分，需继续整改。',
            author: '巡查员-李四',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
          }
        ],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: generateId(), 
        name: '陈记甜品', 
        owner: '陈小甜', 
        category: '甜品', 
        healthScore: 88, 
        rank: 5, 
        activeViolations: 0, 
        licensePlate: '夜市A005', 
        status: 'active', 
        remarks: [],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: generateId(), 
        name: '赵姐烧烤', 
        owner: '赵丽华', 
        category: '烧烤', 
        healthScore: 70, 
        rank: 6, 
        activeViolations: 0, 
        licensePlate: '夜市A006', 
        status: 'active', 
        remarks: [],
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
    ];

    mockTrucks.forEach(truck => {
      truck.remarks.forEach(r => r.truckId = truck.id);
    });

    storage.setTrucks(mockTrucks);

    const mockViolations: Violation[] = [
      { id: generateId(), truckId: mockTrucks[3].id, type: '占道经营', description: '餐车超出划定经营区域50公分', inspector: '巡查员-张三', createdAt: new Date(Date.now() - 86400000).toISOString(), resolved: false },
    ];
    storage.setViolations(mockViolations);
  }
};

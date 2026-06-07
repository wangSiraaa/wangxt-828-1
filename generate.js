import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const srcDir = path.join(baseDir, 'src');

const files = {
  'src/utils/storage.ts': `import { Truck, Violation, SystemConfig } from '../types';

const STORAGE_KEYS = {
  TRUCKS: 'night_market_trucks',
  VIOLATIONS: 'night_market_violations',
  CONFIG: 'night_market_config',
  ROLE: 'night_market_role',
};

const defaultConfig: SystemConfig = {
  id: 'default',
  minHygieneScore: 60,
  maxConsecutiveCategory: 2,
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

  generateId,
};

export const initializeMockData = () => {
  const existingTrucks = storage.getTrucks();
  if (existingTrucks.length === 0) {
    const mockTrucks: Truck[] = [
      {
        id: generateId(),
        plateNumber: '夜市A001',
        ownerName: '张三',
        category: '烧烤',
        hygieneScore: 85,
        rankOrder: 1,
        hasViolation: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        plateNumber: '夜市A002',
        ownerName: '李四',
        category: '奶茶饮品',
        hygieneScore: 92,
        rankOrder: 2,
        hasViolation: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        plateNumber: '夜市A003',
        ownerName: '王五',
        category: '麻辣烫',
        hygieneScore: 55,
        rankOrder: 3,
        hasViolation: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        plateNumber: '夜市A004',
        ownerName: '赵六',
        category: '烧烤',
        hygieneScore: 78,
        rankOrder: 4,
        hasViolation: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        plateNumber: '夜市A005',
        ownerName: '钱七',
        category: '臭豆腐',
        hygieneScore: 88,
        rankOrder: 5,
        hasViolation: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        plateNumber: '夜市A006',
        ownerName: '孙八',
        category: '烧烤',
        hygieneScore: 70,
        rankOrder: 6,
        hasViolation: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    storage.setTrucks(mockTrucks);

    const mockViolations: Violation[] = [
      {
        id: generateId(),
        truckId: mockTrucks[3].id,
        type: '占道经营',
        description: '餐车超出划定经营区域50公分',
        handler: '口头警告，责令整改',
        createdAt: new Date().toISOString(),
        isResolved: false,
      },
    ];
    storage.setViolations(mockViolations);
  }
};
`,

  'src/utils/validation.ts': `import { Truck, SystemConfig, RankValidationResult } from '../types';

export const validateRanking = (
  trucks: Truck[],
  config: SystemConfig
): RankValidationResult => {
  const warnings: string[] = [];
  
  let sortedTrucks = [...trucks].sort((a, b) => a.rankOrder - b.rankOrder);
  
  const normalTrucks = sortedTrucks.filter(t => !t.hasViolation);
  const violationTrucks = sortedTrucks.filter(t => t.hasViolation);
  sortedTrucks = [...normalTrucks, ...violationTrucks];
  
  const eligibleTrucks = sortedTrucks.filter(
    t => t.hygieneScore >= config.minHygieneScore && t.status === 'active'
  );
  
  const lowScoreTrucks = sortedTrucks.filter(
    t => t.hygieneScore < config.minHygieneScore && t.status === 'active'
  );
  if (lowScoreTrucks.length > 0) {
    warnings.push(
      \`\${lowScoreTrucks.length} 辆餐车卫生评分低于 \${config.minHygieneScore} 分，已禁止上屏：\${lowScoreTrucks.map(t => t.plateNumber).join('、')}\`
    );
  }
  
  let consecutiveCount = 1;
  let prevCategory = '';
  
  for (let i = 0; i < eligibleTrucks.length; i++) {
    const truck = eligibleTrucks[i];
    if (truck.category === prevCategory) {
      consecutiveCount++;
      if (consecutiveCount > config.maxConsecutiveCategory) {
        warnings.push(
          \`位置 \${i + 1}：\${truck.plateNumber} 造成同品类「\${truck.category}」连续排位超过 \${config.maxConsecutiveCategory} 个，请调整\`
        );
      }
    } else {
      consecutiveCount = 1;
      prevCategory = truck.category;
    }
  }
  
  if (violationTrucks.length > 0) {
    warnings.push(
      \`\${violationTrucks.length} 辆餐车存在未处理违规，已自动置底：\${violationTrucks.map(t => t.plateNumber).join('、')}\`
    );
  }
  
  return {
    valid: true,
    warnings,
    displayList: eligibleTrucks,
  };
};

export const canDisplay = (truck: Truck, config: SystemConfig): boolean => {
  return (
    truck.hygieneScore >= config.minHygieneScore &&
    truck.status === 'active'
  );
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-neon-green';
  if (score >= 60) return 'text-neon-yellow';
  return 'text-neon-pink';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-neon-green/20 border-neon-green/50';
  if (score >= 60) return 'bg-neon-yellow/20 border-neon-yellow/50';
  return 'bg-neon-pink/20 border-neon-pink/50';
};
`,

  'src/store/index.ts': `import { create } from 'zustand';
import { Truck, Violation, SystemConfig, UserRole } from '../types';
import { storage, initializeMockData } from '../utils/storage';

interface AppState {
  trucks: Truck[];
  violations: Violation[];
  config: SystemConfig;
  currentRole: UserRole;
  initialized: boolean;

  initialize: () => void;
  setTrucks: (trucks: Truck[]) => void;
  addTruck: (truck: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTruck: (id: string, truck: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  reorderTrucks: (activeId: string, overId: string) => void;

  addViolation: (violation: Omit<Violation, 'id' | 'createdAt'>) => void;
  resolveViolation: (id: string) => void;
  updateConfig: (config: Partial<SystemConfig>) => void;
  setRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  trucks: [],
  violations: [],
  config: {
    id: 'default',
    minHygieneScore: 60,
    maxConsecutiveCategory: 2,
  },
  currentRole: 'admin',
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    
    initializeMockData();
    
    set({
      trucks: storage.getTrucks(),
      violations: storage.getViolations(),
      config: storage.getConfig(),
      currentRole: storage.getRole() as UserRole,
      initialized: true,
    });
  },

  setTrucks: (trucks: Truck[]) => {
    const updatedTrucks = trucks.map(t => ({ ...t, updatedAt: new Date().toISOString() }));
    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  addTruck: (truckData) => {
    const newTruck: Truck = {
      ...truckData,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedTrucks = [...get().trucks, newTruck];
    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  updateTruck: (id, truckData) => {
    const updatedTrucks = get().trucks.map(t =>
      t.id === id ? { ...t, ...truckData, updatedAt: new Date().toISOString() } : t
    );
    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  deleteTruck: (id) => {
    const updatedTrucks = get().trucks.filter(t => t.id !== id);
    storage.setTrucks(updatedTrucks);
    set({ trucks: updatedTrucks });
  },

  reorderTrucks: (activeId, overId) => {
    const trucks = [...get().trucks];
    const activeIndex = trucks.findIndex(t => t.id === activeId);
    const overIndex = trucks.findIndex(t => t.id === overId);
    
    if (activeIndex === -1 || overIndex === -1) return;
    
    const [activeTruck] = trucks.splice(activeIndex, 1);
    trucks.splice(overIndex, 0, activeTruck);
    
    const reorderedTrucks = trucks.map((t, i) => ({
      ...t,
      rankOrder: i + 1,
      updatedAt: new Date().toISOString(),
    }));
    
    storage.setTrucks(reorderedTrucks);
    set({ trucks: reorderedTrucks });
  },

  addViolation: (violationData) => {
    const newViolation: Violation = {
      ...violationData,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedViolations = [...get().violations, newViolation];
    storage.setViolations(updatedViolations);
    set({ violations: updatedViolations });
    
    get().updateTruck(violationData.truckId, { hasViolation: true });
  },

  resolveViolation: (id) => {
    const updatedViolations = get().violations.map(v =>
      v.id === id ? { ...v, isResolved: true } : v
    );
    storage.setViolations(updatedViolations);
    set({ violations: updatedViolations });
    
    const violation = get().violations.find(v => v.id === id);
    if (violation) {
      const otherUnresolved = updatedViolations.filter(
        v => v.truckId === violation.truckId && !v.isResolved
      );
      if (otherUnresolved.length === 0) {
        get().updateTruck(violation.truckId, { hasViolation: false });
      }
    }
  },

  updateConfig: (configData) => {
    const updatedConfig = { ...get().config, ...configData };
    storage.setConfig(updatedConfig);
    set({ config: updatedConfig });
  },

  setRole: (role) => {
    storage.setRole(role);
    set({ currentRole: role });
  },
}));
`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(baseDir, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`Created: ${filePath}`);
});

console.log('All files created successfully!');

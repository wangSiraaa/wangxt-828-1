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

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #12183a 50%, #0a0e27 100%);
  color: #e0e0e0;
}

.neon-text-pink { color: #ff2a6d; text-shadow: 0 0 5px #ff2a6d, 0 0 10px #ff2a6d; }
.neon-text-cyan { color: #05d9e8; text-shadow: 0 0 5px #05d9e8, 0 0 10px #05d9e8; }
.neon-text-yellow { color: #f9c80e; text-shadow: 0 0 5px #f9c80e, 0 0 10px #f9c80e; }
.neon-text-green { color: #00ff9d; text-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d; }

.neon-border-pink { border: 1px solid #ff2a6d; box-shadow: 0 0 5px #ff2a6d, inset 0 0 5px rgba(255,42,109,0.1); }
.neon-border-cyan { border: 1px solid #05d9e8; box-shadow: 0 0 5px #05d9e8, inset 0 0 5px rgba(5,217,232,0.1); }
.neon-border-yellow { border: 1px solid #f9c80e; box-shadow: 0 0 5px #f9c80e, inset 0 0 5px rgba(249,200,14,0.1); }
.neon-border-green { border: 1px solid #00ff9d; box-shadow: 0 0 5px #00ff9d, inset 0 0 5px rgba(0,255,157,0.1); }

.glass-card {
  background: rgba(18, 24, 58, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-in { animation: slideIn 0.3s ease-out forwards; }

@keyframes marquee-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
.animate-marquee-up { animation: marquee-up 30s linear infinite; }
.animate-marquee-up:hover { animation-play-state: paused; }

@keyframes glow {
  0% { text-shadow: 0 0 5px #05d9e8, 0 0 10px #05d9e8; }
  100% { text-shadow: 0 0 10px #05d9e8, 0 0 20px #05d9e8, 0 0 30px #05d9e8; }
}
.animate-glow { animation: glow 2s ease-in-out infinite alternate; }
`,

  'src/components/ui/NeonCard.tsx': `import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  color?: 'cyan' | 'pink' | 'yellow' | 'green';
  glow?: boolean;
  style?: React.CSSProperties;
}

export default function NeonCard({ children, className, color = 'cyan', glow = false, style }: NeonCardProps) {
  const borders: Record<string, string> = {
    cyan: 'border-neon-cyan/50 hover:border-neon-cyan',
    pink: 'border-neon-pink/50 hover:border-neon-pink',
    yellow: 'border-neon-yellow/50 hover:border-neon-yellow',
    green: 'border-neon-green/50 hover:border-neon-green',
  };
  const glows: Record<string, string> = {
    cyan: 'shadow-neon-cyan', pink: 'shadow-neon-pink',
    yellow: 'shadow-neon-yellow', green: 'shadow-neon-green',
  };
  return (
    <div style={style} className={cn('glass-card rounded-xl p-6 transition-all duration-300 border', borders[color], glow && glows[color], className)}>
      {children}
    </div>
  );
}
`,

  'src/components/ui/NeonButton.tsx': `import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export default function NeonButton({ children, variant = 'primary', size = 'md', glow, className, ...props }: NeonButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/30 hover:border-neon-cyan',
    secondary: 'bg-neon-purple/20 text-neon-pink border-neon-pink/50 hover:bg-neon-purple/30 hover:border-neon-pink',
    danger: 'bg-red-900/30 text-red-400 border-red-500/50 hover:bg-red-900/50 hover:border-red-500',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/50 hover:bg-neon-green/30 hover:border-neon-green',
    warning: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50 hover:bg-neon-yellow/30 hover:border-neon-yellow',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
  const glows: Record<string, string> = {
    primary: 'shadow-neon-cyan', secondary: 'shadow-neon-pink',
    danger: 'shadow-lg shadow-red-500/30', success: 'shadow-neon-green', warning: 'shadow-neon-yellow',
  };
  return (
    <button className={cn('rounded-lg font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neon-bg disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant], sizes[size], glow && glows[variant], className)} {...props}>
      {children}
    </button>
  );
}
`,

  'src/components/ui/NeonInput.tsx': `import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <input ref={ref} className={cn('w-full px-4 py-2 rounded-lg bg-neon-bgLight/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props} />
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
));
NeonInput.displayName = 'NeonInput';
export default NeonInput;
`,

  'src/components/ui/NeonSelect.tsx': `import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeonSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const NeonSelect = forwardRef<HTMLSelectElement, NeonSelectProps>(({ label, error, options, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
    <select ref={ref} className={cn('w-full px-4 py-2 rounded-lg bg-neon-bgLight/50 border border-gray-600 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props}>
      {options.map(o => <option key={o.value} value={o.value} className="bg-neon-bgLight">{o.label}</option>)}
    </select>
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
));
NeonSelect.displayName = 'NeonSelect';
export default NeonSelect;
`,

  'src/components/ui/NeonModal.tsx': `import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function NeonModal({ isOpen, onClose, title, children, className }: NeonModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative z-10 w-full max-w-lg glass-card rounded-2xl neon-border-cyan animate-slide-in', className)}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold neon-text-cyan font-display">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
`,

  'src/components/Navbar.tsx': `import { Link, useLocation } from 'react-router-dom';
import { Home, Truck, ListOrdered, AlertTriangle, Monitor, Settings, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/trucks', label: '餐车管理', icon: Truck },
  { path: '/ranking', label: '排位管理', icon: ListOrdered },
  { path: '/violations', label: '违规记录', icon: AlertTriangle },
  { path: '/display', label: '大屏展示', icon: Monitor },
  { path: '/settings', label: '系统设置', icon: Settings },
];

const roles: { value: UserRole; label: string }[] = [
  { value: 'owner', label: '摊主' },
  { value: 'admin', label: '管理员' },
  { value: 'inspector', label: '巡查员' },
  { value: 'display', label: '大屏' },
];

export default function Navbar() {
  const location = useLocation();
  const { currentRole, setRole } = useAppStore();
  if (location.pathname === '/display') return null;

  return (
    <nav className="glass-card border-b border-neon-cyan/30 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center">
              <span className="text-white font-bold font-display text-lg">夜</span>
            </div>
            <span className="text-xl font-bold font-display neon-text-cyan">夜市排位系统</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={cn('flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300',
                  isActive ? 'bg-neon-cyan/20 text-neon-cyan neon-border-cyan' : 'text-gray-400 hover:text-white hover:bg-white/5')}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <select value={currentRole} onChange={e => setRole(e.target.value as UserRole)}
              className="bg-neon-bgLight/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-cyan">
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-700">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={cn('flex flex-col items-center p-2 rounded-lg transition-all', isActive ? 'text-neon-cyan' : 'text-gray-400')}>
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
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

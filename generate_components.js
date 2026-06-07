import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const files = {
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

.neon-text-pink {
  color: #ff2a6d;
  text-shadow: 0 0 5px #ff2a6d, 0 0 10px #ff2a6d;
}

.neon-text-cyan {
  color: #05d9e8;
  text-shadow: 0 0 5px #05d9e8, 0 0 10px #05d9e8;
}

.neon-text-yellow {
  color: #f9c80e;
  text-shadow: 0 0 5px #f9c80e, 0 0 10px #f9c80e;
}

.neon-text-green {
  color: #00ff9d;
  text-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d;
}

.neon-border-pink {
  border: 1px solid #ff2a6d;
  box-shadow: 0 0 5px #ff2a6d, inset 0 0 5px rgba(255, 42, 109, 0.1);
}

.neon-border-cyan {
  border: 1px solid #05d9e8;
  box-shadow: 0 0 5px #05d9e8, inset 0 0 5px rgba(5, 217, 232, 0.1);
}

.neon-border-yellow {
  border: 1px solid #f9c80e;
  box-shadow: 0 0 5px #f9c80e, inset 0 0 5px rgba(249, 200, 14, 0.1);
}

.neon-border-green {
  border: 1px solid #00ff9d;
  box-shadow: 0 0 5px #00ff9d, inset 0 0 5px rgba(0, 255, 157, 0.1);
}

.glass-card {
  background: rgba(18, 24, 58, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes marquee-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.animate-marquee-up {
  animation: marquee-up 30s linear infinite;
}

.animate-marquee-up:hover {
  animation-play-state: paused;
}
`,

  'src/components/ui/NeonCard.tsx': `import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  color?: 'cyan' | 'pink' | 'yellow' | 'green';
  glow?: boolean;
}

export default function NeonCard({ children, className, color = 'cyan', glow = false }: NeonCardProps) {
  const borderClasses = {
    cyan: 'border-neon-cyan/50 hover:border-neon-cyan',
    pink: 'border-neon-pink/50 hover:border-neon-pink',
    yellow: 'border-neon-yellow/50 hover:border-neon-yellow',
    green: 'border-neon-green/50 hover:border-neon-green',
  };

  const glowClasses = glow
    ? {
        cyan: 'shadow-neon-cyan',
        pink: 'shadow-neon-pink',
        yellow: 'shadow-neon-yellow',
        green: 'shadow-neon-green',
      }[color]
    : '';

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-6 transition-all duration-300',
        'border',
        borderClasses[color],
        glowClasses,
        className
      )}
    >
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

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  disabled,
  ...props
}: NeonButtonProps) {
  const variantClasses = {
    primary: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/30 hover:border-neon-cyan',
    secondary: 'bg-neon-purple/20 text-neon-pink border-neon-pink/50 hover:bg-neon-purple/30 hover:border-neon-pink',
    danger: 'bg-red-900/30 text-red-400 border-red-500/50 hover:bg-red-900/50 hover:border-red-500',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/50 hover:bg-neon-green/30 hover:border-neon-green',
    warning: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50 hover:bg-neon-yellow/30 hover:border-neon-yellow',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const glowClasses = glow
    ? {
        primary: 'shadow-neon-cyan',
        secondary: 'shadow-neon-pink',
        danger: 'shadow-lg shadow-red-500/30',
        success: 'shadow-neon-green',
        warning: 'shadow-neon-yellow',
      }[variant]
    : '';

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-300 border',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neon-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
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

const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg',
            'bg-neon-bgLight/50 border border-gray-600',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan',
            'transition-all duration-200',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

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

const NeonSelect = forwardRef<HTMLSelectElement, NeonSelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg',
            'bg-neon-bgLight/50 border border-gray-600',
            'text-white',
            'focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan',
            'transition-all duration-200',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-neon-bgLight">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg glass-card rounded-2xl neon-border-cyan',
          'animate-slide-in',
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold neon-text-cyan font-display">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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

  if (location.pathname === '/display') {
    return null;
  }

  return (
    <nav className="glass-card border-b border-neon-cyan/30 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center">
              <span className="text-white font-bold font-display text-lg">夜</span>
            </div>
            <span className="text-xl font-bold font-display neon-text-cyan">
              夜市排位系统
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-neon-cyan/20 text-neon-cyan neon-border-cyan'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-neon-bgLight/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-cyan"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-700">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all',
                  isActive ? 'text-neon-cyan' : 'text-gray-400'
                )}
              >
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

  'src/pages/Home.tsx': `import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ListOrdered, AlertTriangle, Monitor, TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import { useAppStore } from '@/store';
import { validateRanking } from '@/utils/validation';

export default function Home() {
  const { trucks, violations, config, initialize } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { displayList, warnings } = validateRanking(trucks, config);

  const stats = [
    {
      label: '餐车总数',
      value: trucks.length,
      icon: Truck,
      color: 'cyan' as const,
    },
    {
      label: '可上屏',
      value: displayList.length,
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      label: '待处理违规',
      value: violations.filter((v) => !v.isResolved).length,
      icon: AlertTriangle,
      color: 'yellow' as const,
    },
    {
      label: '规则警告',
      value: warnings.length,
      icon: XCircle,
      color: 'pink' as const,
    },
  ];

  const quickActions = [
    {
      title: '餐车管理',
      description: '维护车辆信息、品类、卫生评分',
      icon: Truck,
      path: '/trucks',
      color: 'cyan' as const,
    },
    {
      title: '排位管理',
      description: '调整排位顺序、预览上屏效果',
      icon: ListOrdered,
      path: '/ranking',
      color: 'pink' as const,
    },
    {
      title: '违规记录',
      description: '记录和处理餐车违规行为',
      icon: AlertTriangle,
      path: '/violations',
      color: 'yellow' as const,
    },
    {
      title: '大屏展示',
      description: '现场大屏滚动展示排位名单',
      icon: Monitor,
      path: '/display',
      color: 'green' as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">
          <span className="neon-text-cyan">夜市餐车</span>
          <span className="text-white"> 排位管理系统</span>
        </h1>
        <p className="text-gray-400">智能化夜市运营管理，让秩序更井然</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <NeonCard key={stat.label} color={stat.color} className="animate-slide-in" style={{ animationDelay: \`\${index * 100}ms\` } as React.CSSProperties}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1 font-display">{stat.value}</p>
                </div>
                <div className={\`p-3 rounded-full bg-neon-\${stat.color}/20\`}>
                  <Icon className={\`w-6 h-6 text-neon-\${stat.color}\`} />
                </div>
              </div>
            </NeonCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={action.path} to={action.path}>
              <NeonCard
                color={action.color}
                className="h-full cursor-pointer hover:scale-105 transition-transform animate-slide-in"
                style={{ animationDelay: \`\${index * 100 + 400}ms\` } as React.CSSProperties}
              >
                <div className={\`w-12 h-12 rounded-xl bg-neon-\${action.color}/20 flex items-center justify-center mb-4\`}>
                  <Icon className={\`w-6 h-6 text-neon-\${action.color}\`} />
                </div>
                <h3 className={\`text-lg font-semibold mb-2 text-neon-\${action.color}\`}>
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </NeonCard>
            </Link>
          );
        })}
      </div>

      {warnings.length > 0 && (
        <NeonCard color="yellow" className="mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-neon-yellow flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-neon-yellow mb-2">规则警告</h3>
              <ul className="space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-gray-300 text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </NeonCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeonCard color="cyan">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-neon-cyan" />
            当前可上屏餐车
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {displayList.slice(0, 6).map((truck, index) => (
              <div
                key={truck.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neon-bgLight/50"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{truck.plateNumber}</p>
                    <p className="text-sm text-gray-400">{truck.category}</p>
                  </div>
                </div>
                <span className={\`px-2 py-1 rounded text-sm \${
                  truck.hygieneScore >= 80
                    ? 'bg-neon-green/20 text-neon-green'
                    : truck.hygieneScore >= 60
                    ? 'bg-neon-yellow/20 text-neon-yellow'
                    : 'bg-neon-pink/20 text-neon-pink'
                }\`}>
                  {truck.hygieneScore}分
                </span>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard color="pink">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-neon-pink" />
            品类分布
          </h3>
          <div className="space-y-3">
            {Array.from(new Set(trucks.map((t) => t.category))).map((category) => {
              const count = trucks.filter((t) => t.category === category).length;
              const percentage = (count / trucks.length) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{category}</span>
                    <span className="text-neon-pink">{count}辆</span>
                  </div>
                  <div className="h-2 bg-neon-bgLight rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full transition-all duration-500"
                      style={{ width: \`\${percentage}%\` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
`,

  'src/pages/TruckManagement.tsx': `import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import NeonSelect from '@/components/ui/NeonSelect';
import NeonModal from '@/components/ui/NeonModal';
import { useAppStore } from '@/store';
import { CATEGORIES, Truck } from '@/types';
import { canDisplay, getScoreBgColor, getScoreColor } from '@/utils/validation';

export default function TruckManagement() {
  const { trucks, addTruck, updateTruck, deleteTruck, config, currentRole, initialize } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    ownerName: '',
    category: CATEGORIES[0],
    hygieneScore: 80,
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredTrucks = trucks.filter((t) => {
    const matchSearch =
      t.plateNumber.includes(search) ||
      t.ownerName.includes(search);
    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const sortedTrucks = [...filteredTrucks].sort((a, b) => a.rankOrder - b.rankOrder);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTruck) {
      updateTruck(editingTruck.id, formData);
    } else {
      addTruck({
        ...formData,
        rankOrder: trucks.length + 1,
        hasViolation: false,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      ownerName: '',
      category: CATEGORIES[0],
      hygieneScore: 80,
      status: 'active',
    });
    setEditingTruck(null);
  };

  const handleEdit = (truck: Truck) => {
    setEditingTruck(truck);
    setFormData({
      plateNumber: truck.plateNumber,
      ownerName: truck.ownerName,
      category: truck.category,
      hygieneScore: truck.hygieneScore,
      status: truck.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这辆餐车吗？')) {
      deleteTruck(id);
    }
  };

  const canEdit = currentRole === 'admin' || currentRole === 'owner';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display neon-text-cyan">餐车管理</h1>
          <p className="text-gray-400 text-sm mt-1">维护餐车信息、品类和卫生评分</p>
        </div>
        {canEdit && (
          <NeonButton
            variant="primary"
            className="mt-4 md:mt-0"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            新增餐车
          </NeonButton>
        )}
      </div>

      <NeonCard color="cyan" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <NeonInput
              placeholder="搜索车牌号或摊主..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <NeonSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[{ value: 'all', label: '全部品类' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
          />
          <NeonSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'active', label: '营业中' },
              { value: 'inactive', label: '已停业' },
            ]}
          />
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">共 {sortedTrucks.length} 辆</span>
          </div>
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTrucks.map((truck, index) => {
          const eligible = canDisplay(truck, config);
          return (
            <NeonCard
              key={truck.id}
              color={eligible ? 'green' : 'pink'}
              className="animate-slide-in"
              style={{ animationDelay: \`\${index * 50}ms\` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold text-sm">
                      {truck.rankOrder}
                    </span>
                    <h3 className="font-semibold text-lg">{truck.plateNumber}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">摊主：{truck.ownerName}</p>
                </div>
                <div className="flex space-x-1">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(truck)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-cyan transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(truck.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">品类</span>
                  <span className="px-2 py-1 rounded bg-neon-purple/20 text-neon-pink text-sm">
                    {truck.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">卫生评分</span>
                  <span className={\`px-2 py-1 rounded text-sm border \${getScoreBgColor(truck.hygieneScore)} \${getScoreColor(truck.hygieneScore)}\`}>
                    {truck.hygieneScore}分
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">状态</span>
                  <span className={\`text-sm \${truck.status === 'active' ? 'text-neon-green' : 'text-gray-500'}\`}>
                    {truck.status === 'active' ? '营业中' : '已停业'}
                  </span>
                </div>

                {truck.hasViolation && (
                  <div className="p-2 rounded bg-neon-yellow/10 border border-neon-yellow/30">
                    <span className="text-neon-yellow text-sm">⚠️ 存在未处理违规</span>
                  </div>
                )}

                {!eligible && (
                  <div className="p-2 rounded bg-red-900/20 border border-red-500/30">
                    <span className="text-red-400 text-sm">
                      ❌ 不可上屏（评分低于 {config.minHygieneScore} 分）
                    </span>
                  </div>
                )}
              </div>
            </NeonCard>
          );
        })}
      </div>

      {sortedTrucks.length === 0 && (
        <div className="text-center py-16">
          <Truck className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">暂无餐车数据</p>
        </div>
      )}

      <NeonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTruck ? '编辑餐车' : '新增餐车'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeonInput
            label="车牌号"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            placeholder="例如：夜市A001"
            required
          />
          <NeonInput
            label="摊主姓名"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="请输入摊主姓名"
            required
          />
          <NeonSelect
            label="经营品类"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              卫生评分：{formData.hygieneScore}分
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.hygieneScore}
              onChange={(e) => setFormData({ ...formData, hygieneScore: Number(e.target.value) })}
              className="w-full h-2 bg-neon-bgLight rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className={\`\${
                formData.hygieneScore >= 80
                  ? 'text-neon-green'
                  : formData.hygieneScore >= 60
                  ? 'text-neon-yellow'
                  : 'text-neon-pink'
              }\`}>
                {formData.hygieneScore >= 80 ? '优秀' : formData.hygieneScore >= 60 ? '合格' : '不合格'}
              </span>
              <span>100</span>
            </div>
          </div>
          <NeonSelect
            label="营业状态"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            options={[
              { value: 'active', label: '营业中' },
              { value: 'inactive', label: '已停业' },
            ]}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <NeonButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              取消
            </NeonButton>
            <NeonButton type="submit" variant="success">
              {editingTruck ? '保存修改' : '新增餐车'}
            </NeonButton>
          </div>
        </form>
      </NeonModal>
    </div>
  );
}
`,

  'src/pages/RankingManagement.tsx': `import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import { useAppStore } from '@/store';
import { validateRanking, getScoreBgColor, getScoreColor } from '@/utils/validation';
import { cn } from '@/lib/utils';
import { Truck } from '@/types';

interface SortableTruckProps {
  truck: Truck;
  index: number;
  config: any;
}

function SortableTruck({ truck, index, config }: SortableTruckProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: truck.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const eligible = truck.hygieneScore >= config.minHygieneScore && truck.status === 'active';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center p-4 rounded-xl border transition-all duration-200',
        isDragging ? 'z-50 shadow-2xl' : '',
        eligible ? 'bg-neon-bgLight/50 border-gray-700 hover:border-neon-cyan/50' : 'bg-red-900/10 border-red-500/30'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 mr-3 text-gray-500 hover:text-gray-300"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <span className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold mr-4">
        {index + 1}
      </span>

      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <h4 className="font-semibold">{truck.plateNumber}</h4>
          <span className="px-2 py-0.5 rounded text-xs bg-neon-purple/20 text-neon-pink">
            {truck.category}
          </span>
          {truck.hasViolation && (
            <span className="px-2 py-0.5 rounded text-xs bg-neon-yellow/20 text-neon-yellow">
              违规
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">摊主：{truck.ownerName}</p>
      </div>

      <div className="flex items-center space-x-3">
        <span className={cn('px-3 py-1 rounded-lg text-sm border', getScoreBgColor(truck.hygieneScore), getScoreColor(truck.hygieneScore))}>
          {truck.hygieneScore}分
        </span>
        {eligible ? (
          <CheckCircle className="w-5 h-5 text-neon-green" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
    </div>
  );
}

export default function RankingManagement() {
  const { trucks, reorderTrucks, config, initialize } = useAppStore();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTrucks(active.id as string, over.id as string);
    }
  };

  const sortedTrucks = [...trucks].sort((a, b) => a.rankOrder - b.rankOrder);
  const { displayList, warnings } = validateRanking(trucks, config);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display neon-text-cyan">排位管理</h1>
          <p className="text-gray-400 text-sm mt-1">拖拽调整餐车排位顺序，规则自动校验</p>
        </div>
        <NeonButton
          variant="primary"
          className="mt-4 md:mt-0"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="w-4 h-4 mr-2 inline" />
          {showPreview ? '隐藏预览' : '大屏预览'}
        </NeonButton>
      </div>

      {warnings.length > 0 && (
        <NeonCard color="yellow" className="mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-neon-yellow flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-neon-yellow mb-2">规则警告</h3>
              <ul className="space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-gray-300 text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </NeonCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeonCard color="cyan">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GripVertical className="w-5 h-5 mr-2 text-neon-cyan" />
            排位调整（拖拽排序）
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            拖拽左侧把手调整顺序，违规餐车会自动置底
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortedTrucks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sortedTrucks.map((truck, index) => (
                  <SortableTruck key={truck.id} truck={truck} index={index} config={config} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </NeonCard>

        <NeonCard color="green" className={showPreview ? '' : 'hidden lg:block'}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-neon-green" />
            大屏预览
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            共 {displayList.length} 辆餐车可上屏展示
          </p>

          <div className="relative h-96 overflow-hidden rounded-xl border border-neon-green/30 bg-neon-bg">
            <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 to-transparent pointer-events-none" />
            <div className="p-4 border-b border-neon-green/20">
              <h4 className="text-center font-display text-xl neon-text-green">
                🏮 夜市排位屏 🏮
              </h4>
            </div>
            <div className="h-72 overflow-hidden">
              <div className="animate-marquee-up">
                {[...displayList, ...displayList].map((truck, index) => (
                  <div
                    key={\`\${truck.id}-\${index}\`}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green font-bold text-sm">
                        {(index % displayList.length) + 1}
                      </span>
                      <div>
                        <p className="font-medium">{truck.plateNumber}</p>
                        <p className="text-xs text-gray-500">{truck.category}</p>
                      </div>
                    </div>
                    <span className="text-neon-green font-bold">{truck.hygieneScore}分</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
`,

  'src/pages/ViolationManagement.tsx': `import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import NeonSelect from '@/components/ui/NeonSelect';
import NeonModal from '@/components/ui/NeonModal';
import { useAppStore } from '@/store';
import { VIOLATION_TYPES } from '@/types';

export default function ViolationManagement() {
  const { violations, trucks, addViolation, resolveViolation, currentRole, initialize } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    truckId: '',
    type: VIOLATION_TYPES[0],
    description: '',
    handler: '',
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredViolations = violations.filter((v) => {
    const truck = trucks.find((t) => t.id === v.truckId);
    const matchSearch =
      truck?.plateNumber.includes(search) ||
      v.description.includes(search) ||
      v.type.includes(search);
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !v.isResolved) ||
      (statusFilter === 'resolved' && v.isResolved);
    return matchSearch && matchStatus;
  });

  const sortedViolations = [...filteredViolations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const activeTrucks = trucks.filter((t) => t.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addViolation(formData);
    setIsModalOpen(false);
    setFormData({
      truckId: '',
      type: VIOLATION_TYPES[0],
      description: '',
      handler: '',
    });
  };

  const canAdd = currentRole === 'admin' || currentRole === 'inspector';
  const canResolve = currentRole === 'admin';

  const getTruckPlate = (truckId: string) => {
    return trucks.find((t) => t.id === truckId)?.plateNumber || '未知';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display neon-text-yellow">违规记录</h1>
          <p className="text-gray-400 text-sm mt-1">巡查记录违规行为，跟踪处理状态</p>
        </div>
        {canAdd && (
          <NeonButton
            variant="warning"
            className="mt-4 md:mt-0"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            记录违规
          </NeonButton>
        )}
      </div>

      <NeonCard color="yellow" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <NeonInput
              placeholder="搜索车牌号或违规描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <NeonSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'pending', label: '待处理' },
              { value: 'resolved', label: '已处理' },
            ]}
          />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-yellow animate-pulse" />
              <span className="text-sm text-gray-400">
                待处理：{violations.filter((v) => !v.isResolved).length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-green" />
              <span className="text-sm text-gray-400">
                已处理：{violations.filter((v) => v.isResolved).length}
              </span>
            </div>
          </div>
        </div>
      </NeonCard>

      <div className="space-y-4">
        {sortedViolations.map((violation, index) => (
          <NeonCard
            key={violation.id}
            color={violation.isResolved ? 'green' : 'yellow'}
            className="animate-slide-in"
            style={{ animationDelay: \`\${index * 50}ms\` } as React.CSSProperties}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div
                  className={\`w-12 h-12 rounded-xl flex items-center justify-center \${
                    violation.isResolved ? 'bg-neon-green/20' : 'bg-neon-yellow/20'
                  }\`}
                >
                  {violation.isResolved ? (
                    <CheckCircle className="w-6 h-6 text-neon-green" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-neon-yellow" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{getTruckPlate(violation.truckId)}</h4>
                    <span className="px-2 py-0.5 rounded text-xs bg-neon-pink/20 text-neon-pink">
                      {violation.type}
                    </span>
                    <span
                      className={\`px-2 py-0.5 rounded text-xs \${
                        violation.isResolved
                          ? 'bg-neon-green/20 text-neon-green'
                          : 'bg-neon-yellow/20 text-neon-yellow'
                      }\`}
                    >
                      {violation.isResolved ? '已处理' : '待处理'}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2">{violation.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(violation.createdAt)}
                    </span>
                    <span>处理方式：{violation.handler || '未处理'}</span>
                  </div>
                </div>
              </div>
              {canResolve && !violation.isResolved && (
                <NeonButton
                  variant="success"
                  size="sm"
                  onClick={() => resolveViolation(violation.id)}
                >
                  标记已处理
                </NeonButton>
              )}
            </div>
          </NeonCard>
        ))}
      </div>

      {sortedViolations.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle className="w-16 h-16 mx-auto text-neon-green mb-4" />
          <p className="text-gray-400">暂无违规记录</p>
        </div>
      )}

      <NeonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="记录违规"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeonSelect
            label="选择餐车"
            value={formData.truckId}
            onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
            options={activeTrucks.map((t) => ({ value: t.id, label: t.plateNumber }))}
            required
          />
          <NeonSelect
            label="违规类型"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={VIOLATION_TYPES.map((t) => ({ value: t, label: t }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">违规描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-neon-bgLight/50 border border-gray-600 text-white focus:outline-none focus:border-neon-yellow focus:ring-1 focus:ring-neon-yellow transition-all h-24 resize-none"
              placeholder="请详细描述违规情况..."
              required
            />
          </div>
          <NeonInput
            label="处理方式"
            value={formData.handler}
            onChange={(e) => setFormData({ ...formData, handler: e.target.value })}
            placeholder="例如：口头警告、罚款、停业整顿"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <NeonButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </NeonButton>
            <NeonButton type="submit" variant="warning">
              提交记录
            </NeonButton>
          </div>
        </form>
      </NeonModal>
    </div>
  );
}
`,

  'src/pages/DisplayScreen.tsx': `import { useEffect, useState, useRef } from 'react';
import { Maximize2, Minimize2, Pause, Play, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { validateRanking } from '@/utils/validation';

export default function DisplayScreen() {
  const { trucks, config, initialize } = useAppStore();
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { displayList } = validateRanking(trucks, config);
  const doubledList = [...displayList, ...displayList];

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-neon-bg via-neon-bgLight to-neon-bg text-white overflow-hidden relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold animate-glow">
              <span className="neon-text-pink">🏮</span>
              <span className="neon-text-cyan mx-4">夜市餐车排位屏</span>
              <span className="neon-text-pink">🏮</span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              文明经营 · 有序排位 · 卫生第一
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-3xl font-display neon-text-yellow">
                {currentTime.toLocaleTimeString('zh-CN')}
              </p>
              <p className="text-gray-400">
                {currentTime.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPaused ? <Play className="w-6 h-6 text-neon-green" /> : <Pause className="w-6 h-6 text-neon-yellow" />}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="w-6 h-6 text-neon-cyan" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-6 h-6 text-neon-pink" />
                ) : (
                  <Maximize2 className="w-6 h-6 text-neon-pink" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 neon-border-cyan text-center">
            <p className="text-5xl font-display font-bold neon-text-cyan">{displayList.length}</p>
            <p className="text-gray-400 mt-2">可上屏餐车</p>
          </div>
          <div className="glass-card rounded-2xl p-6 neon-border-green text-center">
            <p className="text-5xl font-display font-bold neon-text-green">
              {Math.round(displayList.reduce((sum, t) => sum + t.hygieneScore, 0) / (displayList.length || 1))}
            </p>
            <p className="text-gray-400 mt-2">平均卫生分</p>

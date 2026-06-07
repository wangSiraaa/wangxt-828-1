import { Link, useLocation } from 'react-router-dom';
import { Truck, LayoutDashboard, ClipboardList, Eye, Settings, Shield, UserCheck, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';

const roles = [
  { key: 'owner', label: '摊主', icon: UserCheck, color: 'cyan' },
  { key: 'admin', label: '管理员', icon: Shield, color: 'yellow' },
  { key: 'inspector', label: '巡查员', icon: ClipboardList, color: 'pink' },
  { key: 'display', label: '大屏', icon: Eye, color: 'green' },
];

const navItems = [
  { path: '/', label: '首页', icon: LayoutDashboard },
  { path: '/trucks', label: '餐车管理', icon: Truck },
  { path: '/ranking', label: '排位管理', icon: BarChart3 },
  { path: '/violations', label: '违规记录', icon: ClipboardList },
  { path: '/display', label: '大屏展示', icon: Eye },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const { currentRole, setCurrentRole } = useStore();

  const colorClasses: Record<string, string> = {
    cyan: 'text-neon-cyan hover:bg-neon-cyan/10 border-neon-cyan/30',
    yellow: 'text-neon-yellow hover:bg-neon-yellow/10 border-neon-yellow/30',
    pink: 'text-neon-pink hover:bg-neon-pink/10 border-neon-pink/30',
    green: 'text-neon-green hover:bg-neon-green/10 border-neon-green/30',
  };

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <Truck className="w-8 h-8 neon-text-pink" />
            <span className="text-xl font-bold font-display neon-text-cyan">夜市餐车排位屏</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  location.pathname === item.path
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'text-gray-400 hover:text-white hover:bg-white/5')}>
                <item.icon className="w-4 h-4 inline mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-2">角色:</span>
            {roles.map(role => (
              <button key={role.key} onClick={() => setCurrentRole(role.key as any)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  currentRole === role.key
                    ? colorClasses[role.color]
                    : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5')}>
                <role.icon className="w-3.5 h-3.5 inline mr-1" />
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

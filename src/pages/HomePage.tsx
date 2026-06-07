import { Link } from 'react-router-dom';
import { Truck, Shield, ClipboardList, Eye, Settings, ArrowRight, CheckCircle, AlertTriangle, Ban } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import { useStore } from '@/store';
import { validateRanking } from '@/utils/validation';
import { getHealthColor } from '@/lib/utils';

const roleCards = [
  { role: 'owner', title: '摊主入口', desc: '维护餐车信息、品类和卫生评分', icon: Truck, color: 'cyan' as const, path: '/trucks' },
  { role: 'admin', title: '管理员入口', desc: '调整排位号、管理系统配置', icon: Shield, color: 'yellow' as const, path: '/ranking' },
  { role: 'inspector', title: '巡查员入口', desc: '记录违规行为、跟踪处理进度', icon: ClipboardList, color: 'pink' as const, path: '/violations' },
  { role: 'display', title: '大屏入口', desc: '现场展示可上屏餐车名单', icon: Eye, color: 'green' as const, path: '/display' },
];

export default function HomePage() {
  const { trucks, violations, config, setCurrentRole } = useStore();
  const result = validateRanking(trucks, config);

  const lowScoreCount = trucks.filter(t => t.healthScore < config.minHealthScore).length;
  const activeViolations = violations.filter(v => !v.resolved).length;
  const eligibleCount = result.displayList.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold font-display animate-glow">夜市餐车排位屏</h1>
        <p className="text-xl text-gray-400">智能排位 · 卫生监管 · 透明公开</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NeonCard color="cyan" className="text-center">
          <div className="text-4xl font-bold neon-text-cyan">{trucks.length}</div>
          <div className="text-gray-400 text-sm mt-1">注册餐车</div>
        </NeonCard>
        <NeonCard color="green" className="text-center">
          <div className="text-4xl font-bold neon-text-green">{eligibleCount}</div>
          <div className="text-gray-400 text-sm mt-1">可上屏餐车</div>
        </NeonCard>
        <NeonCard color="yellow" className="text-center">
          <div className="text-4xl font-bold neon-text-yellow">{activeViolations}</div>
          <div className="text-gray-400 text-sm mt-1">待处理违规</div>
        </NeonCard>
        <NeonCard color="pink" className="text-center">
          <div className="text-4xl font-bold neon-text-pink">{lowScoreCount}</div>
          <div className="text-gray-400 text-sm mt-1">低评分餐车</div>
        </NeonCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleCards.map(card => (
          <NeonCard key={card.role} color={card.color} glow className="hover:scale-105 transition-transform cursor-pointer">
            <Link to={card.path} onClick={() => setCurrentRole(card.role as any)} className="block">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-neon-${card.color}/20`}>
                  <card.icon className={`w-8 h-8 text-neon-${card.color}`} />
                </div>
                <ArrowRight className={`w-5 h-5 text-neon-${card.color}`} />
              </div>
              <h3 className={`text-xl font-bold text-neon-${card.color} mb-2`}>{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </Link>
          </NeonCard>
        ))}
      </div>

      <NeonCard color="cyan">
        <h2 className="text-2xl font-bold neon-text-cyan mb-6">业务规则说明</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 neon-text-green" />
              <span className="font-semibold">卫生评分阈值</span>
            </div>
            <p className="text-gray-400 text-sm pl-9">卫生评分低于 <span className="neon-text-yellow font-bold">{config.minHealthScore}分</span> 的餐车禁止上屏展示</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 neon-text-yellow" />
              <span className="font-semibold">同品类连续限制</span>
            </div>
            <p className="text-gray-400 text-sm pl-9">同品类连续排位超过 <span className="neon-text-yellow font-bold">{config.maxConsecutiveSameCategory}个</span> 将自动提示</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Ban className="w-6 h-6 neon-text-pink" />
              <span className="font-semibold">违规自动置底</span>
            </div>
            <p className="text-gray-400 text-sm pl-9">存在未处理违规的餐车将自动排到列表末尾</p>
          </div>
        </div>
      </NeonCard>

      <div className="text-center">
        <Link to="/settings">
          <NeonButton variant="secondary"><Settings className="w-4 h-4 mr-2 inline" />系统设置</NeonButton>
        </Link>
      </div>
    </div>
  );
}

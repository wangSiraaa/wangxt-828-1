import { useEffect, useState } from 'react';
import { Eye, RefreshCw, Play, Pause, Maximize2 } from 'lucide-react';
import { useStore } from '@/store';
import { validateRanking } from '@/utils/validation';
import { getCategoryColor, cn } from '@/lib/utils';

export default function DisplayScreen() {
  const { trucks, config } = useStore();
  const result = validateRanking(trucks, config);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayList = [...result.displayList, ...result.displayList];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neon-bg via-neon-bgLight to-neon-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold font-display animate-glow mb-2">🏮 夜市排位屏</h1>
            <p className="text-xl text-gray-400">今日可上屏餐车名单</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold font-display neon-text-cyan">
              {currentTime.toLocaleTimeString('zh-CN')}
            </div>
            <div className="text-gray-400">
              {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30">
            <Eye className="w-5 h-5 neon-text-green" />
            <span className="neon-text-green font-semibold">可上屏: {result.displayList.length} 辆</span>
          </div>
          {result.warnings.length > 0 && (
            <div className="px-4 py-2 rounded-full bg-neon-yellow/10 border border-neon-yellow/30">
              <span className="neon-text-yellow">⚠️ {result.warnings.length} 条警告</span>
            </div>
          )}
          <button onClick={() => setIsPaused(!isPaused)}
            className="p-3 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-all">
            {isPaused ? <Play className="w-5 h-5 text-neon-cyan" /> : <Pause className="w-5 h-5 text-neon-cyan" />}
          </button>
          <button onClick={handleFullscreen}
            className="p-3 rounded-full bg-neon-pink/20 border border-neon-pink/50 hover:bg-neon-pink/30 transition-all">
            <Maximize2 className="w-5 h-5 text-neon-pink" />
          </button>
        </div>

        <div className="glass-card rounded-2xl border-2 border-neon-cyan/30 overflow-hidden">
          <div className="bg-neon-cyan/10 px-6 py-3 border-b border-neon-cyan/20">
            <div className="grid grid-cols-12 text-sm font-semibold text-gray-300">
              <div className="col-span-1">排位</div>
              <div className="col-span-3">餐车名称</div>
              <div className="col-span-2">品类</div>
              <div className="col-span-2">摊主</div>
              <div className="col-span-2">卫生评分</div>
              <div className="col-span-2">状态</div>
            </div>
          </div>

          <div className="h-[500px] overflow-hidden relative">
            <div className={cn('animate-marquee-up', isPaused && 'animation-paused')}
              style={{ animationDuration: `${Math.max(20, result.displayList.length * 3)}s` }}>
              {displayList.map((truck, idx) => {
                const categoryColor = getCategoryColor(truck.category);
                const actualIdx = idx % result.displayList.length;
                return (
                  <div key={`${truck.id}-${idx}`} className="grid grid-cols-12 items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="col-span-1">
                      <span className="text-2xl font-bold font-display neon-text-cyan">#{actualIdx + 1}</span>
                    </div>
                    <div className="col-span-3">
                      <span className="text-lg font-semibold text-white">{truck.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={cn('px-3 py-1 rounded-full text-sm font-medium', `bg-neon-${categoryColor}/20 text-neon-${categoryColor}`)}>
                        {truck.category}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-300">{truck.owner}</div>
                    <div className="col-span-2">
                      <span className="text-xl font-bold neon-text-green">★ {truck.healthScore}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-sm font-medium">
                        ✓ 正常营业
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 text-center border border-neon-pink/30">
            <div className="text-4xl font-bold neon-text-pink mb-2">{trucks.filter(t => t.healthScore < config.minHealthScore).length}</div>
            <div className="text-gray-400">低评分未上屏</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center border border-neon-yellow/30">
            <div className="text-4xl font-bold neon-text-yellow mb-2">{trucks.filter(t => t.activeViolations > 0).length}</div>
            <div className="text-gray-400">有违规未上屏</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center border border-neon-green/30">
            <div className="text-4xl font-bold neon-text-green mb-2">{result.displayList.length}</div>
            <div className="text-gray-400">正常上屏</div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>📋 上屏规则：卫生评分 ≥ {config.minHealthScore}分 | 无未处理违规 | 同品类连续不超过 {config.maxConsecutiveSameCategory} 个</p>
        </div>
      </div>
    </div>
  );
}

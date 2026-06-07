import { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown, Eye, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import { useStore } from '@/store';
import { validateRanking } from '@/utils/validation';
import { getCategoryColor, getHealthColor, cn } from '@/lib/utils';

export default function RankingManagement() {
  const { trucks, reorderTrucks, currentRole, config } = useStore();
  const [showPreview, setShowPreview] = useState(false);
  const result = validateRanking(trucks, config);

  const isEditable = currentRole === 'admin';
  const rankedTrucks = [...trucks].sort((a, b) => a.rank - b.rank);

  const moveTruck = (index: number, direction: 'up' | 'down') => {
    if (!isEditable) return;
    const newTrucks = [...rankedTrucks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newTrucks.length) return;
    [newTrucks[index], newTrucks[targetIdx]] = [newTrucks[targetIdx], newTrucks[index]];
    reorderTrucks(newTrucks.map((t, i) => ({ id: t.id, rank: i + 1 })));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display neon-text-yellow">排位管理</h1>
          <p className="text-gray-400 mt-1">调整餐车排位顺序，设置上屏名单</p>
        </div>
        <div className="flex gap-3">
          <NeonButton variant="secondary" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2 inline" />{showPreview ? '隐藏预览' : '排位预览'}
          </NeonButton>
          {isEditable && (
            <NeonButton onClick={() => reorderTrucks(trucks.sort((a,b) => a.healthScore - b.healthScore).map((t,i) => ({id: t.id, rank: i+1})))}>
              <RefreshCw className="w-4 h-4 mr-2 inline" />按评分重排
            </NeonButton>
          )}
        </div>
      </div>

      {result.warnings.length > 0 && (
        <NeonCard color="yellow" className="border-neon-yellow">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 neon-text-yellow flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold neon-text-yellow mb-2">排位警告 ({result.warnings.length})</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {result.warnings.map((w, i) => <li key={i}>⚠️ {w}</li>)}
              </ul>
            </div>
          </div>
        </NeonCard>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <NeonCard color="yellow">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-neon-yellow" />
            排位调整
          </h2>
          <div className="space-y-2">
            {rankedTrucks.map((truck, idx) => {
              const hasViolation = truck.activeViolations > 0;
              const lowScore = truck.healthScore < config.minHealthScore;
              const categoryColor = getCategoryColor(truck.category);
              const healthColor = getHealthColor(truck.healthScore);

              return (
                <div key={truck.id} className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all',
                  lowScore || hasViolation ? 'bg-red-900/10 border-red-500/30' : 'bg-neon-bgLight/50 border-gray-700 hover:border-neon-yellow'
                )}>
                  {isEditable && <GripVertical className="w-5 h-5 text-gray-500 cursor-grab" />}
                  <span className="w-10 text-center font-bold text-xl text-white">#{truck.rank}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{truck.name}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn('px-1.5 py-0.5 rounded', `bg-neon-${categoryColor}/20 text-neon-${categoryColor}`)}>{truck.category}</span>
                      <span className={`text-neon-${healthColor}`}>★ {truck.healthScore}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {lowScore && <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">评分低</span>}
                    {hasViolation && <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">违规</span>}
                    {isEditable && (
                      <>
                        <button onClick={() => moveTruck(idx, 'up')} disabled={idx === 0}
                          className="p-1 rounded hover:bg-white/10 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveTruck(idx, 'down')} disabled={idx === rankedTrucks.length - 1}
                          className="p-1 rounded hover:bg-white/10 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </NeonCard>

        {showPreview && (
          <NeonCard color="green">
            <h2 className="text-xl font-bold neon-text-green mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />上屏预览 ({result.displayList.length}辆)
            </h2>
            <div className="space-y-2">
              {result.displayList.map((truck, idx) => {
                const categoryColor = getCategoryColor(truck.category);
                return (
                  <div key={truck.id} className="flex items-center gap-3 p-3 rounded-lg bg-neon-green/5 border border-neon-green/30">
                    <span className="w-10 text-center font-bold text-xl neon-text-green">#{idx + 1}</span>
                    <div className="flex-1">
                      <div className="font-medium text-white">{truck.name}</div>
                      <div className="text-xs text-gray-400">
                        <span className={cn('px-1.5 py-0.5 rounded mr-2', `bg-neon-${categoryColor}/20 text-neon-${categoryColor}`)}>{truck.category}</span>
                        摊主: {truck.owner}
                      </div>
                    </div>
                  </div>
                );
              })}
              {result.displayList.length === 0 && (
                <div className="text-center py-8 text-gray-500">暂无可上屏的餐车</div>
              )}
            </div>
          </NeonCard>
        )}
      </div>

      <NeonCard color="cyan" className="text-center">
        <p className="text-gray-400">
          <span className="neon-text-cyan font-semibold">规则：</span>
          卫生评分 ≥ {config.minHealthScore}分 且 无未处理违规的餐车可上屏。
          同品类连续排位不超过 {config.maxConsecutiveSameCategory} 个。
        </p>
      </NeonCard>
    </div>
  );
}

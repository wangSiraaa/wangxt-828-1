import { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Clock, Filter, XCircle } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import NeonSelect from '@/components/ui/NeonSelect';
import NeonModal from '@/components/ui/NeonModal';
import { useStore } from '@/store';
import { VIOLATION_TYPES } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import type { Violation } from '@/types';

export default function ViolationManagement() {
  const { violations, trucks, addViolation, resolveViolation, currentRole } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({ truckId: '', type: VIOLATION_TYPES[0], description: '' });

  const isEditable = currentRole === 'inspector' || currentRole === 'admin';

  const filteredViolations = violations
    .filter(v => filterStatus === 'all' || (filterStatus === 'active' && !v.resolved) || (filterStatus === 'resolved' && v.resolved))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeCount = violations.filter(v => !v.resolved).length;

  const handleSubmit = () => {
    if (!formData.truckId || !formData.type) return;
    addViolation({ truckId: formData.truckId, type: formData.type, description: formData.description, inspector: currentRole === 'inspector' ? '巡查员' : '管理员' });
    setIsModalOpen(false);
    setFormData({ truckId: '', type: VIOLATION_TYPES[0], description: '' });
  };

  const getTruckName = (id: string) => trucks.find(t => t.id === id)?.name || '未知餐车';

  const statusColors: Record<string, string> = {
    '卫生不达标': 'neon-pink',
    '占道经营': 'neon-yellow',
    '超时经营': 'neon-orange',
    '油烟扰民': 'neon-purple',
    '证照不全': 'neon-pink',
    '价格欺诈': 'neon-yellow',
    '其他': 'gray-400',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display neon-text-pink">违规记录</h1>
          <p className="text-gray-400 mt-1">记录和管理餐车违规行为</p>
        </div>
        {isEditable && (
          <NeonButton variant="danger" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2 inline" />记录违规
          </NeonButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NeonCard color="pink" className="text-center">
          <div className="text-4xl font-bold neon-text-pink">{violations.length}</div>
          <div className="text-gray-400 text-sm mt-1">总违规次数</div>
        </NeonCard>
        <NeonCard color="yellow" className="text-center">
          <div className="text-4xl font-bold neon-text-yellow">{activeCount}</div>
          <div className="text-gray-400 text-sm mt-1">待处理违规</div>
        </NeonCard>
        <NeonCard color="green" className="text-center">
          <div className="text-4xl font-bold neon-text-green">{violations.length - activeCount}</div>
          <div className="text-gray-400 text-sm mt-1">已处理</div>
        </NeonCard>
      </div>

      <NeonCard color="pink">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">违规记录列表</h2>
          <NeonSelect label="" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            options={[{ value: 'all', label: '全部' }, { value: 'active', label: '待处理' }, { value: 'resolved', label: '已处理' }]}
            className="w-40" />
        </div>

        <div className="space-y-3">
          {filteredViolations.map(violation => {
            const color = statusColors[violation.type] || 'gray-400';
            return (
              <div key={violation.id} className={cn(
                'p-4 rounded-lg border transition-all',
                violation.resolved ? 'bg-gray-800/30 border-gray-700' : 'bg-neon-pink/5 border-neon-pink/30'
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {violation.resolved ? (
                      <CheckCircle className="w-5 h-5 neon-text-green mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 neon-text-yellow mt-0.5 animate-pulse" />
                    )}
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={cn('px-2 py-0.5 rounded text-xs font-medium', `bg-neon-${color}/20 text-neon-${color}`)}>
                          {violation.type}
                        </span>
                        <span className="font-semibold text-white">{getTruckName(violation.truckId)}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{violation.description || '无详细描述'}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(violation.createdAt)}</span>
                        <span>记录人: {violation.inspector}</span>
                      </div>
                    </div>
                  </div>
                  {isEditable && !violation.resolved && (
                    <NeonButton size="sm" variant="success" onClick={() => resolveViolation(violation.id)}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1 inline" />处理
                    </NeonButton>
                  )}
                  {violation.resolved && (
                    <span className="text-xs px-2 py-1 rounded bg-neon-green/20 text-neon-green">已处理</span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredViolations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的违规记录</p>
            </div>
          )}
        </div>
      </NeonCard>

      <NeonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="记录违规">
        <div className="space-y-4">
          <NeonSelect label="选择餐车" value={formData.truckId} onChange={e => setFormData({ ...formData, truckId: e.target.value })}
            options={[{ value: '', label: '请选择餐车' }, ...trucks.map(t => ({ value: t.id, label: `#${t.rank} ${t.name}` }))]} />
          <NeonSelect label="违规类型" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
            options={VIOLATION_TYPES.map(t => ({ value: t, label: t }))} />
          <NeonInput label="详细描述（选填）" value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="请描述违规情况..." />
          <div className="flex gap-3 pt-4">
            <NeonButton onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">取消</NeonButton>
            <NeonButton variant="danger" onClick={handleSubmit} className="flex-1">提交记录</NeonButton>
          </div>
        </div>
      </NeonModal>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Search, Filter } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import NeonSelect from '@/components/ui/NeonSelect';
import NeonModal from '@/components/ui/NeonModal';
import { useStore } from '@/store';
import { CATEGORIES } from '@/types';
import { getHealthColor, getCategoryColor, cn } from '@/lib/utils';
import type { Truck } from '@/types';

export default function TruckManagement() {
  const { trucks, addTruck, updateTruck, deleteTruck, currentRole, config } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [formData, setFormData] = useState({ name: '', owner: '', category: '烧烤', healthScore: 85, licensePlate: '' });

  const isEditable = currentRole === 'owner' || currentRole === 'admin';

  const filteredTrucks = trucks
    .filter(t => t.name.includes(searchTerm) || t.owner.includes(searchTerm))
    .filter(t => filterCategory === 'all' || t.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'score') return b.healthScore - a.healthScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleOpenModal = (truck?: Truck) => {
    if (truck) {
      setEditingTruck(truck);
      setFormData({ name: truck.name, owner: truck.owner, category: truck.category, healthScore: truck.healthScore, licensePlate: truck.licensePlate || '' });
    } else {
      setEditingTruck(null);
      setFormData({ name: '', owner: '', category: '烧烤', healthScore: 85, licensePlate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.owner) return;
    if (editingTruck) {
      updateTruck(editingTruck.id, formData);
    } else {
      addTruck(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个餐车吗？')) deleteTruck(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display neon-text-cyan">餐车管理</h1>
          <p className="text-gray-400 mt-1">管理所有餐车信息、品类和卫生评分</p>
        </div>
        {isEditable && (
          <NeonButton onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2 inline" />添加餐车</NeonButton>
        )}
      </div>

      <NeonCard color="cyan">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <NeonInput placeholder="搜索餐车名称/摊主..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}>
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </NeonInput>
          <NeonSelect label="" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            options={[{ value: 'all', label: '全部分类' }, ...CATEGORIES.map(c => ({ value: c, label: c }))]} />
          <NeonSelect label="" value={sortBy} onChange={e => setSortBy(e.target.value)}
            options={[{ value: 'rank', label: '按排位' }, { value: 'score', label: '按评分' }, { value: 'name', label: '按名称' }]} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrucks.map((truck, idx) => {
            const hasActiveViolation = truck.activeViolations > 0;
            const canDisplay = truck.healthScore >= config.minHealthScore && !hasActiveViolation;
            const categoryColor = getCategoryColor(truck.category);
            const healthColor = getHealthColor(truck.healthScore);

            return (
              <div key={truck.id} className={cn(
                'glass-card rounded-xl p-5 border transition-all duration-300',
                canDisplay ? 'border-neon-green/30 hover:border-neon-green' : 'border-neon-pink/30 hover:border-neon-pink'
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">#{truck.rank}</span>
                      <h3 className="text-lg font-semibold text-white">{truck.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">摊主: {truck.owner}</p>
                  </div>
                  {isEditable && (
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenModal(truck)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-cyan">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(truck.id)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-pink">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', `bg-neon-${categoryColor}/20 text-neon-${categoryColor}`)}>
                    {truck.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className={cn('w-4 h-4', `text-neon-${healthColor}`)} />
                    <span className={`text-neon-${healthColor} font-medium`}>{truck.healthScore}</span>
                  </span>
                </div>

                {truck.licensePlate && <p className="text-gray-500 text-xs mb-3">车牌: {truck.licensePlate}</p>}

                <div className="flex items-center gap-2 text-sm">
                  {canDisplay ? (
                    <span className="px-2 py-1 rounded bg-neon-green/20 text-neon-green text-xs">✓ 可上屏</span>
                  ) : (
                    <>
                      {truck.healthScore < config.minHealthScore && (
                        <span className="px-2 py-1 rounded bg-neon-pink/20 text-neon-pink text-xs">评分不足</span>
                      )}
                      {hasActiveViolation && (
                        <span className="px-2 py-1 rounded bg-neon-yellow/20 text-neon-yellow text-xs">有违规</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTrucks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>没有找到匹配的餐车</p>
          </div>
        )}
      </NeonCard>

      <NeonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTruck ? '编辑餐车' : '添加餐车'}>
        <div className="space-y-4">
          <NeonInput label="餐车名称" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="例如：老王烧烤" />
          <NeonInput label="摊主姓名" value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} placeholder="摊主姓名" />
          <NeonInput label="车牌号" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} placeholder="选填" />
          <NeonSelect label="经营品类" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
            options={CATEGORIES.map(c => ({ value: c, label: c }))} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">卫生评分: {formData.healthScore}</label>
            <input type="range" min="0" max="100" value={formData.healthScore}
              onChange={e => setFormData({ ...formData, healthScore: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <NeonButton onClick={() => setIsModalOpen(false)} variant="secondary" className="flex-1">取消</NeonButton>
            <NeonButton onClick={handleSubmit} className="flex-1">{editingTruck ? '保存' : '添加'}</NeonButton>
          </div>
        </div>
      </NeonModal>
    </div>
  );
}

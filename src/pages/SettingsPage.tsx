import { useState } from 'react';
import { Settings, Save, RotateCcw, Database, Trash2 } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import NeonButton from '@/components/ui/NeonButton';
import NeonInput from '@/components/ui/NeonInput';
import { useStore } from '@/store';
import { initializeMockData } from '@/utils/storage';

export default function SettingsPage() {
  const { config, updateConfig, clearAllData } = useStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('确定要重置为默认设置吗？')) {
      const defaults = { id: "default", minHealthScore: 60, maxConsecutiveSameCategory: 2 };
      setLocalConfig(defaults);
      updateConfig(defaults);
    }
  };

  const handleResetData = () => {
    if (confirm('确定要重置所有数据吗？这将恢复初始 mock 数据！')) {
      clearAllData();
      initializeMockData();
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display neon-text-cyan flex items-center gap-3">
          <Settings className="w-8 h-8" />系统设置
        </h1>
        <p className="text-gray-400 mt-1">配置业务规则和系统参数</p>
      </div>

      <NeonCard color="cyan">
        <h2 className="text-xl font-bold text-white mb-6">业务规则配置</h2>
        <div className="space-y-6">
          <div>
            <NeonInput
              type="number"
              label="卫生评分阈值"
              value={localConfig.minHealthScore}
              onChange={e => setLocalConfig({ ...localConfig, minHealthScore: parseInt(e.target.value) || 0 })}
              min={0}
              max={100}
            />
            <p className="text-sm text-gray-500 mt-1">低于此分数的餐车不能上屏展示（默认：60分）</p>
          </div>

          <div>
            <NeonInput
              type="number"
              label="同品类连续排位限制"
              value={localConfig.maxConsecutiveSameCategory}
              onChange={e => setLocalConfig({ ...localConfig, maxConsecutiveSameCategory: parseInt(e.target.value) || 1 })}
              min={1}
              max={10}
            />
            <p className="text-sm text-gray-500 mt-1">同品类连续排位超过此数量将发出警告（默认：2个）</p>
          </div>

          <div className="flex gap-3 pt-4">
            <NeonButton onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2 inline" />
              {saved ? '已保存 ✓' : '保存设置'}
            </NeonButton>
            <NeonButton variant="secondary" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2 inline" />重置默认
            </NeonButton>
          </div>
        </div>
      </NeonCard>

      <NeonCard color="yellow">
        <h2 className="text-xl font-bold text-white mb-6">数据管理</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20">
            <div>
              <h3 className="font-semibold text-white">重置为示例数据</h3>
              <p className="text-sm text-gray-400">恢复初始 mock 数据，包含 6 辆餐车和示例违规记录</p>
            </div>
            <NeonButton variant="warning" onClick={handleResetData}>
              <Database className="w-4 h-4 mr-2 inline" />重置数据
            </NeonButton>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-red-900/10 border border-red-500/20">
            <div>
              <h3 className="font-semibold text-red-400">清空所有数据</h3>
              <p className="text-sm text-gray-400">删除所有餐车、违规记录，恢复空白状态</p>
            </div>
            <NeonButton variant="danger" onClick={handleClearData}>
              <Trash2 className="w-4 h-4 mr-2 inline" />清空数据
            </NeonButton>
          </div>
        </div>
      </NeonCard>

      <NeonCard color="pink">
        <h2 className="text-xl font-bold text-white mb-4">关于</h2>
        <div className="space-y-2 text-gray-400 text-sm">
          <p>🍢 夜市餐车排位屏 v1.0.0</p>
          <p>📦 技术栈：React 18 + TypeScript + Vite + TailwindCSS + Zustand</p>
          <p>💾 数据存储：浏览器 localStorage</p>
          <p>🎨 UI 风格：夜市霓虹主题</p>
        </div>
      </NeonCard>
    </div>
  );
}

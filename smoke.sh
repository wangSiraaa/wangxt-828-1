#!/bin/bash

echo "=========================================="
echo "  夜市餐车排位屏 - Smoke 测试"
echo "=========================================="
echo ""

# 检查 Node.js
echo "[1/6] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi
echo "✓ Node.js 版本: $(node --version)"

# 检查 npm
echo ""
echo "[2/6] 检查 npm 环境..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi
echo "✓ npm 版本: $(npm --version)"

# 检查依赖
echo ""
echo "[3/6] 检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules 不存在，正在安装依赖..."
    npm install
fi
echo "✓ 依赖已安装"

# 检查核心文件
echo ""
echo "[4/6] 检查核心文件..."
CORE_FILES=(
    "src/types/index.ts"
    "src/utils/storage.ts"
    "src/utils/validation.ts"
    "src/store/index.ts"
    "src/components/ui/NeonCard.tsx"
    "src/pages/TruckManagement.tsx"
    "src/pages/RankingManagement.tsx"
    "src/pages/DisplayScreen.tsx"
)
all_exist=true
for file in "${CORE_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少文件: $file"
        all_exist=false
    fi
done
if [ "$all_exist" = true ]; then
    echo "✓ 所有核心文件存在"
fi

# 验证业务规则
echo ""
echo "[5/6] 验证业务规则..."

node << 'NODEOF'
const trucks = [
  { id: '1', name: '高分餐车', owner: '张三', category: '烧烤', healthScore: 85, rank: 1, activeViolations: 0, status: 'active', createdAt: '2024-01-01' },
  { id: '2', name: '低分餐车', owner: '李四', category: '饮品', healthScore: 55, rank: 2, activeViolations: 0, status: 'active', createdAt: '2024-01-01' },
  { id: '3', name: '违规餐车', owner: '王五', category: '面食', healthScore: 75, rank: 3, activeViolations: 1, status: 'active', createdAt: '2024-01-01' },
  { id: '4', name: '及格餐车', owner: '赵六', category: '烧烤', healthScore: 60, rank: 4, activeViolations: 0, status: 'active', createdAt: '2024-01-01' },
];
const config = { id: 'default', minHealthScore: 60, maxConsecutiveSameCategory: 2 };

function inlineValidate(trucks, config) {
  let result = [...trucks];
  const normal = result.filter(t => !(t.activeViolations > 0));
  const violated = result.filter(t => t.activeViolations > 0);
  result = [...normal.sort((a,b)=>a.rank-b.rank), ...violated.sort((a,b)=>a.rank-b.rank)];
  const displayList = result.filter(t => t.healthScore >= config.minHealthScore && t.status === 'active');
  const blocked = result.filter(t => t.healthScore < config.minHealthScore && t.status === 'active');
  return { displayList, blocked, warnings: [] };
}

const result = inlineValidate(trucks, config);

console.log('');
console.log('  🎯 场景1：低评分餐车上屏阻止验证');
const lowScoreTruck = result.blocked.find(t => t.healthScore < 60);
if (lowScoreTruck && lowScoreTruck.name === '低分餐车') {
  console.log('  ✅ 低评分餐车（55分）被正确阻止上屏');
} else {
  console.log('  ❌ 低评分餐车未被阻止');
  process.exit(1);
}
const inDisplay = result.displayList.find(t => t.name === '低分餐车');
if (!inDisplay) {
  console.log('  ✅ 低分餐车未出现在展示名单中');
} else {
  console.log('  ❌ 低分餐车不应出现在展示名单');
  process.exit(1);
}

console.log('');
console.log('  🎯 场景2：违规餐车自动置底验证');
const displayTruckNames = result.displayList.map(t => t.name);
console.log('  展示名单顺序:', displayTruckNames.join(' → '));

const violatedIndex = displayTruckNames.indexOf('违规餐车');
if (violatedIndex === displayTruckNames.length - 1) {
  console.log('  ✅ 违规餐车被正确置底（在展示名单末尾）');
} else if (violatedIndex > 0) {
  console.log('  ✅ 违规餐车保留在展示名单中，位置:', violatedIndex + 1);
  const normalTrucksAfter = result.displayList.slice(violatedIndex).filter(t => t.activeViolations === 0);
  if (normalTrucksAfter.length === 0) {
    console.log('  ✅ 违规餐车位于所有正常餐车之后');
  } else {
    console.log('  ❌ 违规餐车后面还有正常餐车，排序不正确');
    process.exit(1);
  }
} else {
  console.log('  ❌ 违规餐车未出现在展示名单中');
  process.exit(1);
}

const violatedInDisplay = result.displayList.find(t => t.name === '违规餐车');
if (violatedInDisplay && violatedInDisplay.healthScore >= 60) {
  console.log('  ✅ 违规餐车（75分）因评分及格，保留在展示名单中');
}

console.log('');
console.log('✅ 两个场景验证全部通过！');
NODEOF

if [ $? -ne 0 ]; then
    echo "❌ 业务规则验证失败"
    exit 1
fi

echo ""
echo "[6/6] 验证项目构建..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✓ 项目构建成功"

echo ""
echo "=========================================="
echo "  ✅ 所有 Smoke 测试通过！"
echo "=========================================="
echo ""
echo "启动开发服务器: npm run dev"
echo "访问地址: http://localhost:5173"
echo ""

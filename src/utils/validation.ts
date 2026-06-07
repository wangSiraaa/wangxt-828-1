import { Truck, SystemConfig, RankValidationResult } from '../types';

export const validateRanking = (trucks: Truck[], config: SystemConfig): RankValidationResult => {
  const warnings: string[] = [];

  let sortedTrucks = [...trucks].sort((a, b) => a.rank - b.rank);

  const normalTrucks = sortedTrucks.filter(t => t.activeViolations === 0);
  const violationTrucks = sortedTrucks.filter(t => t.activeViolations > 0);
  sortedTrucks = [...normalTrucks, ...violationTrucks];

  const eligibleTrucks = sortedTrucks.filter(
    t => t.healthScore >= config.minHealthScore && t.status === 'active' && t.activeViolations === 0
  );

  const lowScoreTrucks = sortedTrucks.filter(
    t => t.healthScore < config.minHealthScore && t.status === 'active'
  );
  if (lowScoreTrucks.length > 0) {
    warnings.push(
      `${lowScoreTrucks.length} 辆餐车卫生评分低于 ${config.minHealthScore} 分，已禁止上屏：${lowScoreTrucks.map(t => t.name).join('、')}`
    );
  }

  let consecutiveCount = 1;
  let prevCategory = '';

  for (let i = 0; i < eligibleTrucks.length; i++) {
    const truck = eligibleTrucks[i];
    if (truck.category === prevCategory) {
      consecutiveCount++;
      if (consecutiveCount > config.maxConsecutiveSameCategory) {
        warnings.push(
          `位置 ${i + 1}：${truck.name} 造成同品类「${truck.category}」连续排位超过 ${config.maxConsecutiveSameCategory} 个，请调整`
        );
      }
    } else {
      consecutiveCount = 1;
      prevCategory = truck.category;
    }
  }

  if (violationTrucks.length > 0) {
    warnings.push(
      `${violationTrucks.length} 辆餐车存在未处理违规，已自动置底：${violationTrucks.map(t => t.name).join('、')}`
    );
  }

  return { valid: true, warnings, displayList: eligibleTrucks };
};

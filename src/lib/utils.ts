import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    '烧烤': 'pink', '炸物': 'orange', '饮品': 'cyan',
    '面食': 'yellow', '甜品': 'purple', '海鲜': 'green',
    '火锅': 'pink', '主食': 'yellow', '小吃': 'orange',
    '其他': 'gray-400'
  };
  return colors[category] || 'gray-400';
};

export const getHealthColor = (score: number): string => {
  if (score >= 90) return 'green';
  if (score >= 80) return 'cyan';
  if (score >= 70) return 'yellow';
  if (score >= 60) return 'orange';
  return 'pink';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

export const DEFAULT_CATEGORIES = [
  { id: 'A', name: '核心产出', color: '#ef4444', icon: '🔴' },
  { id: 'B', name: '基础事务', color: '#eab308', icon: '🟡' },
  { id: 'C', name: '生活休息', color: '#22c55e', icon: '🟢' },
  { id: 'D', name: '时间黑洞', color: '#6b7280', icon: '⚫' },
];

export const CATEGORIES_STORAGE_KEY = 'timelog_categories';

export function getCategories() {
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_CATEGORIES;
}

export function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

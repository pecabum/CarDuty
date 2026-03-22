export const EXPENSE_CATEGORIES = [
  { key: 'kasko', label: 'Каско', icon: 'shield-checkmark-outline', color: '#4A90D9' },
  { key: 'grazhdanska', label: 'Гражданска', icon: 'document-text-outline', color: '#E67E22' },
  { key: 'danak', label: 'Данък', icon: 'cash-outline', color: '#27AE60' },
  { key: 'pregled', label: 'Преглед', icon: 'car-outline', color: '#8E44AD' },
  { key: 'vinetka', label: 'Винетка', icon: 'card-outline', color: '#E74C3C' },
];

export const CATEGORY_MAP = EXPENSE_CATEGORIES.reduce((acc, cat) => {
  acc[cat.key] = cat;
  return acc;
}, {});

export function getCategoryLabel(key) {
  return CATEGORY_MAP[key]?.label || key;
}

export function getCategoryColor(key) {
  return CATEGORY_MAP[key]?.color || '#999';
}

export function getCategoryIcon(key) {
  return CATEGORY_MAP[key]?.icon || 'help-circle-outline';
}

export function daysUntil(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

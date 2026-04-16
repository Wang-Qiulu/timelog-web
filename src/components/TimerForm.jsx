import { useTimerStore } from '../store/useTimerStore';
import { getCategories } from '../constants/categories';

export default function TimerForm() {
  const timerState = useTimerStore(state => state.timerState);
  const description = useTimerStore(state => state.description);
  const categoryId = useTimerStore(state => state.categoryId);
  const setDescription = useTimerStore(state => state.setDescription);
  const setCategory = useTimerStore(state => state.setCategory);

  const categories = getCategories();
  const isDisabled = timerState !== 'running';

  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="正在做什么？"
        disabled={isDisabled}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
      <select
        value={categoryId || ''}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isDisabled}
        className="w-40 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
      >
        <option value="">选择分类</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
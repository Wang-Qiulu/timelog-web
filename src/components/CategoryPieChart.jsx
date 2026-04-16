import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLogsStore } from '../store/useLogsStore';
import { getCategories } from '../constants/categories';

export default function CategoryPieChart() {
  const logs = useLogsStore(state => state.logs);
  const categories = getCategories();

  const chartData = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach(cat => {
      categoryMap.set(cat.id, { name: cat.name, value: 0, color: cat.color });
    });

    logs.forEach(log => {
      const entry = categoryMap.get(log.categoryId);
      if (entry) {
        entry.value += log.duration;
      }
    });

    return Array.from(categoryMap.values())
      .filter(item => item.value > 0)
      .map(item => ({
        ...item,
        value: Math.round(item.value * 10) / 10,
      }));
  }, [logs, categories]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 h-64 flex items-center justify-center">
        <p className="text-gray-400">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">时间分布</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} 分钟`, '']}
            contentStyle={{
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { getCategories, saveCategories, DEFAULT_CATEGORIES } from '../constants/categories';
import { getAllLogs } from '../db/cloudDb.js';
import { exportToJSON, exportToCSV } from '../utils/export.js';

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleExportJSON = async () => {
    const logs = await getAllLogs();
    exportToJSON(logs);
  };

  const handleExportCSV = async () => {
    const logs = await getAllLogs();
    exportToCSV(logs);
  };

  const handleCategoryChange = (id, field, value) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const handleSaveCategories = () => {
    saveCategories(categories);
    setIsEditing(false);
  };

  const handleResetCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    setIsEditing(true);
  };

  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">设置</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">数据导出</h3>
          <div className="flex gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              导出 JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              导出 CSV
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">分类管理</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                编辑
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleResetCategories}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  重置
                </button>
                <button
                  onClick={handleSaveCategories}
                  className="text-sm text-gray-900 font-medium"
                >
                  保存
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleCategoryChange(cat.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
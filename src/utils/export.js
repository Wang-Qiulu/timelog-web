export function exportToJSON(logs) {
  const data = JSON.stringify(logs, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  downloadBlob(blob, `timelog_${new Date().toISOString().split('T')[0]}.json`);
}

export function exportToCSV(logs) {
  const headers = ['ID', '描述', '分类', '开始时间', '结束时间', '时长(分钟)', '创建时间'];
  const rows = logs.map(log => [
    log.id,
    `"${log.description.replace(/"/g, '""')}"`,
    log.categoryId,
    new Date(log.startTime).toISOString(),
    new Date(log.endTime).toISOString(),
    log.duration,
    new Date(log.createdAt).toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `timelog_${new Date().toISOString().split('T')[0]}.csv`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
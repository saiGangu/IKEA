function convertToCSV(data) {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => row[h] ?? '').join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

module.exports = convertToCSV;

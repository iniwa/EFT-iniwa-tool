export const isTaskId = (value) => typeof value === 'string' && /^[0-9a-f]{24}$/i.test(value);

export function resolveTaskReferences(values, tasks = []) {
  const names = new Map();
  tasks.forEach((task) => {
    if (!task?.id) return;
    [...new Set([task.name, ...(task.nameAliases || [])].filter(Boolean))].forEach((name) => {
      const matches = names.get(name) || [];
      matches.push(task.id); names.set(name, matches);
    });
  });
  const warnings = [];
  const resolved = values.map((value) => {
    if (isTaskId(value)) return value;
    const matches = names.get(value) || [];
    if (matches.length === 1) return matches[0];
    warnings.push(`タスク「${value}」は${matches.length ? '同名候補が複数あります' : '現在のデータに見つかりません'}。元の値を保持しました。`);
    return value;
  });
  return { values: [...new Set(resolved)], warnings, complete: warnings.length === 0 };
}

export function normalizeHideoutAliases(value, stations = []) {
  const names = new Map();
  stations.forEach((station) => {
    if (!station?.normalizedName) return;
    [station.name, ...(station.nameAliases || [])].filter(Boolean).forEach((name) => names.set(name, station.normalizedName));
  });
  return Object.entries(value).reduce((result, [key, level]) => {
    const normalized = names.get(key) || key;
    // A legacy backup can contain both a localized and normalized key. Keep
    // the furthest progress instead of letting object order downgrade it.
    result[normalized] = Object.prototype.hasOwnProperty.call(result, normalized)
      ? Math.max(Number(result[normalized]) || 0, Number(level) || 0)
      : level;
    return result;
  }, Object.create(null));
}

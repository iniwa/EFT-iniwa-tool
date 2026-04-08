// src/composables/useImportExport.js
// Import / export user data as JSON (singleton)

import { useUserProgress } from './useUserProgress.js';
import { useAppState } from './useAppState.js';
import { useApiData } from './useApiData.js';

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useImportExport() {
  const {
    userHideout,
    completedTasks,
    collectedItems,
    ownedKeys,
    keyUserData,
    prioritizedTasks,
    wishlist,
  } = useUserProgress();

  const { playerLevel } = useAppState();
  const { taskData, hideoutData } = useApiData();

  // -----------------------------------------------------------------------
  // Export
  // -----------------------------------------------------------------------

  /**
   * Serialise current user progress to JSON and trigger a browser download.
   */
  function exportData() {
    const data = {
      userHideout: userHideout.value,
      completedTasks: completedTasks.value,
      collectedItems: collectedItems.value,
      ownedKeys: ownedKeys.value,
      keyUserData: keyUserData.value,
      playerLevel: playerLevel.value,
      prioritizedTasks: prioritizedTasks.value,
      wishlist: wishlist.value,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'iniwas_intel_center_backup.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  // -----------------------------------------------------------------------
  // Import
  // -----------------------------------------------------------------------

  /**
   * Read a JSON file and apply its contents to user progress refs.
   *
   * Accepts the raw `File` object (e.g. from an `<input type="file">` change event).
   *
   * @param {File} file
   * @returns {Promise<void>}
   */
  function importData(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);

          // v2バックアップのタスク名→ID変換
          const isTaskId = (val) => typeof val === 'string' && /^[0-9a-f]{24}$/.test(val);
          const tasks = taskData.value;
          const needsMigration = tasks && tasks.length > 0;

          if (parsed.completedTasks) {
            if (needsMigration && parsed.completedTasks.length > 0 && !isTaskId(parsed.completedTasks[0])) {
              const nameToId = new Map();
              tasks.forEach((t) => { if (t.name && t.id) nameToId.set(t.name, t.id); });
              parsed.completedTasks = parsed.completedTasks
                .map((name) => nameToId.get(name))
                .filter(Boolean);
            }
            completedTasks.value = parsed.completedTasks;
          }

          if (parsed.prioritizedTasks) {
            if (needsMigration && parsed.prioritizedTasks.length > 0 && !isTaskId(parsed.prioritizedTasks[0])) {
              const nameToId = new Map();
              tasks.forEach((t) => { if (t.name && t.id) nameToId.set(t.name, t.id); });
              parsed.prioritizedTasks = parsed.prioritizedTasks
                .map((name) => nameToId.get(name))
                .filter(Boolean);
            }
            prioritizedTasks.value = parsed.prioritizedTasks;
          }

          if (parsed.userHideout) {
            // ローカライズ名キーをnormalizedNameキーに変換
            const stations = hideoutData.value;
            if (stations && stations.length > 0) {
              const nameToNorm = new Map();
              stations.forEach((s) => {
                if (s.name && s.normalizedName) nameToNorm.set(s.name, s.normalizedName);
              });
              const converted = {};
              for (const [key, val] of Object.entries(parsed.userHideout)) {
                const norm = nameToNorm.get(key);
                converted[norm || key] = val;
              }
              userHideout.value = converted;
            } else {
              userHideout.value = parsed.userHideout;
            }
          }
          if (parsed.collectedItems) collectedItems.value = parsed.collectedItems;
          if (parsed.ownedKeys) ownedKeys.value = parsed.ownedKeys;
          if (parsed.keyUserData) keyUserData.value = parsed.keyUserData;
          if (parsed.playerLevel != null) playerLevel.value = parsed.playerLevel;
          if (parsed.wishlist) wishlist.value = parsed.wishlist;

          alert('インポート完了');
          resolve();
        } catch (err) {
          alert('読み込み失敗');
          reject(err);
        }
      };

      reader.onerror = () => {
        alert('読み込み失敗');
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  return {
    exportData,
    importData,
  };
}

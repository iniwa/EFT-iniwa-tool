// Community reports cover the PvE chain and the regular PvP catalog.
// Seasonal per-task equivalence has not been verified.
// https://reitou-blog.com/tarkov-lightkeeper-unlock-pve/
// https://raidsignal.com/tasks/to-the-light-trust-but-verify?mode=regular
export const LIGHTKEEPER_SUPPLEMENT_MODES = ['pve', 'regular']
export const LIGHTKEEPER_SUPPLEMENT_CHECKED_AT = '2026-11-24'

// Factual identifiers, quest titles and prerequisite relationships checked
// against the linked catalog. Descriptions, objectives and rewards are omitted.
export const LIGHTKEEPER_TASKS = [
  { id: '6a880acc9216d0f5aa078305', title: 'Trust but Verify', map: 'The Lab',
    note: 'Tourでの灯台解放、トレーダーの忠誠度、Mechanicとの会話などの受注条件はゲーム内で確認してください。' },
  { id: '6a880f5d9438980c42076efe', title: 'False Call', map: 'Customs', previous: '6a880acc9216d0f5aa078305',
    note: '前提達成後の待ち時間はゲーム内で確認してください。' },
  { id: '6a88270efbd24b6243010e6d', title: 'Someone Called?', previous: '6a880f5d9438980c42076efe' },
  { id: '6a8814d20d25ca7b2908e13e', title: 'Clip Their Wings', previous: '6a880f5d9438980c42076efe',
    note: 'Someone Called? との前後関係は資料によって異なります。待ち時間を含め、ゲーム内で確認してください。' },
  { id: '6a884d69d35a46046d0e808a', title: 'Fallen Bird', previous: '6a8814d20d25ca7b2908e13e' },
  { id: '6a8819620d25ca7b2908e14d', title: 'Dangerous Ambitions', previous: '6a884d69d35a46046d0e808a' },
  { id: '6a881bcf20dba6e9d70597a3', title: 'Bite the Dust', trader: 'Peacekeeper', previous: '6a884d69d35a46046d0e808a' },
  { id: '6a8820cb1f2b560baf0408a1', title: 'A Time to Throw Stones', map: 'The Lab', previous: '6a881bcf20dba6e9d70597a3' },
  { id: '6a8852bc184783d23e047902', title: 'A Time to Gather Stones', previous: '6a8820cb1f2b560baf0408a1' },
  { id: '6a88255e8636c03a2d09ba37', title: 'The Other Side', previous: '6a8852bc184783d23e047902' },
  { id: '625d700cc48e6c62a440fab5', title: 'Getting Acquainted', map: 'Lighthouse', previous: '6a88255e8636c03a2d09ba37' },
]

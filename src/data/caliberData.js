// src/data/caliberData.js
// 弾薬の口径グループとマッピングデータ

/** 口径カテゴリグループ (フィルター表示用) */
export const CALIBER_GROUPS = [
  {
    category: 'Assault Rifles (AR)',
    icon: '⚔️',
    sections: [
      {
        title: '🇺🇸 Western / NATO',
        ids: ['Caliber556x45NATO', 'Caliber762x35', 'Caliber68x51'],
      },
      {
        title: '🇷🇺 Eastern / RUS',
        ids: [
          'Caliber545x39',
          'Caliber762x39',
          'Caliber366TKM',
          'Caliber9x39',
          'Caliber127x55',
        ],
      },
    ],
  },
  {
    category: 'DMR / Sniper Rifles (SR)',
    icon: '🎯',
    sections: [
      {
        title: '🇺🇸 Western / NATO',
        ids: ['Caliber762x51', 'Caliber86x70', 'Caliber127x99'],
      },
      {
        title: '🇷🇺 Eastern / RUS',
        ids: ['Caliber762x54R', 'Caliber93x64'],
      },
      {
        title: '🦌 Civilian / Hunting',
        ids: ['Caliber308ME'],
      },
    ],
  },
  {
    category: 'SMG / Pistols',
    icon: '🔫',
    sections: [
      {
        title: '🇺🇸 Western / NATO',
        ids: [
          'Caliber9x19PARA',
          'Caliber1143x23ACP',
          'Caliber46x30',
          'Caliber57x28',
          'Caliber9x33R',
          'Caliber127x33',
        ],
      },
      {
        title: '🇷🇺 Eastern / RUS',
        ids: ['Caliber9x18PM', 'Caliber762x25TT', 'Caliber9x21'],
      },
    ],
  },
  {
    category: 'Shotguns (SG)',
    icon: '💥',
    sections: [
      {
        title: 'All Origins',
        ids: ['Caliber12g', 'Caliber20g', 'Caliber23x75'],
      },
    ],
  },
  {
    category: 'Others / GL',
    icon: '📦',
    sections: [
      {
        title: 'Grenades & Flares',
        ids: ['Caliber40x46', 'Caliber40mmRU', 'Caliber26x75', 'Caliber20x1mm'],
      },
    ],
  },
];

/** 口径ID → 表示名 + 使用武器例 のマッピング */
export const CALIBER_MAP = {
  Caliber556x45NATO: { name: '5.56x45mm NATO', examples: 'M4A1, HK416, MDR' },
  Caliber762x39: { name: '7.62x39mm', examples: 'AKM, Mk47, SKS' },
  Caliber545x39: { name: '5.45x39mm', examples: 'AK-74, RPK-16' },
  Caliber762x51: { name: '7.62x51mm NATO', examples: 'M80, SR-25, SCAR-H' },
  Caliber762x35: { name: '.300 Blackout', examples: 'MCX, M4 (mod)' },
  Caliber366TKM: { name: '.366 TKM', examples: 'VPO-209, VPO-215' },
  Caliber127x55: { name: '12.7x55mm', examples: 'ASh-12, RSh-12' },
  Caliber68x51: { name: '6.8x51mm', examples: 'SIG Spear' },
  Caliber93x64: { name: '9.3x64mm Brenneke', examples: 'SVDK' },
  Caliber9x39: { name: '9x39mm', examples: 'VSS, AS VAL' },
  Caliber9x19PARA: { name: '9x19mm Parabellum', examples: 'MP5, Vector, Glock' },
  Caliber1143x23ACP: { name: '.45 ACP', examples: 'UMP, M1911, Vector' },
  Caliber46x30: { name: '4.6x30mm HK', examples: 'MP7' },
  Caliber57x28: { name: '5.7x28mm FN', examples: 'P90, Five-seveN' },
  Caliber9x21: { name: '9x21mm Gyurza', examples: 'SR-2M Veresk' },
  Caliber9x18PM: { name: '9x18mm PM', examples: 'Kedr, Makarov' },
  Caliber762x25TT: { name: '7.62x25mm TT', examples: 'PPSH, TT' },
  Caliber9x33R: { name: '.357 Magnum', examples: 'Rhino' },
  Caliber762x54R: { name: '7.62x54mm R', examples: 'Mosin, SVDS, PKM' },
  Caliber86x70: { name: '.338 Lapua Magnum', examples: 'AXMC, Mk-18 Mjolnir' },
  Caliber127x99: { name: '.50 BMG', examples: 'M82A1' },
  Caliber12g: { name: '12/70 Gauge', examples: 'MP-153, Saiga-12' },
  Caliber20g: { name: '20/70 Gauge', examples: 'TOZ-106' },
  Caliber23x75: { name: '23x75mm', examples: 'KS-23M' },
  Caliber40x46: { name: '40x46mm Grenade', examples: 'M203, M32A1' },
  Caliber40mmRU: { name: '40mm VOG', examples: 'GP-25' },
  Caliber26x75: { name: '26x75mm Flare', examples: 'Signal Pistol' },
  Caliber20x1mm: { name: '20x1mm', examples: 'Toy Gun' },
  Caliber127x33: { name: '.50 Action Express', examples: 'Desert Eagle' },
  Caliber308ME: { name: '.308 Marlin Express', examples: 'Marlin MXLR' },
};

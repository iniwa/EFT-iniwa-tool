// src/data/constants.js
// 共有定数

/** 通貨アイテムID (ルーブル, ドル, ユーロ) */
export const CURRENCY_IDS = [
  '5449016a4bdc2d6f028b456f', // Roubles
  '5696686a4bdc2da3298b456a', // Dollars
  '569668774bdc2da2298b4568', // Euros
];

/** トレーダー表示順 */
export const TRADER_ORDER = [
  'Prapor',
  'Therapist',
  'Fence',
  'Skier',
  'Peacekeeper',
  'Mechanic',
  'Ragman',
  'Jaeger',
  'Ref',
  'Lightkeeper',
];

/** マップ表示順 */
export const MAP_ORDER = [
  'Any / Multiple',
  'Customs',
  'Woods',
  'Interchange',
  'Factory',
  'Shoreline',
  'Lighthouse',
  'Reserve',
  'Streets of Tarkov',
  'Ground Zero',
  'The Lab',
  'The Labyrinth',
];

/** 鍵レーティング値マッピング (SS, E を追加) */
export const RATE_VALUES = {
  SS: 12,
  S: 10,
  A: 8,
  B: 6,
  C: 4,
  D: 2,
  E: 1,
  F: 0,
  '?': 1,
  '-': -1,
};

/** 為替レート (概算) */
export const USD_RATE = 162;
export const EUR_RATE = 175;

/** アプリバージョン */
export const APP_VERSION = '3.1.1';

/** API エンドポイント */
export const API_URL = 'https://api.tarkov.dev/graphql';

/** レート制限: 最小リクエスト間隔 (5分) */
export const RATE_LIMIT_MS = 300000;

/** 自動更新間隔 (20時間) */
export const AUTO_UPDATE_MS = 72000000;

// src/logic/itemLogic.js
// アイテム関連のビジネスロジック (純粋関数)

import { USD_RATE, EUR_RATE } from '../data/constants.js';

/**
 * トレーダーへの最高売却価格を計算する
 * フリーマーケットは除外 (normalizedName で判定)
 * @param {object} item - アイテムデータ
 * @returns {{ vendor: string, price: number, currency: string, priceRUB: number } | null}
 */
export function getBestSellPrice(item) {
  if (!item.sellFor || item.sellFor.length === 0) return null;

  let best = null;

  item.sellFor.forEach((offer) => {
    // フリーマーケットを除外 (normalizedName優先、フォールバックとして名前チェック)
    const normalizedName = offer.vendor.normalizedName || '';
    const vendorName = offer.vendor.name || '';
    if (
      normalizedName === 'flea-market' ||
      vendorName === 'Flea Market' ||
      vendorName === 'フリーマーケット'
    ) {
      return;
    }

    // priceRUB がAPIから来ない場合は概算計算
    let priceRub = offer.priceRUB;
    if (!priceRub) {
      if (offer.currency === 'USD') priceRub = offer.price * USD_RATE;
      else if (offer.currency === 'EUR') priceRub = offer.price * EUR_RATE;
      else priceRub = offer.price;
    }

    if (!best || priceRub > best.priceRUB) {
      best = {
        vendor: vendorName,
        price: offer.price,
        currency: offer.currency,
        priceRUB: priceRub,
      };
    }
  });

  return best;
}

/**
 * アイテムリストのフィルタリング
 * @param {Array} items - 全アイテムデータ
 * @param {string} query - 検索文字列
 * @param {boolean} wishlistOnly - ウィッシュリストのみ表示
 * @param {Array} wishlistIds - ウィッシュリストのアイテムID一覧
 * @returns {Array}
 */
export function filterItems(items, query, wishlistOnly, wishlistIds) {
  if (!items) return [];

  let result = items;

  // ウィッシュリストフィルタ
  if (wishlistOnly) {
    result = result.filter((i) => wishlistIds.includes(i.id));
  }

  // 文字列検索 (日本語名, 英語名(shortName等), normalizedName)
  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter((i) => {
      const matchName = i.name.toLowerCase().includes(q);
      const matchShort =
        i.shortName && i.shortName.toLowerCase().includes(q);
      const matchNorm =
        i.normalizedName && i.normalizedName.toLowerCase().includes(q);

      return matchName || matchShort || matchNorm;
    });
  }

  return result;
}

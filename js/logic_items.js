// js/logic_items.js

const ItemLogic = {
    /**
     * トレーダーへの最高売却価格を計算する
     */
    getBestSellPrice(item) {
        if (!item.sellFor || item.sellFor.length === 0) return null;

        // フリーマーケットを除外し、RUB換算で最高値を出す
        // ※簡易的に 1 USD = 150 RUB, 1 EUR = 160 RUB 程度で計算、またはAPIがrub価格を持っていればそれを使う
        // tarkov.devのAPIは priceRUB を持っていることが多い
        let best = null;

        item.sellFor.forEach(offer => {
            if (offer.vendor.name === 'Flea Market') return;
            
            // priceRUBがAPIから来ない場合は簡易計算
            let priceRub = offer.priceRUB; 
            if (!priceRub) {
                if (offer.currency === 'USD') priceRub = offer.price * 162;
                else if (offer.currency === 'EUR') priceRub = offer.price * 175;
                else priceRub = offer.price;
            }

            if (!best || priceRub > best.priceRUB) {
                best = {
                    vendor: offer.vendor.name,
                    price: offer.price,
                    currency: offer.currency,
                    priceRUB: priceRub
                };
            }
        });

        return best;
    },

    /**
     * 検索フィルター
     */
    filterItems(items, query, wishlistOnly, wishlistIds) {
        if (!items) return [];
        
        let result = items;

        // ウィッシュリストフィルタ
        if (wishlistOnly) {
            result = result.filter(i => wishlistIds.includes(i.id));
        }

        // 文字列検索 (日本語名, 英語名(shortName等), ID)
        if (query) {
            const q = query.toLowerCase().trim();
            result = result.filter(i => {
                const matchName = i.name.toLowerCase().includes(q);
                const matchShort = i.shortName && i.shortName.toLowerCase().includes(q);
                // normalizedNameがあればそれもチェック（英語名など）
                const matchNorm = i.normalizedName && i.normalizedName.toLowerCase().includes(q);
                
                return matchName || matchShort || matchNorm;
            });
        }

        return result;
    }
};
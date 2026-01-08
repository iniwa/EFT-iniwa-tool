// js/logic_items.js

const ItemLogic = {
    /**
     * トレーダーへの最高売却価格を計算する
     */
    getBestSellPrice(item) {
        if (!item.sellFor || item.sellFor.length === 0) return null;

        let best = null;

        item.sellFor.forEach(offer => {
            const vName = offer.vendor.name;
            
            // 【修正】英語名 'Flea Market' と 日本語名 'フリーマーケット' の両方を明示的に除外
            if (vName === 'Flea Market' || vName === 'フリーマーケット') return;
            
            // priceRUBがAPIから来ない場合は簡易計算
            // ※レートは変動するため概算値
            let priceRub = offer.priceRUB; 
            if (!priceRub) {
                if (offer.currency === 'USD') priceRub = offer.price * 162;
                else if (offer.currency === 'EUR') priceRub = offer.price * 175;
                else priceRub = offer.price;
            }

            if (!best || priceRub > best.priceRUB) {
                best = {
                    vendor: vName,
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
                const matchNorm = i.normalizedName && i.normalizedName.toLowerCase().includes(q);
                
                return matchName || matchShort || matchNorm;
            });
        }

        return result;
    }
};
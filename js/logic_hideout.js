const HideoutLogic = {
    CURRENCY_IDS: ["5449016a4bdc2d6f028b456f", "5696686a4bdc2da3298b456a", "569668774bdc2da2298b4568"],

    calculate(hideoutData, userLevels, forceFir, addItemFunc) {
        if (!hideoutData) return;

        hideoutData.forEach(station => {
            const currentLvl = userLevels[station.name] || 0;
            station.levels.forEach(lvl => {
                if (lvl.level > currentLvl) {
                    lvl.itemRequirements.forEach(req => {
                        const item = req.item;
                        if (!item) return;

                        const apiSaysFir = req.attributes && req.attributes.some(attr => 
                            attr.type === 'foundInRaid' && String(attr.value).toLowerCase() === 'true'
                        );
                        
                        const isCurrency = this.CURRENCY_IDS.includes(item.id);

                        if (!isCurrency && (forceFir || apiSaysFir)) {
                            // ★修正: sourceType = 'hideout'
                            addItemFunc('hideoutFir', item.id, item.name, req.count, `${station.name} Lv${lvl.level}`, 'hideout');
                        } else {
                            addItemFunc('hideoutBuy', item.id, item.name, req.count, `${station.name} Lv${lvl.level}`, 'hideout');
                        }
                    });
                }
            });
        });
    }
};
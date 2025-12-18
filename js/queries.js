// js/queries.js

const GRAPHQL_QUERY = `
query GetData {
  tasks(gameMode: pve, lang: ja) {
    id
    name
    minPlayerLevel
    wikiLink
    trader { name }
    map { name }
    
    neededKeys {
      keys {
        id
        name
        shortName
        normalizedName
        wikiLink
      }
    }

    taskRequirements { task { name } }
    traderLevelRequirements { level requirementType value }
    kappaRequired
    lightkeeperRequired
    objectives { 
      description
      ... on TaskObjectiveItem { type count foundInRaid item { id name } } 
    }
    finishRewards {
      items { count item { id name } }
      offerUnlock { level trader { name } item { name } }
      craftUnlock {
        station { name }
        level
        rewardItems {
          item { name }
        }
      }
    }
  }
  
  hideoutStations(lang: ja) {
    name
    levels {
      level
      itemRequirements { count item { id name } attributes { type value } }
    }
  }

  maps(lang: ja) {
    name
    locks {
      key { 
        id 
        name
        shortName
        normalizedName
      }
    }
  }
  
  items(types: keys, lang: ja) {
    id
    name
    shortName
    normalizedName
    wikiLink
  }

  # ★修正: 弾薬の詳細データ
  ammo(lang: ja) {
    item {
      id
      name
      shortName
      description
      wikiLink
      image512pxLink
      
      # 購入情報
      buyFor {
        priceRUB
        vendor { name }
        requirements {
          type
          value
          stringValue
        }
        price
        currency
      }
      
      # クラフト情報
      craftsFor {
        id
        level
        source
        sourceName
        station { name }
        duration # 時間も取得
        taskUnlock {
          name
          id
          trader { name }
        }
        requiredItems {
          count
          quantity
          # ★追加: 素材のアイテム名を取得
          item {
            name
          }
          attributes {
            name
            type
            value
          }
        }
        rewardItems {
          quantity
          count
          # ★追加: 成果物のアイテム名を取得
          item {
            name
          }
          attributes {
            name
            type
            value
          }
        }
      }
      
      # 交換情報
      bartersFor {
        level
        requiredItems {
          count
          quantity
          item { name } # 交換も同様に追加しておきます
          attributes {
            name
            type
            value
          }
        }
        rewardItems {
          count
          quantity
          item { name }
          attributes {
            name
            type
            value
          }
        }
      }
    }
    
    # 弾薬性能データ
    caliber
    damage
    penetrationPower
    armorDamage
    fragmentationChance
    projectileSpeed: initialSpeed
    
    # 追加ステータス
    accuracyModifier
    recoilModifier
    lightBleedModifier
    heavyBleedModifier
    ricochetChance
    ammoType
    tracer
    tracerColor
    staminaBurnPerDamage
    stackMaxSize
    recoil
    penetrationPowerDeviation
    projectileCount
    penetrationChance
  }
}
`;
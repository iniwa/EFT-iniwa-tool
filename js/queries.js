// js/queries.js

/**
 * ゲームモードと言語を指定してGraphQLクエリを生成する関数
 * @param {string} gameMode - 'pve' or 'regular'
 * @param {string} lang - 'ja' or 'en'
 */
const getMainQuery = (gameMode, lang) => `
query GetData {
  tasks(gameMode: ${gameMode}, lang: ${lang}) {
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
      type 
      
      ... on TaskObjectiveItem { 
        count 
        foundInRaid 
        item { id name } 
      }
      
      ... on TaskObjectiveShoot {
        count
        target
        bodyParts
        usingWeapon { name }
      }
      
      ... on TaskObjectiveExtract {
        count
      }
      
      ... on TaskObjectiveMark {
        markerItem { name }
      }
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
  
  # gameModeあり
  hideoutStations(gameMode: ${gameMode}, lang: ${lang}) {
    id
    name
    levels {
      id
      level
      constructionTime
      
      itemRequirements {
        count
        item { id name }
        # ★追加: これがないとFIR判定ができず、すべて購入枠に入ってしまいます
        attributes { type value }
      }
      
      traderRequirements {
        trader { name }
        value
        requirementType
        compareMethod
      }
      
      stationLevelRequirements {
        station { name }
        level
      }
    }
  }

  # gameModeあり
  items(gameMode: ${gameMode}, lang: ${lang}) {
    id
    name
    shortName
    normalizedName
    image512pxLink
    
    sellFor {
      price
      priceRUB
      currency
      vendor { name }
    }
    
    containsItems { item { id } }
  }
  
  # gameModeなし
  maps(lang: ${lang}) {
    name
    locks {
      key { id }
    }
  }
  
  # gameModeなし
  ammo(lang: ${lang}) {
    item {
      id
      name
      shortName
      description
      wikiLink
      image512pxLink
      
      buyFor {
        priceRUB
        vendor { name }
        requirements {
          type
          value
          stringValue
        }
      }
      
      craftsFor {
        station { name }
        level
        duration
        requiredItems {
          count
          item { name }
          attributes { name }
        }
        rewardItems {
          count
          item { name }
        }
        taskUnlock { name }
      }
    }
    
    caliber
    damage
    penetrationPower
    armorDamage
    fragmentationChance
    projectileSpeed: initialSpeed
    
    accuracyModifier
    recoilModifier
    lightBleedModifier
    heavyBleedModifier
    ricochetChance
    ammoType
    tracer
  }
}`;
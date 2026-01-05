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
  
  # アイテム情報のスリム化: sellFor, buyFor を削除
  items(lang: ja) {
    id
    name
    shortName
    normalizedName
    wikiLink
    image512pxLink
    width
    height
    
    # 削除: sellFor (売却額)
    # 削除: buyFor (購入額 - 弾薬以外は不要)
    
    craftsFor {
      station { name }
      level
      duration
      requiredItems {
        count
        quantity
        item { name }
        attributes { name type value }
      }
      rewardItems {
        quantity
        count
        item { name }
        attributes { name type value }
      }
      taskUnlock {
         name
         id
         trader { name }
      }
    }
    
    bartersFor {
      level
      trader { name }
      requiredItems {
        count
        quantity
        item { name }
        attributes { name type value }
      }
      rewardItems {
        count
        quantity
        item { name }
        attributes { name type value }
      }
      taskUnlock {
        name
        id
        trader { name }
      }
    }
  }
  
  # 弾薬情報の buyFor は維持
  ammo(lang: ja) {
    item {
      id
      name
      shortName
      description
      wikiLink
      image512pxLink
      
      # 弾薬の購入情報は必要なので残す
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
}
`;
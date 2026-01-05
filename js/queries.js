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
      
      # 納品タスク
      ... on TaskObjectiveItem { 
        count 
        foundInRaid 
        item { id name } 
      }
      
      # 討伐(キル)タスク
      ... on TaskObjectiveShoot {
        count
        target
        bodyParts
        usingWeapon { name }
        # ★修正: name -> id (API仕様に準拠)
        zones { id }
      }
      
      # 脱出タスク
      ... on TaskObjectiveExtract {
        count
        # zoneは存在しないため削除済み
      }
      
      # マーキングタスク
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
  
  items(lang: ja) {
    id
    name
    shortName
    normalizedName
    wikiLink
    image512pxLink
    width
    height
    
    sellFor {
      priceRUB
      vendor { name }
    }
    
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
  
  ammo(lang: ja) {
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
}
`;
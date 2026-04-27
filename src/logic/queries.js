// src/logic/queries.js
// GraphQL クエリ定義 (変数ベース)

/**
 * メインデータ取得クエリを返す
 * @returns {{ query: string, variables: { gameMode: string, lang: string } }}
 */
export function getMainQuery(gameMode = 'regular', lang = 'ja') {
  const query = `
query GetData($gameMode: GameMode, $lang: LanguageCode) {
  tasks(gameMode: $gameMode, lang: $lang) {
    id
    name
    minPlayerLevel
    wikiLink
    trader { name imageLink }
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

    taskRequirements { task { id name } }
    traderLevelRequirements { level requirementType value }
    kappaRequired
    lightkeeperRequired

    objectives {
      description
      type
      maps { name }

      ... on TaskObjectiveItem {
        count
        foundInRaid
        items { id name }
      }

      ... on TaskObjectiveShoot {
        count
        target
        bodyParts
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

  hideoutStations(gameMode: $gameMode, lang: $lang) {
    id
    name
    normalizedName
    levels {
      id
      level
      constructionTime

      itemRequirements {
        count
        item { id name }
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

  items(gameMode: $gameMode, lang: $lang) {
    id
    name
    shortName
    normalizedName
    wikiLink
    image512pxLink

    sellFor {
      price
      priceRUB
      currency
      vendor { name normalizedName }
    }

    containsItems { item { id } }
    types
  }

  maps(lang: $lang) {
    name
    locks {
      key { id }
    }
  }

  ammo(gameMode: $gameMode, lang: $lang) {
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
    projectileCount
    staminaBurnPerDamage

    accuracyModifier
    recoilModifier
    lightBleedModifier
    heavyBleedModifier
    ricochetChance
    ammoType
    tracer
  }
}`;

  return {
    query,
    variables: { gameMode, lang },
  };
}

/**
 * アイテムDB全件取得クエリ
 * @param {string} gameMode - 'regular' | 'pve'
 * @param {string} lang - 'ja' | 'en'
 * @returns {{ query: string, variables: object }}
 */
export function getItemDbQuery(gameMode = 'regular', lang = 'ja') {
  const query = `
query GetItemDb($gameMode: GameMode, $lang: LanguageCode) {
  items(gameMode: $gameMode, lang: $lang) {
    id
    name
    shortName
    normalizedName
    iconLink
    wikiLink
    avg24hPrice
    sellFor {
      price
      currency
      priceRUB
      vendor { name }
    }
    buyFor {
      vendor { name }
      price
      currency
      requirements {
        type
        value
      }
    }
    bartersFor {
      trader { name }
      level
      requiredItems {
        count
        item { name iconLink }
      }
    }
    craftsFor {
      station { name }
      level
      duration
      rewardItems {
        item { id }
        count
      }
      requiredItems {
        count
        item { name iconLink }
      }
    }
    usedInTasks { name }
    bartersUsing {
      trader { name }
      level
      rewardItems {
        count
        item { name iconLink }
      }
      requiredItems {
        count
        item { name iconLink }
      }
    }
    craftsUsing {
      station { name }
      level
      duration
      rewardItems {
        count
        item { name iconLink }
      }
      requiredItems {
        count
        item { name iconLink }
      }
    }
  }
}`;

  return {
    query,
    variables: { gameMode, lang },
  };
}

/**
 * 単一アイテム価格更新クエリ
 * @param {string} itemId - アイテムID
 * @param {string} gameMode - 'regular' | 'pve'
 * @param {string} lang - 'ja' | 'en'
 * @returns {{ query: string, variables: object }}
 */
export function getSingleItemQuery(itemId, gameMode = 'regular', lang = 'ja') {
  const query = `
query GetSingleItem($itemId: ID!, $gameMode: GameMode, $lang: LanguageCode) {
  item(id: $itemId, gameMode: $gameMode, lang: $lang) {
    avg24hPrice
    sellFor {
      price
      currency
      priceRUB
      vendor { name }
    }
    buyFor {
      vendor { name }
      price
      currency
      requirements {
        type
        value
      }
    }
    bartersFor {
      trader { name }
      level
      requiredItems {
        count
        item { name iconLink }
      }
    }
    craftsFor {
      station { name }
      level
      duration
      rewardItems {
        item { id }
        count
      }
      requiredItems {
        count
        item { name iconLink }
      }
    }
    craftsUsing {
      station { name }
      level
      duration
      rewardItems {
        count
        item { name iconLink }
      }
      requiredItems {
        count
        item { name iconLink }
      }
    }
  }
}`;

  return {
    query,
    variables: { itemId, gameMode, lang },
  };
}

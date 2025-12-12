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
    
    # ★追加: タスク攻略に必要な鍵のリストを取得
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
  
  # itemsは基本的な鍵情報のみ取得 (タスクとの紐付けは上のtasks.neededKeysで行うためシンプルに戻しました)
  items(types: keys, lang: ja) {
    id
    name
    shortName
    normalizedName
    wikiLink
  }
}
`;
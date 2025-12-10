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
      
      # ★修正: 正しいフィールド名 craftUnlock を使用
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
    usedInTasks { name }
  }
}
`;
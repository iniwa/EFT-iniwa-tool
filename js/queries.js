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
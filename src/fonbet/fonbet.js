const {Outcome, ScopeType, BetType, HandicapSide, TotalSubject, TotalDirection} = require("../odds").OddsEnums;
const {football, basketball, tennis} = require("./sports/sports");

const sportsDict = {
  1: "FOOTBALL",
  3: "BASKETBALL",
  4: "TENNIS"
};
const sports = {
  FOOTBALL: football,
  BASKETBALL: basketball,
  TENNIS: tennis
};

const api = {
  event: 'https://line32.bkfon-resource.ru/live/updatesFromVersion/3184630894/en',
  sport: 'https://line01i.bkfon-resource.ru/live/updatesFromVersion/3184630894/en'
};

const Status = {
  MAIN: "main",
  OUTDATED: "outdated",
  LIVE: "live"
};

class Sport {
  constructor(id, parentId, kind, regionId, name, status = Status.OUTDATED) {
    this.id = id;
    this.parentId = parentId;
    this.kind = kind;
    this.regionId = regionId;
    this.name = name;
    this.status = status;
  }
}
class Event {
  constructor(id, parentId, sportId, team1Id, team2Id, team1, team2, name, namePrefix, status = Status.OUTDATED) {
    this.id = id;
    this.parentId = parentId;
    this.sportId = sportId;
    this.team1Id = team1Id;
    this.team2Id = team2Id;
    this.team1 = team1;
    this.team2 = team2;
    this.name = name;
    this.namePrefix = namePrefix;
    this.status = status;
  }
}

const factorsDict = {
  921: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.ONE]
    }
  },
  3150: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.ONE]
    }
  },
  3144: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.ONE]
    }
  },
  922: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.X]
    }
  },
  3152: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.X]
    }
  },
  923: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.TWO]
    }
  },
  3151: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.TWO]
    }
  },
  3145: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.TWO]
    }
  },
  924: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.ONE, Outcome.X]
    }
  },
  1571: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.ONE, Outcome.TWO]
    }
  },
  925: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.WIN,
      outcome: [Outcome.X, Outcome.TWO]
    }
  },
  927: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM1,
      handicap: 0
    }
  },
  937: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM1,
      handicap: 0
    }
  },
  1845: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM1,
      handicap: 0
    }
  },
  928: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM2,
      handicap: 0
    }
  },
  938: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM2,
      handicap: 0
    }
  },
  1846: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.HANDICAP,
      side: HandicapSide.TEAM2,
      handicap: 0
    }
  },
  930: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.OVER,
      total: 0
    }
  },
  940: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.OVER,
      total: 0
    }
  },
  1848: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.OVER,
      total: 0
    }
  },
  931: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.UNDER,
      total: 0
    }
  },
  941: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.UNDER,
      total: 0
    }
  },
  1849: {
    scope: {
      type: ScopeType.MATCH
    },
    bet: {
      type: BetType.TOTAL,
      subject: TotalSubject.ALL,
      direction: TotalDirection.UNDER,
      total: 0
    }
  },
  // 2820: c.MainRowFactorsKind.nextRound1,
  // 2821: c.MainRowFactorsKind.nextRound2,
  // 933: c.MainRowFactorsKind.nextRound1,
  // 934: c.MainRowFactorsKind.nextRound2
};

module.exports = {
  FonbetSport: Sport,
  FonbetEvent: Event,
  fonbetSportsDict: sportsDict,
  api,
  FonbetStatus: Status,
  fonbetSports: sports,
  fonbetFactorsDict: factorsDict
};

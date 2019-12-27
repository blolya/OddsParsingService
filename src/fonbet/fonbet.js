const ScopeType = require("../odds").ScopeType;
const BetType = require("../odds").BetType;
const Outcome = require("../odds").Outcome;
const HandicapSide = require("../odds").HandicapSide;
const TotalSubject = require("../odds").TotalSubject;
const TotalDirection = require("../odds").TotalDirection;


const SportsDict = {
  3: "BASKETBALL"
};

const api = {
  event: 'https://line32.bkfon-resource.ru/live/updatesFromVersion/3166364347/en',
  sport: 'https://line01i.bkfon-resource.ru/live/updatesFromVersion/3166344651/en'
};

const status = {
  OUTDATED: "outdated",
  LIVE: "live"
};

const sports = {
  BASKETBALL: 3
};

class Sport {
  constructor(id, parentId, kind, regionId, name, status = status.OUTDATED) {
    this.id = id;
    this.parentId = parentId;
    this.kind = kind;
    this.regionId = regionId;
    this.name = name;
    this.status = status;
  }
}
class Event {
  constructor(id, parentId, sportId, team1Id, team2Id, team1, team2, name, namePrefix, status = status.OUTDATED) {
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

const factors = {
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
  Sport,
  Event,
  SportsDict,
  api,
  status,
  sports,
  factors
};

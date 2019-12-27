class Factor {
  constructor(event, scope, betType, bookmaker, value, updated, extra, deleted) {
    this.event = event;
    this.scope = scope;
    this.betType = betType;
    this.bookmaker = bookmaker;
    this.value = value;
    this.updated = updated;
    this.extra = extra;
    this.deleted = deleted;
  }
}

class SportEvent {
  constructor(sport, league, firstName, secondName) {
    this.sport = sport;
    this.league = league;
    this.firstName = firstName;
    this.secondName = secondName;
  }
}

const Sport = {
  BASKETBALL: "BASKETBALL"
};

const Outcome = {
  ONE: "ONE",
  TWO: "TWO",
  X: "X"
};

const ScopeType = {
  MATCH: "Scope.Match",
  NUM_SETS: "Scope.NumSets",
  SET: "Scope.Set",
  GAME: "Scope.Game",
  HALF: "Scope.Half",
  QUARTER: "Scope.Quarter"
};

const BetType = {
  WIN: "BetType.Win",
  HANDICAP: "BetType.Handicap",
  TOTAL: "BetType.Total",
  PARITY: "BetType.Parity",
  TWO_WAY: "BetType.TwoWay"
};

const HandicapSide = {
  TEAM1: "TEAM1",
  TEAM2: "TEAM2"
};

const TotalSubject = {
  ALL: "ALL",
  TEAM1: "TEAM1",
  TEAM2: "TEAM2"
};

const TotalDirection = {
  OVER: "OVER",
  UNDER: "UNDER",
  EQUAL: "EQUAL"
};


module.exports = {
  Factor,
  SportEvent,
  Sport,
  Outcome,
  ScopeType,
  BetType,
  HandicapSide,
  TotalSubject,
  TotalDirection
};

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


module.exports = {
  Factor,
  SportEvent,
  Sport
};

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
    this.events = {};
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

module.exports = {
  Sport,
  Event,
  SportsDict,
  api,
  status,
  sports
};

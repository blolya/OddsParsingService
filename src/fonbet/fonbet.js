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
  factors: "https://line11.bkfon-resource.ru/line/factorsCatalog/tables/?lang=en&version=0",
  sport: 'https://line01i.bkfon-resource.ru/live/updatesFromVersion/3184630894/en'
};


class Sport {
  constructor(id, parentId, kind, regionId, name) {
    this.id = id;
    this.parentId = parentId;
    this.kind = kind;
    this.regionId = regionId;
    this.name = name;
  }
}
class Event {
  constructor(id, parentId, sportId, team1Id, team2Id, team1, team2, name, namePrefix) {
    this.id = id;
    this.parentId = parentId;
    this.sportId = sportId;
    this.team1Id = team1Id;
    this.team2Id = team2Id;
    this.team1 = team1;
    this.team2 = team2;
    this.name = name;
    this.namePrefix = namePrefix;
  }
}


module.exports = {
  FonbetSport: Sport,
  FonbetEvent: Event,
  fonbetSportsDict: sportsDict,
  api,
  fonbetSports: sports
};

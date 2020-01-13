const {Factor, SportEvent, OddsEnums} = require("../../odds");


module.exports = {
  id: 4,
  makeOdds: (sport, event, factor) => {

    const sportEvent = new SportEvent(
      OddsEnums.Sport[sport.mainSportName],
      sport.name.substring(sport.name.indexOf(".") + 2),
      event.team1,
      event.team2
    );

    let scope = {
      type: OddsEnums.ScopeType.MATCH
    };

    let set = 0;
    if(event.name !== "") {
      const setNameMatches = event.name.match(/(\d)(st|nd|rd)\sset/mi);
      if (setNameMatches) {
        set = setNameMatches[1];
        scope = {
          type: OddsEnums.ScopeType.SET,
          set: set
        };
      }
    }

    let betType = {};

    if (factor.info.title === "1X2") {

      const outcome = factor.info.outcome === "1" ? OddsEnums.Outcome.ONE :
        factor.info.outcome === "2" ? OddsEnums.Outcome.TWO : "";

      betType = {
        type: OddsEnums.BetType.WIN,
        outcome: [outcome]
      }
    }

    if (factor.info.title === "Total" || factor.info.title === "Totals") {

      if (factor.info.subtitle === "") {
        betType = {
          type: OddsEnums.BetType.TOTAL,
          subject: OddsEnums.TotalSubject.ALL,
          direction: factor.info.outcome === "O" ? OddsEnums.TotalDirection.OVER : OddsEnums.TotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }

    if (factor.info.title === "By games" || factor.info.title === "Hcap") {
      const side = factor.info.outcome === "1" ? OddsEnums.HandicapSide.TEAM1 :
        factor.info.outcome === "2" ? OddsEnums.HandicapSide.TEAM2 : "";

      betType = {
        type: OddsEnums.BetType.HANDICAP,
        side: side,
        handicap: factor.pt
      };

      // console.log(event);
      // console.log(factor);
    }

    return new Factor(sportEvent, scope, betType, OddsEnums.Bookmaker.FONBET, factor.v, "", "", true);
  }
};

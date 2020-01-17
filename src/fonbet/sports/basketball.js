const {Factor, SportEvent, OddsEnums} = require("../../odds");


module.exports = {
  id: 3,
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


    let quarter = 0;
    if (event.name !== "") {
      const quarterNameMatches = event.name.match(/(\d)(st|nd|rd|th)\squarter/mi);
      if (quarterNameMatches) {
        quarter = quarterNameMatches[1];
        scope = {
          type: OddsEnums.ScopeType.QUARTER,
          quarter: quarter
        };
      }
    }

    let betType = {};

    if (factor.info.title === "1X2") {

      const outcome =
        factor.info.outcome === "1" ? [OddsEnums.Outcome.ONE] :
        factor.info.outcome === "2" ? [OddsEnums.Outcome.TWO] :
        factor.info.outcome === "X" ? [OddsEnums.Outcome.X] :
        factor.info.outcome === "1X" ? [OddsEnums.Outcome.ONE, OddsEnums.Outcome.X] :
        factor.info.outcome === "X2" ? [OddsEnums.Outcome.X, OddsEnums.Outcome.TWO] :
        factor.info.outcome === "12" ? [OddsEnums.Outcome.ONE, OddsEnums.Outcome.TWO] : "";

      betType = {
        type: OddsEnums.BetType.WIN,
        outcome: outcome
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

    if (factor.info.title === "Team Totals-1") {
      if (factor.info.subtitle === "") {
        betType = {
          type: OddsEnums.BetType.TOTAL,
          subject: OddsEnums.TotalSubject.TEAM1,
          direction: factor.info.outcome === "O" ? OddsEnums.TotalDirection.OVER : OddsEnums.TotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }

    if (factor.info.title === "Team Totals-2") {
      if (factor.info.subtitle === "") {
        betType = {
          type: OddsEnums.BetType.TOTAL,
          subject: OddsEnums.TotalSubject.TEAM2,
          direction: factor.info.outcome === "O" ? OddsEnums.TotalDirection.OVER : OddsEnums.TotalDirection.UNDER,
          total: parseFloat(factor.pt)
        }
      }
    }


    return new Factor(sportEvent, scope, betType, OddsEnums.Bookmaker.FONBET, factor.v, new Date().getTime(), event.parentId ? event.parentId : event.id, false);
  }
};

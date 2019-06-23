const sports = {
  FOOTBALL: 1,
  TENNIS: 3
};
const api = {
  event: 'https://api.ruolimp.ru/api/live/event',
  sport: 'https://api.ruolimp.ru/api/live/sport'
};

class Sport {
  constructor(id) {
    this.id = id;
    this.liveEvents = [];
  }
}
class Event {
  constructor(id, sportId) {
    this.id = id;
    this.sportId = sportId;
  }
}

module.exports = {
  Sport,
  Event,
  sports,
  api
};

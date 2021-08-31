const { getRandomArbitrary } = require("../utils/index.js");

let Game = function (id, level, players, maxTryPermitted, currentGuess = getRandomArbitrary(level), propositions = []) {
  this.id = id;
  this.level = level;
  this.players = players;
  this.currentGuess = currentGuess;
  this.maxTryPermitted = maxTryPermitted;
  this.propositions = propositions;
};

Game.prototype.getId = function () {
  return this.id;
};

Game.prototype.getLevel = function () {
  return this.level;
};

Game.prototype.getPlayers = function () {
  return this.players;
};

Game.prototype.getMaxTryPermitted = function () {
  return this.maxTryPermitted;
};

Game.prototype.getCurrentGuess = function () {
  return this.currentGuess;
};

Game.prototype.getPropositions = function () {
  return this.propositions;
};

Game.prototype.checkVictory = function () {
  if (this.propositions.length > 0) {
    const [lastProposition, ...rest] = [...this.propositions].reverse();

    const isVictory = this.propositions.some((item) => {
      return item == this.getCurrentGuess();
    });

    if (isVictory) {
      return "FOUND";
    } else if (this.propositions.length >= this.maxTryPermitted) {
      return "MAX_PROPOSITION_ACHIEVED";
    } else if (lastProposition > this.getCurrentGuess()) {
      return "TOO_HIGH";
    } else if (lastProposition < this.getCurrentGuess()) {
      return "TOO_LOW";
    } else {
      return "ERROR";
    }
  } else {
    return "NO_PROPOSITION";
  }
};

module.exports = Game;

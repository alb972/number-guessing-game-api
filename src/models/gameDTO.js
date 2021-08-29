const { getRandomArbitrary } = require("../utils/index.js");

let Game = function (id, players, currentGuess = getRandomArbitrary(0, 100), propositions = []) {
  this.id = id;
  this.players = players;
  this.currentGuess = currentGuess;
  this.propositions = propositions;
};

Game.prototype.getId = function () {
  return this.id;
};

Game.prototype.getPlayers = function () {
  return this.players;
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
    if (lastProposition == this.getCurrentGuess()) {
      return "FOUND";
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

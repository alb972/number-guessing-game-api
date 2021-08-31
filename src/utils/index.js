function getRandomArbitrary(level = "EASY") {
  switch (level) {
    case "MEDIUM":
      return Math.trunc(Math.random() * (1000 - 0) + 0);
    case "HARD":
      return Math.trunc(Math.random() * (10000 - 0) + 0);
    default:
      return Math.trunc(Math.random() * (100 - 0) + 0);
  }
}

module.exports = { getRandomArbitrary };

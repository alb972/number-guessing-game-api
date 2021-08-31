const express = require("express");
const router = express.Router();
const UUID = require("uuidjs");
const Player = require("../models/playerDTO");
const Game = require("../models/gameDTO");

// Storage (memory)
let games = [];

/**
 * Generate a new player and create a game object
 * @param {*} req
 * @param {*} res
 */
const createGame = (req, res) => {
  const levelToCreate = req.body.level;
  const newPlayer = new Player(UUID.generate());
  const createdGame = new Game(UUID.generate(), levelToCreate, [newPlayer], 10);

  // Store game
  games = [...games, createdGame];

  res.type("application/json");
  res.status(201);
  res.json(createdGame);
};

/**
 * Returns the list of in progress games
 * @param {*} req
 * @param {*} res
 */
const getGames = (req, res) => {
  res.type("application/json");
  res.status(200);
  res.json(games);
};

/**
 * Returns the specified game infos
 * @param {*} req
 * @param {*} res
 */
const getGameInfos = (req, res) => {
  const idToSearch = req.params.id;
  res.type("application/json");

  // Search game
  const gameFound = games.find((gameToCompare) => {
    return gameToCompare.id == idToSearch;
  });

  if (gameFound) {
    res.status(200);
    res.json(gameFound);
  } else {
    res.status(404);
    res.json({ error: "not found : no game found with this id." });
  }
};

/**
 * Send user proposition and returns last result
 * @param {*} req
 * @param {*} res
 */
const sendProposition = (req, res) => {
  const idToSearch = req.params.id;
  const propositionToSave = req.body.proposition;
  res.type("application/json");

  if (propositionToSave !== null && !Number.isNaN(propositionToSave)) {
    // Search game
    const gameFound = games.find((gameToCompare) => {
      return gameToCompare.id == idToSearch;
    });

    if (gameFound) {
      // If Game continue
      if (gameFound.checkVictory() == "FOUND" || gameFound.checkVictory() == "MAX_PROPOSITION_ACHIEVED") {
        res.status(200);
        res.json({
          state: gameFound.checkVictory(),
          propositions: gameFound.getPropositions(),
        });
      } else {
        // Add new proposition
        games = games.map((gameToCompare) => {
          if (gameToCompare.id == idToSearch) {
            return new Game(
              gameToCompare.getId(),
              gameToCompare.getLevel(),
              gameToCompare.getPlayers(),
              gameToCompare.getMaxTryPermitted(),
              gameToCompare.getCurrentGuess(),
              gameToCompare.getPropositions().concat(propositionToSave)
            );
          } else {
            return gameToCompare;
          }
        });

        // Search game
        const gameToCheck = games.find((gameToCompare) => {
          return gameToCompare.id == idToSearch;
        });

        res.status(200);
        res.json({
          state: gameToCheck.checkVictory(),
          propositions: gameToCheck.getPropositions(),
        });
      }
    } else {
      res.status(404);
      res.json({ error: "not found: game has been lost. start a new game." });
    }
  } else {
    res.status(400);
    res.json({ error: "bad request: it's not a correct proposition." });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The game ID.
 *         players:
 *           type: array
 *           description: The players who playing.
 *           items:
 *             $ref: '#/components/schemas/Player'
 *         currentGuess:
 *           type: integer
 *           description: The number to guess.
 *         propositions:
 *           type: array
 *           description: The players's propositions.
 *           items:
 *             type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID.
 */

/**
 * @swagger
 *   /games:
 *   post:
 *     summary: Create a game
 *     description: Generate a new player and create a game object
 *     tags:
 *       - games
 *     responses:
 *       200:
 *         description: Created Game objet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.post("/", createGame);

/**
 * @swagger
 *   /games:
 *   get:
 *     summary: List of all in progress games
 *     description: Returns a list of in progress games
 *     tags:
 *       - games
 *     responses:
 *       200:
 *         description: List of in progress games.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description:  List of in progress games
 *               items:
 *                 $ref: '#/components/schemas/Game'
 * */
router.get("/", getGames);

/**
 * @swagger
 *   /games/{id}:
 *   get:
 *     summary: Get game informations
 *     description: Returns the specified game informations
 *     tags:
 *       - games
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specified Game object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.get("/:id", getGameInfos);

/**
 * @swagger
 *   /games/{id}/proposition:
 *   post:
 *     summary: Send proposition
 *     description: Send user proposition and returns last result
 *     tags:
 *       - games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposition:
 *                 type: integer
 *                 description: The user's proposition.
 *                 example: 12
 *     responses:
 *       200:
 *         description: An object with result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: string
 */
router.post("/:id/proposition", sendProposition);

module.exports = router;

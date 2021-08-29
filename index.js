const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const indexRouter = require("./src/routes/index");
const gamesRouter = require("./src/routes/games");

const app = express();

// CONFIGS

const port = 3000;
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SWAGGER OPTIONS

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "number-guessing-api",
      version: "0.0.1",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Andy DUFRENOT",
        url: "https://github.com/alb972/number-guessing-game-api/issues",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "default",
        description: "server operations",
      },
      {
        name: "games",
        description: "games operations",
      },
    ],
  },
  // Path to the files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

// ROUTES
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => {
  res.status(301);
  res.redirect("/api-docs");
});
app.use("/api/v1", indexRouter);
app.use("/api/v1/games", gamesRouter);

// START
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;

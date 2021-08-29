const express = require("express");
const router = express.Router();

/**
 * @swagger
 *   /:
 *   get:
 *     summary: Return server status
 *     description: Can be used as a server health check.
 *     responses:
 *       200:
 *         description: An objet with the server status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.get("/", (req, res) => res.status(200).json({ status: "App is working" }));

module.exports = router;

const articleController = require("../controllers/articleController");
const express = require("express");
const router = express.Router();

router.get("/", articleController.getArticle);

module.exports = router;

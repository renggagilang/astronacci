const { Article } = require("../models");

class articleController {
  static async getArticle(req, res) {
    try {
      let article = await Article.findAll({});
      res.status(200).json(article);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = articleController;

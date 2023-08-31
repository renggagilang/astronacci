const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const articleRouter = require("./articleRouter");
router.get("/", (req, res) => {
  res.status(200).json({
    message: "aman",
  });
});

router.use("/users", userRouter);

router.use("/articles", articleRouter);

module.exports = router;

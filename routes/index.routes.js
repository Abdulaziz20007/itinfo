const router = require("express").Router();

const dictRoute = require("./dict.routes");
const descRoute = require("./desc.routes");
const authorRoute = require("./author.routes");
const categoryRoute = require("./category.routes");
const synonymRoute = require("./synonim.routes");
const topicRoute = require("./topic.routes");
const descTopicRoute = require("./desc_topic.routes");
const tagRoute = require("./tag.routes");
const userRoute = require("./user.routes");
const adminRoute = require("./admin.routes");

router.use("/dict", dictRoute);
router.use("/desc", descRoute);
router.use("/author", authorRoute);
router.use("/category", categoryRoute);
router.use("/synonym", synonymRoute);
router.use("/topics", topicRoute);
router.use("/desc-topic", descTopicRoute);
router.use("/tag", tagRoute);
router.use("/users", userRoute);
router.use("/admin", adminRoute);

module.exports = router;

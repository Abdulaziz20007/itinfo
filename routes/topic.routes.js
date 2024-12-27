const router = require("express").Router();
const {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  findTopics,
} = require("../controllers/topic.controller");
const author_police = require("../police_middleware/author_police");

router.get("/", getAllTopics);
router.get("/id", getTopicById);
router.get("/find", findTopics);
router.post("/add", author_police, createTopic);
router.patch("/update", updateTopic);
router.delete("/delete", deleteTopic);

module.exports = router;

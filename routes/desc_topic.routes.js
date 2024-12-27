const router = require("express").Router();
const {
  getAllDescTopics,
  createDescTopic,
  deleteDescTopic
} = require("../controllers/desc_topic.controller");

router.get("/", getAllDescTopics);
router.post("/add", createDescTopic);
router.delete("/delete", deleteDescTopic);

module.exports = router; 
const router = require("express").Router();
const {
  getAllTags,
  createTag,
  deleteTag
} = require("../controllers/tag.controller");

router.get("/", getAllTags);
router.post("/add", createTag);
router.delete("/delete", deleteTag);

module.exports = router; 
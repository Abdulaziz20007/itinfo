const {
  addDescription,
  getAllDescriptions,
  getDescriptionById,
  findDescriptions,
  updateDescription,
  deleteDescription,
  getDescriptionByCategoryId,
} = require("../controllers/description.controller");

const router = require("express").Router();

router.post("/add", addDescription);
router.get("/", getAllDescriptions);
router.get("/id", getDescriptionById);
router.get("/cid", getDescriptionByCategoryId);
router.get("/find", findDescriptions);
router.patch("/update", updateDescription);
router.delete("/delete", deleteDescription);

module.exports = router;


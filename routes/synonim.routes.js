const {
  addSynonim,
  getAllSynonims,
  getSynonimById,
  updateSynonim,
  deleteSynonim,
} = require("../controllers/synonim.controller");

const router = require("express").Router();

router.post("/add", addSynonim);
router.get("/", getAllSynonims);
router.get("/id", getSynonimById);
router.patch("/update", updateSynonim);
router.delete("/delete", deleteSynonim);

module.exports = router;
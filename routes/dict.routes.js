const {
  addTerm,
  getAllTerms,
  getTermsByLetter,
  findTerms,
  getTermById,
  deleteTerm,
  updateTerm,
} = require("../controllers/dictionary.controller");

const router = require("express").Router();

router.post("/add", addTerm);
router.get("/", getAllTerms);
router.get("/id", getTermById);
router.get("/find", findTerms);
router.get("/:letter", getTermsByLetter);
router.delete("/delete/:id", deleteTerm);
router.put("/update/:id", updateTerm);

module.exports = router;

const {
  getAllCategories,
  getCategoryById,
  getCategoriesByParentId,
  findCategoryByName,
  updateCategory,
  addCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const router = require("express").Router();

router.get("/", getAllCategories);
router.get("/id", getCategoryById);
router.get("/parent", getCategoriesByParentId);
router.get("/name", findCategoryByName);
router.patch("/update", updateCategory);
router.post("/add", addCategory);
router.delete("/delete", deleteCategory);

module.exports = router;


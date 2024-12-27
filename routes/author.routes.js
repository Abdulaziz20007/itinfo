const express = require("express");
const router = express.Router();
const authorPolice = require("../police_middleware/author_police");
const authorSelfPolice = require("../police_middleware/author_self_police");
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  findAuthors,
  login,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
} = require("../controllers/author.controller");

router.post("/login", login);
router.post("/register", createAuthor);
router.post("/logout", authorPolice, logoutAuthor);
router.post("/refresh", refreshAuthorToken);

router.get("/", authorPolice, getAllAuthors);
router.get("/search", authorPolice, findAuthors);
router.get("/activate/:link", activateAuthor);
router.get("/:id", authorPolice, getAuthorById);

router.put("/:id", authorPolice, authorSelfPolice, updateAuthor);
router.delete("/:id", authorPolice, authorSelfPolice, deleteAuthor);

module.exports = router;

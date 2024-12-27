const express = require("express");
const router = express.Router();
const userPolice = require("../police_middleware/user_police");
const userSelfPolice = require("../police_middleware/user_self_police");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  findUsers,
  login,
  logoutUser,
  refreshUserToken,
  userActivate,
} = require("../controllers/user.controller");

router.post("/login", login);
router.post("/register", createUser);
router.post("/logout", userPolice, logoutUser);
router.post("/refresh", refreshUserToken);

router.get("/", userPolice, getAllUsers);
router.get("/search", userPolice, findUsers);
router.get("/activate/:link", userActivate);
router.get("/:id", userPolice, getUserById);

router.put("/:id", userPolice, userSelfPolice, updateUser);
router.delete("/:id", userPolice, userSelfPolice, deleteUser);

module.exports = router;

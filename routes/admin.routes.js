const express = require("express");
const router = express.Router();
const adminPolice = require("../police_middleware/admin_police");
const adminSelfPolice = require("../police_middleware/admin_self_police");
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  findAdmins,
  login,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");

router.post("/login", login);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);

router.get("/", adminPolice, getAllAdmins);
router.get("/search", adminPolice, findAdmins);
router.get("/:id", adminPolice, getAdminById);

router.post("/", adminPolice, createAdmin);

router.put("/:id", adminPolice, adminSelfPolice, updateAdmin);
router.delete("/:id", adminPolice, adminSelfPolice, deleteAdmin);

module.exports = router;

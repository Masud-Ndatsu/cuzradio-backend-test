const express = require("express");
const router = express.Router();
const {
     register,
     login,
     getProfile,
     updateUserRole,
     getUsers,
     changeUserStatus,
     deleteUserAccount,
} = require("../controllers/user.controller");
const {
     authenticate,
     checkPermission,
} = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get(
     "/profile",
     authenticate,
     checkPermission(["admin", "moderator", "user"]),
     getProfile
);
router.get(
     "/",
     authenticate,
     checkPermission(["admin", "moderator"]),
     getUsers
);

router.put(
     "/:id/change-status",
     authenticate,
     checkPermission(["admin", "moderator"]),
     changeUserStatus
);
router.put(
     "/:id/change-role",
     authenticate,
     checkPermission(["admin", "moderator"]),
     updateUserRole
);

router.delete(
     "/:id",
     authenticate,
     checkPermission(["admin"]),
     deleteUserAccount
);

module.exports = router;

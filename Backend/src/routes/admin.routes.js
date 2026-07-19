import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { getAllUsers,getUserById,changeUserRole,createCustomer, } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/users/:id", verifyToken, verifyAdmin, getUserById);
router.patch("/users/:id/role",verifyToken,verifyAdmin,changeUserRole);
router.post("/customers",verifyToken,verifyAdmin,createCustomer);

export default router;
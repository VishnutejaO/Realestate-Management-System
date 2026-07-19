import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getDashboardStats,getRecentProperties,getRecentUsers,getRecentWishlist,} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/recent-properties", verifyToken, getRecentProperties);
router.get("/recent-users", verifyToken, getRecentUsers);
router.get("/recent-wishlist", verifyToken, getRecentWishlist);

export default router;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: process.env.CLIENT_URL,credentials: true,}));

app.use(cookieParser());

// Serve uploaded images
app.use("/uploads", express.static("src/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Real Estate Management System API");
});

export default app;
export const verifyAdmin = (req, res, next) => {
    console.log("Logged in user role:", req.user.role);
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
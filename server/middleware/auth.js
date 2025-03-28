import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(404).json({ message: "Not authorized, User not found" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export { protect, admin };

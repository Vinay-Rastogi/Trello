import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    req.user = user;
    req.userId = user._id;   // <-- IMPORTANT FIX

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

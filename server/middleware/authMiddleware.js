import jwt from "jsonwebtoken";
import Brand from "../models/Brand.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const brand = await Brand.findById(decoded.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    req.brand = brand;
    req.brandId = brand._id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;

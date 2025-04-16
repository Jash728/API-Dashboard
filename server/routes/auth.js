import express from "express";
import { loginBrand, registerBrand } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerBrand);
router.post("/login", loginBrand);

export default router;
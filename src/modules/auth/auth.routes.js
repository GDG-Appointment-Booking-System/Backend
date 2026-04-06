import { Router } from "express";
import * as authController from "./auth.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshAccessToken,
);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.getMe);
router.put(
  "/me",
  protect,
  validate(updateProfileSchema),
  authController.updateMe,
);

export default router;

import { Router } from "express";
import * as adminController from "./admin.controller.js";
import {
  protect,
  restrictTo,
} from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { providerIdSchema, userIdSchema } from "./admin.validation.js";

const router = Router();
router.use(protect);
router.use(restrictTo("admin"));

router.get("/stats", adminController.getSystemStats);
router.get("/users", adminController.getUsers);
router.get("/providers", adminController.getProviders);
router.patch(
  "/providers/:providerId/approve",
  validate(providerIdSchema, "params"),
  adminController.approveProvider,
);
router.delete(
  "/users/:userId",
  validate(userIdSchema, "params"),
  adminController.deleteUser,
);
router.delete(
  "/providers/:providerId",
  validate(providerIdSchema, "params"),
  adminController.deleteProvider,
);

export default router;

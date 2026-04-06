import { Router } from "express";
import * as userController from "./user.controller.js";
import {
  protect,
  restrictTo,
} from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import {
  updateUserSchema,
  updateMeSchema,
  userIdSchema,
} from "./user.validation.js";

const router = Router();

router.use(protect);

router.get("/me", userController.getMe);
router.put("/me", validate(updateMeSchema), userController.updateMe);
router.delete("/me", userController.deleteMe);

router.get("/", restrictTo("admin"), userController.getAllUsers);
router.get(
  "/:userId",
  restrictTo("admin"),
  validate(userIdSchema, "params"),
  userController.getUserById,
);
router.put(
  "/:userId",
  restrictTo("admin"),
  validate(updateUserSchema),
  userController.updateUser,
);
router.delete(
  "/:userId",
  restrictTo("admin"),
  validate(userIdSchema, "params"),
  userController.deleteUser,
);

export default router;

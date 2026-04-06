import { Router } from "express";
import * as providerController from "./provider.controller.js";
import {
  protect,
  restrictTo,
} from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import {
  createProviderSchema,
  updateProviderSchema,
  providerIdSchema,
} from "./provider.validation.js";

const router = Router();

router.get("/", providerController.getProviders);
router.get(
  "/:providerId",
  validate(providerIdSchema, "params"),
  providerController.getProviderById,
);
router.use(protect);
router.post(
  "/",
  restrictTo("provider", "admin"),
  validate(createProviderSchema),
  providerController.createProvider,
);
router.put(
  "/:providerId",
  restrictTo("provider", "admin"),
  validate(providerIdSchema, "params"),
  validate(updateProviderSchema),
  providerController.updateProvider,
);
router.patch(
  "/:providerId/approve",
  restrictTo("admin"),
  validate(providerIdSchema, "params"),
  providerController.approveProvider,
);
router.delete(
  "/:providerId",
  restrictTo("admin"),
  validate(providerIdSchema, "params"),
  providerController.deleteProvider,
);

export default router;

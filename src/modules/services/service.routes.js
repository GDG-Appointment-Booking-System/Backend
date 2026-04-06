import { Router } from "express";
import * as serviceController from "./service.controller.js";
import {
  protect,
  restrictTo,
} from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdSchema,
} from "./service.validation.js";

const router = Router();

router.get("/", serviceController.getServices);
router.get(
  "/:serviceId",
  validate(serviceIdSchema, "params"),
  serviceController.getServiceById,
);
router.use(protect);
router.post(
  "/",
  restrictTo("provider", "admin"),
  validate(createServiceSchema),
  serviceController.createService,
);
router.put(
  "/:serviceId",
  restrictTo("provider", "admin"),
  validate(serviceIdSchema, "params"),
  validate(updateServiceSchema),
  serviceController.updateService,
);
router.delete(
  "/:serviceId",
  restrictTo("provider", "admin"),
  validate(serviceIdSchema, "params"),
  serviceController.deleteService,
);

export default router;

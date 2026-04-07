/**
 * @swagger
 * tags:
 *   name: Providers
 *   description: Provider management
 */

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get all providers
 *     tags: [Providers]
 *     parameters:
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by specialty
 *     responses:
 *       200:
 *         description: List of providers
 *   post:
 *     summary: Create provider profile
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: Laloo Hailu Professional Services
 *               specialty:
 *                 type: string
 *                 example: Business Consultancy
 *               description:
 *                 type: string
 *                 example: Professional consultant based in Addis Ababa
 *               location:
 *                 type: string
 *                 example: Addis Ababa, Ethiopia
 *     responses:
 *       201:
 *         description: Provider created
 */

/**
 * @swagger
 * /api/providers/{providerId}:
 *   get:
 *     summary: Get provider by ID
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider details
 *       404:
 *         description: Provider not found
 *   put:
 *     summary: Update provider
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               specialty:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Provider updated
 *   delete:
 *     summary: Delete provider (Admin only)
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider deleted
 */

/**
 * @swagger
 * /api/providers/{providerId}/approve:
 *   patch:
 *     summary: Approve provider (Admin only)
 *     tags: [Providers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider approved
 */



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

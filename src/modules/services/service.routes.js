/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filter by provider
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of services
 *   post:
 *     summary: Create a service (Provider/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Business Consultation
 *               description:
 *                 type: string
 *                 example: One-hour business consultation
 *               category:
 *                 type: string
 *                 example: Consulting
 *               duration:
 *                 type: number
 *                 example: 60
 *                 description: Minutes
 *               price:
 *                 type: number
 *                 example: 1500
 *                 description: ETB
 *     responses:
 *       201:
 *         description: Service created
 */

/**
 * @swagger
 * /api/services/{serviceId}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 *   put:
 *     summary: Update service (Provider/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     summary: Delete service (Provider/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */


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

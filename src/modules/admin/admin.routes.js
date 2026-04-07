/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and analytics
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: number
 *                 providers:
 *                   type: number
 *                 appointments:
 *                   type: number
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /api/admin/providers:
 *   get:
 *     summary: Get all providers (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of providers
 */

/**
 * @swagger
 * /api/admin/providers/{providerId}/approve:
 *   patch:
 *     summary: Approve a provider (Admin only)
 *     tags: [Admin]
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
 *       404:
 *         description: Provider not found
 */

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete any user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */

/**
 * @swagger
 * /api/admin/providers/{providerId}:
 *   delete:
 *     summary: Delete any provider (Admin only)
 *     tags: [Admin]
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
 *         description: Provider deleted
 */


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

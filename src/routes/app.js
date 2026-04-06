import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import providerRoutes from "../modules/providers/provider.routes.js";
import serviceRoutes from "../modules/services/service.routes.js";
import reviewRoutes from "../modules/reviews/review.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import availabilityRoutes from "../modules/availability/availability.routes.js";
import appointmentRoutes from "../modules/appointments/appointment.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "../shared/middleware/error.middleware.js";
import { rateLimiter } from "../shared/middleware/rateLimit.middleware.js";
import { CORS_ORIGIN } from "../shared/config/env.config.js";

const app = express();
app.enable("trust proxy");
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

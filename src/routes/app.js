import express from "express";
import cors from "cors";
import helmet from "helmet";
import {fileURLToPath} from "url"
import path from "path";
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

import swaggerRoutes from "../../swagger.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.enable("trust proxy");

// Configure Helmet with CSP for Swagger
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io", "https://cdnjs.cloudflare.com"],
        connectSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);


app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use(express.static(path.join(__dirname, "public")));

app.use(swaggerRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/swagger.html"));
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

import express from "express";
import { swaggerSpec } from "./docs/swagger.config.js";

const router = express.Router();

// Serve JSON spec
router.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Redirect root to swagger docs
router.get("/docs", (req, res) => {
  res.redirect("/swagger.html");
});

export default router;

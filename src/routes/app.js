import express from "express";

const app = express();

app.use(express.json());

app.use("/health", (req, res) => {
  res.json({
    message: "server is running",
  });
});

export default app;

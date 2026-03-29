import app from "./routes/app.js";
import { PORT } from "./shared/config/env.config.js";

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT} `);
});

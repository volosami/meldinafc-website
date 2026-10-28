import "dotenv/config";
import { app } from "./app.js";
import { logger } from "./config/logger.js";
import { checkDatabaseConnection } from "./config/database.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", async () => {
  logger.info(`Meldina FC API rodando na porta ${PORT}`);
  await checkDatabaseConnection();
});

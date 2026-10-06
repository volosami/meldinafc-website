import "dotenv/config";
import { app } from "./app.js";
import { logger } from "./config/logger.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  logger.info(`🔥 Meldina FC API rodando na porta ${PORT}`);
});

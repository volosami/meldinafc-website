import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { authRouter } from "./auth.routes.js";
import { newsRouter } from "./news.routes.js";
import { playersRouter } from "./players.routes.js";
import { fixturesRouter } from "./fixtures.routes.js";
import { standingsRouter } from "./standings.routes.js";
import { membersRouter } from "./members.routes.js";
import { uploadRouter } from "./upload.routes.js";
import { clubRouter } from "./club.routes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/news", newsRouter);
apiRouter.use("/players", playersRouter);
apiRouter.use("/fixtures", fixturesRouter);
apiRouter.use("/standings", standingsRouter);
apiRouter.use("/members", membersRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/club", clubRouter);

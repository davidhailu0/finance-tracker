import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import path from "path";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middleware/errorMiddleware";

const app: Express = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

setupSwagger(app);

app.use(errorHandler);

export default app;

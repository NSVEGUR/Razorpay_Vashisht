import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import { engine } from "express-handlebars";
import razorypayRouter from "./razorpay/route";
import globalErrorHandler from "./error/global_error_handler";
import AppError from "./util/apperror";

const app: Express = express();
const publicDir = path.join(__dirname, "../public");
const viewsDir = path.join(__dirname, "../public/views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.engine(
  "hbs",
  engine({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", viewsDir);

app.use(express.static(publicDir));

app.use("/razorpay", razorypayRouter);

app.use("*", (req, res, next) => {
  next(
    new AppError(
      `can't find the request route " ${req.originalUrl} "on this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

export default app;

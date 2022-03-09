import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hey There");
});

export default app;

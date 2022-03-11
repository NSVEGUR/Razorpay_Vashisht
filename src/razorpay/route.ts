import express from "express";
import { createOrder, finishOrder } from "./controller";

const router = express.Router();

router.post("/createorder", createOrder);
router.post("/finishorder", finishOrder);

export default router;

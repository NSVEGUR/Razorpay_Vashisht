import express from "express";
import { createOrder, finishOrder, payAmount } from "./controller";

const router = express.Router();

router.get("/:amount", payAmount);
router.post("/createorder", createOrder);
router.post("/finishorder", finishOrder);

export default router;

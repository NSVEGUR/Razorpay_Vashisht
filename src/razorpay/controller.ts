import Razorpay from "razorpay";
import config from "./../config";
import catchAsync from "./../util/catchasync";
import AppError from "./../util/apperror";
import { Request, Response, NextFunction } from "express";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    if (!amount) return next(new AppError("Please Specify Amount", 400));
    var options = {
      amount: amount * 100,
      currency: "INR",
    };
    razorpay.orders.create(options, (err: any, order: any) => {
      res.json(order);
    });
  }
);

const finishOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { razorpay_payment_id } = req.body;
    if (!razorpay_payment_id)
      return next(new AppError("Please Specify OrderID", 403));
    const paymentDocument = await razorpay.payments.fetch(razorpay_payment_id);
    if (!paymentDocument) return next(new AppError("No OrderID found", 404));

    const details = {
      order_id: paymentDocument.order_id,
      orderData: paymentDocument,
    };
    if (paymentDocument.status == "captured") {
      res.status(200).json({
        status: "success",
        details,
      });
    } else {
      res.status(402).json({
        status: "failure",
        details,
      });
    }
  }
);

export { createOrder, finishOrder };

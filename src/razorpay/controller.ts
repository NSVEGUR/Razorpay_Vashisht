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
      receipt: "rcp1",
    };
    razorpay.orders.create(options, (err: any, order: { id: any }) => {
      if (err) return next(new AppError("Error in creating Order", 500));
      res.json({
        amount,
        orderId: order.id,
      });
    });
  }
);

const finishOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.body;
    if (!orderId) return next(new AppError("Please Specify OrderID", 403));
    razorpay.payments.fetch(orderId).then(async (paymentDocument) => {
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
    });
  }
);

const payAmount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.params;
    res.render("payment", {
      amount,
    });
  }
);

export { createOrder, finishOrder, payAmount };

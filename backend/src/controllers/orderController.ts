import { Router, type Request, type Response } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModal.js";
import type { InitialCartStateType } from "../../../shared/interface.js";

//@desc Create new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const order: InitialCartStateType = req.body;
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    shippingAddress,
    paymentMethod,
  } = order;
  if (cartItems && cartItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: Array.isArray(cartItems)
        ? cartItems.map((item) => ({
            ...item,
            product: item._id,
            _id: undefined,
          }))
        : [],
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc logged user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id });
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("orders not found ");
  }
});

//@desc Get order by id
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  //   const order = await Order.findById(req.params.id);
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc  update order to paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    const dateNow = Date.now();
    order.paidAt = new Date(dateNow);
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc  update order to delivered
//@route PUT /api/orders/:id/delivered
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      const dateNow = Date.now();
      order.deliveredAt = new Date(dateNow);
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }
);

//@desc  Get all orders
//@route GET /api/orders
//@access Private/Admin
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
};

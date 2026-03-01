import Order from '../../models/order.js';
import Cart from '../../models/cart.model.js';
import Product from '../../models/Product.js';
import Address from '../../models/address.model.js';

import {
  BadRequestError,
  NotFoundError,
  ForbiddenError
} from '../../utils/appError.js';

/* ======================================
   CREATE ORDER
====================================== */

export const createOrderService = async (userId, addressId) => {

  const cart = await Cart.findOne({ user: userId })
    .populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new BadRequestError('Cart is empty');
  }

  const address = await Address.findOne({
    _id: addressId,
    user: userId
  });

  if (!address) {
    throw new NotFoundError('Address not found');
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for ${item.product.name}`
      );
    }
  }

  const order = await Order.create({
    user: userId,
    address: addressId,   // ✅ store only ObjectId
    items: cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images?.[0]
    })),
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } }
    );
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  return order;
};

/* ======================================
   GET MY ORDERS
====================================== */

export const getMyOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 });
};

/* ======================================
   GET ORDER BY ID
====================================== */

export const getOrderByIdService = async (userId, orderId) => {

  const order = await Order.findById(orderId)
    .populate('user', 'name email');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.user._id.toString() !== userId.toString()) {
    throw new ForbiddenError('Not authorized to access this order');
  }

  return order;
};

/* ======================================
   GET ALL ORDERS (ADMIN)
====================================== */

export const getAllOrdersService = async () => {
  return await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

/* ======================================
   UPDATE ORDER STATUS (ADMIN)
====================================== */

export const updateOrderStatusService = async (orderId, status) => {

  const allowedStatuses = [
    'Pending',
    'Paid',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded'
  ];

  if (!allowedStatuses.includes(status)) {
    throw new BadRequestError('Invalid status value');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  order.status = status;

  if (status === 'Paid') {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  await order.save();

  return order;
};

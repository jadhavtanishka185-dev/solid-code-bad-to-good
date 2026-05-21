import { calculateTotal } from "./pricingService.js";

export function createOrder({ user, item, qty }) {
  return {
    id: Date.now(),
    user,
    item,
    qty: Number(qty),
    total: calculateTotal({ item, qty: Number(qty), user }),
    status: "PLACED",
  };
}

export function refundOrder(orders, orderId) {
  return orders.map((order) => {
    if (order.id === orderId && order.status !== "REFUNDED") {
      return { ...order, status: "REFUNDED" };
    }
    return order;
  });
}

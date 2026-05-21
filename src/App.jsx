import React, { useEffect, useState } from "react";
import { createOrder, refundOrder } from "./services/orderService.js";
import { isPaymentMethodSupported, processPayment } from "./services/paymentService.js";
import { loadOrders, saveOrders } from "./adapters/storageAdapter.js";
import { exportOrdersCsv, calculateRevenue } from "./services/reportService.js";
import { notifyExternalOrder, notifyUser, buildOrderMessage } from "./adapters/notificationAdapter.js";
import { downloadCsv } from "./adapters/exportAdapter.js";

export default function App() {
  const [user, setUser] = useState("vip");
  const [item, setItem] = useState("laptop");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("card");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  async function buyNow() {
    if (!isPaymentMethodSupported(payment)) {
      setMessage("Unsupported payment method");
      return;
    }

    try {
      await processPayment(payment);

      const newOrder = createOrder({ user, item, qty });
      const nextOrders = [...orders, newOrder];

      setOrders(nextOrders);
      notifyExternalOrder({ user, orderId: newOrder.id });
      notifyUser(`SMS to ${user}: Order ${newOrder.id} placed`);
      setMessage(buildOrderMessage({ user, orderId: newOrder.id, total: newOrder.total }));
    } catch (error) {
      setMessage(error?.message ?? "Payment failed");
    }
  }

  function refund(orderId) {
    setOrders(refundOrder(orders, orderId));
    setMessage(`Refund attempted for ${orderId}`);
  }

  function exportReport() {
    const csv = exportOrdersCsv(orders);
    downloadCsv(csv, "orders_export.csv");
    setMessage(`Revenue: ${calculateRevenue(orders)}`);
  }

  return (
    <div className="page">
      <h1>Commerce Admin</h1>
      <p>Refactored architecture with focused services and adapters.</p>

      <div className="card">
        <h2>Create Order</h2>

        <label>User</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} />

        <label>Item</label>
        <select value={item} onChange={(e) => setItem(e.target.value)}>
          <option value="laptop">laptop</option>
          <option value="phone">phone</option>
          <option value="headset">headset</option>
          <option value="misc">misc</option>
        </select>

        <label>Qty</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />

        <label>Payment</label>
        <select value={payment} onChange={(e) => setPayment(e.target.value)}>
          <option value="card">card</option>
          <option value="paypal">paypal</option>
          <option value="cod">cod</option>
        </select>

        <button onClick={buyNow}>Buy</button>
        <button onClick={exportReport}>Export CSV + Revenue</button>
      </div>

      <div className="card">
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.item}</td>
                <td>{order.qty}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => refund(order.id)}>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

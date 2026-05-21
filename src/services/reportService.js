export function exportOrdersCsv(orders) {
  const rows = ["id,user,item,qty,total,status"];

  orders.forEach((order) => {
    rows.push(`${order.id},${order.user},${order.item},${order.qty},${order.total},${order.status}`);
  });

  return rows.join("\n");
}

export function calculateRevenue(orders) {
  return orders.reduce((sum, order) => {
    return order.status === "REFUNDED" ? sum : sum + order.total;
  }, 0);
}

export function notifyExternalOrder({ user, orderId }) {
  return fetch("https://httpbin.org/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: `${user}@mail.com`,
      text: `Order ${orderId} confirmed`,
    }),
  }).catch(() => {
    console.warn("External notification failed");
  });
}

export function notifyUser(message) {
  alert(message);
}

export function buildOrderMessage({ user, orderId, total }) {
  return `Order ${orderId} placed. Total: ${total}. User: ${user}`;
}

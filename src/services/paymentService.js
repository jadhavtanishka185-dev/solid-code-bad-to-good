const paymentGateways = {
  card: {
    name: "card",
    process: () => Promise.resolve("card"),
  },
  paypal: {
    name: "paypal",
    process: () => Promise.resolve("paypal"),
  },
  cod: {
    name: "cod",
    process: () => Promise.resolve("cod"),
  },
};

export function isPaymentMethodSupported(method) {
  return Boolean(paymentGateways[method]);
}

export function processPayment(method) {
  const gateway = paymentGateways[method];
  if (!gateway) {
    throw new Error("Unsupported payment method");
  }

  console.log(`Processing payment through ${gateway.name}`);
  return gateway.process();
}

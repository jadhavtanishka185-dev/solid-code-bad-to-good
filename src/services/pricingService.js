const itemPrices = {
  laptop: 1000,
  phone: 500,
  headset: 50,
  misc: 20,
};

export function getItemPrice(item) {
  return itemPrices[item] ?? itemPrices.misc;
}

export function calculateDiscount(total, user, qty) {
  if (user === "vip") return total * 0.7;
  if (qty > 10) return total * 0.85;
  return total;
}

export function calculateTotal({ item, qty, user }) {
  const price = getItemPrice(item);
  return calculateDiscount(price * qty, user, qty);
}

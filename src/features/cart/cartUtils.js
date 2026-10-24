import axios from "axios";

const API = import.meta.env.VITE_API_URL; // adjust as needed

export const fetchUserCartAPI = async ({ userId }) => {
  const res = await axios.get(`${API}/user/${userId}`);

  const products = res.data?.[0]?.products || res.data?.products || res.data?.data?.products || [];

  console.log("Fetched cart from server:", products);
  return products.map((p) => ({
    productId: p.productId,
    variantId: p.variantId ?? null,
    quantity: p.quantity,
    package: p.package,
    productName: p.productName,
    price: p.sellingPrice ?? p.price ?? p.mrp ?? 0,
    sellingPrice: p.sellingPrice ?? p.price ?? 0,
    mrp: p.mrp ?? p.price ?? 0,
    image: p.image,
    stock: p.stock,
    slug: p.slug,
    is_liquid: p.is_liquid,
    unit: p.unit,
    variantQuantity: p.variantQuantity,
  }));
};

// ✅ Replace local cart with server cart
export const replaceCart = (serverCart) => {
  localStorage.setItem("cart", JSON.stringify(serverCart || []));
  return serverCart || [];
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item) => {
  const cart = getCart();

  const productId = item.productId ?? item.id;
  const packageLabel = String(item.package ?? item.pack ?? "");

  const existingIndex = cart.findIndex(
    (existing) =>
      Number(existing.productId ?? existing.id) === Number(productId) &&
      String(existing.package ?? existing.pack ?? "") === packageLabel
  );

  if (existingIndex !== -1) {
    const existingItem = cart[existingIndex];

    if (Number(existingItem.quantity) === Number(item.quantity)) {
      return { error: "Product already in cart" };
    }

    cart[existingIndex] = {
      ...existingItem,
      ...item,
      productId,
      package: packageLabel,
    };

    saveCart(cart);
    return { success: true, updated: true, cart };
  }

  cart.push({ ...item, productId, package: packageLabel });
  saveCart(cart);

  return { success: true, updated: false, cart };
};

export const updateCartQty = (productId, packageLabel, quantity) => {
  const cart = getCart();

  const updated = cart.map((item) =>
    Number(item.productId ?? item.id) === Number(productId) &&
    String(item.package ?? item.pack ?? "") === String(packageLabel)
      ? { ...item, quantity: Number(quantity) }
      : item
  );

  saveCart(updated);
  return updated;
};

export const removeFromCart = (productId, packageLabel) => {
  const cart = getCart();

  const updated = cart.filter(
    (item) =>
      !(
        Number(item.productId ?? item.id) === Number(productId) &&
        String(item.package ?? item.pack ?? "") === String(packageLabel)
      )
  );

  saveCart(updated);
  return updated;
};

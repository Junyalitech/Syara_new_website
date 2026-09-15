import axios from "axios";

const API = import.meta.env.VITE_API_URL; // adjust as needed

export const fetchUserCartAPI = async ({ userId }) => {
  const res = await axios.get(`${API}/user/${userId}`);

  const products = res.data?.[0]?.products || [];

  console.log("Fetched cart from server:", products);
  return products.map((p) => ({
    productId: p.productId,
    quantity: p.quantity,
    package: p.package,
    productName: p.productName,
    price: p.price,
    image: p.image,
    Pack1kgprice: p.Pack1kgprice,
    Pack500gprice: p.Pack500gprice,
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
  let cart = getCart();

  const existingIndex = cart.findIndex(
    (i) =>
      Number(i.productId) === Number(item.productId) &&
      i.package === item.package
  );

  if (existingIndex !== -1) {
    const existingItem = cart[existingIndex];

    // Same product + same package + same quantity
    if (Number(existingItem.quantity) === Number(item.quantity)) {
      return { error: "Product already in cart" };
    }

    // Same product + same package but different quantity
    cart[existingIndex] = {
      ...existingItem,
      quantity: item.quantity,
      price: item.price,
    };

    saveCart(cart);

    return {
      success: true,
      updated: true,
      cart,
    };
  }

  // New product/package
  cart.push(item);
  saveCart(cart);

  return {
    success: true,
    updated: false,
    cart,
  };
};

export const updateCartQty = (productId, packageType, quantity) => {
  let cart = getCart();

  cart = cart.map((item) =>
    item.productId === productId && item.package === packageType
      ? { ...item, quantity }
      : item
  );

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId, packageType) => {
  let cart = getCart();

  cart = cart.filter(
    (item) =>
      !(item.productId === productId && item.package === packageType)
  );

  saveCart(cart);
  return cart;
};
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, fetchUserCart } from "../../features/cart/cartSlice";
import OrderSuccessModal from "./OrderSuccessModal";
import { set } from "date-fns";
import toast from "react-hot-toast";
import { fetchProfile } from "../../features/auth/profileSlice";

const OrderSummary = ({ pincode, checkoutAddress }) => {
  
  const [deliveryOptions, setDeliveryOptions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [deliveryMethod, setDeliveryMethod] = useState("porter");
  const [promoCode, setPromoCode] = useState("");
  const dispatch = useDispatch();   
  const { profile } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  
  // const { items } = useSelector((state: any) => state.cart);
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setItems(cart);
    };

    loadCart();

    // 🔥 listen for updates
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile()); // 🔥 THIS IS MISSING
    }
  }, []);

  useEffect(() => {
    if (!pincode) return;

    const fetchDelivery = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/delivery/${pincode}`
        );

        const data = await res.json();

        setDeliveryOptions(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [pincode]);

  console.log("Available delivery options for pincode", pincode, ":", deliveryOptions);

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.package === "1kg"
        ? item.Pack1kgprice
        : item.package === "500gm"
          ? item.Pack500gprice
          : item.price;

    return sum + price * item.quantity;
  }, 0);

  let deliveryFee = 0;

  if (deliveryOptions) {
    if (deliveryMethod === "porter") {
      deliveryFee = deliveryOptions.delivery_options.porter?.charge || 0;
    }

    if (deliveryMethod === "road") {
      deliveryFee = deliveryOptions.delivery_options.courier_road?.charge || 0;
    }

    if (deliveryMethod === "air") {
      deliveryFee = deliveryOptions.delivery_options.courier_air?.charge || 0;
    }

    if (deliveryMethod === "free") {
      deliveryFee = 0;
    }
  }

  useEffect(() => {
    if (!deliveryOptions) return;

    const d = deliveryOptions.delivery_options;

    if (d.free_delivery?.available) {
      setDeliveryMethod("free");
    } else if (d.porter?.available) {
      setDeliveryMethod("porter");
    } else if (d.courier_road?.available) {
      setDeliveryMethod("road");
    } else if (d.courier_air?.available) {
      setDeliveryMethod("air");
    }
  }, [deliveryOptions]);

  const taxes = 0.0;
  const total = subtotal + deliveryFee + taxes;

  console.log("user", profile);

  console.log("orderssummary",items)

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const products = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        package: item.package,
        Pack1kgprice: item.Pack1kgprice,
        Pack500gprice: item.Pack500gprice,
      }));

      // 🔹 Step 1: Call backend create order
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("syaraid")),
          products,
          paymentType: paymentMethod === "cod" ? "COD" : "Online",

          // ✅ REQUIRED FIELDS
          pincode: pincode,
          deliveryType: deliveryMethod,  // porter / road / air / free
          deliveryTime: deliveryOptions?.delivery_options?.[deliveryMethod]?.time || "N/A",
          subtotal: subtotal,
          address: checkoutAddress       // NOT total
        })
      });

      const data = await res.json();

      // 🟢 COD FLOW
      if (paymentMethod === "cod") {
        setOrderData({
          orderId: data.order.orderId,
          paymentType: "COD",
          amount: total
        });

        dispatch(setCartItems([])); // ✅ CLEAR CART UI
        setShowModal(true);

        return;
      }

      // 🔵 ONLINE FLOW (RAZORPAY)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: total * 100,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,

        handler: async function (response) {
          try {
            setIsVerifying(true);

            await fetch(`${import.meta.env.VITE_API_URL}/api/verifyPayment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            dispatch(setCartItems([]));
            dispatch(fetchUserCart(Number(localStorage.getItem("syaraid"))));

            setOrderData({
              orderId: data.order.orderId,
              paymentType: "Online",
              amount: total
            });

            setShowModal(true);

          } catch (err) {
            toast.error("❌ Payment verification failed");
          } finally {
            setIsVerifying(false);
          }
        },


        prefill: {
          name: profile?.name,
          email: profile?.email,
          contact: profile?.phone
        },

        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong");
    }
    finally {
      setLoading(false)
    }

  };

  const hasLiquidProduct = items.some(item => item.is_liquid === true);


  return (
    <>

      {
        isVerifying && (
          <div className="success-verify-overlay">
            <div className="verify-box">
              <div className="spinner"></div>
              <h3>Verifying your payment...</h3>
              <p>Please don't close this page</p>
            </div>
          </div>
        )
      }
      <div className="ck-card order-summary-card">
        <div className="ck-section-header">
          <h2>Order summary</h2>
        </div>

        <div className="payment-methods">
          <h4 style={{ fontWeight: 'bolder' }}>Payments Method</h4>
          {["online", "cod"].map((method) => (
            <label className="payment-option" key={method}>
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {method === "online" && "Online Payment"}
              {method === "cod" && "Cash on delivery"}
            </label>
          ))}
        </div>

        <div className="delivery-methods">
          <h4 className="section-title">Delivery Method</h4>

          {deliveryOptions?.delivery_options?.porter?.available && (
            <label className={`delivery-card ${deliveryMethod === "porter" ? "active" : ""}`}>
              <input
                type="radio"
                name="delivery"
                value="porter"
                checked={deliveryMethod === "porter"}
                onChange={() => setDeliveryMethod("porter")}
              />

              <div className="delivery-content">
                <div className="left">
                  <span className="icon">🧑‍🔧</span>
                  <div>
                    <p className="title">Porter</p>
                    <p className="time">{deliveryOptions.delivery_options.porter.time}</p>
                  </div>
                </div>

                <div className="price">
                  ₹{deliveryOptions.delivery_options.porter.charge}
                </div>
              </div>
            </label>
          )}

          {deliveryOptions?.delivery_options?.courier_road?.available && (
            <label className={`delivery-card ${deliveryMethod === "road" ? "active" : ""}`}>
              <input
                type="radio"
                name="delivery"
                value="road"
                checked={deliveryMethod === "road"}
                onChange={() => setDeliveryMethod("road")}
              />

              <div className="delivery-content">
                <div className="left">
                  <span className="icon">🚛</span>
                  <div>
                    <p className="title">Courier Road</p>
                    <p className="time">{deliveryOptions.delivery_options.courier_road.time}</p>
                  </div>
                </div>

                <div className="price">
                  ₹{deliveryOptions.delivery_options.courier_road.charge}
                </div>
              </div>
            </label>
          )}

          {deliveryOptions?.delivery_options?.courier_air?.available && !hasLiquidProduct && (
            <label className={`delivery-card ${deliveryMethod === "air" ? "active" : ""}`}>
              <input
                type="radio"
                name="delivery"
                value="air"
                checked={deliveryMethod === "air"}
                onChange={() => setDeliveryMethod("air")}
              />

              <div className="delivery-content">
                <div className="left">
                  <span className="icon">✈️</span>
                  <div>
                    <p className="title">Courier Air</p>
                    <p className="time">{deliveryOptions.delivery_options.courier_air.time}</p>
                  </div>
                </div>

                <div className="price">
                  ₹{deliveryOptions.delivery_options.courier_air.charge}
                </div>
              </div>
            </label>
          )}

          {deliveryOptions?.delivery_options?.free_delivery?.available && (
            <label className={`delivery-card ${deliveryMethod === "free" ? "active" : ""}`}>
              <input
                type="radio"
                name="delivery"
                value="free"
                checked={deliveryMethod === "free"}
                onChange={() => setDeliveryMethod("free")}
              />

              <div className="delivery-content">
                <div className="left">
                  <span className="icon">🚚</span>
                  <div>
                    <p className="title">Free Delivery</p>
                    <p className="time">{deliveryOptions.delivery_options.free_delivery.time}</p>
                  </div>
                </div>

                <div className="price free">FREE</div>
              </div>
            </label>
          )}
        </div>

        {/* <div className="promo-row">
        <input
          className="promo-input"
          type="text"
          placeholder="Add Promo"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button className="promo-apply-btn">Apply</button>
      </div> */}

        <div className="summary-lines">
          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Delivery fee</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>
          {/* <div className="summary-line discount">
          <span>Coupon Discount</span>
          <span>-₹{Math.abs(couponDiscount).toFixed(2)}</span>
        </div> */}
          <div className="summary-line">
            <span>Taxes</span>
            <span>₹{taxes.toFixed(2)}</span>
          </div>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          disabled={loading || !deliveryOptions}
          style={{
            opacity: loading || !deliveryOptions ? 0.6 : 1,
            cursor: loading || !deliveryOptions ? "not-allowed" : "pointer",
          }}
          className="cta-primary cta-primary--green" onClick={handlePlaceOrder}>
          {loading
            ? "Processing..."
            : !deliveryOptions
              ? "Add address to continue"
              : "Proceed to Pay"}
        </button>
        {/* <button className="cta-primary cta-primary--outline">
        Continue with Cash 
      </button>

      <div className="cashback-banner">
        🎁 Earn 5% cash back on tabby. <a href="#">Learn More</a>
      </div> */}
      </div>

      <OrderSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderData={orderData}
      />

    </>
  );
};

export default OrderSummary;

import { useState } from "react";

const OrderSummary = () => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [promoCode, setPromoCode] = useState("");

  const subtotal = 37.65;
  const deliveryFee = 10.0;
  const couponDiscount = -5.0;
  const taxes = 0.0;
  const total = subtotal + deliveryFee + couponDiscount + taxes;

  return (
    <div className="ck-card order-summary-card">
      <div className="ck-section-header">
        <h2>Order summary</h2>
      </div>

      <div className="payment-methods">
        {["online", "cod", "pod"].map((method) => (
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
            {method === "pod" && "Pay on delivery"}
          </label>
        ))}
      </div>

      <div className="promo-row">
        <input
          className="promo-input"
          type="text"
          placeholder="Add Promo"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button className="promo-apply-btn">Apply</button>
      </div>

      <div className="summary-lines">
        <div className="summary-line">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Delivery fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="summary-line discount">
          <span>Coupon Discount</span>
          <span>-${Math.abs(couponDiscount).toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Taxes</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
      </div>

      <div className="summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="cta-primary cta-primary--green">
        Continue with 💳 <strong>Card</strong>
      </button>
      <button className="cta-primary cta-primary--outline">
        Continue with Cash 
      </button>

      <div className="cashback-banner">
        🎁 Earn 5% cash back on tabby. <a href="#">Learn More</a>
      </div>
    </div>
  );
};

export default OrderSummary;

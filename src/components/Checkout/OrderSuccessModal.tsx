import React, { use } from "react";
import "./OrderSuccessModal.css";
import { useNavigate } from "react-router";
import { syncCartAPI } from "../../features/cart/cartSlice";
import { useDispatch } from "react-redux";

const OrderSuccessModal = ({ isOpen, onClose, orderData }: any) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewOrders = () => {
    onClose();
    navigate("/account", { state: { activeNav: "orders" } });


  };

  const handleClose = () => {
    const userId = localStorage.getItem("syaraid");

    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    if (userId) {
      dispatch(syncCartAPI({ userId, items: [] })); // 🔥 empty cart bhejo
    }



    navigate("/account", { state: { activeNav: "orders" } })
  }



  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="success-icon">✔</div>

        <h2>Booking confirmed</h2>
        <p className="order_succes_subtitle">
          Your order has been placed successfully.
        </p>

        <div className="details">
          <div className="row">
            <span>Order ID</span>
            <span>{orderData?.orderId}</span>
          </div>

          <div className="row">
            <span>Payment</span>
            <span>{orderData?.paymentType}</span>
          </div>

          <div className="row">
            <span>Total</span>
            <span>₹{orderData?.amount}</span>
          </div>

          {/* <div className="row">
            <span>Status</span>
            <span className="success">Paid</span>
          </div> */}
        </div>

        <button className="view-btn" onClick={() => handleClose()}>
          View Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
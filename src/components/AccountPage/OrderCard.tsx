import { Download, MoreVertical } from 'lucide-react';
import ProductItem from './ProductItem';
import './OrderCard.css';

export interface Product {
  name: string;
  image: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  productCount: number;
  customer: string;
  date: string;
  status: string;
  statusType: 'on-the-way' | 'shipped';
  deliveryDate: string;
  deliveredTo: string;
  total: string;
  products: Product[];
}

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {

  console.log("Rendering OrderCard for order:", order); // Debug log
  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-title">
          <h3>Order #{order.orderId}</h3>
          <span>
            {order.OrderItems.length} Products  | {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</span>
        </div>
        <div className="order-actions">
          {/* <button className="btn-download">
            <Download size={14} />
            Download invoice
          </button> */}
          {/* <button className="btn-more">
            <MoreVertical size={16} />
          </button> */}
        </div>
      </div>

      <div className="order-info">
        <div className="order-info-row">
          <span className="order-info-label">Status:</span>
          <span className={`order-info-value ${order.statusType === 'on-the-way' ? 'status-on-the-way' : 'status-shipped'}`}>
            { order.orderStatus === 'delivered' ? 'Delivered' : "On the way"}
          </span>
        </div>
        <div className="order-info-row">
          <span className="order-info-label">  {order.orderStatus === "processing" ? "Expected Delivery:" : "Delivery Date"}</span>
          <span className="order-info-value">{new Date(order.deliveryTime).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) || "Arriving soon"}</span>
        </div>
        {/* <div className="order-info-row">
          <span className="order-info-label">Delivery Fee:</span>
          <span className="order-info-value">₹{order.transportationCost}</span>
        </div> */}
        <div className="order-info-row">
          <span className="order-info-label">Delivered to:</span>
          <span className="order-info-value">{order.address}</span>
        </div>

        <div className="order-info-row">
          <span className="order-info-label">Payment Mode:</span>
          <span className="order-info-value">{order.paymentType == 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
        </div>

        {/* <div className="order-info-row">
          <span className="order-info-label">Payment Status:</span>
          <span className="order-info-value">{order.paymentStatus}</span>
        </div> */}
        <div className="order-info-row">
          <span className="order-info-label">Total:</span>
          <span className="order-info-value" style={{ fontWeight: 700 }}>₹{order.grandTotal}</span>
        </div>
      </div>

      <div className="order-products">
        {order.OrderItems.map((item, idx) => (
          <ProductItem
            key={idx}
            name={item.Product.productName}
            image={`${import.meta.env.VITE_API_URL}/public/userImages/${item.Product.image1}`}
            quantity={item.quantity}
            price={
              item.package === "1kg"
                ? item.Product.packeoption1kgrate
                : item.package === "500gm"
                  ? item.Product.packeoption500gmrate
                  : item.price}
            pack={item.package || 'NA'}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderCard;

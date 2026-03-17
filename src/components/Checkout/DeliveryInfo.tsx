import './checkout.css'

const DeliveryInfo = () => {
  return (
    <div className="ck-card">
      <div className="ck-section-header">
        <h2>Delivery information</h2>
        <button className="ck-edit-btn">✏️ Edit</button>
      </div>

      <div className="ck-divider"></div>

      <div className="delivery-detail">
        <div className="delivery-icon">📍</div>
        <div>
          <div className="delivery-label">Delivery to</div>
          <div className="delivery-value">
            Address: (+62) 854-3845-1989
          </div>
          <div className="delivery-label" style={{ marginTop: 4 }}>
            Dhaka, Banassree, Block B, Road 3, California, USA
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;

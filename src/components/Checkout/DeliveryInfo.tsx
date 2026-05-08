import { useEffect, useState } from 'react';
import { AddressModal } from './ChangeAddressModel';
import './checkout.css'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../../features/auth/address';

const DeliveryInfo = ({ setPincode, setCheckoutAddress }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const dispatch = useDispatch();
  const { list: addresses, loading } = useSelector((state: any) => state.address);


  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0) {
      const addr = addresses[0];

      // console.log("Setting default address:", addr);
      setSelectedAddress({
        fullName : addr.fullName,
        phone: addr.phone,
        address: `${addr.addressLine}, ${addr.city}, ${addr.state} - ${addr.pincode}`
      });

      // 🔥 send pincode to parent
      setPincode(addr.pincode);
      setCheckoutAddress(selectedAddress.fullName + ',' + selectedAddress.address + ',' + selectedAddress.phone);
    }
  }, [addresses]);

  const onClose = () => {
    console.log("Modal closed");
    setIsModalOpen(false);
  }


  return (
    <>
      <div className="ck-card">
        <div className="ck-section-header">
          <h2>Delivery information</h2>
           { addresses.length !== 0 ?
          <button
            className="ck-edit-btn"
            onClick={() => setIsModalOpen(true)}
          >
            ✏️ Change Address
          </button> : null }
        </div>

        <div className="ck-divider"></div>

        <div className="delivery-detail">
          {loading ? (
            // 🔥 Skeleton Loader
            <>
              <div className="delivery-icon skeleton-icon"></div>

              <div style={{ width: "100%" }}>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            </>
          ) : addresses.length === 0 ? (
            // ❌ EMPTY STATE
            <div style={{ textAlign: "center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" }}>
              {/* <div style={{ fontSize: "40px" }}>📍</div> */}

              <p style={{ margin: "8px 0", fontWeight: 500 }}>
                No address found
              </p>

              <p style={{ fontSize: "13px", color: "#777" }}>
                Please add your delivery address first
              </p>

              <button
                className="ck-edit-btn"
                style={{ marginTop: "10px", textAlign: "center" }}
                onClick={() => setIsModalOpen(true)}
              >
                ➕ Add Address
              </button>
            </div>
          ) : (
            <>
              <div className="delivery-icon">📍</div>

              <div>
                <div className="delivery-label">Delivery to</div>

                <div className="delivery-value">
                  {selectedAddress.fullName} | {selectedAddress.phone}
                </div>

                <div className="delivery-label" style={{ marginTop: 4 }}>
                  {selectedAddress.address}
                </div>

              </div>
            </>
          )}
        </div>

      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={onClose}   // ✅ FIXED
        onSelect={(addr) => {
          setSelectedAddress({
            fullName: addr.fullName,
            phone: addr.phone,
            address: `${addr.addressLine}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
          });

          setPincode(addr.pincode);
        }}
      />

    </>
  );
};

export default DeliveryInfo;

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Addresses.css';
import './shared.css';
import { AddAddressModal } from '../Checkout/AddAddressModel';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress, fetchAddresses } from '../../features/auth/address';

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    name: 'Alex John',
    street: 'Great street, Brooklyn 5A',
    city: 'New York, NY 10001',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    name: 'Alex John',
    street: '450 Lexington Ave, Suite 200',
    city: 'New York, NY 10017',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
];

const Addresses = () => {
  const dispatch = useDispatch();
  const { list: addresses, loading, deletingIndex } = useSelector((state: any) => state.address);

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);



  return (
    <>
      <div>
        <div className="section-header">
          <h2>Your Addresses</h2>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Add new address
          </button>
        </div>

        <div className="address-grid">

          {loading ? (
            // 🔥 Skeleton Loader
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="address-card section-card skeleton-card">

                <div className="skeleton-label"></div>

                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>

                <div className="skeleton-line"></div>

                <div className="skeleton-actions"></div>

              </div>
            ))
          ) : addresses.length === 0 ? (
            <div className="empty-address">
              <p>📍 No address found</p>
              <span>Please add a new address</span>
            </div>
          ) :
            addresses.map((addr, index) => (
              <div key={addr.id} className="address-card section-card">
                <div className="address-card-top">
                  <span className="address-label">{addr.addressType}</span>
                  {addr.isDefault && <span className="address-default-badge">Default</span>}
                </div>
                <p className="address-name">{addr.fullName}</p>
                <p className="address-line">{addr.addressLine}</p>
                <p className="address-line">{addr?.landmark}</p>
                <p className="address-line">{addr.city}, {addr.state}</p>
                <p className="address-line">{addr.pincode}</p>
                <p className="address-line">{addr.phone}</p>
                <div className="address-actions">
                  {/* <button className="btn-outline">
                  <Edit2 size={13} style={{ marginRight: 4 }} />
                  Edit
                </button> */}
                  {/* {!addr.isDefault && (
                  <button className="btn-outline">Set as default</button>
                )} */}
                  <button
                    className="btn-danger-text"
                    disabled={deletingIndex === index}
                    onClick={() => dispatch(deleteAddress(index))}
                  >
                    {deletingIndex === index
                      ? "Removing..."
                      : <><Trash2 size={13} /> Remove</>}
                  </button>

                </div>
              </div>
            ))}
        </div>


      </div>

      <AddAddressModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={(newAddress) => {
          console.log("New Address:", newAddress);
          // 👉 Next step: create addAddress thunk
        }}
      />

    </>
  );
};

export default Addresses;

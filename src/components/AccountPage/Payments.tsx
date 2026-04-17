import { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import './Payments.css';
import './shared.css';
import { AddPaymentMethodModal } from './AddPaymentMethod';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod, editPaymentMethod, fetchPaymentMethods, removePaymentMethod, setDefaultPayment } from '../../features/payment/paymentSlice';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

// const mockPayments: PaymentMethod[] = [
//   { id: '1', type: 'visa', last4: '4829', expiry: '09/27', holder: 'Alex John', isDefault: true },
//   { id: '2', type: 'mastercard', last4: '7631', expiry: '12/26', holder: 'Alex John', isDefault: false },
// ];

const Payments = () => {
  // const [payments] = useState(mockPayments);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const dispatch = useDispatch();
  const { methods: payments,
    adding,
    loading,
    deletingId,
    editingId,
    defaultId } = useSelector((state: any) => state.payment);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  return (
    <>
      <div>
        <div className="section-header">
          <h2>Payment Methods</h2>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Add payment method
          </button>
        </div>

        <div className="payments-list">
          {loading ? (
            // 🔥 Skeleton Loader
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="payment-card section-card skeleton-card">

                <div className="payment-card-top">

                  <div className="skeleton-icon"></div>

                  <div className="payment-info">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>

                </div>

                <div className="payment-actions">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>

              </div>
            ))
          ) : payments.length === 0 ? (
            <div className="empty-payment">
              <p>💳 No payment methods found</p>
              <span>Please add your card</span>
            </div>
          ) :
            payments.map(pm => (
              <div key={pm.id} className="payment-card section-card">
                <div className="payment-card-top">
                  <div className="payment-icon">
                    <CreditCard size={24} color="#53ce57" />
                  </div>
                  <div className="payment-info">
                    <div className="payment-info-top">
                      <span className="payment-type" style={{ textTransform: 'capitalize' }}>{pm.type}</span>
                      {pm.isDefault && <span className="payment-default-badge">Default</span>}
                    </div>
                    <p className="payment-number">•••• •••• •••• {pm.last4}</p>
                    <p className="payment-meta">Expires {pm.expiry} · {pm.holder}</p>
                  </div>
                </div>
                <div className="payment-actions">
                  <button
                    className="btn-outline"
                     disabled={editingId === pm.id}
                    onClick={() => {
                      setEditingPayment(pm);
                      setShowAddForm(true);
                    }}
                  >
                     {editingId === pm.id ? "Updating..." : "Edit"}
                  </button>
                  {!pm.isDefault && (
                    <button
                      className="btn-outline"
                      disabled={defaultId === pm.id}
                      onClick={() => {
                        dispatch(setDefaultPayment(pm.id))
                          .unwrap()
                          .then(() => {
                            dispatch(fetchPaymentMethods());
                          });
                      }}
                    >
                     {defaultId === pm.id ? "Setting..." : "Set as default"}
                    </button>
                  )}

                  <button

                    disabled={deletingId === pm.id}
                    className="btn-danger-text"
                    onClick={() => {
                      dispatch(removePaymentMethod(pm.id))
                        .unwrap()
                        .then(() => {
                          dispatch(fetchPaymentMethods());
                        });
                    }}
                  >
                    {deletingId === pm.id ? "Removing..." : <><Trash2 size={13} /> Remove</>}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div >

      <AddPaymentMethodModal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingPayment(null);
        }}
        initialData={editingPayment}
        onSave={(form) => {
          if (editingPayment) {
            dispatch(
              editPaymentMethod({
                paymentId: editingPayment.id,
                form,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(fetchPaymentMethods());
              });

          } else {
            dispatch(
              addPaymentMethod({
                id: localStorage.getItem("syaraid"),
                form,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(fetchPaymentMethods()); // 🔥 IMPORTANT
              });

          }

          setShowAddForm(false);
          setEditingPayment(null);
        }}
      />

    </>
  );
};

export default Payments;

import { useEffect, useState } from 'react';
import Sidebar from '../components/AccountPage/Sidebar';
import OrderTabs from '../components/AccountPage/OrderTabs';
import OrderCard, { Order } from '../components/AccountPage/OrderCard';
import Addresses from '../components/AccountPage/Addresses';
import Payments from '../components/AccountPage/Payments';
import LoginSecurity from '../components/AccountPage/LoginSecurity';
import LogoutSection from '../components/AccountPage/LogoutSection';
import './AccountPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/order/orderSlice';


const AccountPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);

  const { orders, loading, error, totalPages } = useSelector((state: any) => state.orders);

  useEffect(() => {
    const userId = localStorage.getItem("syaraid"); // or your auth user id
    if (userId) {
      dispatch(fetchOrders({ userId, page }));
    }
  }, [dispatch, page]);

  const [activeNav, setActiveNav] = useState(
    location.state?.activeNav || "security"
  );
  const [activeTab, setActiveTab] = useState('Current');

  console.log("Orders in account page:", orders);

  const renderContent = () => {
    switch (activeNav) {
      case 'orders':
        if (loading) return (
          <>
            {[...Array(3)].map((_, i) => (
              <div className="order-skeleton">
                <div className="skeleton-header shimmer"></div>
                <div className="skeleton-product shimmer"></div>
                <div className="skeleton-product shimmer"></div>
              </div>)
            )}
          </>)
          ;

        if (error) return <p>Error: {error}</p>;
        return (
          <>
            {/* <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} /> */}

            {orders?.length > 0 ? (
              <> {
                orders.map((order) => (
                  <>
                    <OrderCard key={order.orderId} order={order} />


                  </>))
              }
                <div className="pagination">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1 || loading}
                  >
                    Prev
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages || loading}
                  >
                    Next
                  </button>
                </div>
              </>) : (
              <div className="empty-orders">

                <h2>No Orders Yet</h2>
                <p>Looks like you haven’t placed any orders yet.</p>

                <button onClick={() => navigate("/")}>
                  Start Shopping
                </button>
              </div>
            )}

          </>
        );
      case 'addresses':
        return <Addresses />;
      case 'payments':
        return <Payments />;
      case 'security':
        return <LoginSecurity />;
      case 'logout':
        return <LogoutSection onCancel={() => setActiveNav('security')} />;
      default:
        return (
          <div className="section-card" style={{ padding: 40, textAlign: 'center', color: '#999' }}>
            <p>This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="account-page">
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />
      <div className="account-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AccountPage;

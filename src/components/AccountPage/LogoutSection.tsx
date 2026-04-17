import { LogOut, AlertTriangle } from 'lucide-react';
import './LogoutSection.css';
import './shared.css';

interface LogoutSectionProps {
  onCancel: () => void;
}

const LogoutSection = ({ onCancel }: LogoutSectionProps) => {

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('syara');
    localStorage.removeItem('syaraid');
    
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = '/';
  }

  return (
    <div className="logout-container">
      <div className="logout-card section-card">
        <div className="logout-icon-wrap">
          <LogOut size={32} color="#53ce57" />
        </div>
        <h2 className="logout-title">Log Out</h2>
        <p className="logout-desc">Are you sure you want to log out of your account?</p>
        <div className="logout-warning">
          <AlertTriangle size={15} />
          <span>You will need to sign in again to access your orders and account settings.</span>
        </div>
        <div className="logout-actions">
          <button className="btn-logout" onClick={logout}>Yes, Log Out</button>
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutSection;

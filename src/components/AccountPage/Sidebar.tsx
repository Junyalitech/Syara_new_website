import { Package, MapPin, Shield, CreditCard, Archive, Heart, Headphones, LogOut } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: 'security', label: 'Profile', icon: Shield },
  { id: 'orders', label: 'My orders', icon: Package },
  { id: 'addresses', label: 'Your addresses', icon: MapPin },
  // { id: 'payments', label: 'Payments', icon: CreditCard },
];

const bottomItems = [
  { id: 'logout', label: 'Log out', icon: LogOut },
];

const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  return (
    <aside className="account-sidebar">
      <div className="sidebar-header">
        <h1>Your Account</h1>
        {/* <p>Alex John, Email: alexjohn@gmail.com</p> */}
      </div>

      <div className="topbar-tabs">
        {[...navItems, ...bottomItems].map(item => (
          <button
            key={item.id}
            className={`topbar-tab ${activeItem === item.id ? "active" : ""}`}
            onClick={() => onItemClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <item.icon className="nav-icon" />
            {item.label}
          </button>
        ))}

        <div className="sidebar-divider" />
        {bottomItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
          >
            <item.icon className="nav-icon" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

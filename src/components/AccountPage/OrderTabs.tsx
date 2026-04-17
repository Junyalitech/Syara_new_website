import './OrderTabs.css';

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Current', 'Unpaid', 'All orders'];

const OrderTabs = ({ activeTab, onTabChange }: OrderTabsProps) => {
  return (
    <div className="order-tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`order-tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;

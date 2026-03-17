import { useState } from "react";
import "./ProductTabs.css";

const tabs = ["Description", "Additional Information", "Reviews (1)"];

const AdditionalInfo = () => (
  <table className="pt-table">
    <tbody>
      <tr>
        <td>Weight</td>
        <td>1000gm</td>
      </tr>
      <tr>
        <td>Dimensions</td>
        <td>45 × 20 × 33 cm</td>
      </tr>
    </tbody>
  </table>
);

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="pt-container">

      <div className="pt-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`pt-tab ${activeTab === i ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-content">
        {activeTab === 0 && (
          <p>
            Vivamus adipiscing nisi ut dolor dignissim semper. Nulla luctus malesuada tincidunt.
          </p>
        )}

        {activeTab === 1 && <AdditionalInfo />}

        {activeTab === 2 && (
          <p>No reviews yet.</p>
        )}
      </div>

    </div>
  );
};

export default ProductTabs;
import { RefreshCcw, Package, AlertCircle } from "lucide-react";
import { ChevronRight, Mail, Phone } from "lucide-react";
import logo from "../../assets/Logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./PrivacyPolicy.css"; // ✅ reuse same CSS

const returnSections = [
  {
    icon: Package,
    title: "Return at Delivery",
    content:
      "Customers can return products at the time of delivery if they are not satisfied with the quality or freshness.",
  },
  {
    icon: AlertCircle,
    title: "Conditions",
    list: [
      "Opened products are not eligible for return",
      "Return or exchange allowed within 5 days (at store)",
      "Perishable items like vegetables and sweets are non-returnable",
    ],
  },
  {
    icon: RefreshCcw,
    title: "Refund Policy",
    content:
      "Refunds will be provided as credit vouchers in case of cancellation, return, or undelivered orders.",
  },
];


const ReturnPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pp-page">

      {/* HEADER */}
      <header className="pp-header">
        <div className="pp-header-inner">
          <span className="pp-logo">
            <img src={logo} alt="Syara Retails Logo" />
          </span>
          <nav className="pp-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <ChevronRight />
            <span className="pp-breadcrumb-current">Return Policy</span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <h1>Return Policy</h1>
          <p className="pp-hero-desc">
            Learn about our return, exchange, and refund process.
          </p>
          <p className="pp-hero-date">Last updated: April 2026</p>
        </div>
        <div className="pp-hero-pattern" />
      </section>

      {/* CONTENT */}
      <main className="pp-main">
        <div className="pp-sections">
          {returnSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <article key={i} className="pp-card">
                <div className="pp-card-header">
                  <div className="pp-card-icon">
                    <Icon />
                  </div>

                  <div className="pp-card-body">
                    <h2>{section.title}</h2>

                    {section.content && <p>{section.content}</p>}

                    {section.list && (
                      <ul className="pp-card-list">
                        {section.list.map((item, j) => (
                          <li key={j}>
                            <span className="pp-card-list-dot" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="pp-cta">
          <h2>Need Help?</h2>
          <p>For return or refund queries, contact us anytime.</p>

          <div className="pp-cta-buttons">
            <a href="mailto:syararetails@gmail.com" className="pp-btn-primary">
              <Mail />
              syararetails@gmail.com
            </a>

            <a href="tel:+918826540148" className="pp-btn-secondary">
              <Phone />
              +91-8826540148
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="pp-footer">
        <div className="pp-footer-inner">
          © 2026 Syara Retails. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ReturnPolicy;
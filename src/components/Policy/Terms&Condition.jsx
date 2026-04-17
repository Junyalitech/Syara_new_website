import { FileText, Truck, DollarSign, Info } from "lucide-react";
import { ChevronRight, Mail, Phone } from "lucide-react";
import logo from "../../assets/Logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./PrivacyPolicy.css"; // ✅ reuse same CSS

const termsSections = [
  {
    icon: Info,
    title: "General",
    content:
      "Kindly read the following terms and conditions carefully. By using our services, you agree to be bound by these terms and policies including Privacy Policy and Return Policy.",
  },
  {
    icon: FileText,
    title: "Introduction",
    content:
      "Syara Retails is registered at R-89, Ground Floor, Khichripur Main Road, East Vinod Nagar, New Delhi.",
    extra: "Email: syararetail@gmail.com | Phone: +91-8826540148",
  },
  {
    icon: DollarSign,
    title: "Pricing",
    content:
      "All products are sold at MRP unless specified. Prices at delivery will be final. No extra charges or refunds based on price fluctuations.",
  },
  {
    icon: Truck,
    title: "Delivery & Shipping",
    content:
      "Orders are delivered within 1–5 business days across Delhi-NCR. We ensure products are delivered in the best condition using reliable couriers.",
  },
];

const TermsCondition = () => {
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
            <span className="pp-breadcrumb-current">
              Terms & Conditions
            </span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <h1>Terms & Conditions</h1>
          <p className="pp-hero-desc">
            Please read these terms carefully before using our services.
          </p>
          <p className="pp-hero-date">Last updated: April 2026</p>
        </div>
        <div className="pp-hero-pattern" />
      </section>

      {/* CONTENT */}
      <main className="pp-main">
        <div className="pp-sections">
          {termsSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <article key={i} className="pp-card">
                <div className="pp-card-header">
                  <div className="pp-card-icon">
                    <Icon />
                  </div>
                  <div className="pp-card-body">
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                    {section.extra && <p>{section.extra}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="pp-cta">
          <h2>Need Help?</h2>
          <p>Contact us for any queries regarding our terms and policies.</p>

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

export default TermsCondition;
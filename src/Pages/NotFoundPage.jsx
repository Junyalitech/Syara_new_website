
import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      {/* Background decorative elements */}
      <div className="nf-glow nf-glow-1"></div>
      <div className="nf-glow nf-glow-2"></div>

      <div className="not-found-container">
        {/* Small brand label */}
        <div className="nf-brand">
          <span className="nf-brand-dot"></span>
          SYARA
        </div>

        {/* 404 Number */}
        <div className="nf-number-wrapper">
          <span className="nf-number nf-four">4</span>

          <div className="nf-circle">
            <div className="nf-circle-inner">
              <span className="nf-leaf">✦</span>
            </div>
          </div>

          <span className="nf-number nf-four">4</span>
        </div>

        {/* Content */}
        <div className="nf-content">
          <span className="nf-tag">PAGE NOT FOUND</span>

          <h1>
            Oops! This page
            <br />
            <span>got lost somewhere.</span>
          </h1>

          <p>
            The page you're looking for doesn't exist, has been moved,
            or the link may be incorrect.
          </p>
        </div>

        {/* Buttons */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn-primary">
            <Home size={18} />
            Back to Home
          </Link>

          {/* <Link to="/products/all" className="nf-btn nf-btn-secondary">
            <ShoppingBag size={18} />
            Explore Products
          </Link> */}
        </div>

        {/* Back link */}
        <button
          className="nf-back"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={15} />
          Go back to previous page
        </button>

        {/* Bottom decorative line */}
        <div className="nf-bottom-line">
          <span></span>
          <div className="nf-bottom-dot"></div>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;


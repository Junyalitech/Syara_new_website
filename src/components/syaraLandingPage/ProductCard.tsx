import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartUtils";

const getVariantLabel = (variant) => {
  const quantity = variant?.quantity ?? "";
  const unit = String(variant?.unit ?? "").trim();
  const normalizedUnit = unit.toLowerCase();
  const displayUnit =
    normalizedUnit === "g" ? "g" :
    normalizedUnit === "kg" ? "kg" :
    normalizedUnit === "ml" ? "ml" :
    normalizedUnit === "l" ? "L" :
    normalizedUnit === "pcs" || normalizedUnit === "pc" ? "pcs" : unit;
  return `${quantity}${displayUnit ? ` ${displayUnit}` : ""}`.trim();
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.cart);

  // Price and stock now belong to variants, not to the product itself.
  const variants = useMemo(
    () =>
      (Array.isArray(product?.variants) ? product.variants : []).filter(
        (variant) => variant && variant.status !== "deactive" && variant.status !== "inactive"
      ),
    [product?.variants]
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id != null ? String(variants[0].id) : ""
  );

  useEffect(() => {
    if (!variants.some((variant) => String(variant.id) === selectedVariantId)) {
      setSelectedVariantId(variants[0]?.id != null ? String(variants[0].id) : "");
    }
  }, [variants, selectedVariantId]);

  const selectedVariant =
    variants.find((variant) => String(variant.id) === selectedVariantId) || variants[0];

  const stock = Number(selectedVariant?.stock ?? 0);
  const price = Number(selectedVariant?.price ?? 0);
  const outOfStock = !selectedVariant || stock <= 0;

  const productview = () => {
    navigate(`/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const useraddToCartHandler = (event) => {
    event?.stopPropagation();

    if (!selectedVariant) {
      toast.error("No product variants are available");
      return;
    }

    if (stock <= 0) {
      toast.error("This variant is out of stock");
      return;
    }

    const cartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
      package: getVariantLabel(selectedVariant),
      price,
      productName: product.productName,
      image: product.image1,
      stock,
      slug: product.slug,
      is_liquid: product.is_liquid,
    };

    const result = addToCart(cartItem);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item added to cart 🛒");
  };

  return (
    <div className="gm-product-card" onClick={productview}>
      <div className="gm-product-image-wrapper">
        <img
          src={`${import.meta.env.VITE_API_URL}/public/userImages/${product.image1}`}
          alt={product.productName}
          className="gm-product-image"
          loading="lazy"
        />
        {outOfStock && (
          <span className="stock-badge out" aria-label="Out of stock">
            Out of Stock
          </span>
        )}
      </div>

      <div className="gm-product-name">{product.productName}</div>

      {selectedVariant ? (
        <>
          <div className="gm-product-prices">
            <span className="gm-product-price">₹{price.toFixed(2).replace(/\\.00$/, "")}</span>
          </div>

          {variants.length >= 1 && (
            <div
              className="gm-pack-options"
              onClick={(event) => event.stopPropagation()}
              role="group"
              aria-label={`Choose ${product.productName} variant`}
            >
              {variants.map((variant) => {
                const isSelected = String(variant.id) === String(selectedVariant.id);
                const variantOutOfStock = Number(variant.stock ?? 0) <= 0;

                return (
                  <label
                    key={variant.id}
                    className={`pack-option ${isSelected ? "active" : ""} ${
                      variantOutOfStock ? "variant-out-of-stock" : ""
                    }`}
                    title={variantOutOfStock ? "Out of stock" : `${getVariantLabel(variant)} - ₹${variant.price}`}
                  >
                    <input
                      type="radio"
                      name={`variant-${product.id}`}
                      value={variant.id}
                      checked={isSelected}
                      onChange={() => setSelectedVariantId(String(variant.id))}
                    />
                    <span>{getVariantLabel(variant)}</span>
                  </label>
                );
              })}
            </div>
          )}

          {variants.length === 1 && (
            <div className="gm-single-variant-hint">Pack size</div>
          )}
          <div className={`gm-variant-stock ${outOfStock ? "is-out-of-stock" : "is-in-stock"}`}>
            {outOfStock ? "Currently unavailable" : `${stock} in stock`}
          </div>
        </>
      ) : (
        <div className="gm-variant-stock is-out-of-stock">No variants available</div>
      )}

      <button
        className="gm-add-cart-btn"
        disabled={loading || outOfStock}
        onClick={useraddToCartHandler}
        type="button"
      >
        {outOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingCart size={16} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
};

export default ProductCard;

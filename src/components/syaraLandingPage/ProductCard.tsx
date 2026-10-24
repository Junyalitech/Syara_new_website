import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Tag } from "lucide-react";
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
  return `${quantity}${displayUnit ? ` ${displayUnit}` : ""}`.trim() || "Standard pack";
};

const money = (value) => Number(value || 0).toLocaleString("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.cart);

  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []).filter(
      (variant) => variant && variant.status !== "deactive" && variant.status !== "inactive"
    ),
    [product?.variants]
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id != null ? String(variants[0].id) : ""
  );

  // Reset selection when the card receives a different product/variant list.
  useEffect(() => {
    setSelectedVariantId(variants[0]?.id != null ? String(variants[0].id) : "");
  }, [product?.id, variants]);

  const selectedVariant =
    variants.find((variant) => String(variant.id) === selectedVariantId) || variants[0];

  const stock = Number(selectedVariant?.stock ?? 0);
  const mrp = Number(selectedVariant?.price ?? 0);
  // Legacy products without sellingPrice continue to use MRP as their selling price.
  const sellingPrice = Number(selectedVariant?.sellingPrice ?? selectedVariant?.selling_price ?? mrp);
  const hasDiscount = mrp > sellingPrice && mrp > 0;
  const discountPercent = hasDiscount ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const outOfStock = !selectedVariant || stock <= 0;

  const productview = () => {
    if (!product?.slug) return;
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
      price: sellingPrice,
      mrp,
      sellingPrice,
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
    <article className={`gm-product-card ${outOfStock ? "is-out-of-stock" : ""}`} onClick={productview}>
      <div className="gm-product-image-wrapper">
        <img
          src={`${import.meta.env.VITE_API_URL}/public/userImages/${product.image1}`}
          alt={product.productName || "Product"}
          className="gm-product-image"
          loading="lazy"
        />
        {outOfStock && <span className="stock-badge out" aria-label="Out of stock">Out of Stock</span>}
        {hasDiscount && !outOfStock && (
          <span className="gm-card-discount"><Tag size={12} /> {discountPercent}% OFF</span>
        )}
      </div>

      <div className="gm-product-name">{product.productName}</div>

      {selectedVariant ? (
        <>
          <div className="gm-product-prices" aria-label={`Selling price ₹${sellingPrice}; MRP ₹${mrp}`}>
            <span className="gm-product-price">₹{money(sellingPrice)}</span>
            {hasDiscount && <span className="gm-product-old-price">₹{money(mrp)}</span>}
          </div>

          <div
            className="gm-pack-options"
            onClick={(event) => event.stopPropagation()}
            role="radiogroup"
            aria-label={`Choose pack size for ${product.productName}`}
          >
            {variants.map((variant, index) => {
              const variantId = variant.id != null ? String(variant.id) : `variant-${index}`;
              const isSelected = variant.id != null
                ? variantId === selectedVariantId
                : variant === selectedVariant;
              const variantOutOfStock = Number(variant.stock ?? 0) <= 0;

              return (
                <label
                  key={variantId}
                  className={`pack-option ${isSelected ? "active" : ""} ${variantOutOfStock ? "variant-out-of-stock" : ""}`}
                  title={`${getVariantLabel(variant)}${variantOutOfStock ? " — Out of stock" : ""}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="radio"
                    name={`variant-${product.id ?? product.slug ?? product.productName}`}
                    value={variantId}
                    checked={isSelected}
                    onChange={() => setSelectedVariantId(variant.id != null ? String(variant.id) : "")}
                    aria-label={getVariantLabel(variant)}
                  />
                  <span>{getVariantLabel(variant)}</span>
                </label>
              );
            })}
          </div>

          <div className={`gm-variant-stock ${outOfStock ? "is-out-of-stock" : "is-in-stock"}`}>
            {outOfStock ? "" : `${stock} in stock`}
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
        {outOfStock ? "Out of Stock" : <><ShoppingCart size={17} /> Add to Cart</>}
      </button>
    </article>
  );
};

export default ProductCard;

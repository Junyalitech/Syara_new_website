import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./ProductInfo.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartUtils";

type Variant = {
  id: number | string;
  quantity: number | string;
  unit: string;
  /** MRP / original price */
  price: number | string;
  /** Optional discounted selling price; falls back to MRP when absent or blank. */
  sellingPrice?: number | string | null;
  stock: number | string;
  status?: string;
};

const getVariantLabel = (variant?: Variant) => {
  if (!variant) return "";
  const quantity = variant.quantity ?? "";
  const unit = String(variant.unit ?? "").trim();
  const normalized = unit.toLowerCase();
  const displayUnit =
    normalized === "g" ? "g" :
    normalized === "kg" ? "kg" :
    normalized === "ml" ? "ml" :
    normalized === "l" ? "L" :
    normalized === "pc" || normalized === "pcs" ? "pcs" : unit;
  return `${quantity}${displayUnit ? ` ${displayUnit}` : ""}`.trim();
};

const ProductInfo = ({ product, loading }: any) => {
  const { loading: cartLoading } = useSelector((state: any) => state.cart);

  const variants: Variant[] = useMemo(
    () =>
      (Array.isArray(product?.variants) ? product.variants : []).filter(
        (variant: Variant) =>
          variant &&
          variant.status !== "deactive" &&
          variant.status !== "inactive"
      ),
    [product?.variants]
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id != null ? String(variants[0].id) : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!variants.some((variant) => String(variant.id) === selectedVariantId)) {
      setSelectedVariantId(variants[0]?.id != null ? String(variants[0].id) : "");
      setQuantity(1);
    }
  }, [variants, selectedVariantId]);

  const selectedVariant =
    variants.find((variant) => String(variant.id) === selectedVariantId) ||
    variants[0];
  const mrp = Number(selectedVariant?.price ?? 0);
  const sellingPriceValue = selectedVariant?.sellingPrice;
  const parsedSellingPrice = sellingPriceValue == null || String(sellingPriceValue).trim() === ""
    ? mrp
    : Number(sellingPriceValue);
  // Guard against malformed/legacy values and never show a selling price above MRP.
  const price = Number.isFinite(parsedSellingPrice) && parsedSellingPrice > 0
    ? Math.min(parsedSellingPrice, mrp > 0 ? mrp : parsedSellingPrice)
    : mrp;
  const hasDiscount = Boolean(selectedVariant && mrp > price);
  const formatPrice = (value: number) => `₹${value.toFixed(2)}`;
  const stock = Number(selectedVariant?.stock ?? 0);
  const outOfStock = !selectedVariant || stock <= 0;

  const selectVariant = (variant: Variant) => {
    setSelectedVariantId(String(variant.id));
    setQuantity(1);
  };

  const useraddToCartHandler = () => {
    if (!selectedVariant) {
      toast.error("No product variants are available");
      return;
    }
    if (stock <= 0) {
      toast.error("This pack is out of stock");
      return;
    }
    if (quantity > stock) {
      toast.error(`Only ${stock} available for this pack`);
      setQuantity(Math.max(1, stock));
      return;
    }

    setAdding(true);
    const cartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      package: getVariantLabel(selectedVariant),
      price,
      productName: product.productName,
      image: product.image1,
      stock,
      slug: product.slug,
      is_liquid: product.is_liquid,
    };

    const result = addToCart(cartItem);
    setAdding(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(result?.updated ? "Cart quantity updated 🛒" : "Item added to cart 🛒");
  };

  if (loading) {
    return (
      <div className="product-info">
        <div className="skeleton title" />
        <div className="skeleton meta" />
        <div className="skeleton price" />
        <div className="skeleton stock" />
        <div className="skeleton pack" />
        <div className="skeleton desc" />
        <div className="skeleton cart" />
        <div className="skeleton payment" />
      </div>
    );
  }

  return (
    <div className="product-info">
      <div>
        <h1 className="product-title">{product?.productName}</h1>
        <div className="product-meta">
          <span>
            {product?.nickname1}
            {product?.nickname2 ? ` / ${product.nickname2}` : ""}
            {product?.nickname3 ? ` / ${product.nickname3}` : ""}
          </span>
        </div>
      </div>

      <div className="price-box">
        <span className="new-price">
          {selectedVariant ? formatPrice(price) : "Price unavailable"}
        </span>
        {selectedVariant && hasDiscount && (
          <>
            <span className="old-price" aria-label={`MRP ${formatPrice(mrp)}`}>
              {formatPrice(mrp)}
            </span>
            <span className="product-discount-badge">
              {Math.round(((mrp - price) / mrp) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      <div className="stock">
        {selectedVariant ? (
          <>
            <span className={outOfStock ? "stock-status out" : "stock-status in"}>
              {outOfStock ? "Out of Stock" : `${stock} in stock`}
            </span>
          </>
        ) : (
          <span className="stock-status out">No variants available</span>
        )}
      </div>

      <div className="package-select">
        <p>Select Pack:</p>
        {variants.length > 0 ? (
          <div className="pack-options" role="group" aria-label="Select product pack">
            {variants.map((variant) => {
              const isSelected = String(variant.id) === String(selectedVariant?.id);
              const variantStock = Number(variant.stock ?? 0);
              return (
                <button
                  type="button"
                  key={variant.id}
                  className={`${isSelected ? "active" : ""} ${variantStock <= 0 ? "variant-out-of-stock" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => selectVariant(variant)}
                >
                  <span>{getVariantLabel(variant)}</span>
                  <span className="variant-price">
                    {(() => {
                      const variantMrp = Number(variant.price ?? 0);
                      const rawSellingPrice = variant.sellingPrice;
                      const parsed = rawSellingPrice == null || String(rawSellingPrice).trim() === ""
                        ? variantMrp
                        : Number(rawSellingPrice);
                      const variantSellingPrice = Number.isFinite(parsed) && parsed > 0
                        ? Math.min(parsed, variantMrp > 0 ? variantMrp : parsed)
                        : variantMrp;
                      return (
                        <>
                          <span className="variant-selling-price">{formatPrice(variantSellingPrice)}</span>
                          {variantMrp > variantSellingPrice && (
                            <span className="variant-old-price" aria-label={`MRP ${formatPrice(variantMrp)}`}>
                              {formatPrice(variantMrp)}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </span>
                  {variantStock <= 0 && <span className="variant-unavailable">Out of stock</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="no-variants-message">No pack sizes are currently available.</p>
        )}
      </div>

      <p className="product-desc">{product?.description || ""}</p>

      <div className="cart-section">
        <div className="qty-box" aria-label="Quantity">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1 || outOfStock}
          >
            <Minus size={16} />
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
            disabled={outOfStock || quantity >= stock}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          className="add-cart"
          type="button"
          disabled={loading || cartLoading || adding || outOfStock}
          onClick={useraddToCartHandler}
        >
          {outOfStock ? "Out of Stock" : adding ? (
            <>
              <span className="spinner" />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

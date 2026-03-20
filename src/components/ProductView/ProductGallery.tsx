import { useState } from "react";
import "./ProductGallery.css";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="pg-container">

      <div className="pg-main">

        <button className="pg-wishlist">
          ❤
        </button>

        <button
          className="pg-arrow left"
          onClick={() =>
            setSelectedIndex((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
        >
          ‹
        </button>

        <img
          src={images[selectedIndex]}
          alt={name}
          className="pg-main-img"
        />

        <button
          className="pg-arrow right"
          onClick={() =>
            setSelectedIndex((prev) =>
              prev === images.length - 1 ? 0 : prev + 1
            )
          }
        >
          ›
        </button>

      </div>



      <div className="pg-thumbnails">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`pg-thumb ${selectedIndex === i ? "active" : ""}`}
          >
            <img src={img} alt={`thumb-${i}`} />
          </button>
        ))}
      </div>

    </div>
  );
};

export default ProductGallery;
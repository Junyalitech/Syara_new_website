import { useState } from "react";
import "./ProductGallery.css";
import { Heart } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  loading?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name, loading }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (loading) {
    return (
      <div className="pg-container">

        <div className="pg-main">
          <div className="pg-skeleton-main"></div>
        </div>

        <div className="pg-thumbnails">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="pg-skeleton-thumb"></div>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="pg-container">

      <div className="pg-main">

        {/* <button
          className={`pg-wishlist ${liked ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart size={18} fill={liked ? "red" : "none"} color={liked ? "red" : "black"} />

        </button> */}

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
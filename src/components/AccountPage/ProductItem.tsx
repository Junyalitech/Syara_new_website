import './ProductItem.css';

interface ProductItemProps {
  name: string;
  image: string;
  quantity: number;
  price: number;
  pack?: string;
}

const ProductItem = ({ name, image, quantity, price, pack }: ProductItemProps) => {
  return (
    <div className="product-item">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h4>{name}</h4>
        <p>Quantity: {quantity} </p>
        <p>Price: ₹{price}</p>

        <p>Pack: {pack}</p>
      </div>
    </div>
  );
};

export default ProductItem;

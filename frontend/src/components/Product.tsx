import { Card } from "react-bootstrap";
import { type ProductItem } from "../../../shared/interface";
import { Link } from "react-router-dom";
import Rating from "./Reting";

interface ProductProps {
  product: ProductItem;
}

const Product = ({ product }: ProductProps) => {
  const { _id, name, image, price, rating, numReviews } = product;
  return (
    <Card className="my-3 p-3 rounded h-100">
      <Link to={`/product/${_id}`}>
        <Card.Img
          src={image}
          variant="top"
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${_id}`}>
          <Card.Title className="product-title" as="div">
            <strong>{name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating value={rating || 0} text={numReviews?.toString() || "0"} />
        </Card.Text>
        <Card.Text as="h3" className="mt-auto">
          ${price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;

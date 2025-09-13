import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { Carousel, Image } from "react-bootstrap";
import { type ProductItem } from "../../../shared/interface";
import { Link } from "react-router-dom";

import Loader from "./Loader";
import Message from "./Message";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery({});

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <Message variant="danger">
        {"status" in error
          ? (error.data as { message?: string })?.message || error.status
          : error?.message || "An error occurred"}
      </Message>
    );
  }
  return (
    <Carousel pause="hover" className="bg-primary mb-4">
      {products.map((product: ProductItem) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;

import { Row, Col } from "react-bootstrap";
import { type ProductItem } from "../../../shared/interface.ts";
import Product from "../components/Product.tsx";
import { useGetProductsQuery } from "../slices/productsApiSlice.ts";
import Loader from "../components/Loader.tsx";
import Message from "../components/Message.tsx";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate.tsx";
import ProductCarousel from "../components/ProductCarousel.tsx";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  const products: ProductItem[] = data?.products ?? [];
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

  if (!data) {
    return <div>Products not found</div>;
  }
  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      <h1 className="mb-4">Latest Products</h1>
      <Row className="mb-4">
        {products.map((product: ProductItem) => (
          <Col className="mb-3" sm={12} md={6} lg={4} xl={3} key={product._id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </Col>
      </Row>
    </>
  );
};

export default HomeScreen;

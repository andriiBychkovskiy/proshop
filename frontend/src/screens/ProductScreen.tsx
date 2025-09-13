import { useParams, useNavigate } from "react-router-dom";
import { type ProductItem, type ReviewItem } from "../../../shared/interface";
import { Link } from "react-router-dom";
import {
  Row,
  Image,
  Col,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import Rating from "../components/Reting";
import {
  useGetProductByIdQuery,
  useCreateProductReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useState } from "react";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toast } from "react-toastify";
import Meta from "../components/Meta.tsx";

const ProductScreen = () => {
  const { id } = useParams();
  const options = [1, 2, 3, 4, 5];
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const productId = id as string;

  const [qty, setQty] = useState<number>(1);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });

  const { data, isLoading, error, refetch } = useGetProductByIdQuery(productId);
  const [createProductReview, { isLoading: isLoadingReview }] =
    useCreateProductReviewMutation();

  const product: ProductItem = data;

  if (!data) {
    return <div>Product not found</div>;
  }

  const {
    image,
    name,
    rating,
    numReviews,
    price,
    countInStock,
    description,
    reviews,
  } = product;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await createProductReview({ id: productId, review: formData }).unwrap();
      toast.success("Review submitted successfully");
      refetch();
      setFormData({ rating: 0, comment: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading || isLoadingReview) {
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
    <>
      <Meta title={name} description={description} />
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={image} alt={name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={rating ?? 0} text={(numReviews ?? 0).toString()} />
            </ListGroup.Item>
            <ListGroup.Item>{price}$</ListGroup.Item>
            <ListGroup.Item>{description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price</Col>
                  <Col>
                    <strong>${price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status</Col>
                  <Col>
                    <strong>
                      {countInStock || 0 > 0 ? "In Stock" : "Out Of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroupItem>
                  <Row className="align-items-center">
                    <Col xs="auto">Quantity</Col>
                    <Col>
                      <Form.Select
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </ListGroupItem>
              )}
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  disabled={!countInStock}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="review mt-3">
        <Col md={5}>
          <h2>Reviews</h2>
          {reviews?.length === 0 && <Message>No reviews</Message>}
          <ListGroup variant="flush">
            {reviews &&
              reviews?.length > 0 &&
              reviews?.map((review: ReviewItem) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt?.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            <ListGroup.Item>
              <h2>Write a review</h2>
              {userInfo ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="rating" className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      name="rating"
                      value={formData.rating}
                      onChange={handlerChange}
                    >
                      <option value={0}>Select...</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="comment" className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="comment"
                      value={formData.comment}
                      onChange={handlerChange}
                      rows={3}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoadingReview}
                  >
                    {isLoadingReview ? "Submitting..." : "Submit"}
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">login</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;

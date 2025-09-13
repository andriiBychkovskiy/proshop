import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { clearCart } from "../slices/cartSlice";
import Loader from "../components/Loader";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const {
    shippingAddress,
    paymentMethod,
    cartItems,
    totalPrice,
    shippingPrice,
    taxPrice,
    itemsPrice,
  } = cart;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
    if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, navigate, paymentMethod]);

  const createOrderHandler = async () => {
    try {
      const order = await createOrder(cart).unwrap();
      if (order) {
        toast.success("Order Placed");
        dispatch(clearCart());
        navigate(`/order/${order._id}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong> {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            fluid
                            rounded
                            alt={item.name}
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {" "}
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Items:</p>
                  </Col>
                  <Col>{itemsPrice}$</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Shipping:</p>
                  </Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Tax:</p>
                  </Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Total:</p>
                  </Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={createOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;

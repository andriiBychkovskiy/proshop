import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import type { CartItemType } from "../../../shared/interface";
import { addToCart, deleteFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const { cartItems, itemsPrice } = cart;
  const count = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const addToCartHandler = (item: CartItemType, qty: number) => {
    const updatedItem: CartItemType = { ...item, qty };
    dispatch(addToCart(updatedItem));
  };
  const deleteFromCardHandler = (id: string) => {
    dispatch(deleteFromCart(id));
  };
  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Col md={12}>
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        </Col>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              {cartItems.map((item: CartItemType) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                      ></Image>
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col>
                      <Form.Select
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteFromCardHandler(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="fluch">
                <ListGroup.Item>
                  <h2>Subtotal ({count}) items</h2>${itemsPrice}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    onClick={checkOutHandler}
                  >
                    Procced To Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Row>
  );
};

export default CartScreen;

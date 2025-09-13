import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  useGetOrderByIdQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import { useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import type { CartItemType } from "../../../shared/interface";
import { Link } from "react-router-dom";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  DISPATCH_ACTION,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import type {
  OnApproveData,
  OnApproveActions,
  CreateOrderData,
  CreateOrderActions,
} from "@paypal/paypal-js";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery("");

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId);

  //paypalScript
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: DISPATCH_ACTION.RESET_OPTIONS,
          value: {
            clientId: paypal.clientId,
            currency: "USD",
            intent: "capture",
          },
        });
        paypalDispatch({
          type: DISPATCH_ACTION.LOADING_STATUS,
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      if (order && !order.isPaid) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    if (actions.order) {
      return actions.order.capture().then(async function (details) {
        try {
          await payOrder({ orderId: orderId ?? "", details });
          refetch();
          toast.success("Payment successful");
        } catch (err: any) {
          toast.error(err?.data?.message || err.message);
        }
      });
    } else {
      toast.error("PayPal order actions not available.");
      return Promise.resolve();
    }
  };
  const onError = (err: any) => {
    toast.error(err.message);
  };

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order.totalPrice,
            },
          },
        ],
        intent: "CAPTURE",
      })
      .then((orderId) => {
        return orderId;
      });
  };

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
    <>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p>
                <strong>Delivered: </strong>
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order?.orderItems.map((item: CartItemType, index: number) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} fluid rounded alt={item.name} />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>{order.itemsPrice}$</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Shipping:</p>
                  </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Tax:</p>
                  </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    {" "}
                    <p>Total:</p>
                  </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;

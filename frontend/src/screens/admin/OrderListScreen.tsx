import {
  useGetAllOrdersQuery,
  useSetDeliveredOrderMutation,
} from "../../slices/ordersApiSlice";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import type { OrderType } from "../../../../shared/interface";
import { toast } from "react-toastify";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery({});
  const [setDelivered, { isLoading: deliverLoading }] =
    useSetDeliveredOrderMutation();

  const setDeliveredHandler = async (orderId: string) => {
    try {
      await setDelivered({ orderId: orderId });
      toast.success("Order Delivered");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading || deliverLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <Message variant="danger">
        {" "}
        {"status" in error
          ? (error.data as { message?: string })?.message || error.status
          : error?.message || "An error occurred"}
      </Message>
    );
  }
  return (
    <>
      <h1>Orders</h1>
      <Table hover responsive size="lg">
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>DETAILS</th>
            <th>MARK AS DELIVERED</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order: OrderType) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {" "}
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {" "}
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn=sm" variant="light" size="sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
                <td>
                  <Button
                    className="btn=sm"
                    variant="light"
                    size="sm"
                    disabled={order.isDelivered || !order.isPaid}
                    onClick={() => setDeliveredHandler(order._id)}
                  >
                    <FaPaperPlane />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;

import { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import type { RootState, AppDispatch } from "../store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import type { OrderType } from "../../../shared/interface";
import { FaTimes } from "react-icons/fa";

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [profile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    data: orders,
    isLoading,
    error: ordersError,
  } = useGetMyOrdersQuery({});

  useEffect(() => {
    setFormData({
      ...formData,
      name: userInfo?.name || "",
      email: userInfo?.email || "",
    });
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPassword !== formData.password) {
      toast.error("Passwords do not match");
    } else {
      try {
        const name = formData.name;
        const email = formData.email;
        const password = formData.password;
        let user = null;
        if (password.length === 0) {
          user = await profile({
            _id: userInfo?._id,
            name: name,
            email: email,
          }).unwrap();
        } else {
          user = await profile({
            _id: userInfo?._id,
            name: name,
            email: email,
            password: password,
          }).unwrap();
        }

        if (user) dispatch(setCredentials(user));
        toast.success("Profile updated successufully");

        // Handle successful login (e.g., redirect)
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loadingUpdateProfile) {
    return <Loader />;
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            ></Form.Control>
            <Form.Group className="my-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  name="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={false}
            className="mt-2"
          >
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        {isLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant="danger">
            {"message" in ordersError
              ? ordersError.message
              : typeof ordersError === "object" &&
                ordersError &&
                "error" in ordersError
              ? (ordersError as any).error
              : JSON.stringify(ordersError)}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order: OrderType) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt?.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
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
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn=sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;

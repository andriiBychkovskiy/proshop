import { Button, Form, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer.tsx";
import { useState, useEffect } from "react";
import { useLoginMutation } from "../slices/userApiSlice.ts";
import { setCredentials } from "../slices/authSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toast } from "react-toastify";

import Loader from "../components/Loader.tsx";

const LoginScreen = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(formData).unwrap();
      dispatch(setCredentials(user));
      navigate(redirect);
      // Handle successful login (e.g., redirect)
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </Form.Group>
        <Form.Group className="my-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="mt-2"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;

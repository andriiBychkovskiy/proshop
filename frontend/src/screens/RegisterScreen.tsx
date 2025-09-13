import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer.tsx";
import { useState, useEffect } from "react";
import { useRegisterMutation } from "../slices/userApiSlice.ts";
import { setCredentials } from "../slices/authSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store.ts";
import { toast } from "react-toastify";

import Loader from "../components/Loader.tsx";

const RegisterScreen = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const [register, { isLoading }] = useRegisterMutation();

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
    name: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPassword !== formData.password) {
      toast.error("Passwords do not match");
    } else {
      try {
        const user = await register(formData).unwrap();
        dispatch(setCredentials(user));
        navigate(redirect);
        // Handle successful login (e.g., redirect)
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />
        </Form.Group>
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
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
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
        <Form.Group className="my-3" controlId="formPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
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
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="mt-2"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;

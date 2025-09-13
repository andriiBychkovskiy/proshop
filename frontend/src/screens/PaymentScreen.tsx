import { useState, useEffect } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const cart = useSelector((state: RootState) => state.cart);
  console.log("cart", cart);
  const { shippingAddress } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [paymentMethod, setPaymentMethod] = useState<string>("PayPal");
  const submithHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submithHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value={paymentMethod}
              checked
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPaymentMethod(e.target.value)
              }
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;

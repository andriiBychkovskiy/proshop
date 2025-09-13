import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import type { ShippingAddresType } from "../../../shared/interface";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddres } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;
  const [shippingAddres, setShippingAddres] = useState<ShippingAddresType>(
    shippingAddress ||
      ({
        address: "",
        city: "",
        postalCode: "",
        country: "",
      } as ShippingAddresType)
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddres(shippingAddres));
    navigate("/payment");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddres({ ...shippingAddres, [e.target.name]: e.target.value });
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="adress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="string"
            name="address"
            value={shippingAddres?.address}
            onChange={handleOnChange}
            placeholder="Enter address"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="string"
            name="city"
            value={shippingAddres?.city}
            onChange={handleOnChange}
            placeholder="City"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3" controlId="code">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="string"
            name="postalCode"
            value={shippingAddres?.postalCode}
            onChange={handleOnChange}
            placeholder="Postal code"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="string"
            name="country"
            value={shippingAddres?.country}
            onChange={handleOnChange}
            placeholder="Enter country"
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="my-2"
          disabled={
            !shippingAddres.address ||
            !shippingAddres.city ||
            !shippingAddres.country ||
            !shippingAddres.postalCode
          }
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;

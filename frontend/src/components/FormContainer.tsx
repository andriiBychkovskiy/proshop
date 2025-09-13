import type { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <Container>
      <Row className="justify-content-md-center"></Row>
      <Col xs={12} mad={6}>
        {children}
      </Col>
    </Container>
  );
};

export default FormContainer;

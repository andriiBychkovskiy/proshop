import { Button, Form, Modal } from "react-bootstrap";
import FormContainer from "./FormContainer";
import { useState, useEffect } from "react";
import type { UserType } from "../../../shared/interface";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../slices/userApiSlice";
import Loader from "./Loader";
import Message from "./Message";

interface ModalType {
  show: boolean;
  handleClose: (message?: string) => void;
  userId: string;
}

const EditUserModal = ({ show, handleClose, userId }: ModalType) => {
  const [formData, setFormData] = useState<UserType>({
    name: "",
    email: "",
    isAdmin: false,
  });

  const [
    updateUser,
    { isLoading: isLoadingUpdateUser, error: errorUpdateUser },
  ] = useUpdateUserMutation();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleSubmit = async () => {
    await updateUser(formData).unwrap();
    handleClose("User updated");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isAdmin" ? value === "true" : value,
    });
  };

  if (isLoadingUser || isLoadingUpdateUser) {
    return <Loader />;
  }
  if (errorUser) {
    return (
      <Message variant="danger">
        {"status" in errorUser
          ? (errorUser.data as { message?: string })?.message ||
            errorUser.status
          : errorUser?.message || "An error occurred"}
      </Message>
    );
  }
  if (errorUpdateUser) {
    return (
      <Message variant="danger">
        {"status" in errorUpdateUser
          ? (errorUpdateUser.data as { message?: string })?.message ||
            errorUpdateUser.status
          : errorUpdateUser?.message || "An error occurred"}
      </Message>
    );
  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormContainer>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="my-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="my-3" controlId="brand">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="isAdmin">
                <Form.Label>Is Admin</Form.Label>
                <Form.Control
                  as="select"
                  name="isAdmin"
                  value={formData.isAdmin ? "true" : "false"}
                  onChange={handleChange}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </FormContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Update User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserModal;

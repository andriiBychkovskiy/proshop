import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/userApiSlice";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import type { UserType } from "../../../../shared/interface";
import { useState } from "react";
import { toast } from "react-toastify";
import EditUserModal from "../../components/EditUserModal";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery({});
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const onDeleteHandler = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  const onEditHandler = (userId: string) => {
    setShowEditModal(true);
    setUserId(userId);
  };
  const closeModalHandler = (message?: string) => {
    setShowEditModal(false);
    if (message) {
      toast.success(message);
    }
  };

  if (isLoading || isLoadingDelete) {
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
      <Row className="align-items-center">
        <Col>
          <h1>Users</h1>
        </Col>
      </Row>
      <>
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ISADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user: UserType) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="light"
                      className="mx-2"
                      onClick={() => onEditHandler(user._id ?? "")}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      onClick={() => onDeleteHandler(user._id ?? "")}
                      size="sm"
                      variant="danger"
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </>
      <EditUserModal
        show={showEditModal}
        handleClose={closeModalHandler}
        userId={userId}
      />
    </>
  );
};

export default UserListScreen;

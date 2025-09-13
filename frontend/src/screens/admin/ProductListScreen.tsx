import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import type { ProductItem } from "../../../../shared/interface";
import CreateProductModal from "../../components/CreateProductModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [deleteProduct, { isLoading: isLoadingDelete }] =
    useDeleteProductMutation();
  const onDeleteHandler = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success("Product deleted");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onEditHandler = (productId: string) => {
    setShowCreateModal(true);
    setIsEdit(true);
    setProductId(productId);
  };
  const closeModalHandler = (message?: string) => {
    setShowCreateModal(false);
    setIsEdit(false);
    if (message) {
      toast.success(message);
    }
  };

  if (isLoading || isLoadingDelete) {
    return <Loader />;
  }
  if (error) {
    <Message variant="danger">
      {" "}
      {"status" in error
        ? (error.data as { message?: string })?.message || error.status
        : error?.message || "An error occurred"}
    </Message>;
  }
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="btn-sm m-3"
            onClick={() => setShowCreateModal(true)}
          >
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      <>
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGOTY</th>
              <th>BRAND</th>
            </tr>
          </thead>
          <tbody>
            {data?.products &&
              data.products.map((product: ProductItem) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="light"
                      className="mx-2"
                      onClick={() => onEditHandler(product._id ?? "")}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      onClick={() => onDeleteHandler(product._id ?? "")}
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
      <Row>
        <Col>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </Col>
      </Row>
      <CreateProductModal
        show={showCreateModal}
        handleClose={closeModalHandler}
        isEdit={isEdit}
        productId={productId}
      />
    </>
  );
};

export default ProductListScreen;

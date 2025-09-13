import { Button, Form, Modal } from "react-bootstrap";
import FormContainer from "./FormContainer";
import { useState, useEffect } from "react";
import type { ProductItem } from "../../../shared/interface";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../slices/productsApiSlice";
import type { RootState } from "../store";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { toast } from "react-toastify";

interface ModalType {
  show: boolean;
  handleClose: (message?: string) => void;
  isEdit?: boolean;
  productId?: string;
}

const CreateProductModal = ({
  show,
  handleClose,
  isEdit = false,
  productId,
}: ModalType) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [createProduct] = useCreateProductMutation();
  const [
    updateProduct,
    { isLoading: isLoadingUpdateProduct, error: errorUpdateProduct },
  ] = useUpdateProductMutation();

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: errorProduct,
  } = useGetProductByIdQuery(productId);

  useEffect(() => {
    if (product && isEdit) {
      setFormData({ ...product, ...{ user: userInfo?._id } });
    }
  }, [product, isEdit]);

  const [uploadProductImage, { isLoading: loadingImage }] =
    useUploadProductImageMutation();
  const onHandleClose = () => {
    handleClose();
  };
  const [formData, setFormData] = useState<ProductItem>({
    name: "",
    category: "",
    brand: "",
    countInStock: 0,
    description: "",
    image: "",
    price: 0,
    user: userInfo?._id,
  });
  const handleSubmit = async () => {
    isEdit
      ? await updateProduct(formData).unwrap()
      : await createProduct(formData).unwrap();

    handleClose(isEdit ? "Product updated" : "Product created");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        setFormData((prev) => ({
          ...prev,
          image: res.image,
        }));
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  if (loadingImage || isLoadingProduct || isLoadingUpdateProduct) {
    return <Loader />;
  }
  if (errorProduct) {
    <Message variant="danger">
      {" "}
      {"status" in errorProduct
        ? (errorProduct.data as { message?: string })?.message ||
          errorProduct.status
        : errorProduct?.message || "An error occurred"}
    </Message>;
  }
  if (errorUpdateProduct) {
    <Message variant="danger">
      {" "}
      {"status" in errorUpdateProduct
        ? (errorUpdateProduct.data as { message?: string })?.message ||
          errorUpdateProduct.status
        : errorUpdateProduct?.message || "An error occurred"}
    </Message>;
  }
  return (
    <>
      <Modal show={show} onHide={onHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Update Product" : "Create Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
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
              <Form.Group className="my-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="countInStock">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
                <Form.Control type="file" onChange={uploadFileHandler} />
              </Form.Group>
              <Form.Group className="my-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  rows={3}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </FormContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHandleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateProductModal;

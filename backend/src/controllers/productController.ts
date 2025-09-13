import { Router, type Request, type Response } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModal.js";

//@desc Fetch all Products
//@route Get /api/products
//@access Public

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  console.log("REQ", req.query);
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch top rated Products
//@route Get /api/products/top
//@access Public

const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

//@desc Fetch a product
//@route Get /api/products/:id
//@access Public

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json(product);
  }
  res.status(404);
  throw new Error("Product not found ");
});
//@desc Create a product
//@route Post /api/products
//@access Privat, Admin

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = req.body;

  if (!productData) {
    res.status(400);
    throw new Error("No product data provided");
  }

  const createdProduct = await Product.create(productData);

  res.status(201).json(createdProduct);
});

//@desc Update all Products
//@route Put /api/products
//@access Privat, Admin

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found ");
  }
});

//@desc Delete a product
//@route Delete /api/products/:id
//@access Privet/Admin

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (product) {
    await Product.deleteOne({ _id: id });
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Product not found ");
  }
});

//@desc add reviews to product
//@route Post /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    // @ts-ignore
    const user = req.user;

    const product = await Product.findById(productId);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r: any) => r.user.toString() === user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: user.name,
        rating: Number(rating),
        comment,
        user: user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce(
          (acc: number, item: any) => item.rating + acc,
          0
        ) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  }
);

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};

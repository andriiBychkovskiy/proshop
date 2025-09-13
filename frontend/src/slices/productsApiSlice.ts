import type { ProductItem } from "../../../shared/interface";
import { PRODUCTS_URL, UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: PRODUCTS_URL,
        params: {
          pageNumber,
          keyword,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: (product: ProductItem) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (product: ProductItem) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOADS_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createProductReview: builder.mutation({
      query: ({
        id,
        review,
      }: {
        id: string;
        review: { rating: number; comment: string };
      }) => ({
        url: `${PRODUCTS_URL}/${id}/reviews`,
        method: "POST",
        body: review,
      }),
    }),
  }),
});
invaliddatesTags: ["Product"];
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;

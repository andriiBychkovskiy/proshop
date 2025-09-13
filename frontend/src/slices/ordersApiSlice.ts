import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { apiSlice } from "./apiSlice";
import type { InitialCartStateType } from "../../../shared/interface.js";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (order: InitialCartStateType) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }: { orderId: string; details: {} }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
      invalidatesTags: ["Order"],
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    setDeliveredOrder: builder.mutation({
      query: ({ orderId }: { orderId: string }) => ({
        url: `${ORDERS_URL}/${orderId}/delivered`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetAllOrdersQuery,
  useSetDeliveredOrderMutation,
} = productsApiSlice;

import type { UserType } from "../../../shared/interface.ts";
import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }: { email: string; password: string }) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: ({ name, email, password }: UserType) => ({
        url: USERS_URL,
        method: "POST",
        body: { name, email, password },
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    profile: builder.mutation({
      query: (data: UserType) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data: UserType) => ({
        url: `${USERS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
} = userApiSlice;

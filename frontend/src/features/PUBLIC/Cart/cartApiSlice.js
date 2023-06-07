import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

// NORMALIZED STATE
// {
//   // The unique IDs of each item. Must be strings or numbers
//   ids: []
//   // A lookup table mapping entity IDs to the corresponding entity objects
//   entities: {
//   }
// }

const cartAdapter = createEntityAdapter({});

const initialState = cartAdapter.getInitialState();

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    viewCartItems: builder.query({
      // query /cart
      query: () => ({
        url: "/cart",
        // if we get unexpected error set to 200 recommended from docs. isError set in backend (error middleware)
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // keepUnusedDataFor: 5,
      // transforming the res since mongodb id looks like _id, and the entity object looks for just id
      transformResponse: (responseData) => {
        const loadedCartItems = responseData.map((cartItem) => {
          cartItem.id = cartItem._id;
          return cartItem;
        });
        // setting the state with the intitialState (normalized state) and also adding loadedNotes
        return cartAdapter.setAll(initialState, loadedCartItems);
      },
      // providingTags to be invalidated in mutations for re fetching of data
      // will tell rtkq if cache is old
      providesTags: (result, error, arg) => {
        // result is the entities objects and ids array (ids here is the id for each product, not id for each user)
        // the entities object is the entire data associated with that note (user who made, text, ticket etc )
        if (result?.ids) {
          return [
            // giving entire result these tags
            { type: "Cart", id: "LIST" },
            // giving each note its own id for individual invalidation
            ...result.ids.map((id) => ({ type: "Cart", id })),
          ];
        } else return [{ type: "Cart", id: "LIST" }];
      },
    }),

    addToCart: builder.mutation({
      query: (product) => ({
        url: "/cart/add",
        method: "POST",
        body: {
          ...product,
        },
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),

    deleteFromCart: builder.mutation({
      query: ({ id }) => ({
        url: "/cart/delete",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Cart", id: arg.id }],
    }),

    deleteAllFromCart: builder.mutation({
      query: () => ({
        url: "/cart/delete-all",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
  }),
});

export const {
  useViewCartItemsQuery,
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useDeleteAllFromCartMutation,
} = cartApiSlice;

const selectCartItemsResult = cartApiSlice.endpoints.viewCartItems.select();

const selectCartItemsData = createSelector(
  selectCartItemsResult,
  (cartItemsResult) => cartItemsResult.data
);

export const {
  selectAll: selectAllCartItems,
  selectById: selectCartItemById,
  selectIds: selectCartItemsIds,
} = cartAdapter.getSelectors(
  (state) => selectCartItemsData(state) ?? initialState
);

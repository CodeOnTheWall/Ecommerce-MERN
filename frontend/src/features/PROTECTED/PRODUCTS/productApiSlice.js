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

// createEntityAdapter generates a set of prebuilt reducers and selectors for CRUD opps, on a normalized state structure
// reducers like addOne, deleteOne etc, and selectors like selectAll, selectIds to read content of entity state object
const productsAdapter = createEntityAdapter({});

// getInitialState returns a new entity state object like {ids: [], entities: {}}
const initialState = productsAdapter.getInitialState();

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // query /products
      query: () => ({
        url: "/products",
        // if we get unexpected error set to 200 recommended from docs. isError set in backend (error middleware)
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      // keepUnusedDataFor: 5,
      // transforming the res since mongodb id looks like _id, and the entity object looks for just id
      transformResponse: (responseData) => {
        const loadedProducts = responseData.map((product) => {
          product.id = product._id;
          return product;
        });
        // setting the state with the intitialState (normalized state) and also adding loadedNotes
        return productsAdapter.setAll(initialState, loadedProducts);
      },
      // providingTags to be invalidated in mutations for re fetching of data
      // will tell rtkq if cache is old
      providesTags: (result, error, arg) => {
        // result is the entities objects and ids array (ids here is the id for each product, not id for each user)
        // the entities object is the entire data associated with that note (user who made, text, ticket etc )
        if (result?.ids) {
          return [
            // giving entire result these tags
            { type: "Product", id: "LIST" },
            // giving each note its own id for individual invalidation
            ...result.ids.map((id) => ({ type: "Product", id })),
          ];
        } else return [{ type: "Product", id: "LIST" }];
      },
    }),

    addNewProduct: builder.mutation({
      // param expected to be passed in is initialNote
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: {
          ...newProduct,
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: "/products",
        // patch is for changing/updating, not replacing like put
        method: "PATCH",
        body: {
          ...updatedProduct,
        },
      }),
      // arg is the passed in updatedProduct, so invalidate the product that has arg.id and re fetch new data
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: "/products",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }),
  }),
});

// add use[insertGetMethod]Query for get and use[insertMutation]Mutation
export const {
  useGetProductsQuery,
  useAddNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;

// select method creates memoized selector on entire result obj of getNotes
export const selectProductsResult =
  productsApiSlice.endpoints.getProducts.select();

// creates memoized selector, takes input, and extracts data output
const selectProductsData = createSelector(
  selectProductsResult,
  // normalized state object with ids & entities
  (productsResult) => productsResult.data
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductsIds,
  // Pass in a selector that returns the notes slice of state
} = productsAdapter.getSelectors(
  (state) => selectProductsData(state) ?? initialState
);

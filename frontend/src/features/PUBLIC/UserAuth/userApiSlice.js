import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

// ENTITY STATE STRUCTURE:
// {
//   // The unique IDs of each item. Must be strings or numbers
//   ids: []
//   // A lookup table mapping entity IDs to the corresponding entity objects
//   entities: {
//   }
// }

// entities cant be iterated over, but ids cant
// createEntityAdapter function creates an adapter obj that provides a set of pre-generated reducer
// functions and selectors that can handle common CRUD operations on normalized data.
// so now on the usersAdapter (the adapter object), can do i.e.
// usersAdapter.addOne, addMany, updateOne, setAll etc
// REDUX STATE (FOR THIS SLICE) WILL BE ACCESSED THROUGH THE USERSADAPTER
const usersAdapter = createEntityAdapter({});

// getInitialState() returns an empty state obj with ids and entities object (normalized state)
// ids is an array of ids for each user, entities is the object of data associated with the id
const initialState = usersAdapter.getInitialState();

// REDUX WILL CHECK CACHE AUTOMATICALLY ON REQ - to see if cache hasnt changed and doesnt need to send another req
// injecting/adding endpoints into the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      // /admin/employees is an endpoint to make req/query on
      query: () => ({
        url: "/users",
        // via docs - making sure we have 200 and not an error
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  transforming the response from query (calling it responseData)
      transformResponse: (responseData) => {
        const loadedUser = responseData.map((user) => {
          // the normalized data via the usersAdapter looks for an id property, not _id (mongo id syntax), hence have to format it here
          // so giving each mapped user a user.id (which is the mongodb user._id)
          user.id = user._id;
          return user;
        });
        // setAll takes two args. first arg is the current state of the entity,
        // which is typically the initial state of the entity adapter, while
        // the second arg is the array of entity objects to add to the state.
        return usersAdapter.setAll(initialState, loadedUser);
      },

      // result is data/query result returned from endpoint (getUsers) - loadedUsers,
      // providesTags function generates an array of tags based on the
      // result of the query. These tags are used to cache the query result,
      // so that the same cache can be used in response to future queries
      // with the same arguments without having to make a new network request.
      // cache is stored in memory
      providesTags: (result, error, arg) => {
        // could get a result that doesnt have an id, hence the else return
        if (result?.ids) {
          return [
            // to invalidate the entire User cache (use both type and id: "LIST")
            // this is because id: "LIST" is unique id for entire list of users
            // need a type here to give this slice its own type, as to not interfere for example with notesApiSlice
            { type: "User", id: "LIST" },
            // generates tags for each loadedUser by mapping over the loadedUser id
            // so i can invalidate a single loadedUser
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),

    // INVALIDATING CACHE NOTE
    // when invaliding a cache, redux behind the scenes checks the current cache in memory

    createNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        // body is what is sent to backend, backend access req.body
        body: {
          ...initialUserData,
        },
      }),
      // entire User List cache will be invalidated and be re fetched
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      // only invalidating the individual user cache, arg is the initialuserData
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),

    deleteUser: builder.mutation({
      // only need the id here destructured from data sent in
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      // arg is id passed in
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// hooks auto created, just add use[insertMethod]Query/Mutation
// THESE ARE HTTP REQ
// RTKQ, since its built on top of ReduxToolkit, uses the selectors and memoization
// behind the scenes in the created hooks, hence React Hooks users will
// most likely never need to use selectors directly, as the hooks automatically
// use these selectors as needed.
export const {
  useGetUserInfoQuery,
  useCreateNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// MEMOIZED SELECTORS - take an input func, and output func
// React Hooks users will most likely never need to use these directly, as the hooks automatically use these selectors as needed.
// both below create memoized selectors
// select() creates selector for specific endpoint and returns entire result obj (data, isLoading, isSuccess, error etc)
// createSelector() creates selector based off the output data from the input function
// memoized selectors work by comparing the input parameters for changes, in this scenario
// if the entire getUsers result hasnt changed, selectUsersResult will load same cache,
// and if the data (usersResult.data) from selectUsersResult hasnt changed, selectUsersResult will load same cache
// if cache has changed, the memoized selectors will update the cache to the new cache
// now the component that uses the selector can re render, but only re render the exact changes/differences instead of the entire component
// so whether cache has changed or not, the selector updates the cache, reducing excess entire component re renders,
// and api calls

export const selectUserResult = usersApiSlice.endpoints.getUserInfo.select();

const selectUsersData = createSelector(
  selectUserResult,
  // normalized state object with ids & entities
  (usersResult) => usersResult.data
);

// all these memoized selectors are based off the result of selectUsersData
// all are only the data part of the result from selectUsersData
// when these are used in components, only the parts that change will be re rendered
export const {
  selectById: selectUserById,
  // the entity adapter (which is usersAdapter) contains a getSelector func that returns a set of selectors to read contents of entity state object
  // pass in a selector that returns the users slice of state (in this case selectUsersData which is data)
} = usersAdapter.getSelectors(
  // return state from selectUsersData, if null ?? load initialState
  (state) => selectUsersData(state) ?? initialState
);

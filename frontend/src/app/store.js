import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

// Api Slice
import { apiSlice } from "./api/apiSlice";
// Non Api Slice
import empReducer from "../features/PUBLIC/EmployeeAuth/empAuthSlice";
import userReducer from "../features/PUBLIC/UserAuth/userAuthSlice";

export const store = configureStore({
  reducer: {
    // rtkq required
    // all apiSlices in their respective files inject endpoints into apiSlice (that interact with api)
    // other slices for regular store, are added below that dont interact with api
    // such as authReducer
    // .reducerPath and .reducer are naming conventions
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Non Api Slices
    empAuth: empReducer,
    userAuth: userReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,

  // This middleware intercepts all dispatched actions that are defined as an RTK
  // Query endpoint. The middleware will use the baseQuery object you
  // passed to createApi as the default (which is apiSlice.middleware)
  // configuration for all network requests made by the RTK Query endpoints.
  // see apiSlice for reminder

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  // to be able to use redux devTools
  devTools: true,
});

// this enables some options to use with the queries in Users and Notes
setupListeners(store.dispatch);

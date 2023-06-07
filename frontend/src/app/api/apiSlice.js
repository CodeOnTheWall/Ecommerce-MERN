import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserCred } from "../../features/PUBLIC/UserAuth/userAuthSlice";
import { setEmpCred } from "../../features/PUBLIC/EmployeeAuth/empAuthSlice";
// from RTKQ docs - fetchBaseQuery
// very small wrapper around fetch that aims to simplify HTTP requests.
// It is not a full-blown replacement for axios, superagent, or any other
// more heavyweight library, but it will cover the vast majority of your HTTP request needs.
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  // always sends cookie - secure http only cookie that contains rT
  credentials: "include",
  // getState is api object, could be api.getState, but destructuring, this gets current state from application
  prepareHeaders: (headers, { getState }) => {
    // so that a user can make a refresh without state being wiped, but also so that
    // we dont mix the same refresh route which uses foundEmployee vs foundUser

    let token;
    const userToken = getState().userAuth.token;

    if (userToken) {
      token = getState().userAuth.token;
    } else {
      token = getState().empAuth.token;
    }

    // if token, set headers
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    // now this is applied to every req sent
    return headers;
  },
});

// query wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}
  // await the result from first req, so we have used access token as defined in baseQuery above
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    const isUser = api.getState().userAuth.isUser;

    const refreshResult = await baseQuery(
      isUser ? "/user-auth/refresh" : "/employee-auth/refresh",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const setCredentialz = isUser ? setUserCred : setEmpCred;
      api.dispatch(setCredentialz({ ...refreshResult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // for invalidating cached data
  tagTypes: ["Employee", "Product", "User", "Cart"],
  endpoints: (builder) => ({}),
});

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setEmpCred } from "../../features/PUBLIC/EmployeeAuth/empAuthSlice";

// // from RTKQ docs - fetchBaseQuery
// // very small wrapper around fetch that aims to simplify HTTP requests.
// // It is not a full-blown replacement for axios, superagent, or any other
// // more heavyweight library, but it will cover the vast majority of your HTTP request needs.

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://localhost:3500",
//   // always sends cookie - secure http only cookie that contains rT
//   credentials: "include",
//   // getState is api object, could be api.getState, but destructuring, this gets current state from application
//   prepareHeaders: (headers, { getState }) => {
//     // reference empAuthSlice, name of slice is empAuth, and initial state is an object with token, hence empAuth.token
//     const token = getState().empAuth.token;
//     // console.log(token);

//     // if token, set headers
//     if (token) {
//       // specific format expected is 'Bearer token' - this sets authorization header
//       // which if we look at verifyJWT, its req.headers.authorization
//       headers.set("authorization", `Bearer ${token}`);
//     }
//     // now this is applied to every req sent
//     return headers;
//   },
// });

// // query wrapper
// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   // console.log(args) // request url, method, body
//   // console.log(api) // signal, dispatch, getState()
//   // console.log(extraOptions) //custom like {shout: true}
//   // await the result from first req, so we have used access token as defined in baseQuery above
//   let result = await baseQuery(args, api, extraOptions);

//   // trying original aT - if error, have to send a rT to get a new aT
//   if (result?.error?.status === 403) {
//     console.log("sending refresh token");

//     // send rT to get new aT (arg is /employee-auth/refresh )
//     const refreshResult = await baseQuery(
//       "/employee-auth/refresh",
//       api,
//       extraOptions
//     );

//     // baseQuery returns an object that has a data property
//     // data should hold access token
//     if (refreshResult?.data) {
//       // store the new token by spreading in the access token and set that token in redux state
//       api.dispatch(setEmpCred({ ...refreshResult.data }));

//       // essentially trying original aT, then send rT, and gives us new access token, with setCredentials
//       // after setting credentials, retry original query (args) with new access token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       if (refreshResult?.error?.status === 403) {
//         refreshResult.error.data.message = "Your login has expired.";
//       }
//       return refreshResult;
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth,
//   // for invalidating cached data
//   tagTypes: ["Employee", "Product"],
//   endpoints: (builder) => ({}),
// });

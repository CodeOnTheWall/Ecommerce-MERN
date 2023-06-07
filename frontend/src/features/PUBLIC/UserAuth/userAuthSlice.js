import { createSlice } from "@reduxjs/toolkit";

// can see in redux dev tools that after we setCredentials, auth state has the aT
const userAuthSlice = createSlice({
  name: "userAuth",
  //   expecting to receive token (aT) back from api
  initialState: { token: null, isUser: false },
  reducers: {
    // when getting data back from api, payload will contain accessToken
    // dont need state.auth.token as already inside of auth
    setUserCred: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      state.isUser = action.payload.isUser;
    },
    // removing aT at logout
    userLogOut: (state, action) => {
      state.token = null;
      state.isUser = false;
    },
  },
});

// 'actions' of the authSlice
export const { setUserCred, userLogOut } = userAuthSlice.actions;

// this is imported as authReducer in store, I can do this since this is default export
export default userAuthSlice.reducer;

export const selectCurrentToken = (state) => state.userAuth.token;

// Redux
import { useSelector } from "react-redux";
// Non Api Auth Slice
import { selectCurrentToken } from "../features/PUBLIC/UserAuth/userAuthSlice";
// package to decode jwt on frontend
import jwtDecode from "jwt-decode";

export default function useUserAuth() {
  // selecting token from state
  const token = useSelector(selectCurrentToken);

  if (token) {
    // decode token and destructure username and roles
    const decoded = jwtDecode(token);
    // reminder when we 'signed' token in backend api, we put the info into UserInfo (refer to authController)
    const { username } = decoded.UserInfo;

    // return these values into useAuth hook, which can then be used for the RequireAuth hook to grant access to protected routes based on role
    return { username };
  }

  // returned if dont have token
  return { username: "" };
}

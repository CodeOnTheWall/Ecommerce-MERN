// useLocation hook returns location object from current URL (pathname)
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function RequireAuth({ allowedRoles }) {
  const location = useLocation();
  const { roles } = useAuth();

  // some - if this is true even once, this will return true
  // if allowedRoles includes one of the roles that the employee has then true and render children via Outlet, otherwise navigate to /login
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    // to /login from the state object which is the target route from location, location being the current url
    // replace prop to be taken back to prev page, and not prev route, hence, if a user goes to an unauthorized path/route,
    // they will be navigated to /login, but the back button will be to prev page, and not the route they tried
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
}

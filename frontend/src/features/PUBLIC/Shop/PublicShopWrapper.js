// React Router Dom
import { Outlet, useNavigate } from "react-router-dom";
// User Auth Api Slice
import { useUserLogoutMutation } from "../UserAuth/userAuthApiSlice";
// Custom Hooks
import useUserAuth from "../../../hooks/useUserAuth";
// Components
import CustomLink from "../../../components/CustomLink";
import CustomButton from "../../../components/CustomButton";
import { useEffect } from "react";

export default function PublicShopWrapper({ className }) {
  const { username } = useUserAuth();

  const navigate = useNavigate();

  const [userLogout, { isSuccess }] = useUserLogoutMutation();

  const onLogoutClick = async () => {
    await userLogout();
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <nav className=" bg-blue-100 flex justify-between items-center py-4 px-10">
        <div className=" space-x-4 flex">
          <CustomLink urlPath="/cart">Go to cart</CustomLink>
          {username ? (
            <>
              <CustomLink urlPath={`/user-settings/`}>
                Account Settings
              </CustomLink>
              <h1>Welcome {username}</h1>
              <CustomButton onClick={onLogoutClick}>Logout</CustomButton>
            </>
          ) : (
            <CustomLink urlPath="/user-login">User login</CustomLink>
          )}
        </div>
        <CustomLink urlPath="/login">Admin Login</CustomLink>
      </nav>
      <section
        className={`${className} flex flex-col justify-center items-center w-full
        p-8 sm:p-12 md:p-24 space-y-6 `}
      >
        <Outlet />
      </section>
    </>
  );
}

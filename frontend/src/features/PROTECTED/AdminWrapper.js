// React
import { useEffect } from "react";
// React Router Dom
import { useNavigate, Outlet } from "react-router-dom";
// Non Api empAuth Slice
import { useEmpLogoutMutation } from "../PUBLIC/EmployeeAuth/empAuthApiSlice";
// Components
import CustomButton from "../../components/CustomButton";

export default function AdminWrapper({ className }) {
  const [empLogout, { isSuccess }] = useEmpLogoutMutation();

  const navigate = useNavigate();

  const onLogoutClick = () => {
    empLogout();
  };

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  return (
    <>
      <nav className=" bg-blue-100 flex justify-between items-center py-4 px-10">
        <CustomButton onClick={onLogoutClick}>Logout</CustomButton>
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

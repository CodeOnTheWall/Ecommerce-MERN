// React Router Dom
import { useParams } from "react-router-dom";
// Employees Api Slice
import { useGetAllEmployeesQuery } from "./employeeApiSlice";
// Hooks
import useAuth from "../../../hooks/useAuth";
// Components
import EditEmployeeForm from "./EditEmployeeForm";
import useTitle from "../../../hooks/useTitle";
import CustomLink from "../../../components/CustomLink";

export default function EditEmployee() {
  const { isManager, isAdmin } = useAuth();
  useTitle("techNotes: Edit Employee");

  // getting user id out of url
  const { id } = useParams();
  // console.log(id);

  // reminder that rtkq will check if theres a cache first, if no cache, make api call
  const { employee } = useGetAllEmployeesQuery("employeeList", {
    selectFromResult: ({ data }) => ({
      employee: data?.entities[id],
    }),
  });

  // if no user, then we are loading
  if (!employee) return <div>Loading...</div>;

  // Check if the user is authorized to edit the employee
  if (!isManager && !isAdmin) {
    return (
      <>
        <div>You are not authorized to edit this employee</div>
        <CustomLink urlPath="/admin/employees">
          Back to employee list
        </CustomLink>
      </>
    );
  }
  const content = <EditEmployeeForm employee={employee} />;

  return content;
}

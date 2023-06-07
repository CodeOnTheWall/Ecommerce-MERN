// React
import { memo } from "react";
// Users Api slice
import { useGetAllEmployeesQuery } from "./employeeApiSlice";
// Custom Hooks
import useAuth from "../../../hooks/useAuth";
// Components
import CustomLink from "../../../components/CustomLink";

const Employee = ({ employeeId }) => {
  const { isManager, isAdmin } = useAuth();

  // querying the db, get back the {data}, then using selectFromResult, we can only select
  // a specific data piece, in this case, finding the user by inserting the userId
  // into the entity

  // OTHER IMPORTANT NOTE - "usersList" tag
  // our component is auto subscribed to changes to the state and updates the cached result accordingly, so ui stays up to date (once component is mounted)
  // by adding a "tag", we put a label on this cache, so when a change happens anywhere with the tag "usersList"
  // the useGetUsersQuery will check the cache first (with the tag usersList), and load from the cache (if cache hasnt expired), if theres no cache or exp, sending another api call
  const { employee } = useGetAllEmployeesQuery("employeeList", {
    selectFromResult: ({ data }) => ({
      employee: data?.entities[employeeId],
    }),
  });

  if (employee) {
    // getting all roles, setting to string, and replacing commas with comma and a space
    const employeesRolesString = employee.roles
      .toString()
      .replaceAll(",", ", ");

    return (
      // table row, and table cell td
      <tr>
        <td className="px-8 py-3">{employee.username}</td>
        <td className="px-8 py-3">{employeesRolesString}</td>
        {(isManager || isAdmin) && (
          <td className="px-8 py-3">
            <CustomLink urlPath={`/admin/employees/${employeeId}`}>
              Edit
            </CustomLink>
          </td>
        )}
      </tr>
    );
  } else return null;
};

// By using memo, you can ensure that the component will only re-render
// when its own props or state change, rather than whenever the parent
// component re-renders. This can help optimize the performance
const memoizedEmployee = memo(Employee);
export default memoizedEmployee;

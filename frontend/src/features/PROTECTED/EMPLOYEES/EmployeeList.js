// Employees Api Slice
import { useGetAllEmployeesQuery } from "./employeeApiSlice";
// Custom Hooks
import useAuth from "../../../hooks/useAuth";
// Components
import Employee from "./Employee";
import CustomLink from "../../../components/CustomLink";

// NOTE ABOUT CACHE TAG
// if other parts of app change the cache of the tag "employeesList", this component will see that as its subscribed to the store
// but it wont cause a api call, it will just update the cache with the new cache
// and render the ui accordingly (on component mount), and only the changes

export default function EmployeeList() {
  const { isManager, isAdmin } = useAuth();

  // all these states are automatically monitored by rtkq
  const {
    // naming data: users
    data: employees,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllEmployeesQuery("employeeList", {
    userType: "employee",
    // these options are available via adding setUpListeners in store.js
    // these options do cause api calls
    // this is for updating every so often, incase multiple employees were on same page
    // 60000 millisec, every min, will re query the data
    pollingInterval: 60000,
    // put focus on another window and come back, re fetch
    refetchOnFocus: true,
    // if component is mounted, re fetch data
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;
  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  if (isSuccess) {
    // users is an array of ids and entity objects
    const { ids } = employees;

    content = (
      <table className=" bg-slate-300 border border-slate-500">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-8 underline decoration-slate-700 underline-offset-2"
            >
              Employee
            </th>
            <th
              scope="col"
              className="px-8 underline decoration-slate-700 underline-offset-2"
            >
              Roles
            </th>
            {(isManager || isAdmin) && (
              <th
                scope="col"
                className="px-8 underline decoration-slate-700 underline-offset-2"
              >
                Edit
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ids?.length &&
            // if ids is defined, and it has a length. using ? operator so that if ids is undefined it wont throw an error
            // always add key when mapping
            ids.map((employeeId) => (
              <Employee key={employeeId} employeeId={employeeId} />
            ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {content}
      <CustomLink urlPath="/admin">Back to admin dashboard</CustomLink>
    </>
  );
}

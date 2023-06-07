// Custom Hooks
import useAuth from "../../hooks/useAuth";
// Components
import CustomLink from "../../components/CustomLink";

export default function Welcome() {
  const { username, isManager, isAdmin } = useAuth();

  // creating new date object
  const date = new Date();
  // formatting date
  // first expected value is locale (en-US), second is object of options (dateStyle and timeStyle)
  const today = new Intl.DateTimeFormat("en-US", {
    // date formatting style
    dateStyle: "full",
    // time formatting style
    timeStyle: "long",
  }).format(date);

  return (
    <>
      <p>{today}</p>
      <h1>Welcome {username}!</h1>
      <CustomLink urlPath="/admin/employees">View Employees</CustomLink>
      {(isManager || isAdmin) && (
        <CustomLink urlPath="/admin/new-employee">
          Create New Employee
        </CustomLink>
      )}
      <CustomLink urlPath="/admin/products">View Products</CustomLink>
      <CustomLink urlPath="/admin/add-product">Add New Product</CustomLink>
      <CustomLink urlPath="/">Back to public products page</CustomLink>
    </>
  );
}

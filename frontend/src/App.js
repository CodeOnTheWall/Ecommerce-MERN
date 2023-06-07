// react router dom
import { Routes, Route } from "react-router-dom";

// OTHER FEATURES
import PersistLogin from "./features/PUBLIC/EmployeeAuth/PersistLogin";
import RequireAuth from "./features/PUBLIC/EmployeeAuth/RequireAuth";
import Prefetch from "./features/PUBLIC/EmployeeAuth/Prefetch";
import { PROTECTEDROLES } from "./config/protectedRoles";

// PUBLIC PAGES/ROUTES
import PublicShopWrapper from "./features/PUBLIC/Shop/PublicShopWrapper";
import ProductList from "./features/PUBLIC/Shop/ProductList";
import ProductDetail from "./features/PUBLIC/Shop/ProductDetail";
import UserLogin from "./features/PUBLIC/UserAuth/UserLogin";
import UserSignUp from "./features/PUBLIC/UserAuth/UserSignUp";
import UserSettings from "./features/PUBLIC/UserAuth/UserSettings";
import EmpLogin from "./features/PUBLIC/EmployeeAuth/EmpLogin";
import Cart from "./features/PUBLIC/Cart/Cart";
// PROTECTED PAGES/ROUTES
// /admin
import Welcome from "./features/PROTECTED/Welcome";
import AdminWrapper from "./features/PROTECTED/AdminWrapper";
// /admin/products
import Products from "./features/PROTECTED/PRODUCTS/Products";
import EditProduct from "./features/PROTECTED/PRODUCTS/EditProduct";
import AddProductForm from "./features/PROTECTED/PRODUCTS/AddProductForm";
// /admin/employees
import EmployeeList from "./features/PROTECTED/EMPLOYEES/EmployeeList";
import NewEmployee from "./features/PROTECTED/EMPLOYEES/NewEmployee";
import EditEmployee from "./features/PROTECTED/EMPLOYEES/EditEmployee";

// VIA REDUX DEV TOOLS
// req is made, pending, subscription added, query fulfilled (meaning tags are provided for invalidation)
// tags are usersList and notesList, and the mutations in the slices have their own tags for inidivial changes and slice changes
// when getUsers and getNotes is called, they both provide tags, which is how further mutations can invalidate those tags, and communicate with that cache

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<PublicShopWrapper />}>
        {/* index routes render at parent url */}
        <Route index element={<ProductList />} />
        {/* /products/:id */}
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="/user-settings/:id" element={<UserSettings />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/sign-up" element={<UserSignUp />} />
        <Route path="/login" element={<EmpLogin />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* protected routes */}
      {/* since aT is wiped on refresh, must get a new aT via rT which is inside the cookie, since cookie didnt get wiped on refesh (not until expiration of cookie) */}
      <Route element={<PersistLogin />}>
        {/* PROTECTED ROUTES */}
        <Route
          element={
            <RequireAuth allowedRoles={[...Object.values(PROTECTEDROLES)]} />
          }
        >
          <Route path="/admin" element={<AdminWrapper />}>
            {/* index elements render at parent url */}
            <Route index element={<Welcome />} />

            {/* /admin/employees */}
            <Route path="employees" element={<EmployeeList />} />
            {/* /admin/new-employee */}
            <Route path="new-employee" element={<NewEmployee />} />
            {/* /admin/employees/:id */}
            <Route path="employees/:id" element={<EditEmployee />} />

            {/* /admin/products/ */}
            <Route path="products" element={<Products />} />
            {/* /admin/add-product */}
            <Route path="add-product" element={<AddProductForm />} />
            {/* /admin/products/:id */}
            <Route path="product/:id" element={<EditProduct />} />
          </Route>
        </Route>
        {/* end protected routes */}
      </Route>
    </Routes>
  );
}

// Products Api Slice
import { useGetProductsQuery } from "../../PROTECTED/PRODUCTS/productApiSlice";
// User Non Api Slice
import { selectCurrentToken } from "../UserAuth/userAuthSlice";
// Redux
import { useSelector } from "react-redux";
// Components
import Product from "./Product";
import PageTitle from "../../../components/PageTitle";
import CustomLink from "../../../components/CustomLink";

// Note about memoization
// in this component, the state of rtkq could be changing frequently, causing
// many component re renders, to improve performance, we will give the child
// components memo from react so that they wont re render unless their own
// props or state change, since typically when the state or props of a parent
// component change, the children will re render, and we dont want that so we
// can maintain a high perf app

export default function Products() {
  const token = useSelector(selectCurrentToken);

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("productsList", {
    // if component is mounted, re fetch data
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = products;

    content = (
      <>
        <PageTitle>Products</PageTitle>
        {!token ? (
          <CustomLink urlPath="/user-login">
            Log in to add books to cart!
          </CustomLink>
        ) : null}
        <div
          className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
         "
        >
          {ids.map((id) => (
            <Product key={id} productId={id} />
          ))}
        </div>
      </>
    );
  }

  return content;
}

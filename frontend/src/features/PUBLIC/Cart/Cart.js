// Cart Api Slice
import { useViewCartItemsQuery } from "./cartApiSlice";

// Components
import CustomLink from "../../../components/CustomLink";
import PageTitle from "../../../components/PageTitle";
import CartItem from "./CartItem";

export default function Cart() {
  const {
    data: cartItems,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useViewCartItemsQuery("cartList", {
    // if component is mounted, re fetch data
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = cartItems;

    content = (
      <>
        <PageTitle>Shopping Cart</PageTitle>
        {ids.map((id) => (
          <CartItem key={id} cartItemId={id} />
        ))}
        <CustomLink urlPath="/">Back to all products</CustomLink>
      </>
    );
  }

  return content;
}

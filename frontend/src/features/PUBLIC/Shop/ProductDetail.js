// React Router Dom
import { useParams } from "react-router-dom";
// Api Slice
import { useGetProductsQuery } from "../../PROTECTED/PRODUCTS/productApiSlice";
// Components
import CustomLink from "../../../components/CustomLink";

export default function ProductDetail() {
  const { id } = useParams();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery("productsList");

  // Find the product with the given id
  const product = products?.entities[id];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error?.data?.message}</p>;
  }

  return (
    <>
      <div>
        <div>{product.title}</div>
        <div>{product.id}</div>
        <CustomLink urlPath="/">See all products</CustomLink>
      </div>
    </>
  );
}

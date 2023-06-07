// React Router Dom
import { useParams } from "react-router-dom";
// Product Api Slice
import { useGetProductsQuery } from "./productApiSlice";
// Components
import EditProductForm from "./EditProductForm";
import CustomLink from "../../../components/CustomLink";

export default function EditProduct() {
  // gets id from url path
  const { id } = useParams();

  // getting the product from the id
  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[id],
    }),
  });

  // while loading product
  //   if no product, or if product but no length
  if (!product) return <p>Loading...</p>;

  const content = <EditProductForm product={product} />;

  return (
    <>
      {content}
      <CustomLink urlPath="/admin/products">Back to products</CustomLink>
    </>
  );
}

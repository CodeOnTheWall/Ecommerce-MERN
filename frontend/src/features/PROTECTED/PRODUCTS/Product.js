// Product Api Slice
import { useGetProductsQuery } from "./productApiSlice";
// Components
import CustomLink from "../../../components/CustomLink";

// this Product.js the mapped over from Products.js, each has a passed in productId to be selected from state
export default function Product({ productId }) {
  // querying the db, get back the {data}, then using selectFromResult, we can only select
  // a specific data piece, in this case, finding the product by inserting the productId
  // into the entity

  // IMPORTANT CACHE NOTE - "productsList" tag
  // the queryCacheKey (seen in redux dev tools) is automatically generated by RTK
  // Query based on the endpoint name and the serialized query parameters used when
  // components subscribe to data from that endpoint (getProduct and "productsList").
  // It is used for cache lookup and to identify and deduplicate identical requests.
  // The queryCacheKey ensures that if two components perform the same request,
  // they will share the same cached data, preventing redundant network requests.
  // WHEREAS provided tags is for invalidating after mutations
  // rtkq will then invalidate the queries that are affected and invalidate them

  // selectFromResult is similar to createSelector in that we are extracting a specific part
  // naming it product is arbitrary
  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      // data has ids array and entities, finding the note entity via passing in noteId
      product: data?.entities[productId],
    }),
  });

  return (
    // table row tr, table cell td
    <tr>
      <td className="px-8 py-3">{product.title}</td>
      <td className="px-8 py-3"> {product.price}</td>
      <td className="px-8 py-3 w-[30%]">{product.description}</td>
      <td>
        <CustomLink urlPath={`/admin/product/${productId}`}>
          Edit Product
        </CustomLink>
      </td>
    </tr>
  );
}

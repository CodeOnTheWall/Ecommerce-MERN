// React
import { memo } from "react";
// API Products Slice
import { useGetProductsQuery } from "../../PROTECTED/PRODUCTS/productApiSlice";
// API Cart Slice
import { useAddToCartMutation } from "../Cart/cartApiSlice";
// User Non Api Slice
import { selectCurrentToken } from "../UserAuth/userAuthSlice";
// Redux
import { useSelector } from "react-redux";
// Components
import CustomLink from "../../../components/CustomLink";
import CustomButton from "../../../components/CustomButton";

const Product = ({ productId }) => {
  const token = useSelector(selectCurrentToken);

  // IMPORTANT NOTE - "productsList" tag
  // our component is auto subscribed to changes to the state and updates the cached result accordingly, so ui stays up to date (once component is mounted)
  // by adding a "tag", we put a label on this cache, so when a change happens anywhere with the tag "productsList"
  // the useGetProductsQuery will check the cache first (with the tag productsList), and load from the cache (if cache hasnt expired), if theres no cache or exp, sending another api call

  // selectFromResult is similar to createSelector in that we are extracting a specific part
  const { product } = useGetProductsQuery("productsList", {
    selectFromResult: ({ data }) => ({
      // data has ids array and entities, finding the note entity via passing in noteId
      product: data?.entities[productId],
    }),
  });

  const [addToCart] = useAddToCartMutation();

  const onAddToCartClick = async () => {
    await addToCart({ productId });
  };
  return (
    <div
      className=" w-full flex flex-col items-center justify-start bg-blue-100 border 
      rounded-lg border-blue-700 p-8 space-y-5 "
    >
      <div> {product.title}</div>
      <div> ${product.price}</div>
      <div className=" h-40 overflow-y-auto"> {product.description}</div>
      {token ? (
        <CustomButton onClick={onAddToCartClick}>Add to cart</CustomButton>
      ) : null}
      <CustomLink urlPath={`/products/${productId}`}>
        Product Information
      </CustomLink>
    </div>
  );
};

const memoizedProduct = memo(Product);
export default memoizedProduct;

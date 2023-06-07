// Products Api Slice
import { useGetProductsQuery } from "./productApiSlice";
// Components
import Product from "./Product";
import PageTitle from "../../../components/PageTitle";
import CustomLink from "../../../components/CustomLink";

export default function Products() {
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("productsList");

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    // 'normalized state with ids and entities', ids can be mapped over, entities cant
    const { ids } = products;

    content = (
      <table className=" bg-slate-300 border border-slate-500 table-fixed h-5">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-8 underline decoration-slate-700 underline-offset-2 h-[25px]"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-8 underline decoration-slate-700 underline-offset-2"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-8 underline decoration-slate-700 underline-offset-2"
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {ids?.map((id) => (
            <Product key={id} productId={id} />
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <PageTitle>Products</PageTitle>
      {content}
      <CustomLink urlPath="/admin">Back to admin dashboard</CustomLink>
    </>
  );
}

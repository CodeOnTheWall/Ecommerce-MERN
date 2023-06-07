import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// rtkq
import { store } from "../../../app/store";
import { productsApiSlice } from "../../PROTECTED/PRODUCTS/productApiSlice";

// util is from rtkq which contains a list of functions such as prefetch

// pre fetch data to be available to wrapped components. once query is successful,
// the subscription to the store is active with the respective cache tag productsList
// so whenever another query is made with same cache tag, redux will check cache first before sending a new api req
export default function Prefetch() {
  useEffect(() => {
    // prefetch func is a redux thunk, first arg - endpoint, cache key, and force a new api req regardless if theres a cache already
    store.dispatch(
      productsApiSlice.util.prefetch("getProducts", "productsList", {
        force: true,
      })
    );

    // empty dependency[] only runs when component mounts
  }, []);

  return <Outlet />;
}

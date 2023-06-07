import { useState, useEffect } from "react";

const usePersist = () => {
  const [persist, setPersist] = useState(
    // if persist doesnt exist in local storage its false to begin with
    // parse into a js object
    JSON.parse(localStorage.getItem("persist")) || false
  );
  // console.log(persist);
  // when persists changes, set that value (true/false) to localStorage
  useEffect(() => {
    // stringify into json to be set in localStorage
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  // current persist value, and func to update persist value, can be extracted from
  // the hook in other components
  return [persist, setPersist];
};
export default usePersist;

import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // run when component unmounts to return to prev title
    return () => (document.title = prevTitle);
  }, [title]);
};

export default useTitle;

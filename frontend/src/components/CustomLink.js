// React Router Dom
import { Link } from "react-router-dom";

export default function CustomLink({ urlPath, children, className }) {
  return (
    <Link className={`${className} btn`} to={urlPath}>
      {children}
    </Link>
  );
}

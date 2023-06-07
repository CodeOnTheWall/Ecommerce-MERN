// React Router Dom
import { useParams } from "react-router-dom";
// User Api Slice
import { useGetUserInfoQuery } from "./userApiSlice";

export default function UserSettings() {
  const [getUserInfo] = useGetUserInfoQuery();

  return <div>hi</div>;
}

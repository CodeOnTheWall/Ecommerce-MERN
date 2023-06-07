// help us remain logged in even when we refresh application
// otherwise redux state would be wiped and state wouldnt persist

// because of react 18 strict mode, components mount, unmount, and re mount again
// on initial mount, effectRan useRef value is set to false, in the clean up function, its set to true via useRef. useRef hook allows value to not change
// in between component re renders (nor does it cause component re renders). Component then unmounts, but, the value of true remains on second mount
// this then causes the if inside useEffect to run as the ref value is now true, causing the refresh func to run.

import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { useUserRefreshMutation } from "./userAuthApiSlice";
import { selectCurrentToken } from "./userAuthSlice";
import usePersist from "../../../hooks/usePersist";
import CustomLink from "../../../components/CustomLink";

export default function PersistUserLogin() {
  // true
  const [persist] = usePersist();
  // selectCurrentToken is current access token from state, this should be falsy on a refresh, as redux state is wiped
  const token = useSelector(selectCurrentToken);

  // for strict mode in react 18, inital mount set to false
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  // isUninitialized, the refresh func hasnt been called yet
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useUserRefreshMutation();

  useEffect(() => {
    // this should run after second mount (react18, mounts>unmounts>mounts again)
    // since the effectRan will now be true
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // only want to send rT once, hence only send if effectRan.current === true (second mount via react18)
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          await refresh();
          // to give a bit more time to work for credentials to be set
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      // essentially, on a refresh, aT from redux state (inc rest of redux state) is wiped, but cookie containing rT is still there (if it has time left on its i.e. 7 days)
      // so if no token, which makes sense as redux state was wiped on refresh, and user checked persist off, then run above func
      if (!token && persist) verifyRefreshToken();
    }
    // cleanup func
    // this runs on unmount of first mount as a clean up func. And this value then perists itself to second mount
    // since useRef value stays on component re renders
    return () => (effectRan.current = true);
    // to not get any warnings
    // eslint-disable-next-line
  }, []);

  // need outlet since this wraps other components
  let content;
  if (!persist) {
    // persist: no
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    //persist: yes, token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    //persist: yes, token: no
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <CustomLink urlPath="/user-login">Please login again</CustomLink>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    content = <Outlet />;
  }

  return content;
}

// React
import { useRef, useState, useEffect } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Redux
import { useDispatch } from "react-redux";
// Non Api Employee Auth Slice
import { setEmpCred } from "./empAuthSlice";
// Api User Auth Slice
import { useUserLogoutMutation } from "../UserAuth/userAuthApiSlice";
// apiSlice to interact with rest api
import { useEmpLoginMutation } from "./empAuthApiSlice";
// Hooks
import usePersist from "../../../hooks/usePersist";
// Components
import CustomForm from "../../../components/CustomForm";
import CustomLink from "../../../components/CustomLink";

export default function EmpLogin() {
  // refs to set focus
  const userRef = useRef();
  const errRef = useRef();

  // rtkq will auto track loading state
  const [login, { isLoading, error }] = useEmpLoginMutation();
  const [userLogout] = useUserLogoutMutation();

  // manage state of component
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(error);
  const [persist, setPersist] = usePersist();

  // redux
  const navigate = useNavigate();
  // router
  const dispatch = useDispatch();

  // focuses the input only when component loads (empty dependency [])
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // clear out error message when username or password changes
  // user may have read error, so when they go to continue typing, error should go away
  useEffect(() => {
    setErrMsg("");
    setErrorMsg("");
  }, [username, password]);

  const onLogInSubmit = async (event) => {
    event.preventDefault();
    try {
      await userLogout();
      // passing in username and password into login mutation func which sends these as credentials inside the authApiSlice to /auth
      // this gives us back the aT - can see in redux dev tools
      // unwrap is to be able to access raw error message if error
      const { accessToken } = await login({ username, password }).unwrap();
      // dispatching this aT into setCredentials which sets the frontend state object (the state of our app) to be the passed in aT
      dispatch(setEmpCred({ accessToken }));
      // then clearing fields
      setUsername("");
      setPassword("");
      navigate("/admin");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  // Handlers
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const formFields = {
    errRef: errRef,
    errMsg: errMsg,
    error: errorMsg,
    formTitle: "Employee Login",
  };

  const formLabelAndInputFields = [
    {
      name: "Username",
      label: "Username:",
      type: "text",
      value: username,
      onChange: onUsernameChanged,
      ref: userRef,
      required: true,
    },
    {
      name: "Password",
      label: "Password:",
      type: "password",
      value: password,
      onChange: onPasswordChanged,
      required: true,
    },
    {
      name: "Persist",
      label: "Trust This Device",
      type: "checkbox",
      onChange: handleToggle,
      checked: persist,
    },
  ];

  const buttonInfo = [
    {
      buttonTitle: "Login",
      onButtonClick: onLogInSubmit,
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <section
      className="flex flex-col justify-center items-center w-full
    p-8 sm:p-12 md:p-24 space-y-6"
    >
      <CustomForm
        formFields={formFields}
        formLabelAndInputFields={formLabelAndInputFields}
        canSaveParams={[username, password, !isLoading]}
        buttonInfo={buttonInfo}
      />
      <CustomLink urlPath="/">Back to all products</CustomLink>
    </section>
  );
}

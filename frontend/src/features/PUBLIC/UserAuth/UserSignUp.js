// React
import { useRef, useState, useEffect } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Users Api Slice
import { useCreateNewUserMutation } from "./userApiSlice";
// Hooks
import usePersist from "../../../hooks/usePersist";
// Components
import CustomForm from "../../../components/CustomForm";
import CustomLink from "../../../components/CustomLink";

export default function UserSignUp() {
  // refs to set focus
  const userRef = useRef();
  const errRef = useRef();

  // rtkq will auto track loading state
  const [createNewUser, { isLoading, error }] = useCreateNewUserMutation();

  // manage state of component
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(error);
  const [persist, setPersist] = usePersist();

  // redux
  const navigate = useNavigate();

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

  const onSignUpSubmit = async (event) => {
    event.preventDefault();
    try {
      // passing in username and password into createNewUser mutation func which sends these as credentials inside the authApiSlice to /auth
      // this gives us back the aT - can see in redux dev tools
      // unwrap is to be able to access raw error message if error
      await createNewUser({ username, password }).unwrap();
      setUsername("");
      setPassword("");
      navigate("/user-login");
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
    formTitle: "Sign Up",
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
      buttonTitle: "Sign Up",
      onButtonClick: onSignUpSubmit,
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

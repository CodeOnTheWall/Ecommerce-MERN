// React
import { useState, useEffect } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Users Api Slice
import { useAddNewEmployeeMutation } from "./employeeApiSlice";
// Config
import { PROTECTEDROLES } from "../../../config/protectedRoles";
// Components
import CustomForm from "../../../components/CustomForm";
import CustomLink from "../../../components/CustomLink";

// requirements for user/employee username and pw
// ^ - matches start of string, $ matches end of string length between 3-20
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

export default function NewEmployee() {
  // mutations arnt called right away unlike a query
  const [addNewEmployee, { isLoading, isSuccess, error }] =
    useAddNewEmployeeMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);
  const [selectOpen, setSelectOpen] = useState(false);

  // handlers
  const onUsernameChanged = (event) => setUsername(event.target.value);
  const onPasswordChanged = (event) => setPassword(event.target.value);
  // this approach is because we are allowing more than one option to be selected
  const onRolesChanged = (event) => {
    // console.log(event.target.selectedOptions); - selected options is an html collection which is not an array
    // hence need to convert to an Array using Array.from, which converts from array-like iterables, into an array
    // maping over the options, and returning an array with the values
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };
  const onSelectClick = () => {
    setSelectOpen(true);
  };

  const onSaveEmployeeClicked = async () => {
    // values from useState(s)
    await addNewEmployee({ username, password, roles });
  };

  const formFields = {
    formTitle: "Create New Employee",
    error: error,
  };

  const formLabelAndInputFields = [
    {
      name: "Username",
      label: "Username (3-20 letters):",
      type: "text",
      value: username,
      onChange: onUsernameChanged,
    },
    {
      name: "Password",
      label: "Password (4-12 chars incl. !@#$%):",
      type: "password",
      value: password,
      onChange: onPasswordChanged,
    },
  ];

  const formLabelAndSelectFields = [
    {
      name: "Roles",
      label: "Assigned Roles",
      value: roles,
      onChange: onRolesChanged,
      onClick: onSelectClick,
      selectOpen: selectOpen,
    },
  ];

  const buttonInfo = [
    {
      buttonTitle: "Save new employee",
      onButtonClick: onSaveEmployeeClicked,
    },
  ];

  // as username and pw change, test them with the regex that we defined
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // after calling mutation, if isSuccess, empty form values
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/admin/employees");
    }
  }, [isSuccess, navigate]);

  // Object.values method returns an array of given objects enumerable string-keyed prop values
  // passing in the ROLES object, mapping over to make each an option
  const selectOptions = Object.values(PROTECTEDROLES).map((role) => {
    return (
      // mapping over each role to give an option for each role
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  return (
    <>
      <CustomForm
        canSaveParams={[
          username,
          password,
          validPassword,
          validUsername,
          !isLoading,
        ]}
        formFields={formFields}
        formLabelAndInputFields={formLabelAndInputFields}
        formLabelAndSelectFields={formLabelAndSelectFields}
        selectOptions={selectOptions}
        buttonInfo={buttonInfo}
      />
      <CustomLink urlPath="/admin">Back to admin dashboard</CustomLink>
    </>
  );
}

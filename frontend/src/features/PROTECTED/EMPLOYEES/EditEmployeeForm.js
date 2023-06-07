// React
import { useState, useEffect } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Users Api slice
import {
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "./employeeApiSlice";
// Config
import { PROTECTEDROLES } from "../../../config/protectedRoles";
// Components
import CustomForm from "../../../components/CustomForm";
import CustomLink from "../../../components/CustomLink";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

export default function EditEmployeeForm({ employee }) {
  const [updateEmployee, { isLoading, isSuccess, error }] =
    useUpdateEmployeeMutation();

  const [
    deleteEmployee,
    // re naming since cant have 2 isSuccess etc
    { isSuccess: isDelSuccess, error: delerror },
  ] = useDeleteEmployeeMutation();

  const navigate = useNavigate();

  // username is pre filled via the passed in username
  const [username, setUsername] = useState(employee.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(employee.roles);
  const [active, setActive] = useState(employee.active);
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/admin/employees");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRolesChanged = (e) => {
    const values = Array.from(
      // selectedOptions is html, so have to convert to an array with the values
      // mapping over the options to return the value of those options in an array
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveEmployeeClicked = async () => {
    // checking if I have password so its not required to edit everytime
    if (password) {
      await updateEmployee({
        id: employee.id,
        username,
        password,
        roles,
        active,
      });
      // console.log(user.id);
    } else {
      await updateEmployee({ id: employee.id, username, roles, active });
    }
  };

  // Handlers
  const onDeleteEmployeeClicked = async () => {
    await deleteEmployee({ id: employee.id });
  };
  const onSelectClick = () => {
    setSelectOpen(true);
  };

  // Object.values makes the objects inside an array
  const selectOptions = Object.values(PROTECTEDROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const formFields = {
    error: error || delerror,
    formTitle: "Edit Employee",
  };

  const formLabelAndInputFields = [
    {
      name: "Username",
      label: "Username: [3-20 letters]",
      type: "text",
      value: username,
      onChange: onUsernameChanged,
      required: true,
    },
    {
      name: "Password",
      label: "Password: [empty = no change] [4-12 chars incl. !@#$%]",
      type: "password",
      value: password,
      onChange: onPasswordChanged,
      required: true,
    },
    {
      name: "Employee Actice",
      label: "ACTIVE:",
      type: "checkbox",
      onChange: onActiveChanged,
      checked: active,
    },
  ];

  const formLabelAndSelectFields = [
    {
      name: "Assigned Roles",
      label: "Assigned Roles:",
      value: roles,
      onChange: onRolesChanged,
      onClick: onSelectClick,
      selectOpen: selectOpen,
    },
  ];

  const buttonInfo = [
    {
      buttonTitle: "Save changes",
      onButtonClick: onSaveEmployeeClicked,
    },
    {
      buttonTitle: "Delete Employee",
      onButtonClick: onDeleteEmployeeClicked,
    },
  ];

  let canSaveParams;
  if (password) {
    canSaveParams = [
      roles.length > 0,
      validUsername,
      validPassword,
      !isLoading,
    ];
  } else {
    canSaveParams = [roles.length > 0, validUsername, !isLoading];
  }

  return (
    <>
      <CustomForm
        buttonInfo={buttonInfo}
        canSaveParams={canSaveParams}
        formFields={formFields}
        formLabelAndInputFields={formLabelAndInputFields}
        formLabelAndSelectFields={formLabelAndSelectFields}
        selectOptions={selectOptions}
      />
      <CustomLink urlPath="/admin/employees">Back to employees list</CustomLink>
    </>
  );
}

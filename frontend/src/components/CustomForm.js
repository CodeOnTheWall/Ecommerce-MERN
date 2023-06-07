import PageTitle from "./PageTitle";

export default function CustomForm({
  formFields,
  formLabelAndInputFields,
  formLabelAndSelectFields,
  selectOptions,
  canSaveParams,
  buttonInfo,
}) {
  const { errRef, error, errMsg, formTitle } = formFields;

  // Determine the message to display based on error and errMsg
  const errorMessage = error?.data?.message || errMsg;

  // all have to be Boolean (true) for button to be clicked
  // inc the isLoading so button is disabled while mutation isLoading, so button cant be clicked again
  const canSave = canSaveParams.every(Boolean);

  return (
    <form
      className="flex flex-col items-center justify-center space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* aria-live monitors element for changes, and reads aloud as a screen reader,
        assertive will immediately announce updates */}
      <p ref={errRef} className=" text-red-600" aria-live="assertive">
        {errorMessage}
      </p>
      <PageTitle>{formTitle}</PageTitle>
      {/* disabled is true if !canSave */}
      {formLabelAndInputFields.map((field) => (
        <div className=" space-x-5 " key={field.name}>
          <label key={field.name} htmlFor={field.name}>
            {field.label}
          </label>
          <input
            className=" border border-blue-500 rounded-md"
            ref={field.ref}
            type={field.type}
            id={field.name}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            autoComplete="off"
            required={field.required}
            checked={field.checked}
          />
        </div>
      ))}

      {formLabelAndSelectFields && formLabelAndSelectFields.length > 0
        ? formLabelAndSelectFields.map((selectField) => (
            <div key={selectField.name}>
              <label htmlFor={selectField.name}>{selectField.label}</label>
              <select
                id={selectField.name}
                name={selectField.name}
                multiple={true}
                size={selectField.selectOpen ? 3 : 1}
                value={selectField.value}
                onChange={selectField.onChange}
                onClick={selectField.onClick}
              >
                {selectOptions}
              </select>
            </div>
          ))
        : null}
      {/* if more than 1 button */}
      {buttonInfo.map((button, index) => (
        <button
          className={`btn ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
          key={index}
          disabled={!canSave}
          title={button.buttonTitle}
          onClick={button.onButtonClick}
        >
          {button.buttonTitle}
        </button>
      ))}
    </form>
  );
}

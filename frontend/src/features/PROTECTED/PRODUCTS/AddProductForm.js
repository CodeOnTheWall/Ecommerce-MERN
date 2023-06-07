// React
import { useState, useEffect, useRef } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Product Api Slice
import { useAddNewProductMutation } from "./productApiSlice";
// Components
import CustomForm from "../../../components/CustomForm";
import CustomLink from "../../../components/CustomLink";

export default function AddProductForm() {
  // unlike a query, this wont be called until i call it
  const [addNewProduct, { isLoading, isSuccess, error }] =
    useAddNewProductMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      navigate("/admin/products");
    }
  }, [isSuccess, navigate]);

  // Handlers
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onPriceChanged = (e) => setPrice(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const onSaveProductClicked = async (event) => {
    await addNewProduct({ title, price, description });
  };

  // refs to set focus
  const titleRef = useRef();
  // focuses the input only when component loads (empty dependency [])
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const formFields = {
    formTitle: "New Product Form",
    error: error,
  };

  const formLabelAndInputFields = [
    {
      name: "Title",
      label: "Title:",
      type: "text",
      value: title,
      onChange: onTitleChanged,
      ref: titleRef,
      required: true,
    },
    {
      name: "Price",
      label: "Price:",
      type: "number",
      value: price,
      onChange: onPriceChanged,
      required: true,
    },
    {
      name: "Description",
      label: "Description:",
      type: "text",
      value: description,
      onChange: onDescriptionChanged,
      required: true,
    },
  ];

  const buttonInfo = [
    {
      buttonTitle: "Add new product",
      onButtonClick: onSaveProductClicked,
    },
  ];

  return (
    <>
      <CustomForm
        canSaveParams={[title, price, description, !isLoading]}
        formFields={formFields}
        formLabelAndInputFields={formLabelAndInputFields}
        buttonInfo={buttonInfo}
      />
      <CustomLink urlPath="/admin">Back to admin dashboard</CustomLink>
    </>
  );
}

// React
import { useState, useEffect, useRef } from "react";
// React Router Dom
import { useNavigate } from "react-router-dom";
// Product Api Slice
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "./productApiSlice";
// Components
import CustomForm from "../../../components/CustomForm";

export default function EditProductForm({ product }) {
  const [updateProduct, { isSuccess, error }] = useUpdateProductMutation();
  // cant have 2 isSuccess, hence the renaming
  const [deleteProduct, { isSuccess: isDelSuccess, error: delerror }] =
    useDeleteProductMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      navigate("/admin/products");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onPriceChanged = (e) => setPrice(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);

  const onSaveProductClicked = async (e) => {
    await updateProduct({ title, id: product.id, price, description });
  };
  const onDeleteProductClicked = async () => {
    await deleteProduct({ id: product.id });
  };

  const errMsg = error || delerror;

  // refs to set focus
  const titleRef = useRef();
  // focuses the input only when component loads (empty dependency [])
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const formFields = {
    formTitle: `Edit ${product.title}`,
    errMsg: errMsg,
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
      buttonTitle: "Edit product",
      onButtonClick: onSaveProductClicked,
    },
    {
      buttonTitle: "Delete product",
      onButtonClick: onDeleteProductClicked,
    },
  ];

  return (
    <CustomForm
      canSaveParams={[title, price, description]}
      formFields={formFields}
      formLabelAndInputFields={formLabelAndInputFields}
      buttonInfo={buttonInfo}
    />
  );
}

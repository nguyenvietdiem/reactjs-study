import { ErrorMessage } from "@hookform/error-message";
import { Button } from "antd";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import categoryAPI from "../../api/categoryAPI";
type FieldType = {
  _id?: string;
  name?: string;
  description?: string;
};
const CategoryForm = ({
  selectedCategory,
  isModalOpen,
  isEditing,
  handleCancel,
  fetchData,
}: any) => {
  useEffect(() => {
    if (selectedCategory) {
      setValue("name", selectedCategory.name);
      setValue("description", selectedCategory.description);
      setValue("_id", selectedCategory.id);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setFocus("name");
      }, 100);
    }
  }, [isModalOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FieldType>();

  const onSubmit = async (data: any) => {
    let isError = false;
    try {
      if (isEditing) {
        const updateData: any = {};
        if (data.name !== selectedCategory.name) {
          updateData["name"] = data.name;
        }
        if (data.description !== selectedCategory.description) {
          updateData["description"] = data.description;
        }
        const dataUpdate = {
          _id: data._id,
          ...updateData,
        };
        await categoryAPI.update(dataUpdate);
      } else {
        const dataAPI = {
          name: data.name,
          description: data.description,
        };
        await categoryAPI.add(dataAPI);
      }
    } catch (e) {
      console.log("Error");
      isError = true;
    }

    if (!isError) {
      reset();
      handleCancel();
      fetchData();
    }
  };

  return (
    <form>
      <input type="hidden" {...register("_id")} />
      <div>
        <input {...register("name", { required: "This is required." })} />
        <ErrorMessage errors={errors} name="name" />
      </div>
      <div>
        <input
          {...register("description", { required: "This is required." })}
        />
        <ErrorMessage errors={errors} name="description" />
      </div>
      <Button onClick={handleSubmit(onSubmit)} type="primary">
        Send
      </Button>
    </form>
  );
};
export default CategoryForm;

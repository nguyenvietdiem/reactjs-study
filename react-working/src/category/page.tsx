import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { columns } from "./_features/columns";
import { ErrorMessage } from "@hookform/error-message";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";

type FieldType = {
  _id?: string;
  name?: string;
  description?: string;
};
export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/category"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const showModalEdit = (category: any) => {
    setSelectedCategory(category);
    console.log(category);

    setIsEditing(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (selectedCategory) {
      setValue("name", selectedCategory.name);
      setValue("description", selectedCategory.description);
      setValue("_id", selectedCategory.id);
    }
  }, [selectedCategory]);

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldType>();
  const onSubmit = async (data: any) => {
    try {
      if (isEditing) {
        console.log("edit", data);
        const res = await axios.put(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/category",
          {
            _id: data._id,
            name: data.name,
            description: data.description,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        console.log("add", isEditing);
        const res = await axios.post(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/category",
          {
            name: data.name,
            description: data.description,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (e) {
      console.log("Error");
    }
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Create category
      </Button>
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns({ fetchData, showModalEdit: showModalEdit })}
      />
      <Modal
        title="Create category"
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        open={isModalOpen}
        onCancel={handleCancel}
      >
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
      </Modal>
    </div>
  );
}

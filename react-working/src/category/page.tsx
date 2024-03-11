import { Button, Flex, Modal, Select, Table } from "antd";
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
  const [selectedValue, setSelectedValue] = useState("all");

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
        const updateData:any = {};
        if (data.name !== selectedCategory.name) {
          updateData["name"] = data.name;
        }
        if (data.description !== selectedCategory.description) {
          updateData["description"] = data.description;
        }
        const res = await axios.put(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/category",
          {
            _id: data._id,
            ...updateData,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
      } else {
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

  const handleChangeSelect = (value: any) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <Flex justify="space-between">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create category
        </Button>
        <Select
          defaultValue="All"
          style={{ width: 120 }}
          onChange={handleChangeSelect}
          options={[
            { value: "all", label: "All" },
            { value: "ON", label: "ON" },
            { value: "OFF", label: "OFF" },
          ]}
        />
      </Flex>
      <Table
        rowKey="_id"
        dataSource={
          selectedValue === "all"
            ? data
            : data.filter((item: any) => item.status === selectedValue)
        }
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

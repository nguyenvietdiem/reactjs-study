import { Button, Flex, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { columns } from "./_features/columns";
import { PlusOutlined } from "@ant-design/icons";
import categoryAPI from "../api/categoryAPI";
import TableCommon from "../component/Table/Table";
import ModalForm from "../component/Modal/Modal";
import CategoryForm from "../component/Form/CateogryForm";

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");

  const fetchData = async () => {
    try {
      const params: any = {};
      if (status && status !== "all") {
        params.status = status;
      }
      const categoryList: any = await categoryAPI.getAll(params);
      setData(categoryList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const showModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModalEdit = (category: any) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleChangeSelect = (value: any) => {
    setStatus(value);
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
      <TableCommon
        rowKey="_id"
        data={data}
        columns={columns({ fetchData, showModalEdit: showModalEdit })}
      />
      <ModalForm
        title={isEditing ? "Edit category" : "Create category"}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <CategoryForm
          isModalOpen={isModalOpen}
          selectedCategory={selectedCategory}
          isEditing={isEditing}
          handleCancel={handleCancel}
          fetchData={fetchData}
        />
      </ModalForm>
    </div>
  );
}

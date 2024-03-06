import { Button, Flex, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { columns } from "./_features/columns";
import { PlusOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
type FieldType = {
  _id?: string;
  categoryId?: string;
  productName?: string;
  price?: any;
  productFormat?: any;
  productDescription?: string;
  quantity?: any;
  inStock?: any;
  cost?: any;
  note?: string;
};
export default function ProductPage() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/product"
      );
      setData(res.data);
    } catch {
      console.log("Error");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldType>();

  return (
    <div>
      <Flex justify="space-between">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          New product
        </Button>
      </Flex>
      <Table rowKey="_id" dataSource={data} columns={columns()} />

      <Modal
        title="Create product"
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <form>
          <div className="form-item">
            <label htmlFor="">Name *</label>
            <input
              {...register("productName", { required: "This is required." })}
            />
            <ErrorMessage errors={errors} name="productName" />
          </div>
        </form>
      </Modal>
    </div>
  );
}

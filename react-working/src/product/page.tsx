import { Button, Flex, Modal, Table, Upload, UploadFile } from "antd";
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
  productImage?: string;
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
  const [dataCategory, setDataCategory] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
  const fetchDataCategory = async () => {
    try {
      const resCate = await axios.get(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/category"
      );
      setDataCategory(resCate.data);
    } catch {
      console.log("Error");
    }
  };
  useEffect(() => {
    fetchData();
    fetchDataCategory();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
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

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/product",
        {
          productName: data.productName,
          categoryId: data.categoryId,
          price: data.price,
          productFormat: data.productFormat,
          productDescription: data.productDescription,
          quantity: data.quantity,
          productImage:
            "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
          inStock: data.inStock,
          cost: data.cost,
          note: data.note,
        }
      );
      console.log(res);

      if (res) {
        reset();
        setIsModalOpen(false);
        fetchData();
      }
    } catch {
      console.log("Error");
    }
  };
  const uploadButton = (
    <button type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
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
          <div className="form-item">
            <label htmlFor="">Category *</label>
            <select {...register("categoryId")}>
              {dataCategory.map((category: any) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ErrorMessage errors={errors} name="productName" />
          </div>
          <div className="form-item">
            <label htmlFor="">Type/Color</label>
            <textarea
              {...register("productFormat")}
              placeholder="Nhập mỗi loại nằm trên một dòng"
            ></textarea>
          </div>
          <div className="form-item">
            <label htmlFor="">Description</label>
            <textarea
              {...register("productDescription")}
              placeholder="Nội dung"
            ></textarea>
          </div>
          <div className="form-item">
            <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              fileList={fileList}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </div>
          <div className="form-item">
            <label htmlFor="">Quantity</label>
            <input {...register("quantity")} placeholder="0" />
          </div>
          <div className="form-item">
            <label htmlFor="">Cost</label>
            <input {...register("cost")} placeholder="0" />
          </div>
          <div className="form-item">
            <label htmlFor="">Price</label>
            <input {...register("price")} placeholder="0" />
          </div>
          <div className="form-item">
            <label htmlFor="">InStock</label>
            <input {...register("inStock")} placeholder="0" />
          </div>
          <div className="form-item">
            <label htmlFor="">Note *</label>
            <input
              {...register("note", { required: "This is required." })}
              placeholder="Thêm mới"
            />
            <ErrorMessage errors={errors} name="note" />
          </div>
          <Button onClick={handleSubmit(onSubmit)} type="primary">
            Send
          </Button>
        </form>
      </Modal>
    </div>
  );
}

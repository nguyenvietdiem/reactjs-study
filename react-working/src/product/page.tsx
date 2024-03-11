import {
  Button,
  Flex,
  Input,
  Modal,
  Select,
  Table,
  Upload,
  UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { columns } from "./_features/columns";
import { PlusOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { NavigationType } from "react-router-dom";
import { useDebounce } from "use-debounce";
type FieldType = {
  _id?: string;
  categoryId?: string;
  productName?: string;
  productImage?: string;
  price?: string;
  productFormat?: string;
  productDescription?: string;
  quantity?: number;
  inStock?: boolean;
  cost?: string;
  note?: string;
};
export default function ProductPage() {
  const [data, setData] = useState([]);
  const [dataCategory, setDataCategory] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [inStockChecked, setInStockChecked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedValueStatus, setSelectedValueStatus] = useState("all");
  const [selectedValueCategory, setSelectedValueCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedValue] = useDebounce(searchKeyword, 300);

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
    setIsEditing(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalEdit = (product: any) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockChecked(e.target.checked);
  };

  useEffect(() => {
    if (selectedProduct) {
      setValue("_id", selectedProduct.id);
      setValue("productName", selectedProduct.productName);
      setValue("categoryId", selectedProduct.categoryId);
      setValue("productFormat", selectedProduct.productFormat);
      setValue("productDescription", selectedProduct.productDescription);
    }
  }, [selectedProduct]);
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
        const updateData: any = {};
        if (data.productName !== selectedProduct.productName) {
          updateData["productName"] = data.productName;
        }
        const productFormatArray = data.productFormat.split("\n");
        const res = await axios.put(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/product",
          {
            _id: data._id,
            productFormat: productFormatArray,
            productDescription: data.productDescription,
            categoryId: data.categoryId,
            productImage:
              "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
            ...updateData,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const productFormatArray = data.productFormat.split("\n");
        const res = await axios.post(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/product",
          {
            productName: data.productName,
            categoryId: data.categoryId,
            price: data.price,
            productFormat: productFormatArray,
            productDescription: data.productDescription,
            quantity: data.quantity,
            productImage:
              "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
            inStock: inStockChecked,
            cost: data.cost,
            note: data.note,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
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

  const handleChangeSelect = (value: any) => {
    setSelectedValueStatus(value);
  };

  const handleChangeSelectCategory = (value: any) => {
    setSelectedValueCategory(value);
  };

  const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div>
      <Flex justify="space-between">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          New product
        </Button>
        <div>
          <Select
            defaultValue="All category"
            style={{ width: 250 }}
            onChange={handleChangeSelectCategory}
          >
            <Select.Option value="all" key="all">
              All category
            </Select.Option>
            {dataCategory.map((category: any) => (
              <Select.Option value={category._id} key={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
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

          <Input.Search
            placeholder="Search name product"
            onChange={handelSearch}
            style={{ width: 200 }}
          />
        </div>
      </Flex>
      <Table
        rowKey="_id"
        dataSource={
          selectedValueStatus === "all"
            ? selectedValueCategory === "all"
              ? searchKeyword === ""
                ? data
                : data.filter((item: any) =>
                    item.productName
                      .toLowerCase()
                      .includes(debouncedValue.toLowerCase())
                  )
              : data.filter(
                  (item: any) =>
                    item.category._id === selectedValueCategory &&
                    item.productName
                      .toLowerCase()
                      .includes(debouncedValue.toLowerCase())
                )
            : data.filter(
                (item: any) =>
                  item.status === selectedValueStatus &&
                  item.productName
                    .toLowerCase()
                    .includes(debouncedValue.toLowerCase())
              )
        }
        columns={columns({ fetchData, showModalEdit: showModalEdit })}
      />

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
          <input type="hidden" {...register("_id")} />
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
            <ErrorMessage errors={errors} name="categoryId" />
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

          <div style={{ display: isEditing ? "none" : "block" }}>
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
              <input
                {...register("inStock")}
                type="checkbox"
                checked={inStockChecked}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className="form-item">
              <label htmlFor="">Note *</label>
              <input
                {...register("note", {
                  required: isEditing ? false : "This is required.",
                })}
                placeholder="Thêm mới"
              />
              <ErrorMessage errors={errors} name="note" />
            </div>
          </div>
          <Button onClick={handleSubmit(onSubmit)} type="primary">
            Send
          </Button>
        </form>
      </Modal>
    </div>
  );
}

import { Button, Flex, Input, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { columns } from "./_features/columns";
import { PlusOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
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
  const [inStockChecked, setInStockChecked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageData, setImageData] = useState<any>("");
  const [debouncedValue] = useDebounce(productName, 600);

  const fetchData = async () => {
    try {
      let url =
        "https://pod-system-api-git-develop-sontran.vercel.app/api/product";
      let queryParams = [];
      if (status !== "all" && status !== "") {
        queryParams.push(`status=${status}`);
      }
      if (categoryId !== "all" && categoryId !== "") {
        queryParams.push(`categoryId=${categoryId}`);
      }
      if (productName !== "") {
        queryParams.push(`productName=${productName}`);
      }
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }
      const res = await axios.get(url);
      setData(res.data);
    } catch (error) {
      console.log("Error:", error);
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
  }, [status, categoryId, debouncedValue]);

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
    setIsEditing(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setImageData("");
  };

  const showModalEdit = (product: any) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
    setIsEditing(true);
    setImageData(product.productImage);
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInStockChecked(e.target.checked);
  };

  useEffect(() => {
    if (selectedProduct) {
      setValue("_id", selectedProduct.id);
      setValue("productName", selectedProduct.productName);
      setValue("categoryId", selectedProduct.categoryId);
      setValue("productFormat", selectedProduct.productFormat.join("\n"));
      setValue("productDescription", selectedProduct.productDescription);
    }
  }, [selectedProduct]);
  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm<FieldType>();

  const onSubmit = async (data: any) => {
    try {
      if (isEditing) {
        const updateData: any = {};
        if (data.productName !== selectedProduct.productName) {
          updateData["productName"] = data.productName;
        }
        const res = await axios.put(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/product",
          {
            _id: data._id,
            categoryId: data.categoryId,
            productFormat: data.productFormat,
            productDescription: data.productDescription,
            productImage: imageData,
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
        const quantityProduct = data.quantity === "" ? 0 : data.quantity;
        const priceProduct = data.price === "" ? 0 : data.price;
        const costProduct = data.cost === "" ? 0 : data.cost;
        const res = await axios.post(
          "https://pod-system-api-git-develop-sontran.vercel.app/api/product",
          {
            productName: data.productName,
            categoryId: data.categoryId,
            price: priceProduct,
            productFormat: productFormatArray,
            productDescription: data.productDescription,
            quantity: quantityProduct,
            productImage: imageData,
            inStock: inStockChecked,
            cost: costProduct,
            note: data.note,
          }
        );
        if (res) {
          reset();
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (error: any) {
      console.log(error.toString());
    }
  };

  const handleStatusChange = (value: any) => {
    setStatus(value);
  };
  const handleCategoryChange = (value: any) => {
    setCategoryId(value);
  };

  const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handleUploadImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await axios.post(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/image/upload",
        {
          image: reader.result,
          fileName: file.name,
        }
      );
      setImageData(res.data.url);
      console.log(imageData);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setFocus("productName");
      }, 100);
    }
  }, [isModalOpen]);

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
            onChange={handleCategoryChange}
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
            onChange={handleStatusChange}
            options={[
              { value: "all", label: "All" },
              { value: "ON", label: "ON" },
              { value: "OFF", label: "OFF" },
            ]}
          />

          <Input.Search
            onChange={handelSearch}
            placeholder="Search name product"
            style={{ width: 200 }}
          />
        </div>
      </Flex>
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns({ fetchData, showModalEdit: showModalEdit })}
      />

      <Modal
        title={isEditing ? "Edit Product" : "Create product"}
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
            <select
              defaultValue=""
              {...register("categoryId", { required: true })}
            >
              <option value="" disabled>
                Select category
              </option>
              {dataCategory.map((category: any) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span>This field is required</span>}
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
            <input
              type="file"
              id="image"
              accept=".png, .jpg, .jpeg"
              onChange={handleUploadImage}
            />
          </div>
          {imageData ? (
            <div className="form-item">
              <img src={imageData} alt="" width={100} height={100} />
            </div>
          ) : null}

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

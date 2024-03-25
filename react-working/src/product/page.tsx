import { Button, Flex, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { columns } from "./_features/columns";
import { PlusOutlined } from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import categoryAPI from "../api/categoryAPI";
import productAPI from "../api/productAPI";
import imageAPI from "../api/imageAPI";
import TableCommon from "../component/Table/Table";
import ModalForm from "../component/Modal/Modal";
import ProductForm from "../component/Form/ProductForm";

export default function ProductPage() {
  const [data, setData] = useState([]);
  const [dataCategory, setDataCategory] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageData, setImageData] = useState<any>("");
  const [imageDelete, setImageDelete] = useState("");
  const [debouncedValue] = useDebounce(productName, 600);

  const fetchData = async () => {
    const params: any = {
      status,
      categoryId,
      productName,
    };

    const res: any = await productAPI.getAll(params);
    setData(res);
  };
  const fetchDataCategory = async () => {
    const resCate = await categoryAPI.getAll();
    setDataCategory(resCate);
  };
  useEffect(() => {
    fetchData();
    fetchDataCategory();
  }, [status, categoryId, debouncedValue]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    if (imageDelete) {
      deleteImageUpload(imageDelete);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    setImageData("");
  };

  const showModalEdit = (product: any) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
    setImageData(product.productImage[0] !== "" ? product.productImage : "");
  };

  const handleStatusChange = (value: any) => {
    setStatus(value === "all" ? "" : value);
  };
  const handleCategoryChange = (value: any) => {
    setCategoryId(value === "all" ? "" : value);
  };

  const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const deleteImageUpload = async (imageLink: any) => {
    const param = {
      fileName: imageLink,
    };
    await imageAPI.delete(param);
    const dataAPI = {
      _id: selectedProduct.id,
      categoryId: selectedProduct.categoryId,
      productImage: "",
    };
    await productAPI.update(dataAPI);
    setImageDelete("");
    fetchData();
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

      <TableCommon
        rowKey="_id"
        data={data}
        columns={columns({ fetchData, showModalEdit: showModalEdit })}
      />

      <ModalForm
        title={selectedProduct ? "Edit Product" : "Create product"}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <ProductForm
          isModalOpen={isModalOpen}
          dataCategory={dataCategory}
          handleCancel={handleCancel}
          fetchData={fetchData}
          selectedProduct={selectedProduct}
          imageData={imageData}
          imageDelete={imageDelete}
          deleteImageUpload={deleteImageUpload}
          setImageData={setImageData}
          setImageDelete={setImageDelete}
          setIsModalOpen={setIsModalOpen}
          setSelectedProduct={setSelectedProduct}
        />
      </ModalForm>
    </div>
  );
}

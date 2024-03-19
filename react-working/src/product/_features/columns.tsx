import { Button, Switch } from "antd";
import moment from "moment";
import productAPI from "../../api/productAPI";

const onChange = async (checked: string, id: string, fetchData: Function) => {
  const param = {
    _id: id,
    status: checked,
  };
  await productAPI.update(param);
  fetchData();
};
export const columns = ({ fetchData, showModalEdit }: any) => {
  return [
    {
      title: "Product name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (value: string, record: any) => (
        <img
          src={record.productImage ? record.productImage[0] : ""}
          width={100}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: any) => category.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string, record: any) => (
        <Switch
          checkedChildren="ON"
          unCheckedChildren="OFF"
          defaultChecked={value === "ON" ? true : false}
          onChange={() => {
            onChange(value === "ON" ? "OFF" : "ON", record._id, fetchData);
          }}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string, record: any) =>
        moment(value).format("YYYY/MM/DD"),
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record: any) =>
        moment(value).format("YYYY/MM/DD"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: any, record: any) => (
        <Button
          type="primary"
          onClick={() => {
            showModalEdit({
              id: record._id,
              productName: record.productName,
              productFormat: record.productFormat,
              productImage: record.productImage,
              productDescription: record.productDescription,
              categoryId: record.category._id,
            });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];
};

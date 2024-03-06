import { Button, Switch } from "antd";
import moment from "moment";

export const columns = () => {
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
        <img src={record.productImage[0]} width={100} />
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
          //   onChange={() => {
          //     onChange(value === "ON" ? "OFF" : "ON", record._id, fetchData);
          //   }}
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
      render: (value: any, record: any) => <Button type="primary">Edit</Button>,
    },
  ];
};

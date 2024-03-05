import { Button, Flex, Switch } from "antd";
import axios from "axios";
import moment from "moment";

const onChange = async (checked: string, id: string, fetchData: Function) => {
  const res = await axios.put(
    "https://pod-system-api-git-develop-sontran.vercel.app/api/category",
    {
      _id: id,
      status: checked,
    }
  );
  fetchData();
};

export const columns = ({ fetchData, showModalEdit }: any) => {
  return [
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (value: string, record: any) => (
        <Switch
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
          onClick={(event: React.MouseEvent<HTMLDivElement>) =>
            showModalEdit({
              event,
              id: record._id,
              name: record.name,
              description: record.description,
            })
          }
        >
          Edit
        </Button>
      ),
    },
  ];
};

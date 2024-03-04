import { Button, Flex, Switch } from "antd";
import moment from "moment";

const onChange = (checked) => {
  console.log(checked);
};

export const columns = () => {
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
          onChange={onChange}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string, record: any) => moment().format("MM DD YYYY"),
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record: any) => moment().format("MM DD YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: any, record: any) => (
        <Flex gap="small" wrap="wrap">
          <Button type="primary">Edit</Button>
          <Button danger>Delete</Button>
        </Flex>
      ),
    },
  ];
};

import { Button, Switch } from "antd";
import moment from "moment";
import categoryAPI from "../../api/categoryAPI";

const onChange = async (checked: string, id: string, fetchData: Function) => {
  const param = {
    _id: id,
    status: checked,
  };
  await categoryAPI.update(param);
  fetchData();
};
const momentDateFormat = (value: any) => {
  return moment(value).format("YYYY/MM/DD");
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
      render: (value: string, record: any) => momentDateFormat(value),
    },
    {
      title: "Update At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: string, record: any) => momentDateFormat(value),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: any, record: any) => (
        <Button type="primary" onClick={() => showModalEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];
};

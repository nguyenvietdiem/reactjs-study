import { Table } from "antd";

const TableCommon = ({ rowKey, data, columns }: any) => {
  return <Table rowKey={rowKey} dataSource={data} columns={columns} />;
};

export default TableCommon;

import { Table } from "antd";

const TableCommon = ({ data, columns, fetchData, showModalEdit }: any) => {
  return (
    <Table
      rowKey="_id"
      dataSource={data}
      columns={columns({ fetchData, showModalEdit: showModalEdit })}
    />
  );
};

export default TableCommon;

import { Table } from "antd";

const TableCommon = ({
  rowKey,
  data,
  columns,
  fetchData,
  showModalEdit,
}: any) => {
  return (
    <Table
      rowKey={rowKey}
      dataSource={data}
      columns={columns({ fetchData, showModalEdit: showModalEdit })}
    />
  );
};

export default TableCommon;

import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { columns } from "./_features/columns";

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://pod-system-api-git-develop-sontran.vercel.app/api/category"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <Table rowKey="_id" dataSource={data} columns={columns()} />;
}

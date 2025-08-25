import React, { useRef, useState } from "react";
import { Button, Drawer, message, Select, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { orderAPI } from "../../services/api";
import { orderStatuses, type Order } from "../../types";

import OrderSummary from "../../components/OrderSummary";
import SmartTable, {
  type SmartTableRef,
} from "../../components/Admin/SmartTable";

const { Option } = Select;
const { Title } = Typography;

const OrderPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const tableRef = useRef<SmartTableRef>(null);

  const refetchOrders = () => {
    tableRef.current?.refetch();
  };

  const fetchOrders = async (params: any) => {
    const response = await orderAPI.getAll(params);

    return {
      data: response.data.orders,
      total: response.data.pagination.total,
    };
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      message.success("Order status updated successfully");
      refetchOrders();
    } catch (error) {
      console.error(error);
      message.error("Failed to update order status");
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerVisible(true);
  };

  const tableColumns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleUpdateOrderStatus(record.id, value)}
        >
          {orderStatuses.map((orderStatus) => (
            <Option key={orderStatus} value={orderStatus}>
              {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
            </Option>
          ))}
        </Select>
      ),
      filters: orderStatuses.map((status) => ({
        text: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date: string) => dayjs(date).format("MMM DD, YYYY h:mm A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Order) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Orders</Title>
      <SmartTable<Order>
        ref={tableRef}
        columns={tableColumns}
        searchableColumns={["id", "name", "email"]}
        onFetchData={fetchOrders}
      />
      <Drawer
        title="Order Details"
        width={600}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {selectedOrder && <OrderSummary order={selectedOrder} />}
      </Drawer>
    </>
  );
};

export default OrderPage;

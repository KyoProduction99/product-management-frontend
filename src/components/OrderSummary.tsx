import React from "react";
import { Link } from "react-router-dom";
import { Descriptions, Tag, Col, Image, Row, Table, Typography } from "antd";
import dayjs from "dayjs";

import { getImageUrl } from "../utils/image";
import type { CartItem, Product, Order } from "../types";

const { Text } = Typography;

const OrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  const tableColumns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: Product) => (
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Image
              alt={product.name}
              src={getImageUrl(product.imageUrl)}
              crossOrigin="anonymous"
              style={{ width: 72, height: 72, objectFit: "cover" }}
            />
          </Col>
          <Col>
            <Link to={`/products/${product.id}`}>
              <Text strong>{product.name}</Text>
            </Link>
            <br />
            <Text type="secondary">${product.price.toFixed(2)}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (record: CartItem) => (
        <Text strong style={{ whiteSpace: "nowrap" }}>
          ${(record.product.price * record.quantity).toFixed(2)}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <Descriptions size="small" bordered column={1}>
        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{order.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
        <Descriptions.Item label="Contact Number">
          {order.contact}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {order.address}, {order.zipCode} {order.city}, {order.state}.
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          ${order.totalAmount.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Order Date">
          {dayjs(order.createdAt).format("MMMM DD, YYYY h:mm A")}
        </Descriptions.Item>
      </Descriptions>

      {order.items && (
        <div style={{ marginTop: 24 }}>
          <Table
            rowKey="id"
            dataSource={order.items}
            columns={tableColumns}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

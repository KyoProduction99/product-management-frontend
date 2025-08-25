import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Empty, Result, Skeleton } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import { orderAPI } from "../services/api";
import type { Order } from "../types";
import OrderSummary from "../components/OrderSummary";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/", { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        const response = await orderAPI.getById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!order) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Order not found."
        >
          <Button type="primary">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <>
      <Result
        status="success"
        title="Order Placed Successfully!"
        icon={<CheckCircleOutlined />}
      />

      <OrderSummary order={order} />

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Link to="/">
          <Button type="primary">Continue Shopping</Button>
        </Link>
      </div>
    </>
  );
};

export default OrderSuccessPage;

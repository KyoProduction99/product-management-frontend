import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../contexts/CartContext";
import { orderAPI } from "../services/api";
import type { CreateOrderRequest } from "../types";

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, emptyCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      message.warning("Your shopping cart is empty.");
      navigate("/cart", { replace: true });
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const savedShippingInfo = localStorage.getItem("shippingInfo");
    if (savedShippingInfo) {
      try {
        form.setFieldsValue(JSON.parse(savedShippingInfo));
      } catch (error) {
        console.error("Error loading shipping info from localStorage:", error);
      }
    }
  }, [form]);

  const handleSubmit = async (values: CreateOrderRequest) => {
    setIsLoading(true);
    localStorage.setItem("shippingInfo", JSON.stringify(values));

    try {
      const response = await orderAPI.create({
        ...values,
        items: cartItems.map((cartItem) => ({
          productId: cartItem.id,
          quantity: cartItem.quantity,
        })),
      });

      message.success("Order placed successfully!");
      emptyCart();
      navigate(`/order-success/${response.data.order.id}`, { replace: true });
    } catch (error) {
      message.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : "Failed to place order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = getTotalPrice();

  return (
    <>
      <Title level={2}>Checkout</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Title level={4}>Shipping Information</Title>

              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="contact"
                label="Contact Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your contact number",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Contact number must contain digits only",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="zipCode"
                    label="Zip Code"
                    rules={[
                      { required: true, message: "Please enter your Zip code" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      { required: true, message: "Please enter your city" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[
                      { required: true, message: "Please enter your state" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                block
              >
                Place Order
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Summary">
            {cartItems.map((item) => (
              <Row
                key={item.id}
                justify="space-between"
                style={{ marginBottom: 8 }}
              >
                <Col span={16}>
                  <Text>
                    {item.product.name} × {item.quantity}
                  </Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Text>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </Col>
              </Row>
            ))}

            <Divider />

            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Subtotal:</Text>
              <Text>${getTotalPrice().toFixed(2)}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Shipping Fee:</Text>
              <Text>Free</Text>
            </Row>

            <Divider />

            <Row justify="space-between">
              <Title level={4}>Total:</Title>
              <Title level={4} style={{ marginTop: 0 }}>
                ${totalAmount.toFixed(2)}
              </Title>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CheckoutPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Layout, message, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { useAuth } from "../../contexts/AuthContext";

const { Content } = Layout;
const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const isSuccess = await login(values.email, values.password);
      if (isSuccess) {
        message.success("Login successful!");
        navigate("/admin/orders", { replace: true });
      } else {
        message.error("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      message.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            Admin Login
          </Title>

          <Form
            name="login"
            size="large"
            autoComplete="off"
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;

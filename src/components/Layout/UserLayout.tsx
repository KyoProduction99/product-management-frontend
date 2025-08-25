import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Layout, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

import { useCart } from "../../contexts/CartContext";
import { HeaderContainer, ContentContainer } from "./UserLayoutStyles";

const { Footer } = Layout;

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderContainer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginRight: 40,
            }}
          >
            <Link to="/" style={{ color: "black", textDecoration: "none" }}>
              My Store
            </Link>
          </div>
        </div>

        <Space size="middle">
          <Badge count={cartItemCount} showZero={false}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate("/cart")}
            >
              Cart
            </Button>
          </Badge>
        </Space>
      </HeaderContainer>

      <ContentContainer>
        <div
          style={{
            background: "#fff",
            padding: 24,
            minHeight: "100%",
            marginTop: 16,
          }}
        >
          {children}
        </div>
      </ContentContainer>

      <Footer style={{ textAlign: "center", background: "#f0f0f0" }}>
        © {new Date().getFullYear()} My Store | All rights reserved.
      </Footer>
    </Layout>
  );
};

export default GuestLayout;

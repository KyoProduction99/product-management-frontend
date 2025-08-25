import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Button, Drawer, Layout, Menu, Typography } from "antd";
import {
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../contexts/AuthContext";

const { Content, Sider, Header } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { logout } = useAuth();

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/orders")) return "orders";
    if (path.includes("/admin/products")) return "products";
    return "orders";
  };

  const activeTab = getCurrentTab();

  const menuItems = [
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: "Orders",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Products",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/admin/${key}`);
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: isMobile ? "100vh" : "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Admin Panel
        </Title>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[activeTab]}
          onClick={handleMenuClick}
          style={{ borderRight: 0, height: "100%" }}
        />
      </div>

      <div
        style={{
          padding: 8,
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            width: "100%",
            height: 40,
            justifyContent: "flex-start",
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              background: "white",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Admin Panel
            </Title>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
            />
          </Header>
          <Drawer
            placement="left"
            title={null}
            closable={false}
            open={drawerVisible}
            width={250}
            styles={{ body: { padding: 0 } }}
            onClose={() => setDrawerVisible(false)}
          >
            <SidebarContent />
          </Drawer>
        </>
      ) : (
        <Sider width={250} style={{ background: "white" }}>
          <SidebarContent />
        </Sider>
      )}

      <Layout>
        <Content
          style={{
            background: "white",
            margin: 16,
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

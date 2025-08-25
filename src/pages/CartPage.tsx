import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Image,
  Modal,
  message,
  Row,
  Space,
  Skeleton,
  Table,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useCart } from "../contexts/CartContext";
import { productAPI } from "../services/api";
import { getImageUrl } from "../utils/image";
import type { CartItem, Product } from "../types";

import QuantityControl from "../components/QuantityControl";

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    cartItems,
    updateQuantity,
    updateCartItems,
    removeFromCart,
    emptyCart,
  } = useCart();

  const [isInit, setIsInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStockIssues, setHasStockIssues] = useState(false);

  useEffect(() => {
    const fetchProductsData = async () => {
      if (cartItems.length === 0 || isInit) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const productIds = cartItems.map((item) => item.product.id);
        const response = await productAPI.getAll({
          ids: productIds.join(","),
          limit: productIds.length,
        });

        const products = response.data.products;
        const newCartItems = cartItems.map((cartItem) => {
          const product = products.find((product) => product.id == cartItem.id);
          return {
            ...cartItem,
            product: { ...cartItem.product, stock: product?.stock || 0 },
          };
        });
        updateCartItems(newCartItems);
        setIsInit(true);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch latest products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsData();
  }, [isInit, cartItems, updateCartItems]);

  useEffect(() => {
    let stockIssues = false;

    cartItems.forEach((cartItem) => {
      if (
        cartItem.product.stock === 0 ||
        cartItem.quantity > cartItem.product.stock
      ) {
        stockIssues = true;
      }
    });

    setHasStockIssues(stockIssues);
  }, [cartItems]);

  const handleEmptyCart = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will remove all products from your shopping cart.",
      okText: "Yes, empty it",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        emptyCart();
      },
    });
  };

  const handleQuantityDecrease = (productId: string, quantity: number) => {
    if (quantity > 0) updateQuantity(productId, quantity - 1);
  };

  const handleQuantityIncrease = (
    productId: string,
    quantity: number,
    stock: number
  ) => {
    if (quantity < stock) updateQuantity(productId, quantity + 1);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    message.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return message.warning("Your shopping cart is empty.");
    }

    if (hasStockIssues) {
      return message.warning("Please resolve stock issues.");
    }

    navigate("/checkout");
  };

  const getStockStatus = (item: CartItem) => {
    if (item.product.stock === 0) {
      return <Tag color="red">Out of Stock</Tag>;
    }

    if (item.quantity > item.product.stock) {
      return (
        <Tag color="orange">Limited Stock ({item.product.stock} available)</Tag>
      );
    }
    return null;
  };

  const tableColumns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: Product, record: CartItem) => (
        <Row gutter={16} align="middle">
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
            <br />
            {getStockStatus(record)}
          </Col>
        </Row>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: CartItem) => (
        <QuantityControl
          quantity={quantity}
          max={record.product.stock}
          onDecrease={() => handleQuantityDecrease(record.id, quantity)}
          onIncrease={() =>
            handleQuantityIncrease(record.id, quantity, record.product.stock)
          }
          onChange={(value: number) => handleQuantityChange(record.id, value)}
        />
      ),
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
    {
      title: "Action",
      key: "action",
      render: (record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id, record.product.name)}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Skeleton />;
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Your shopping cart is empty."
        >
          <Button type="primary">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Title level={2}>Shopping Cart</Title>

      {hasStockIssues && (
        <Alert
          type="warning"
          message="Stock Issues Detected"
          description="Some products in your cart have stock limitations. Please review and adjust quantities before checkout."
          showIcon
          closable
        />
      )}

      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button>
          <Link to="/">Continue Shopping</Link>
        </Button>
        <Button danger onClick={handleEmptyCart}>
          Empty Cart
        </Button>
      </Space>

      {isMobile ? (
        <div>
          {cartItems.map((item) => (
            <Card key={item.id} style={{ marginBottom: 16 }} size="small">
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <Image
                    alt={item.product.name}
                    src={getImageUrl(item.product.imageUrl)}
                    crossOrigin="anonymous"
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                </Col>
                <Col span={16}>
                  <Space
                    direction="vertical"
                    style={{ justifyContent: "space-between", height: "100%" }}
                  >
                    <Space direction="vertical" size={2}>
                      <Link to={`/products/${item.product.id}`}>
                        <Text strong>{item.product.name}</Text>
                      </Link>
                      <Text type="secondary">
                        ${item.product.price.toFixed(2)}
                      </Text>
                      {getStockStatus(item)}
                    </Space>

                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <QuantityControl
                        quantity={item.quantity}
                        max={item.product.stock}
                        onDecrease={() =>
                          handleQuantityDecrease(item.id, item.quantity)
                        }
                        onIncrease={() =>
                          handleQuantityIncrease(
                            item.id,
                            item.quantity,
                            item.product.stock
                          )
                        }
                        onChange={(value: number) =>
                          handleQuantityChange(item.id, value)
                        }
                      />

                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          handleRemoveItem(item.id, item.product.name)
                        }
                      />
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          rowKey="id"
          dataSource={cartItems}
          columns={tableColumns}
          pagination={false}
        />
      )}

      <Button
        type="primary"
        size="large"
        block
        disabled={hasStockIssues}
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </Button>
    </Space>
  );
};

export default CartPage;

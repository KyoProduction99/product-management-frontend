import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Empty,
  Image,
  message,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

import { useCart } from "../contexts/CartContext";
import { productAPI } from "../services/api";
import { getImageUrl } from "../utils/image";
import type { Product } from "../types";

import QuantityControl from "../components/QuantityControl";

const { Title, Text, Paragraph } = Typography;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await productAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      message.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (!product) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Product not found."
        >
          <Link to="/">
            <Button type="primary">Continue Shopping</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} md={12} style={{ textAlign: "center" }}>
        <Image
          alt={product.name}
          src={getImageUrl(product.imageUrl)}
          crossOrigin="anonymous"
          style={{
            width: "100%",
            maxHeight: 500,
            objectFit: "cover",
          }}
        />
      </Col>

      <Col xs={24} md={12}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Tag>{product.category}</Tag>
            <Title level={1} style={{ marginTop: 16 }}>
              {product.name}
            </Title>
            <Paragraph>{product.description}</Paragraph>
          </div>

          <Row gutter={[32, 32]} align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                ${product.price.toFixed(2)}
              </Title>
            </Col>
            <Col>
              {product.stock > 0 ? (
                <QuantityControl
                  quantity={quantity}
                  max={product.stock}
                  onDecrease={handleQuantityDecrease}
                  onIncrease={handleQuantityIncrease}
                  onChange={(value: number) => setQuantity(value || 1)}
                />
              ) : (
                <Text type="danger" strong>
                  Out Of Stock
                </Text>
              )}
            </Col>
          </Row>

          <Button
            block
            type="primary"
            size="large"
            disabled={product.stock <= 0}
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            style={{ marginTop: 48 }}
          >
            Add to Cart
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductPage;

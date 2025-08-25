import React, { useRef, useState } from "react";
import {
  Button,
  message,
  Image,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { productAPI } from "../../services/api";
import { getImageUrl } from "../../utils/image";
import { categories, type Product } from "../../types";

import ProductForm from "../../components/Admin/ProductForm";
import SmartTable, {
  type SmartTableRef,
} from "../../components/Admin/SmartTable";

const { Title } = Typography;

const ProductPage: React.FC = () => {
  const [isProductFormVisible, setIsProductFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const tableRef = useRef<SmartTableRef>(null);

  const refetchProducts = () => {
    tableRef.current?.refetch();
  };

  const fetchProducts = async (params: any) => {
    const response = await productAPI.getAll(params);

    return {
      data: response.data.products,
      total: response.data.pagination.total,
    };
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormVisible(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productAPI.delete(id);
      message.success("Product deleted successfully");

      refetchProducts();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete product");
    }
  };

  const tableColumns: ColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl, record: Product) => (
        <Image
          alt={record.name}
          src={getImageUrl(imageUrl)}
          crossOrigin="anonymous"
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag>{category}</Tag>,
      filters: categories.map((category) => ({
        text: category,
        value: category,
      })),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Product) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Title level={2}>Products</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Space>

      <SmartTable<Product>
        ref={tableRef}
        columns={tableColumns}
        searchableColumns={["name"]}
        onFetchData={fetchProducts}
      />

      <ProductForm
        visible={isProductFormVisible}
        product={editingProduct}
        onClose={() => {
          setIsProductFormVisible(false);
          setEditingProduct(null);
        }}
        onSuccess={refetchProducts}
      />
    </>
  );
};

export default ProductPage;

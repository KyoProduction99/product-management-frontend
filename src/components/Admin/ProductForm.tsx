import React, { useEffect, useState, type ReactNode } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

import { productAPI } from "../../services/api";
import { getImageUrl } from "../../utils/image";
import { categories, type Product } from "../../types";

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormProps {
  visible: boolean;
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  visible,
  product,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible) {
      if (product) {
        form.setFieldsValue(product);

        if (product.imageUrl) {
          setFileList([
            {
              uid: "-1",
              name: "product-image",
              status: "done",
              url: getImageUrl(product.imageUrl),
            },
          ]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [visible, product, form]);

  const handleSubmit = async (values: Product) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("price", values.price.toString());
      formData.append("stock", values.stock.toString());
      formData.append("description", values.description);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (product) {
        await productAPI.update(product.id, formData);
        message.success("Product updated successfully!");
      } else {
        await productAPI.create(formData);
        message.success("Product created successfully!");
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload: UploadProps["customRequest"] = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess?.("ok");
    }, 0);
  };

  const handleImageChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList.slice(-1));
  };

  const handleRemoveImage = () => {
    setFileList([]);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isStandardSize = file.size / 1024 / 1024 < 5;
    if (!isStandardSize) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    return true;
  };

  const customItemRender = (_originNode: ReactNode, file: UploadFile) => {
    return (
      <Image
        alt={file.name}
        src={file.url || file.thumbUrl}
        crossOrigin="anonymous"
      />
    );
  };

  return (
    <>
      <Modal
        title={product ? "Edit Product" : "Add Product"}
        open={visible}
        width={768}
        footer={null}
        onCancel={onClose}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input
                  placeholder="Enter product name"
                  maxLength={100}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select category">
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price ($)"
                    rules={[{ required: true, message: "Please enter price" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0.00"
                      precision={2}
                      min={0.01}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="stock"
                    label="Stock Quantity"
                    rules={[
                      {
                        required: true,
                        message: "Please enter stock quantity",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter product description..."
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Product Image (Max: 5MB)">
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={fileList}
                  maxCount={1}
                  beforeUpload={beforeUpload}
                  customRequest={handleImageUpload}
                  itemRender={customItemRender}
                  onChange={handleImageChange}
                >
                  {!fileList.length && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>

                {fileList.length > 0 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {product ? "Update Product" : "Create Product"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductForm;

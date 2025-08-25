import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Col,
  Empty,
  Input,
  message,
  Pagination,
  Row,
  Select,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { productAPI } from "../services/api";
import { getImageUrl } from "../utils/image";
import { categories, type CategoryType, type Product } from "../types";

import {
  BannerContainer,
  BannerTitleText,
  BannerDescText,
} from "../components/Layout/UserLayoutStyles";

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

type SortBy = "name" | "price_asc" | "price_desc" | "newest";

const sortByOptions: {
  label: string;
  value: SortBy;
  sortField: string;
  sortOrder: "ASC" | "DESC";
}[] = [
  { label: "Name", value: "name", sortField: "name", sortOrder: "ASC" },
  {
    label: "Price: Low to High",
    value: "price_asc",
    sortField: "price",
    sortOrder: "ASC",
  },
  {
    label: "Price: High to Low",
    value: "price_desc",
    sortField: "price",
    sortOrder: "DESC",
  },
  {
    label: "Newest",
    value: "newest",
    sortField: "createdAt",
    sortOrder: "DESC",
  },
];

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({
    page: 1,
    limit: 12,
    category: undefined as CategoryType | undefined,
    name: "",
    sortBy: "newest" as SortBy,
    sortField: "createdAt",
    sortOrder: "DESC",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll(query);
        setProducts(response.data.products);
        setTotal(response.data.pagination.total);
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      name: value,
    }));
  };

  const onCategoryChange = (value: CategoryType | undefined) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      category: value,
    }));
  };

  const onSortByChange = (value: SortBy) => {
    const selectedOption = sortByOptions.find((opt) => opt.value === value);
    if (!selectedOption) return;

    setQuery((prev) => ({
      ...prev,
      page: 1,
      sortBy: value,
      sortField: selectedOption.sortField,
      sortOrder: selectedOption.sortOrder,
    }));
  };

  const onPageChange = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <>
      <BannerContainer>
        <div>
          <BannerTitleText>Welcome to My Store</BannerTitleText>
          <BannerDescText>
            Discover amazing products at great prices
          </BannerDescText>
        </div>
      </BannerContainer>

      <Row gutter={[16, 8]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Search
            allowClear
            placeholder="Search products..."
            defaultValue={query.name}
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={24} sm={6} lg={4}>
          <Select
            allowClear
            placeholder="Category"
            value={query.category || undefined}
            onChange={onCategoryChange}
            style={{ width: "100%" }}
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={query.sortBy}
            onChange={onSortByChange}
          >
            {sortByOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <div style={{ marginBottom: 48 }}>
        {total > 0 ? (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Link to={`/products/${product.id}`}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={getImageUrl(product.imageUrl)}
                        crossOrigin="anonymous"
                        style={{
                          width: "100%",
                          aspectRatio: 1,
                          objectFit: "cover",
                        }}
                      />
                    }
                  >
                    <Meta
                      title={product.name}
                      description={<Text>${product.price.toFixed(2)}</Text>}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : query.name || query.category ? (
          <div style={{ padding: "50px 0" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description=" We're sorry. We cannot find any matches for your search term."
            />
          </div>
        ) : (
          <div style={{ padding: "50px 0" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="We're Restocking – Stay Tuned!"
            />
          </div>
        )}

        {total > 0 && (
          <div style={{ marginTop: 24 }}>
            <Pagination
              total={total}
              current={query.page}
              pageSize={query.limit}
              align="center"
              showSizeChanger={false}
              onChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;

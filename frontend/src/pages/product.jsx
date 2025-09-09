import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useProducts } from "../hooks/useProducts";
import { Card, Spin, Empty, Typography, Input, Select, InputNumber, Button, Space } from "antd";

const { Title, Text } = Typography;

function LazyList() {
  const { products, fetchProducts, hasMore, loading, error } = useProducts();
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchProducts(true);
  }, []);

  const applyFilters = () => {
    fetchProducts(true, filters); // reset + apply filters
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Title level={2}>📦 Product List</Title>

      {/* 🔎 Filters */}
      <Space wrap style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Search products..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Select category"
          value={filters.category}
          onChange={(val) => setFilters({ ...filters, category: val })}
          allowClear
          style={{ width: 180 }}
        >
          <Select.Option value="Điện thoại">Điện thoại</Select.Option>
          <Select.Option value="Laptop">Laptop</Select.Option>
          <Select.Option value="Tai nghe">Tai nghe</Select.Option>
          <Select.Option value="Máy ảnh">Máy ảnh</Select.Option>
          <Select.Option value="Đồng hồ">Đồng hồ</Select.Option>
          <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
        </Select>
        <InputNumber
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(val) => setFilters({ ...filters, minPrice: val })}
          style={{ width: 120 }}
        />
        <InputNumber
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(val) => setFilters({ ...filters, maxPrice: val })}
          style={{ width: 120 }}
        />
        <Button type="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Space>

      {/* Error */}
      {error && (
        <Text type="danger" style={{ display: "block", marginBottom: "1rem" }}>
          ⚠️ Error: {error.message}
        </Text>
      )}

      {/* Product List */}
      <InfiniteScroll
        dataLength={products.length}
        next={() => fetchProducts(false, filters)}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Spin tip="Loading more products..." />
          </div>
        }
        endMessage={
          <Empty
            description="No more products 🚀"
            style={{ marginTop: "24px" }}
          />
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <Card
              key={p._id}
              hoverable
              title={p.name}
              bordered={true}
              style={{ borderRadius: "8px" }}
            >
              <p>
                <Text type="secondary">{p.category}</Text>
              </p>
              <p>
                <Text strong type="success">
                  {p.price}₫
                </Text>
              </p>
            </Card>
          ))}
        </div>
      </InfiniteScroll>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Spin />
        </div>
      )}
    </div>
  );
}

export default LazyList;

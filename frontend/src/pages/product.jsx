import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useProducts } from "../hooks/useProducts";
import { Spin, Empty, Typography, Input, Select, InputNumber, Button, Space, Checkbox } from "antd";
import ProductCard from "../components/ui/productCart";
import { getAllFavorites, getViewedProducts } from "../utils/api";
import { AuthContext } from "../components/context/auth.context";


const { Title, Text } = Typography;

function LazyList() {
  const { products, fetchProducts, hasMore, loading, error } = useProducts();
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewedIds, setViewedIds] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await getAllFavorites(auth?.user?.email);
        if (res.data.success) {
          setFavorites(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const loadViewed = async () => {
      try {
        const res = await getViewedProducts(auth?.user?.email);
        if (res.data.success) {
          setViewedIds(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching viewed products", err);
      }
    };
    loadViewed();
  }, [auth?.user?.email]);

  const applyFilters = () => {
    fetchProducts(true, filters); // reset + apply filters
  };

  let filteredProducts = products;
  if (showFavorites) {
    filteredProducts = filteredProducts.filter((p) => favorites.includes(p._id));
  }
  if (showHistory) {
    filteredProducts = filteredProducts.filter((p) => viewedIds.includes(p._id));
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2}>📦 Product List</Title>

      {/* 🔎 Filters */}
      <Space
        wrap
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: search + category + price + apply */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            flex: 1,
            minWidth: 250,
          }}
        >
          <Input
            placeholder="Search Products"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Select Category"
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
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(val) => setFilters({ ...filters, minPrice: val })}
            style={{ width: 120 }}
          />
          <InputNumber
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(val) => setFilters({ ...filters, maxPrice: val })}
            style={{ width: 120 }}
          />
          <Button type="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>

        {/* Right: favorites + product history */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={showFavorites}
            onChange={(e) => setShowFavorites(e.target.checked)}
          >
            Favorites
          </Checkbox>

          <Checkbox
            checked={showHistory}
            onChange={(e) => setShowHistory(e.target.checked)}
          >
            Viewed
          </Checkbox>
        </div>
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
          {filteredProducts.filter((p) => !showFavorites || favorites.includes(p._id)).map((p) => (
            <ProductCard key={p._id} email={auth?.user?.email} product={p} isFavorite={favorites.includes(p._id)} />
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

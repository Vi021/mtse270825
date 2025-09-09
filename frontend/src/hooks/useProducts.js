import { useState } from "react";
import { getProductApi, addProduct, updateProduct, deleteProduct } from "../utils/api";

export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 20;

  // Fetch products (reset = true for first load / filter change)
  const fetchProducts = async (reset = false, filters = initialFilters) => {
    try {
      setLoading(true);
      const res = await getProductApi(reset ? 0 : offset, limit, filters);

      if (reset) {
        setProducts(res.data.data);
        setOffset(limit);
      } else {
        setProducts((prev) => [...prev, ...res.data.data]);
        setOffset(offset + limit);
      }

      setHasMore(res.data.total > (reset ? limit : offset + limit));
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Add new product
  const create = async (data) => {
    const res = await addProduct(data);
    setProducts((prev) => [res.data, ...prev]);
  };

  // Update product
  const update = async (id, data) => {
    const res = await updateProduct(id, data);
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? res.data : p))
    );
  };

  // Delete product
  const remove = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    products,
    fetchProducts,
    hasMore,
    loading,
    error,
    create,
    update,
    remove,
  };
}

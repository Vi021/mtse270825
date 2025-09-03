import React, { useState, useEffect } from "react";
import { getProductApi } from "../utils/api";
import InfiniteScroll from "react-infinite-scroll-component";


function LazyList() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const getLimit = (pageNum) => (pageNum === 1 ? 50 : 20);

    const fetchItems = async (pageNum) => {
        const limit = getLimit(pageNum);
        const res = await getProductApi(pageNum, limit);

        setItems((prev) => {
            const newItems = [...prev, ...res.data.data];   // append
            setHasMore(newItems.length < res.data.total);
            return newItems;
        });
    };

    useEffect(() => {
        fetchItems(1); // load first 50
    }, []);

    const fetchMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchItems(nextPage);
    };

    return (
        <div>
            <h2>Your Products</h2>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more products 🚀</p>}
            >
                {items.map((i) => (
                    <div key={i.id}>{i.name}</div>
                ))}
            </InfiniteScroll>
        </div>
    );
}

export default LazyList;
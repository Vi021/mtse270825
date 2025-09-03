import React, { useState, useEffect } from "react";
import { getProductApi } from "../utils/api";


function LazyList() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchItems = async (pageNum) => {
        const res = await getProductApi(pageNum, 10);

        setItems((prev) => {
            const newItems = [...prev, ...res.data.data];
            setHasMore(newItems.length < res.data.total);
            return newItems;
        });
    };

    useEffect(() => {
        fetchItems(1);
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchItems(page);
        }
    }, [page]);

    return (
        <div>
            <h2>Your Products</h2>
            <ul>
                {items.map((i) => (
                    <li key={i.id}>{i.name}</li>
                ))}
            </ul>

            {hasMore && (
                <button onClick={() => setPage((p) => p + 1)}>Load More</button>
            )}
        </div>
    );
}

export default LazyList;
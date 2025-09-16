import { useEffect } from "react";
import { Card, Typography, Tooltip, Modal, Divider } from "antd";
import { HeartOutlined, HeartFilled, EyeOutlined, CommentOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { addToFavorites, removeFromFavorites, markProductViewed, getSimilarProducts } from "../../utils/api";

const { Text, Title } = Typography;

function ProductCard({ email, product, isFavorite = false }) {
    const [favorite, setFavorite] = useState(isFavorite);
    const toggleFavorite = () => {
        setFavorite(!favorite);
        if (!favorite) {
            if (email) {
                addToFavorites(email, product._id)
                    .catch((error) => {
                        console.error("Error adding to favorites:", error);
                    });
            }
        } else {
            if (email) {
                removeFromFavorites(email, product._id)
                    .catch((error) => {
                        console.error("Error removing from favorites:", error);
                    });
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpen = async () => setIsModalOpen(true);

    const [viewedAlready, setViewedAlready] = useState(false);
    const handleViewed = async () => {
        if (email && !viewedAlready) {
            await markProductViewed(email, product._id)
                .catch((error) => {
                    console.error("Error marking product as viewed:", error);
                });
            setViewedAlready(true);
        }
    };

    useEffect(() => {
        if (isModalOpen && !viewedAlready) {
            handleViewed();
        }
    }, [isModalOpen]);

    const [ similarProducts, setSimilarProducts ] = useState([]);
    const getSimilars = async () => {
        const results = await getSimilarProducts(product._id)
            .catch((error) => {
                console.error("Error fetching similar products:", error);
            });
        if (results && results.data && results.data.success) {
            setSimilarProducts(results.data.data);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            getSimilars();
        }
    }, [isModalOpen]);

    return (
        <Card
            hoverable
            bordered
            onClick={handleOpen}
            key={product._id}
            style={{ borderRadius: "8px" }}
            title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{product.name}</span>
                    <span onClick={(e) => e.stopPropagation()}>
                        {favorite ? (
                            <Tooltip title="Unfavorite">
                                <HeartFilled
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={toggleFavorite}
                                />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Favorite">
                                <HeartOutlined
                                    style={{ color: "gray", cursor: "pointer" }}
                                    onClick={toggleFavorite}
                                />
                            </Tooltip>
                        )}
                    </span>
                </div>
            }
        >
            <p>
                <Text type="secondary">{product.category}</Text>
            </p>
            <p>
                <Text strong type="success">{product.price}₫</Text>
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", color: "#888" }}>
                <Tooltip title="Views">
                    <span><EyeOutlined /> {product.views || 0}</span>
                </Tooltip>
                <Tooltip title="Comments">
                    <span><CommentOutlined /> {product.commentCount || 0}</span>
                </Tooltip>
                <Tooltip title="Purchases">
                    <span><ShoppingCartOutlined /> {product.purchaseCount || 0}</span>
                </Tooltip>
            </div>

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                closable={true}
                maskClosable={true}
                keyboard={true}
                centered
                width={600}
            >
                <Title level={4}>{product.name}</Title>
                <p>{product.description}</p>
                <p>
                    <Text type="secondary">Category: {product.category}</Text>
                </p>

                {/* Similar products */}
                <Divider>Similar Products</Divider>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {similarProducts.map((p) => (
                        <Card
                            key={p._id}
                            size="small"
                            hoverable
                            style={{ width: 270 }}
                            title={p.name}
                        >
                            <Text type="success">{p.price}₫</Text>
                        </Card>
                    ))}
                </div>
            </Modal>
        </Card>
    );
}

export default ProductCard;

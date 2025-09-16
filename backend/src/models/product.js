const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },         // tên sản phẩm
  category: { type: String, required: true },     // danh mục
  price: { type: Number, required: true },        // giá
  discount: { type: Number, default: 0 },         // khuyến mãi (%)
  views: { type: Number, default: 0 },            // lượt xem
  commentCount: { type: Number, default: 0 },     // số bình luận
  purchaseCount: { type: Number, default: 0 },    // số lần mua
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// to speed up searching name
productSchema.index({ name: "text" });

// to speed up filtering category, price
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
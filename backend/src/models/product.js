const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },         // tên sản phẩm
  category: { type: String, required: true },     // danh mục
  price: { type: Number, required: true },        // giá
  discount: { type: Number, default: 0 },         // khuyến mãi (%)
  views: { type: Number, default: 0 },            // lượt xem
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
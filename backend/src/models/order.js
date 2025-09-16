const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
    }],
    total: Number,
    // status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// compute total if missing
orderSchema.pre("save", function (next) {
  if (!this.total || this.isModified("products")) {
    this.total = this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  }
  // mark whether this is a new document (we'll use in post save)
  this._wasNew = this.isNew;
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

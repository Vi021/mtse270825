require("dotenv").config();
const { faker } = require("@faker-js/faker");
const Product = require("./models/product");
const connection = require("./config/database");

(async () => {
  try {
    await connection(); // connect to Mongo
    await Product.deleteMany({}); // clear old data

    const categories = [
      "Điện thoại",
      "Laptop",
      "Tai nghe",
      "Máy ảnh",
      "Đồng hồ",
      "Phụ kiện",
    ];

    const products = [];

    for (let i = 0; i < 200; i++) {
      const category = faker.helpers.arrayElement(categories);
      const basePrice = faker.number.int({ min: 500000, max: 50000000 });

      products.push({
        name: faker.commerce.productName(),
        category,
        price: basePrice,
        discount: faker.number.int({ min: 0, max: 50 }),
        views: faker.number.int({ min: 0, max: 5000 }),
        description: faker.commerce.productDescription(),
      });
    }

    await Product.insertMany(products);

    console.log("Seed thành công 200 sản phẩm!");
    process.exit();
  } catch (error) {
    console.error("Seed thất bại:", error);
    process.exit(1);
  }
})();

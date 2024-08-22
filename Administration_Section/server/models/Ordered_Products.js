const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Product_ID: {
        type: Number,
        required: true
    },
    Product_Amount: {
        type: Number,
        required: true
    },
    Order_ID: {
        type: Number,
        required: true
    }
});

const ProductOrderModel = mongoose.model("Ordered_Products", productSchema);
module.exports = ProductOrderModel;

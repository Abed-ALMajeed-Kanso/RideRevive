const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
    Customer_ID: {
        type: Number,
        required: true
    },
    Product_ID: {
        type: Number,
        required: true
    }
});

const ProductOrderModel = mongoose.model("favorites_lists", favSchema);
module.exports = ProductOrderModel;

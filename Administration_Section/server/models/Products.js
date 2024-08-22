const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
    Product_ID: {
        type: Number
    },
    Product: {
        type: String,
        required: true
    },
    Product_price: {
        type: Number,
        required: true
    },
    Product_state: {
        type: Boolean,
        required: true
    },
    Product_amount: {
        type: Number,
        required: true
    },
    Product_current_amount: {
        type: Number,
        required: true
    },
    Product_image: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Product_Date: {
        type: Date,
        required: true
    },
    Product_Discount: {
        type: Number,
        required: true
    }
});

productSchema.plugin(AutoIncrement, { inc_field: 'Product_ID' });

const ProductModel = mongoose.model('Products', productSchema);
module.exports = ProductModel;

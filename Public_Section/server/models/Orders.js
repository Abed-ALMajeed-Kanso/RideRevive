const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
    Customer_ID: {
        type: Number,
        required: true
    },
    Order_ID: {
        type: Number
    },
    Order_Date: {
        type: Date,
        required: true
    },
    Order_payment_method: {
        type: String,
        required: true
    },
    Order_total_price: {
        type: Number,
        required: true
    }
});

orderSchema.plugin(AutoIncrement, { inc_field: 'Order_ID' });

const OrderModel = mongoose.model("Orders", orderSchema);
module.exports = OrderModel;


const mongoose = require('mongoose');

const loyalSchema = new mongoose.Schema({

    loyal_customer_email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    }
});

const loyalModel = mongoose.model("loyal_customers", loyalSchema);
module.exports = loyalModel;
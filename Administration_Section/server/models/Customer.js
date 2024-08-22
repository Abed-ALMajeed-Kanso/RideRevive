const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
    Customer_ID: {
        type: Number
    },
    Customer_fullname: {
        type: String,
        required: true
    },
    Customer_email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    Customer_number: {
        type: String,
        required: true
    },
    Customer_password: {
        type: String,
        required: true
    },
    Customer_address: {
        type: String,
        required: true
    },
    Customer_state: {
        type: Boolean,
        required: true
    }
});

customerSchema.plugin(AutoIncrement, { inc_field: 'Customer_ID' });

customerSchema.pre('save', async function (next) {
    try {
        if (this.isModified('Customer_password')) {
            const salt = await bcrypt.genSalt(10);
            this.Customer_password = await bcrypt.hash(this.Customer_password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const CustomerModel = mongoose.model('Customer', customerSchema);
module.exports = CustomerModel;

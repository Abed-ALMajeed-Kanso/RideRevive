const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const administratorSchema = new mongoose.Schema({
    Administrator_ID: {
        type: Number
    },
    Administrator_fullname: {
        type: String,
        required: true
    },
    Administrator_email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    Administrator_password: {
        type: String,
        required: true
    },
    Administrator_number: {
        type: String,
        required: true
    },
    Administrator_address: {
        type: String,
        required: true
    }
});

administratorSchema.pre('save', async function (next) {
    try {
        if (this.isModified('Administrator_password')) {
            const salt = await bcrypt.genSalt(10);
            this.Administrator_password = await bcrypt.hash(this.Administrator_password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

const AdministratorModel = mongoose.model('Administrator', administratorSchema);
module.exports = AdministratorModel;

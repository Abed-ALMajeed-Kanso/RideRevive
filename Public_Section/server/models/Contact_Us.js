const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    Contact_name: {
        type: String,
        required: true
    },
    Contact_email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    Contact_message: {
        type: String,
        required: true
    }
});

const ContactModel = mongoose.model("contact_us", contactSchema);
module.exports = ContactModel;

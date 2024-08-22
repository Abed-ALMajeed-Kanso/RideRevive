const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Category: {
        type: String,
        required: true
    },
    Category_state: {
        type: Boolean,
        required: true
    },
    Category_description: {
        type: String,
        required: true
    },
    Category_image: {
        type: String,
        required: true
    }
});

const CategoryModel = mongoose.model("Categories", categorySchema);
module.exports = CategoryModel;

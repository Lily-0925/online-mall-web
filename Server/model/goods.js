var mongoose = require("mongoose");
var schema = mongoose.Schema;

var productSchema = new schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String
});

module.exports = mongoose.model('Good',productSchema);
   

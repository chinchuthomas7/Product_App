const mongoose = require('mongoose');
// connecting to the mongodb database
mongoose.connect('mongodb://localhost:27017/productDb');
// creating schema
const Schema = mongoose.Schema;

var NewProductSchema = new Schema({
    productId:Number,
    productName:String,
    productCode:String,
    releaseDate:String,
    description:String,
    price:Number,
    starRating:Number,
    imageUrl:String
})

var ProductData =mongoose.model('product',NewProductSchema);
module.exports=ProductData;
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const ProductCartSchema = mongoose.Schema({
   
   product: {
       type : ObjectId,
       ref : "Product",

   },

   name: String,
   count: Number,
   price: Number



});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);


const OrderSchema = mongoose.Schema({
    products : [ProductCartSchema],
    transaction_id : {},
    amount: Number,
    address: String,
    status : {
        type: String,
        default : "Recieved",
        enum : ["Cancelled","Delieverd","Shipped","Processing","Recieved"]

    },
    updated: Date,
    user: {
        type: ObjectId,
        ref : "User",
                
    }
},
{timeStamps : true});

const Order = mongoose.model("Order",OrderSchema);

module.exports = {Order,ProductCart}; 
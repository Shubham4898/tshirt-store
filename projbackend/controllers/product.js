const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "Not found product with this id"
            });
        }

        req.product = product;
        next();
    });

};

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            });
        }
        //destructure the fields
        const {name,description,price,category,stock} = fields;
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock 
        ){
            return res.status(400).json({
                error : "Please include all fields"
            });

        }
        let product = new Product(fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

             product.save((err,product) => {
                 if(err){
                 res.status(400).json({
                     error : "Saving tshirt in DB failed "
                 });
                }

                res.json(product);
             });
 
    });

};

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.photo);
}

exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.removeProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
              
                error : "Failed to delete product"

            });
        }

        res.json({
            message : "Deletion was success",
            deletedProduct
        });
    });
};


exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            });
        }
        let product = req.product;
        product = _.extend(product,fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

             product.save((err,product) => {
                 if(err){
                 res.status(400).json({
                     error : "Updation in DB is  failed "
                 });
                }

                res.json(product);
             });
 
    });

}



exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy: "_id";


    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products) => {
        if(err){
        return req.status(400).json({
            error : "No product found"
        })
    }
res.json(products);    

    })
};

exports.getAllUniqueCtegories = (req,res) => {
    Product.distinct("category",{}, (err,category) => {
        if(err){
            return res.status(400).json({
                error : "NO category Found"
            });
        }
        res.json(category);

    });
};

exports.updateStock = (req,res,next) =>{
    let myOperations = req.body.order.products.map(prod => {
        return{
            updateOne : {
                filter : {_id : prod._id},
                update : {$inc : {stock : -prod.count , sold : +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk operation failed"
            });

        }
        next();


    });
};




const express = require("express");
const router = express.Router();

const{getProductById,createProduct,getProduct,photo,removeProduct,updateProduct,getAllProducts,getAllUniqueCtegories} = require("../controllers/product");
const{isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");
const{getUserById} = require("../controllers/user");



router.param("userId", getUserById);
router.param("productId", getProductById)



router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,removeProduct);

router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);


router.get("/products/getAllProducts",getAllProducts);
router.get("/products/categories",getAllUniqueCtegories);








module.exports = router;
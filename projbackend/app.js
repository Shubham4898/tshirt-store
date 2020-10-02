require("dotenv").config({ path: 'routes/.env' });

const express = require("express"); 
const mongoose = require("mongoose");
const bodyParser =  require("body-parser");
const cookieParser = require("cookie-parser");
const cors  = require("cors");
const paymentBRoutes  = require("./routes/paymentBRoutes");

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");



const app = express();


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=>{
    console.log("DB CONNECTED");
});

//middleware

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);
app.use("/api",paymentBRoutes);




app.listen(3000,() => {
    console.log("app is running on 3000");
});

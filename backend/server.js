const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const ProductRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Product CRUD routes
app.use("/api/products", ProductRoutes);

// Home routes
app.get("/", (req, res) => {
    res.json({
        message: "MERN backend is working!"
    });
});

// mongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

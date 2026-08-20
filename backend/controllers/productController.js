const Product = require("../models/Product");

// create product
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "product created successfully",
            data: product
        });

    } catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Read all product
const getProducts = async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json({
            success: true,
            message: "fetch all product successfully",
            data: allProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
//  get single product

const getProduct = async (req, res) => {
    try {
        const productData = await Product.findById(req.params.id);
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            data: productData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// update product
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, {
            new: true,
            runValidators: true
        }
        );
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }
        res.status(200).json({
            success: true,
            message: "product update successfully",
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//delete product

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "product deleted successfully"
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
};
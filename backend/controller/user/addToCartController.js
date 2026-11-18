const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId, selectedSize } = req.body;
        const currentUser = req.userId;

        if (!selectedSize) {
            return res.json({
                message: "Please select a size before adding to cart",
                success: false,
                error: true
            });
        }

        // Check if the exact same product AND exact same size is already in the user's cart
        const isProductAvailable = await addToCartModel.findOne({ 
            productId, 
            selectedSize, 
            userId: currentUser 
        });

        if (isProductAvailable) {
            return res.json({
                message: `Size ${selectedSize} is already in your cart`,
                success: false,
                error: true
            });
        }

        const payload = {
            productId: productId,
            quantity: 1,
            selectedSize: selectedSize,
            userId: currentUser,
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.json({
            data: saveProduct,
            message: `Added (Size: ${selectedSize}) to cart`,
            success: true,
            error: false
        });

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = addToCartController;
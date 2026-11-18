import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id, selectedSize, quantity = 1) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (!selectedSize) {
        toast.error("Please select a size first!");
        return { success: false, message: "Size required" };
    }

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                productId: id,
                selectedSize: selectedSize,
                quantity: quantity
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        }

        if (responseData.error) {
            toast.error(responseData.message);
        }

        return responseData;
    } catch (error) {
        console.error("Add to cart error:", error);
        toast.error("Failed to add product to cart");
        return { success: false };
    }
};

export default addToCart;
import React from "react";

import { createContext, useContext, useState, useEffect, } from "react";
import { getProductById } from "@/services/productService";
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setItems(parsedCart);
        }
    }, []);
    // Update localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
        // Calculate totals
        const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalItems(itemsCount);
        setTotalPrice(price);
    }, [items]);
    const addToCart = async (productId, quantity) => {
        try {
            // Fetch the latest product data to ensure price is current
            const product = await getProductById(productId);
            if (!product) {
                throw new Error(`Product not found: ${productId}`);
            }
            // Calculate actual price (accounting for discounts)
            const actualPrice = product.price * (1 - product.discountPercentage / 100);
            setItems((prevItems) => {
                // Check if product already exists in cart
                const existingItemIndex = prevItems.findIndex((item) => item.productId === productId);
                if (existingItemIndex > -1) {
                    // Update existing item
                    const updatedItems = [...prevItems];
                    updatedItems[existingItemIndex] = Object.assign(Object.assign({}, updatedItems[existingItemIndex]), { quantity: updatedItems[existingItemIndex].quantity + quantity, price: actualPrice });
                    return updatedItems;
                }
                else {
                    // Add new item
                    return [
                        ...prevItems,
                        {
                            productId,
                            quantity,
                            price: actualPrice,
                        },
                    ];
                }
            });
        }
        catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    const removeFromCart = (productId) => {
        setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prevItems) => prevItems.map((item) => item.productId === productId ? Object.assign(Object.assign({}, item), { quantity }) : item));
    };
    const clearCart = () => {
        setItems([]);
    };
    return (React.createElement(CartContext.Provider, { value: {
            items,
            totalItems,
            totalPrice,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
        } }, children));
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

import React from "react";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
export default function Cart() {
    const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCartProducts = async () => {
            setLoading(true);
            try {
                const loadedItems = await Promise.all(items.map(async (item) => {
                    const product = await getProductById(item.productId);
                    if (!product)
                        throw new Error(`Product not found: ${item.productId}`);
                    return {
                        product,
                        quantity: item.quantity,
                        price: item.price,
                    };
                }));
                setCartItems(loadedItems);
            }
            catch (error) {
                console.error("Error fetching cart products:", error);
                toast.error("Failed to load some cart items");
            }
            finally {
                setLoading(false);
            }
        };
        fetchCartProducts();
    }, [items]);
    const handleQuantityChange = (productId, newQuantity) => {
        var _a;
        const product = (_a = cartItems.find((item) => item.product.id === productId)) === null || _a === void 0 ? void 0 : _a.product;
        if (!product)
            return;
        if (newQuantity > product.stock) {
            toast.error(`Cannot add more than ${product.stock} of this item`);
            return;
        }
        updateQuantity(productId, newQuantity);
    };
    const handleRemoveItem = (productId, productName) => {
        removeFromCart(productId);
        toast.success(`Removed ${productName} from cart`);
    };
    const handleClearCart = () => {
        clearCart();
        toast.success("Cart cleared");
    };
    const proceedToCheckout = () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        navigate("/checkout");
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading your cart...")));
    }
    if (cartItems.length === 0) {
        return (React.createElement("div", { className: "text-center py-16 h-[70vh] flex flex-col items-center justify-center" },
            React.createElement("div", { className: "flex justify-center mb-4" },
                React.createElement(ShoppingBag, { className: "h-16 w-16 text-muted-foreground" })),
            React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Your cart is empty"),
            React.createElement("p", { className: "text-muted-foreground mb-6" }, "Looks like you haven't added any items to your cart yet."),
            React.createElement(Button, { asChild: true },
                React.createElement(Link, { to: "/products" }, "Start Shopping"))));
    }
    return (React.createElement("div", { className: "h-[70vh] overflow-y-auto" },
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Shopping Cart"),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
            React.createElement("div", { className: "lg:col-span-2" },
                React.createElement("div", { className: "bg-card rounded-lg border shadow-sm" },
                    React.createElement("div", { className: "p-4 border-b" },
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("h2", { className: "text-lg font-medium" },
                                "Cart Items (",
                                cartItems.length,
                                ")"),
                            React.createElement(Button, { variant: "ghost", size: "sm", onClick: handleClearCart, className: "text-muted-foreground hover:text-destructive" }, "Clear Cart"))),
                    React.createElement("div", { className: "divide-y" }, cartItems.map(({ product, quantity, price }) => (React.createElement("div", { key: product.id, className: "p-4" },
                        React.createElement("div", { className: "flex gap-4" },
                            React.createElement("div", { className: "h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0" },
                                React.createElement("div", { className: "w-full h-full bg-muted flex items-center justify-center" },
                                    React.createElement("span", { className: "text-2xl" }, "\uD83D\uDDBC\uFE0F"))),
                            React.createElement("div", { className: "flex-1" },
                                React.createElement("div", { className: "flex justify-between" },
                                    React.createElement(Link, { to: `/products/${product.id}`, className: "font-medium hover:underline" }, product.title),
                                    React.createElement(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-destructive", onClick: () => handleRemoveItem(product.id, product.title) },
                                        React.createElement(Trash2, { size: 16 }),
                                        React.createElement("span", { className: "sr-only" }, "Remove"))),
                                React.createElement("div", { className: "text-muted-foreground text-sm" }, product.brand),
                                React.createElement("div", { className: "flex items-center justify-between mt-2" },
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement(Button, { variant: "outline", size: "icon", className: "h-7 w-7", onClick: () => handleQuantityChange(product.id, quantity - 1), disabled: quantity <= 1 }, "-"),
                                        React.createElement(Input, { type: "number", min: "1", max: product.stock, value: quantity, onChange: (e) => handleQuantityChange(product.id, parseInt(e.target.value)), className: "w-14 h-7 text-center" }),
                                        React.createElement(Button, { variant: "outline", size: "icon", className: "h-7 w-7", onClick: () => handleQuantityChange(product.id, quantity + 1), disabled: quantity >= product.stock }, "+")),
                                    React.createElement("div", { className: "font-bold" },
                                        "$",
                                        (price * quantity).toFixed(2))))))))))),
            React.createElement("div", null,
                React.createElement("div", { className: "bg-card rounded-lg border shadow-sm p-4 sticky top-20" },
                    React.createElement("h2", { className: "text-lg font-medium mb-4" }, "Order Summary"),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-muted-foreground" }, "Subtotal"),
                            React.createElement("span", null,
                                "$",
                                totalPrice.toFixed(2))),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-muted-foreground" }, "Shipping"),
                            React.createElement("span", null, "Free")),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-muted-foreground" }, "Tax"),
                            React.createElement("span", null,
                                "$",
                                (totalPrice * 0.07).toFixed(2))),
                        React.createElement(Separator, { className: "my-2" }),
                        React.createElement("div", { className: "flex justify-between font-bold" },
                            React.createElement("span", null, "Total"),
                            React.createElement("span", null,
                                "$",
                                (totalPrice + totalPrice * 0.07).toFixed(2)))),
                    React.createElement(Button, { className: "w-full mt-4", size: "lg", onClick: proceedToCheckout },
                        "Proceed to Checkout",
                        React.createElement(ArrowRight, { size: 16, className: "ml-2" })),
                    React.createElement("div", { className: "text-center mt-4" },
                        React.createElement(Link, { to: "/products", className: "text-primary text-sm hover:underline" }, "Continue Shopping")))))));
}

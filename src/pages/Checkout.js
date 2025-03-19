import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getProductById } from "@/services/productService";
import { createOrder } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, CircleDollarSign, Loader2 } from "lucide-react";
const shippingAddressSchema = z.object({
    name: z.string().min(2, "Name is required"),
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "Zip code is required"),
    country: z.string().min(2, "Country is required"),
});
const paymentSchema = z.object({
    paymentMethod: z.enum(["credit-card", "paypal"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
});
const checkoutSchema = z.object({
    shipping: shippingAddressSchema,
    payment: paymentSchema,
});
export default function Checkout() {
    var _a, _b, _c, _d, _e, _f;
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            shipping: {
                name: (user === null || user === void 0 ? void 0 : user.name) || "",
                country: "USA",
            },
            payment: {
                paymentMethod: "credit-card",
            },
        },
    });
    const paymentMethod = watch("payment.paymentMethod");
    useEffect(() => {
        const fetchCartProducts = async () => {
            setLoading(true);
            try {
                if (items.length === 0) {
                    navigate("/cart");
                    return;
                }
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
                toast.error("Failed to load checkout items");
                navigate("/cart");
            }
            finally {
                setLoading(false);
            }
        };
        fetchCartProducts();
    }, [items, navigate]);
    const onSubmit = async (data) => {
        if (!user) {
            toast.error("You must be logged in to complete checkout");
            navigate("/login");
            return;
        }
        setSubmitting(true);
        try {
            // Create order
            await createOrder(user.id, items, totalPrice, data.shipping, data.payment.paymentMethod === "credit-card" ? "Credit Card" : "PayPal");
            // Clear cart
            clearCart();
            // Show success message
            toast.success("Order placed successfully!");
            // Redirect to order confirmation
            navigate("/profile");
        }
        catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to place order. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading checkout...")));
    }
    if (cartItems.length === 0) {
        return (React.createElement("div", { className: "text-center py-10" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Your cart is empty"),
            React.createElement(Button, { variant: "default", asChild: true },
                React.createElement(Link, { to: "/products" }, "Browse Products"))));
    }
    const subtotal = totalPrice;
    const tax = subtotal * 0.07;
    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shippingCost;
    return (React.createElement("div", null,
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Checkout"),
        React.createElement(Button, { variant: "link", className: "pl-0 mb-4", onClick: () => navigate("/cart") },
            React.createElement(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to Cart"),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
            React.createElement("div", { className: "lg:col-span-2" },
                React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8" },
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, null, "Shipping Address")),
                        React.createElement(CardContent, { className: "space-y-4" },
                            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.name" }, "Full Name"),
                                    React.createElement(Input, Object.assign({ id: "shipping.name" }, register("shipping.name"))),
                                    ((_a = errors.shipping) === null || _a === void 0 ? void 0 : _a.name) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.name.message))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.street" }, "Street Address"),
                                    React.createElement(Input, Object.assign({ id: "shipping.street" }, register("shipping.street"))),
                                    ((_b = errors.shipping) === null || _b === void 0 ? void 0 : _b.street) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.street.message))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.city" }, "City"),
                                    React.createElement(Input, Object.assign({ id: "shipping.city" }, register("shipping.city"))),
                                    ((_c = errors.shipping) === null || _c === void 0 ? void 0 : _c.city) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.city.message))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.state" }, "State/Province"),
                                    React.createElement(Input, Object.assign({ id: "shipping.state" }, register("shipping.state"))),
                                    ((_d = errors.shipping) === null || _d === void 0 ? void 0 : _d.state) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.state.message))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.zipCode" }, "Zip/Postal Code"),
                                    React.createElement(Input, Object.assign({ id: "shipping.zipCode" }, register("shipping.zipCode"))),
                                    ((_e = errors.shipping) === null || _e === void 0 ? void 0 : _e.zipCode) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.zipCode.message))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "shipping.country" }, "Country"),
                                    React.createElement(Select, { defaultValue: "USA", onValueChange: (value) => {
                                            // This works with react-hook-form
                                            register("shipping.country").onChange({
                                                target: { name: "shipping.country", value },
                                            });
                                        } },
                                        React.createElement(SelectTrigger, null,
                                            React.createElement(SelectValue, { placeholder: "Select a country" })),
                                        React.createElement(SelectContent, null,
                                            React.createElement(SelectItem, { value: "USA" }, "United States"),
                                            React.createElement(SelectItem, { value: "Canada" }, "Canada"),
                                            React.createElement(SelectItem, { value: "Mexico" }, "Mexico"),
                                            React.createElement(SelectItem, { value: "UK" }, "United Kingdom"))),
                                    ((_f = errors.shipping) === null || _f === void 0 ? void 0 : _f.country) && (React.createElement("p", { className: "text-sm text-destructive" }, errors.shipping.country.message)))))),
                    React.createElement(Card, null,
                        React.createElement(CardHeader, null,
                            React.createElement(CardTitle, null, "Payment Method")),
                        React.createElement(CardContent, { className: "space-y-4" },
                            React.createElement(RadioGroup, { defaultValue: "credit-card", className: "space-y-3", onValueChange: (value) => {
                                    register("payment.paymentMethod").onChange({
                                        target: { name: "payment.paymentMethod", value },
                                    });
                                } },
                                React.createElement("div", { className: "flex items-center space-x-2 border rounded-md p-3" },
                                    React.createElement(RadioGroupItem, { value: "credit-card", id: "credit-card" }),
                                    React.createElement(Label, { htmlFor: "credit-card" }, "Credit Card"),
                                    React.createElement(CreditCard, { className: "ml-auto h-4 w-4 text-muted-foreground" })),
                                React.createElement("div", { className: "flex items-center space-x-2 border rounded-md p-3" },
                                    React.createElement(RadioGroupItem, { value: "paypal", id: "paypal" }),
                                    React.createElement(Label, { htmlFor: "paypal" }, "PayPal"),
                                    React.createElement(CircleDollarSign, { className: "ml-auto h-4 w-4 text-muted-foreground" }))),
                            paymentMethod === "credit-card" && (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-3" },
                                React.createElement("div", { className: "space-y-2 md:col-span-2" },
                                    React.createElement(Label, { htmlFor: "payment.cardNumber" }, "Card Number"),
                                    React.createElement(Input, Object.assign({ id: "payment.cardNumber", placeholder: "1234 5678 9012 3456" }, register("payment.cardNumber")))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "payment.cardExpiry" }, "Expiry Date"),
                                    React.createElement(Input, Object.assign({ id: "payment.cardExpiry", placeholder: "MM/YY" }, register("payment.cardExpiry")))),
                                React.createElement("div", { className: "space-y-2" },
                                    React.createElement(Label, { htmlFor: "payment.cardCvc" }, "CVC"),
                                    React.createElement(Input, Object.assign({ id: "payment.cardCvc", placeholder: "123" }, register("payment.cardCvc")))))))),
                    React.createElement("div", { className: "lg:hidden" },
                        React.createElement(OrderSummary, { cartItems: cartItems, subtotal: subtotal, tax: tax, shippingCost: shippingCost, total: total, isSubmitting: submitting })))),
            React.createElement("div", { className: "hidden lg:block" },
                React.createElement(OrderSummary, { cartItems: cartItems, subtotal: subtotal, tax: tax, shippingCost: shippingCost, total: total, isSubmitting: submitting, onSubmit: handleSubmit(onSubmit) })))));
}
const OrderSummary = ({ cartItems, subtotal, tax, shippingCost, total, isSubmitting, onSubmit, }) => (React.createElement(Card, { className: "sticky top-20" },
    React.createElement(CardHeader, null,
        React.createElement(CardTitle, null, "Order Summary")),
    React.createElement(CardContent, { className: "space-y-4" },
        React.createElement("div", { className: "space-y-3" }, cartItems.map(({ product, quantity, price }) => (React.createElement("div", { key: product.id, className: "flex justify-between" },
            React.createElement("span", { className: "text-sm" },
                product.title,
                " ",
                React.createElement("span", { className: "text-muted-foreground" },
                    "x",
                    quantity)),
            React.createElement("span", { className: "font-medium" },
                "$",
                (price * quantity).toFixed(2)))))),
        React.createElement(Separator, null),
        React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex justify-between text-sm" },
                React.createElement("span", { className: "text-muted-foreground" }, "Subtotal"),
                React.createElement("span", null,
                    "$",
                    subtotal.toFixed(2))),
            React.createElement("div", { className: "flex justify-between text-sm" },
                React.createElement("span", { className: "text-muted-foreground" }, "Shipping"),
                React.createElement("span", null, shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`)),
            React.createElement("div", { className: "flex justify-between text-sm" },
                React.createElement("span", { className: "text-muted-foreground" }, "Tax"),
                React.createElement("span", null,
                    "$",
                    tax.toFixed(2))),
            React.createElement(Separator, null),
            React.createElement("div", { className: "flex justify-between font-medium" },
                React.createElement("span", null, "Total"),
                React.createElement("span", null,
                    "$",
                    total.toFixed(2))))),
    React.createElement(CardFooter, null,
        React.createElement(Button, { className: "w-full", size: "lg", onClick: onSubmit, disabled: isSubmitting }, isSubmitting ? (React.createElement(React.Fragment, null,
            React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Processing...")) : ("Place Order")))));

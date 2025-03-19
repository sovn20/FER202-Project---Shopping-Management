import React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsBySeller } from "@/services/productService";
import { getOrdersByUser } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, TrendingUp, Star, ArrowRight, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function SellerDashboard() {
    var _a, _b;
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            if (!user)
                return;
            try {
                const sellerProducts = await getProductsBySeller(user.id);
                setProducts(sellerProducts);
                // For demonstration, we're using getOrdersByUser
                // In a real app, we might have a getOrdersForSeller endpoint
                const sellerOrders = await getOrdersByUser(user.id);
                setOrders(sellerOrders);
            }
            catch (error) {
                console.error("Error fetching seller data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    // Calculate revenue
    const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0);
    // Get recent orders
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    // Get top selling products
    const topProducts = [...products]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5);
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading dashboard data...")));
    }
    return (React.createElement("div", { className: "space-y-8" },
        React.createElement("div", null,
            React.createElement("h1", { className: "text-3xl font-bold" }, "Seller Dashboard"),
            (user === null || user === void 0 ? void 0 : user.storeInfo) && (React.createElement("p", { className: "text-muted-foreground" },
                "Welcome back to ",
                user.storeInfo.name))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Products")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(ShoppingBag, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" }, products.length),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                products.filter((p) => p.stock < 10).length,
                                " low stock"))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Total Sales")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(DollarSign, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" },
                                "$",
                                totalRevenue.toFixed(2)),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                React.createElement(TrendingUp, { className: "h-3 w-3 inline mr-1" }),
                                React.createElement("span", { className: "text-green-500" }, "+5.2%"),
                                " from last month"))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Store Rating")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(Star, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold flex items-center" },
                                ((_a = user === null || user === void 0 ? void 0 : user.storeInfo) === null || _a === void 0 ? void 0 : _a.rating) || "0.0",
                                React.createElement("span", { className: "text-yellow-500 ml-2 text-sm" }, "\u2605\u2605\u2605\u2605\u2605")),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                "Based on ",
                                ((_b = user === null || user === void 0 ? void 0 : user.storeInfo) === null || _b === void 0 ? void 0 : _b.totalSales) || 0,
                                " sales")))))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement(Card, null,
                React.createElement(CardHeader, null,
                    React.createElement(CardTitle, null, "Manage Your Store")),
                React.createElement(CardContent, { className: "space-y-4" },
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3" },
                        React.createElement(Button, { asChild: true, variant: "outline", className: "justify-between" },
                            React.createElement(Link, { to: "/seller/products" },
                                "View Products",
                                React.createElement(ArrowRight, { className: "h-4 w-4" }))),
                        React.createElement(Button, { asChild: true, variant: "outline", className: "justify-between" },
                            React.createElement(Link, { to: "/seller/products/add" },
                                "Add New Product",
                                React.createElement(ArrowRight, { className: "h-4 w-4" }))),
                        React.createElement(Button, { asChild: true, variant: "outline", className: "justify-between" },
                            React.createElement(Link, { to: "/seller/orders" },
                                "Manage Orders",
                                React.createElement(ArrowRight, { className: "h-4 w-4" }))),
                        React.createElement(Button, { asChild: true, variant: "outline", className: "justify-between" },
                            React.createElement(Link, { to: "/profile" },
                                "Store Settings",
                                React.createElement(ArrowRight, { className: "h-4 w-4" })))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, null,
                    React.createElement(CardTitle, null, "Recent Orders")),
                React.createElement(CardContent, null,
                    recentOrders.length === 0 ? (React.createElement("p", { className: "text-center text-muted-foreground py-4" }, "No orders yet")) : (React.createElement("div", { className: "space-y-2" }, recentOrders.map((order) => (React.createElement("div", { key: order.id, className: "flex justify-between items-center border-b pb-2" },
                        React.createElement("div", null,
                            React.createElement("p", { className: "font-medium" },
                                "Order #",
                                order.id),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, new Date(order.createdAt).toLocaleDateString())),
                        React.createElement("div", null,
                            React.createElement("span", { className: "font-medium" },
                                "$",
                                order.totalAmount.toFixed(2)))))))),
                    React.createElement(Button, { variant: "link", className: "mt-4 px-0", asChild: true },
                        React.createElement(Link, { to: "/seller/orders" }, "View all orders"))))),
        React.createElement(Card, null,
            React.createElement(CardHeader, null,
                React.createElement(CardTitle, null, "Products Overview")),
            React.createElement(CardContent, null,
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-sm" },
                        React.createElement("thead", null,
                            React.createElement("tr", { className: "border-b" },
                                React.createElement("th", { className: "py-3 text-left" }, "Product Name"),
                                React.createElement("th", { className: "py-3 text-left" }, "Stock"),
                                React.createElement("th", { className: "py-3 text-left" }, "Price"),
                                React.createElement("th", { className: "py-3 text-right" }, "Rating"))),
                        React.createElement("tbody", { className: "divide-y" }, products.length === 0 ? (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 4, className: "py-4 text-center text-muted-foreground" }, "No products yet. Add your first product!"))) : (products.slice(0, 5).map((product) => (React.createElement("tr", { key: product.id },
                            React.createElement("td", { className: "py-3 font-medium" }, product.title),
                            React.createElement("td", { className: "py-3" },
                                React.createElement("span", { className: `${product.stock < 10
                                        ? "text-red-500"
                                        : "text-green-500"}` },
                                    product.stock,
                                    " in stock")),
                            React.createElement("td", { className: "py-3" },
                                "$",
                                product.price.toFixed(2)),
                            React.createElement("td", { className: "py-3 text-right" },
                                React.createElement("div", { className: "flex items-center justify-end" },
                                    React.createElement("span", { className: "text-yellow-500 mr-1" }, "\u2605"),
                                    React.createElement("span", null, product.rating.toFixed(1))))))))))),
                React.createElement(Button, { variant: "link", className: "mt-4 px-0", asChild: true },
                    React.createElement(Link, { to: "/seller/products" }, "View all products"))))));
}

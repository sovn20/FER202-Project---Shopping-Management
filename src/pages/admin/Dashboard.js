import React from "react";
import { useState, useEffect } from "react";
import { getOrders } from "@/services/orderService";
import { getProducts } from "@/services/productService";
import { getUsers } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, DollarSign, Calendar, } from "lucide-react";
export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, productsData, usersData] = await Promise.all([
                    getOrders(),
                    getProducts(),
                    getUsers(),
                ]);
                setOrders(ordersData);
                setProducts(productsData);
                setUsers(usersData);
                // Filter users by role
                setSellers(usersData.filter((u) => u.role === "seller"));
                setBuyers(usersData.filter((u) => u.role === "buyer"));
            }
            catch (error) {
                console.error("Error fetching admin dashboard data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0);
    // Calculate monthly revenue (for the current month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthlyRevenue = orders
        .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear);
    })
        .reduce((total, order) => total + order.totalAmount, 0);
    // Get recent orders
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    // Get top products
    const topProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading dashboard data...")));
    }
    return (React.createElement("div", { className: "space-y-8" },
        React.createElement("h1", { className: "text-3xl font-bold" }, "Admin Dashboard"),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Total Revenue")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(DollarSign, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" },
                                "$",
                                totalRevenue.toFixed(2)),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" }, "+12.5% from last month"))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Monthly Revenue")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(Calendar, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" },
                                "$",
                                monthlyRevenue.toFixed(2)),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                new Date().toLocaleString("default", { month: "long" }),
                                " ",
                                currentYear))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Total Orders")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(Package, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" }, orders.length),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                orders.filter((o) => o.orderStatus === "Delivered").length,
                                " ",
                                "delivered"))))),
            React.createElement(Card, null,
                React.createElement(CardHeader, { className: "pb-2" },
                    React.createElement(CardTitle, { className: "text-sm font-medium text-muted-foreground" }, "Total Users")),
                React.createElement(CardContent, null,
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("div", { className: "mr-4 bg-primary/10 p-2 rounded-full" },
                            React.createElement(Users, { className: "h-6 w-6 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-2xl font-bold" }, users.length),
                            React.createElement("div", { className: "text-xs text-muted-foreground mt-1" },
                                buyers.length,
                                " buyers, ",
                                sellers.length,
                                " sellers")))))),
        React.createElement(Tabs, { defaultValue: "recent-orders" },
            React.createElement(TabsList, null,
                React.createElement(TabsTrigger, { value: "recent-orders" }, "Recent Orders"),
                React.createElement(TabsTrigger, { value: "top-products" }, "Top Products")),
            React.createElement(TabsContent, { value: "recent-orders", className: "mt-4" },
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Recent Orders")),
                    React.createElement(CardContent, null,
                        React.createElement("div", { className: "overflow-x-auto" },
                            React.createElement("table", { className: "w-full text-sm" },
                                React.createElement("thead", null,
                                    React.createElement("tr", { className: "border-b" },
                                        React.createElement("th", { className: "py-3 text-left" }, "Order #"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Date"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Customer"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Status"),
                                        React.createElement("th", { className: "py-3 text-right" }, "Amount"))),
                                React.createElement("tbody", { className: "divide-y" }, recentOrders.map((order) => (React.createElement("tr", { key: order.id },
                                    React.createElement("td", { className: "py-3" }, order.id),
                                    React.createElement("td", { className: "py-3" }, new Date(order.createdAt).toLocaleDateString()),
                                    React.createElement("td", { className: "py-3" }, order.shippingAddress.name),
                                    React.createElement("td", { className: "py-3" },
                                        React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === "Delivered"
                                                ? "bg-green-100 text-green-800"
                                                : order.orderStatus === "Shipped"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-yellow-100 text-yellow-800"}` }, order.orderStatus)),
                                    React.createElement("td", { className: "py-3 text-right" },
                                        "$",
                                        order.totalAmount.toFixed(2))))))))))),
            React.createElement(TabsContent, { value: "top-products", className: "mt-4" },
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Top Rated Products")),
                    React.createElement(CardContent, null,
                        React.createElement("div", { className: "overflow-x-auto" },
                            React.createElement("table", { className: "w-full text-sm" },
                                React.createElement("thead", null,
                                    React.createElement("tr", { className: "border-b" },
                                        React.createElement("th", { className: "py-3 text-left" }, "Product"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Category"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Brand"),
                                        React.createElement("th", { className: "py-3 text-left" }, "Rating"),
                                        React.createElement("th", { className: "py-3 text-right" }, "Price"))),
                                React.createElement("tbody", { className: "divide-y" }, topProducts.map((product) => (React.createElement("tr", { key: product.id },
                                    React.createElement("td", { className: "py-3 font-medium" }, product.title),
                                    React.createElement("td", { className: "py-3" },
                                        "ID: ",
                                        product.categoryId),
                                    React.createElement("td", { className: "py-3" }, product.brand),
                                    React.createElement("td", { className: "py-3" },
                                        React.createElement("div", { className: "flex items-center" },
                                            React.createElement("span", { className: "text-yellow-500 mr-1" }, "\u2605"),
                                            React.createElement("span", null, product.rating))),
                                    React.createElement("td", { className: "py-3 text-right" },
                                        "$",
                                        product.price.toFixed(2))))))))))))));
}

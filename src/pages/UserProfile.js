import React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUser } from "@/services/orderService";
import { getProductById } from "@/services/productService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Package, Settings } from "lucide-react";
export default function UserProfile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user)
                return;
            setLoading(true);
            try {
                const userOrders = await getOrdersByUser(user.id);
                // Fetch products for each order
                const ordersWithProducts = await Promise.all(userOrders.map(async (order) => {
                    const productsPromises = order.items.map(async (item) => {
                        try {
                            const product = await getProductById(item.productId);
                            return { product: product || null, quantity: item.quantity };
                        }
                        catch (error) {
                            console.error(`Error fetching product ${item.productId}:`, error);
                            return { product: null, quantity: item.quantity };
                        }
                    });
                    const products = await Promise.all(productsPromises);
                    return Object.assign(Object.assign({}, order), { products });
                }));
                setOrders(ordersWithProducts);
            }
            catch (error) {
                console.error("Error fetching user orders:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserOrders();
    }, [user]);
    if (!user) {
        return (React.createElement("div", { className: "text-center py-10" },
            React.createElement("p", null, "You need to be logged in to view your profile.")));
    }
    return (React.createElement("div", { className: "space-y-8" },
        React.createElement("h1", { className: "text-3xl font-bold" }, "My Profile"),
        React.createElement(Tabs, { defaultValue: "profile" },
            React.createElement(TabsList, { className: "grid grid-cols-3 w-full md:w-auto" },
                React.createElement(TabsTrigger, { value: "profile" },
                    React.createElement(User, { className: "mr-2 h-4 w-4" }),
                    "Profile"),
                React.createElement(TabsTrigger, { value: "orders" },
                    React.createElement(Package, { className: "mr-2 h-4 w-4" }),
                    "Orders"),
                React.createElement(TabsTrigger, { value: "settings" },
                    React.createElement(Settings, { className: "mr-2 h-4 w-4" }),
                    "Settings")),
                    React.createElement(TabsContent, { value: "profile", className: "mt-6" },
                        React.createElement(Card, null,
                            React.createElement(CardHeader, null,
                                React.createElement(CardTitle, null, "Account Information"),
                                React.createElement(CardDescription, null, "Your personal information and preferences")
                            ),
                            React.createElement(CardContent, { className: "flex flex-col space-y-4" }, // Chuyển sang flex-col để hiển thị trên một cột
                                React.createElement("div", { className: "flex flex-col items-center gap-4" }, // Avatar và tên căn giữa
                                    React.createElement(Avatar, { className: "w-20 h-20" },
                                        React.createElement(AvatarImage, { src: user.avatarUrl }),
                                        React.createElement(AvatarFallback, null, user.name.substring(0, 2).toUpperCase())
                                    ),
                                    React.createElement("div", { className: "text-center" },
                                        React.createElement("h3", { className: "text-xl font-medium" }, user.name),
                                        React.createElement(Badge, { className: "mt-1" }, user.role)
                                    )
                                ),
                                React.createElement("div", { className: "space-y-4" }, // Các thông tin khác hiển thị theo chiều dọc
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "text-sm text-muted-foreground" }, "Email"),
                                        React.createElement("p", null, user.email)
                                    ),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "text-sm text-muted-foreground" }, "Member Since"),
                                        React.createElement("p", null, new Date(user.createdAt).toLocaleDateString())
                                    ),
                                    user.role === "seller" && user.storeInfo && (
                                        React.createElement(React.Fragment, null,
                                            React.createElement("div", null,
                                                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Store Name"),
                                                React.createElement("p", null, user.storeInfo.name)
                                            ),
                                            React.createElement("div", null,
                                                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Store Description"),
                                                React.createElement("p", null, user.storeInfo.description)
                                            ),
                                            React.createElement("div", null,
                                                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Store Rating"),
                                                React.createElement("div", { className: "flex items-center" },
                                                    React.createElement("span", { className: "text-yellow-500 mr-1" }, "\u2605"),
                                                    React.createElement("span", null, user.storeInfo.rating)
                                                )
                                            ),
                                            React.createElement("div", null,
                                                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Total Sales"),
                                                React.createElement("p", null,
                                                    user.storeInfo.totalSales,
                                                    " items sold"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    
            React.createElement(TabsContent, { value: "orders", className: "mt-6" },
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Order History"),
                        React.createElement(CardDescription, null, "View your past orders and their status")),
                    React.createElement(CardContent, null, loading ? (React.createElement("div", { className: "flex justify-center py-10" },
                        React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }))) : orders.length === 0 ? (React.createElement("div", { className: "text-center py-10" },
                        React.createElement("p", { className: "text-muted-foreground" }, "You haven't placed any orders yet."))) : (React.createElement("div", { className: "space-y-6" }, orders.map((order) => (React.createElement("div", { key: order.id, className: "border rounded-lg overflow-hidden" },
                        React.createElement("div", { className: "bg-muted p-4" },
                            React.createElement("div", { className: "flex flex-wrap justify-between items-center" },
                                React.createElement("div", null,
                                    React.createElement("p", { className: "font-medium" },
                                        "Order #",
                                        order.id),
                                    React.createElement("p", { className: "text-sm text-muted-foreground" }, new Date(order.createdAt).toLocaleDateString())),
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(Badge, { variant: order.orderStatus === "Delivered"
                                            ? "default"
                                            : order.orderStatus === "Shipped"
                                                ? "secondary"
                                                : "outline" }, order.orderStatus),
                                    React.createElement(Badge, { variant: order.paymentStatus === "Paid"
                                            ? "default"
                                            : "outline" }, order.paymentStatus)))),
                        React.createElement("div", { className: "p-4 space-y-4" },
                            React.createElement("div", { className: "space-y-2" }, order.products.map(({ product, quantity }, index) => product ? (React.createElement("div", { key: index, className: "flex justify-between items-center" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement("div", { className: "h-10 w-10 bg-muted rounded flex items-center justify-center" },
                                        React.createElement("span", null, "\uD83D\uDDBC\uFE0F")),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-medium" }, product.title),
                                        React.createElement("p", { className: "text-sm text-muted-foreground" },
                                            "Qty: ",
                                            quantity))),
                                React.createElement("p", { className: "font-medium" },
                                    "$",
                                    (product.price * quantity).toFixed(2)))) : (React.createElement("div", { key: index, className: "text-muted-foreground italic" }, "Product no longer available")))),
                            React.createElement(Separator, null),
                            React.createElement("div", { className: "flex justify-between" },
                                React.createElement("span", null, "Total"),
                                React.createElement("span", { className: "font-bold" },
                                    "$",
                                    order.totalAmount.toFixed(2))),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium mb-1" }, "Shipping Address"),
                                React.createElement("p", { className: "text-sm text-muted-foreground" },
                                    order.shippingAddress.name,
                                    ",",
                                    " ",
                                    order.shippingAddress.street,
                                    ",",
                                    order.shippingAddress.city,
                                    ",",
                                    " ",
                                    order.shippingAddress.state,
                                    " ",
                                    order.shippingAddress.zipCode,
                                    ",",
                                    order.shippingAddress.country))))))))))),
            React.createElement(TabsContent, { value: "settings", className: "mt-6" },
                React.createElement(Card, null,
                    React.createElement(CardHeader, null,
                        React.createElement(CardTitle, null, "Account Settings"),
                        React.createElement(CardDescription, null, "Manage your account preferences")),
                    React.createElement(CardContent, null,
                        React.createElement("p", { className: "text-muted-foreground" }, "Account settings functionality coming soon.")))))));
}

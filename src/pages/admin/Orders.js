import React from "react";
import { useState, useEffect } from "react";
import { getOrders } from "@/services/orderService";
import { getUsers } from "@/services/authService";
import { getProductById } from "@/services/productService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Search, FileText, Eye, TrendingUp, ArrowUpDown, } from "lucide-react";
export default function AdminOrders() {
    var _a;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [viewingOrder, setViewingOrder] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ordersData, usersData] = await Promise.all([
                    getOrders(),
                    getUsers(),
                ]);
                // Enhance orders with user data
                const enhancedOrders = await Promise.all(ordersData.map(async (order) => {
                    const user = usersData.find((u) => u.id === order.userId);
                    // Fetch product details for each order item
                    const productDetails = await Promise.all(order.items.map(async (item) => {
                        const product = await getProductById(item.productId);
                        return { product: product || null, quantity: item.quantity };
                    }));
                    return Object.assign(Object.assign({}, order), { user,
                        productDetails });
                }));
                setOrders(enhancedOrders);
                setFilteredOrders(enhancedOrders);
                setUsers(usersData);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        // Apply filters
        let result = [...orders];
        // Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter((order) => {
                var _a, _b;
                return order.id.toLowerCase().includes(lowerCaseSearch) ||
                    ((_a = order.user) === null || _a === void 0 ? void 0 : _a.name.toLowerCase().includes(lowerCaseSearch)) ||
                    ((_b = order.user) === null || _b === void 0 ? void 0 : _b.email.toLowerCase().includes(lowerCaseSearch));
            });
        }
        // Filter by order status
        if (statusFilter && statusFilter !== "all") {
            result = result.filter((order) => order.orderStatus === statusFilter);
        }
        // Apply sorting
        switch (sortOption) {
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "highest":
                result.sort((a, b) => b.totalAmount - a.totalAmount);
                break;
            case "lowest":
                result.sort((a, b) => a.totalAmount - b.totalAmount);
                break;
        }
        setFilteredOrders(result);
    }, [searchTerm, statusFilter, sortOption, orders]);
    const viewOrderDetails = (order) => {
        setViewingOrder(order);
        setIsOrderDetailsOpen(true);
    };
    const updateOrderStatus = (orderId, newStatus) => {
        // In a real app, this would call an API
        const updatedOrders = orders.map((order) => {
            if (order.id === orderId) {
                return Object.assign(Object.assign({}, order), { orderStatus: newStatus });
            }
            return order;
        });
        setOrders(updatedOrders);
        toast.success(`Order status updated to: ${newStatus}`);
        // If we were viewing this order in the dialog, update it there too
        if (viewingOrder && viewingOrder.id === orderId) {
            setViewingOrder(Object.assign(Object.assign({}, viewingOrder), { orderStatus: newStatus }));
        }
    };
    const getOrderStatusBadge = (status) => {
        switch (status) {
            case "Processing":
                return React.createElement(Badge, { variant: "outline" }, "Processing");
            case "Shipped":
                return React.createElement(Badge, { variant: "secondary" }, "Shipped");
            case "Delivered":
                return React.createElement(Badge, { variant: "default" }, "Delivered");
            case "Cancelled":
                return React.createElement(Badge, { variant: "destructive" }, "Cancelled");
            default:
                return React.createElement(Badge, null, status);
        }
    };
    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return React.createElement(Badge, { variant: "outline" }, "Pending");
            case "Paid":
                return React.createElement(Badge, { variant: "default" }, "Paid");
            case "Failed":
                return React.createElement(Badge, { variant: "destructive" }, "Failed");
            case "Refunded":
                return React.createElement(Badge, { variant: "secondary" }, "Refunded");
            default:
                return React.createElement(Badge, null, status);
        }
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading orders...")));
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", null,
            React.createElement("h1", { className: "text-3xl font-bold" }, "Orders"),
            React.createElement("p", { className: "text-muted-foreground" }, "Manage customer orders")),
        React.createElement("div", { className: "flex flex-col md:flex-row justify-between gap-4 items-center" },
            React.createElement(Tabs, { defaultValue: "all", value: statusFilter, onValueChange: setStatusFilter },
                React.createElement(TabsList, null,
                    React.createElement(TabsTrigger, { value: "all" }, "All Orders"),
                    React.createElement(TabsTrigger, { value: "Processing" }, "Processing"),
                    React.createElement(TabsTrigger, { value: "Shipped" }, "Shipped"),
                    React.createElement(TabsTrigger, { value: "Delivered" }, "Delivered"),
                    React.createElement(TabsTrigger, { value: "Cancelled" }, "Cancelled"))),
            React.createElement("div", { className: "flex w-full md:w-auto gap-2" },
                React.createElement("div", { className: "relative flex-1" },
                    React.createElement(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                    React.createElement(Input, { type: "search", placeholder: "Search by order ID or customer...", className: "pl-8 w-full md:w-[260px]", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
                React.createElement(Select, { value: sortOption, onValueChange: setSortOption },
                    React.createElement(SelectTrigger, { className: "w-[180px]" },
                        React.createElement(ArrowUpDown, { className: "h-4 w-4 mr-2" }),
                        React.createElement(SelectValue, { placeholder: "Sort by" })),
                    React.createElement(SelectContent, null,
                        React.createElement(SelectItem, { value: "newest" }, "Newest first"),
                        React.createElement(SelectItem, { value: "oldest" }, "Oldest first"),
                        React.createElement(SelectItem, { value: "highest" }, "Highest value"),
                        React.createElement(SelectItem, { value: "lowest" }, "Lowest value"))))),
        React.createElement(Card, null,
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "Order"),
                        React.createElement(TableHead, null, "Customer"),
                        React.createElement(TableHead, null, "Date"),
                        React.createElement(TableHead, null, "Status"),
                        React.createElement(TableHead, null, "Payment"),
                        React.createElement(TableHead, { className: "text-right" }, "Amount"),
                        React.createElement(TableHead, { className: "text-right" }, "Actions"))),
                React.createElement(TableBody, null, filteredOrders.length === 0 ? (React.createElement(TableRow, null,
                    React.createElement(TableCell, { colSpan: 7, className: "h-24 text-center" }, "No orders found."))) : (filteredOrders.map((order) => {
                    var _a;
                    return (React.createElement(TableRow, { key: order.id },
                        React.createElement(TableCell, { className: "font-medium" },
                            "#",
                            order.id),
                        React.createElement(TableCell, null,
                            React.createElement("div", null,
                                React.createElement("div", null, order.shippingAddress.name),
                                React.createElement("div", { className: "text-sm text-muted-foreground truncate max-w-[150px]" }, ((_a = order.user) === null || _a === void 0 ? void 0 : _a.email) || "Unknown user"))),
                        React.createElement(TableCell, null, new Date(order.createdAt).toLocaleDateString()),
                        React.createElement(TableCell, null, getOrderStatusBadge(order.orderStatus)),
                        React.createElement(TableCell, null, getPaymentStatusBadge(order.paymentStatus)),
                        React.createElement(TableCell, { className: "text-right" },
                            "$",
                            order.totalAmount.toFixed(2)),
                        React.createElement(TableCell, { className: "text-right" },
                            React.createElement("div", { className: "flex justify-end space-x-2" },
                                React.createElement(Button, { variant: "ghost", size: "icon", onClick: () => viewOrderDetails(order) },
                                    React.createElement(Eye, { className: "h-4 w-4" })),
                                React.createElement(Select, { onValueChange: (value) => updateOrderStatus(order.id, value), defaultValue: order.orderStatus },
                                    React.createElement(SelectTrigger, { className: "h-8 w-auto border-none" },
                                        React.createElement(FileText, { className: "h-4 w-4" })),
                                    React.createElement(SelectContent, null,
                                        React.createElement(SelectItem, { value: "Processing" }, "Processing"),
                                        React.createElement(SelectItem, { value: "Shipped" }, "Shipped"),
                                        React.createElement(SelectItem, { value: "Delivered" }, "Delivered"),
                                        React.createElement(SelectItem, { value: "Cancelled" }, "Cancelled")))))));
                }))))),
        React.createElement(Dialog, { open: isOrderDetailsOpen, onOpenChange: setIsOrderDetailsOpen },
            React.createElement(DialogContent, { className: "max-w-3xl" },
                React.createElement(DialogHeader, null,
                    React.createElement(DialogTitle, null,
                        "Order #", viewingOrder === null || viewingOrder === void 0 ? void 0 :
                        viewingOrder.id),
                    React.createElement(DialogDescription, null,
                        "Placed on",
                        " ",
                        viewingOrder &&
                            new Date(viewingOrder.createdAt).toLocaleString())),
                viewingOrder && (React.createElement("div", { className: "space-y-6" },
                    React.createElement("div", { className: "flex justify-between items-center" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Order Status"),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                getOrderStatusBadge(viewingOrder.orderStatus),
                                React.createElement(Select, { onValueChange: (value) => updateOrderStatus(viewingOrder.id, value), defaultValue: viewingOrder.orderStatus },
                                    React.createElement(SelectTrigger, { className: "h-8 w-[160px]" },
                                        React.createElement(SelectValue, { placeholder: viewingOrder.orderStatus })),
                                    React.createElement(SelectContent, null,
                                        React.createElement(SelectItem, { value: "Processing" }, "Processing"),
                                        React.createElement(SelectItem, { value: "Shipped" }, "Shipped"),
                                        React.createElement(SelectItem, { value: "Delivered" }, "Delivered"),
                                        React.createElement(SelectItem, { value: "Cancelled" }, "Cancelled"))))),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Payment Status"),
                            React.createElement("div", null, getPaymentStatusBadge(viewingOrder.paymentStatus))),
                        React.createElement("div", { className: "text-right" },
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Total Amount"),
                            React.createElement("div", { className: "text-xl font-bold" },
                                "$",
                                viewingOrder.totalAmount.toFixed(2)))),
                    React.createElement(Separator, null),
                    React.createElement("div", { className: "grid grid-cols-2 gap-6" },
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-2" }, "Customer Information"),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement("p", null,
                                    "Name: ",
                                    viewingOrder.shippingAddress.name),
                                React.createElement("p", null,
                                    "Email: ",
                                    ((_a = viewingOrder.user) === null || _a === void 0 ? void 0 : _a.email) || "N/A"))),
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-2" }, "Shipping Address"),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement("p", null, viewingOrder.shippingAddress.name),
                                React.createElement("p", null, viewingOrder.shippingAddress.street),
                                React.createElement("p", null,
                                    viewingOrder.shippingAddress.city,
                                    ",",
                                    " ",
                                    viewingOrder.shippingAddress.state,
                                    " ",
                                    viewingOrder.shippingAddress.zipCode),
                                React.createElement("p", null, viewingOrder.shippingAddress.country)))),
                    React.createElement(Separator, null),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-medium mb-3" }, "Order Items"),
                        React.createElement("div", { className: "border rounded-lg overflow-hidden" },
                            React.createElement(Table, null,
                                React.createElement(TableHeader, null,
                                    React.createElement(TableRow, null,
                                        React.createElement(TableHead, null, "Product"),
                                        React.createElement(TableHead, { className: "text-right" }, "Quantity"),
                                        React.createElement(TableHead, { className: "text-right" }, "Price"),
                                        React.createElement(TableHead, { className: "text-right" }, "Total"))),
                                React.createElement(TableBody, null,
                                    viewingOrder.productDetails &&
                                        viewingOrder.productDetails.map((item, index) => (React.createElement(TableRow, { key: index },
                                            React.createElement(TableCell, null, item.product ? (React.createElement("div", { className: "flex items-center gap-3" },
                                                React.createElement("div", { className: "h-10 w-10 bg-muted rounded flex items-center justify-center" },
                                                    React.createElement("span", null, "\uD83D\uDDBC\uFE0F")),
                                                React.createElement("div", { className: "max-w-[300px]" },
                                                    React.createElement("div", { className: "font-medium" }, item.product.title),
                                                    React.createElement("div", { className: "text-xs text-muted-foreground" }, item.product.brand)))) : (React.createElement("span", { className: "text-muted-foreground italic" }, "Product unavailable"))),
                                            React.createElement(TableCell, { className: "text-right" }, item.quantity),
                                            React.createElement(TableCell, { className: "text-right" },
                                                "$",
                                                item.product
                                                    ? item.product.price.toFixed(2)
                                                    : "N/A"),
                                            React.createElement(TableCell, { className: "text-right" },
                                                "$",
                                                item.product
                                                    ? (item.product.price * item.quantity).toFixed(2)
                                                    : "N/A")))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Subtotal"),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            viewingOrder.totalAmount.toFixed(2))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Tax"),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            (viewingOrder.totalAmount * 0.07).toFixed(2))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Shipping"),
                                        React.createElement(TableCell, { className: "text-right" }, "Free")),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Total"),
                                        React.createElement(TableCell, { className: "text-right font-bold" },
                                            "$",
                                            (viewingOrder.totalAmount * 1.07).toFixed(2))))))))),
                React.createElement(DialogFooter, null,
                    React.createElement(Button, { variant: "outline", onClick: () => setIsOrderDetailsOpen(false) }, "Close")))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
            React.createElement(Card, { className: "p-6" },
                React.createElement("h3", { className: "font-medium mb-4" }, "Order Trends"),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center" },
                        React.createElement(TrendingUp, { className: "h-8 w-8 text-primary" })),
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-3xl font-bold" }, orders.length),
                        React.createElement("div", { className: "text-sm text-muted-foreground" }, "Total Orders")))),
            React.createElement(Card, { className: "p-6" },
                React.createElement("h3", { className: "font-medium mb-4" }, "Revenue Overview"),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center" },
                        React.createElement(TrendingUp, { className: "h-8 w-8 text-primary" })),
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-3xl font-bold" },
                            "$",
                            orders
                                .reduce((sum, order) => sum + order.totalAmount, 0)
                                .toFixed(2)),
                        React.createElement("div", { className: "text-sm text-muted-foreground" }, "Total Revenue")))))));
}

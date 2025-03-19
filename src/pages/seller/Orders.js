import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUser } from "@/services/orderService";
import { getProductById } from "@/services/productService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowUpDown, Loader2, Package, Search, Eye, FileText, } from "lucide-react";
export default function SellerOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingOrder, setViewingOrder] = useState(null);
    const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user)
                return;
            setLoading(true);
            try {
                // In a real application, we would have a dedicated endpoint for seller orders
                // For this demo, we're using the user's orders
                const ordersData = await getOrdersByUser(user.id);
                // Fetch product details for each order
                const ordersWithProducts = await Promise.all(ordersData.map(async (order) => {
                    const productsPromises = order.items.map(async (item) => {
                        try {
                            const product = await getProductById(item.productId);
                            return {
                                product,
                                quantity: item.quantity,
                                price: item.price,
                            };
                        }
                        catch (error) {
                            console.error(`Error fetching product ${item.productId}:`, error);
                            return {
                                product: null,
                                quantity: item.quantity,
                                price: item.price,
                            };
                        }
                    });
                    const products = await Promise.all(productsPromises);
                    return {
                        order,
                        products,
                    };
                }));
                setOrders(ordersWithProducts);
                setFilteredOrders(ordersWithProducts);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            }
            finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);
    useEffect(() => {
        // Apply filters and sorting
        let result = [...orders];
        // Filter by status
        if (statusFilter !== "all") {
            result = result.filter((item) => item.order.orderStatus === statusFilter);
        }
        // Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter((item) => item.order.id.toLowerCase().includes(lowerCaseSearch) ||
                item.order.shippingAddress.name
                    .toLowerCase()
                    .includes(lowerCaseSearch));
        }
        // Apply sorting
        switch (sortOption) {
            case "newest":
                result.sort((a, b) => new Date(b.order.createdAt).getTime() -
                    new Date(a.order.createdAt).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.order.createdAt).getTime() -
                    new Date(b.order.createdAt).getTime());
                break;
            case "highest":
                result.sort((a, b) => b.order.totalAmount - a.order.totalAmount);
                break;
            case "lowest":
                result.sort((a, b) => a.order.totalAmount - b.order.totalAmount);
                break;
        }
        setFilteredOrders(result);
    }, [statusFilter, sortOption, searchTerm, orders]);
    const handleUpdateOrderStatus = (orderId, status) => {
        // In a real app, this would make an API call
        // For now, we'll update the local state
        const updatedOrders = orders.map((item) => {
            if (item.order.id === orderId) {
                return Object.assign(Object.assign({}, item), { order: Object.assign(Object.assign({}, item.order), { orderStatus: status }) });
            }
            return item;
        });
        setOrders(updatedOrders);
        // Also update viewing order if it's open
        if (viewingOrder && viewingOrder.order.id === orderId) {
            setViewingOrder(Object.assign(Object.assign({}, viewingOrder), { order: Object.assign(Object.assign({}, viewingOrder.order), { orderStatus: status }) }));
        }
        toast.success(`Order #${orderId} status updated to ${status}`);
    };
    const viewOrderDetails = (order) => {
        setViewingOrder(order);
        setOrderDetailsOpen(true);
    };
    if (loading) {
        return (React.createElement("div", { className: "flex flex-col items-center justify-center h-64" },
            React.createElement(Loader2, { className: "h-10 w-10 animate-spin text-primary mb-4" }),
            React.createElement("p", null, "Loading orders...")));
    }
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
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", null,
            React.createElement("h1", { className: "text-3xl font-bold" }, "Orders"),
            React.createElement("p", { className: "text-muted-foreground mt-2" }, "Manage and track customer orders for your products.")),
        React.createElement("div", { className: "flex flex-col md:flex-row justify-between gap-4 items-center" },
            React.createElement(Tabs, { defaultValue: "all", value: statusFilter, onValueChange: setStatusFilter },
                React.createElement(TabsList, null,
                    React.createElement(TabsTrigger, { value: "all" }, "All Orders"),
                    React.createElement(TabsTrigger, { value: "Processing" }, "Processing"),
                    React.createElement(TabsTrigger, { value: "Shipped" }, "Shipped"),
                    React.createElement(TabsTrigger, { value: "Delivered" }, "Delivered"),
                    React.createElement(TabsTrigger, { value: "Cancelled" }, "Cancelled"))),
            React.createElement("div", { className: "flex items-center gap-4 w-full md:w-auto" },
                React.createElement("div", { className: "relative flex-1" },
                    React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
                    React.createElement(Input, { placeholder: "Search orders...", className: "pl-9", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
                React.createElement(Select, { value: sortOption, onValueChange: setSortOption },
                    React.createElement(SelectTrigger, { className: "w-[180px]" },
                        React.createElement(ArrowUpDown, { className: "mr-2 h-4 w-4" }),
                        React.createElement(SelectValue, { placeholder: "Sort by" })),
                    React.createElement(SelectContent, null,
                        React.createElement(SelectItem, { value: "newest" }, "Newest first"),
                        React.createElement(SelectItem, { value: "oldest" }, "Oldest first"),
                        React.createElement(SelectItem, { value: "highest" }, "Highest value"),
                        React.createElement(SelectItem, { value: "lowest" }, "Lowest value"))))),
        filteredOrders.length === 0 ? (React.createElement(Card, null,
            React.createElement(CardContent, { className: "flex flex-col items-center justify-center py-12" },
                React.createElement(Package, { className: "h-12 w-12 text-muted-foreground mb-4" }),
                React.createElement("p", { className: "text-lg font-medium mb-2" }, "No orders found"),
                React.createElement("p", { className: "text-muted-foreground text-center" }, orders.length === 0
                    ? "You haven't received any orders yet."
                    : "No orders match your current filters.")))) : (React.createElement(Card, null,
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "Order ID"),
                        React.createElement(TableHead, null, "Customer"),
                        React.createElement(TableHead, null, "Date"),
                        React.createElement(TableHead, null, "Status"),
                        React.createElement(TableHead, { className: "text-right" }, "Amount"),
                        React.createElement(TableHead, { className: "text-right" }, "Actions"))),
                React.createElement(TableBody, null, filteredOrders.map((item) => (React.createElement(TableRow, { key: item.order.id },
                    React.createElement(TableCell, { className: "font-medium" },
                        "#",
                        item.order.id),
                    React.createElement(TableCell, null, item.order.shippingAddress.name),
                    React.createElement(TableCell, null, new Date(item.order.createdAt).toLocaleDateString()),
                    React.createElement(TableCell, null, getOrderStatusBadge(item.order.orderStatus)),
                    React.createElement(TableCell, { className: "text-right" },
                        "$",
                        item.order.totalAmount.toFixed(2)),
                    React.createElement(TableCell, { className: "text-right" },
                        React.createElement("div", { className: "flex justify-end space-x-2" },
                            React.createElement(Button, { variant: "ghost", size: "icon", onClick: () => viewOrderDetails(item), title: "View order details" },
                                React.createElement(Eye, { className: "h-4 w-4" })),
                            React.createElement(Select, { defaultValue: item.order.orderStatus, onValueChange: (value) => handleUpdateOrderStatus(item.order.id, value) },
                                React.createElement(SelectTrigger, { className: "h-8 w-auto border-none" },
                                    React.createElement(FileText, { className: "h-4 w-4" })),
                                React.createElement(SelectContent, null,
                                    React.createElement(SelectItem, { value: "Processing" }, "Processing"),
                                    React.createElement(SelectItem, { value: "Shipped" }, "Shipped"),
                                    React.createElement(SelectItem, { value: "Delivered" }, "Delivered"),
                                    React.createElement(SelectItem, { value: "Cancelled" }, "Cancelled")))))))))))),
        React.createElement(Dialog, { open: orderDetailsOpen, onOpenChange: setOrderDetailsOpen },
            React.createElement(DialogContent, { className: "max-w-3xl" }, viewingOrder && (React.createElement(React.Fragment, null,
                React.createElement(DialogHeader, null,
                    React.createElement(DialogTitle, null,
                        "Order #",
                        viewingOrder.order.id),
                    React.createElement(DialogDescription, null,
                        "Placed on",
                        " ",
                        new Date(viewingOrder.order.createdAt).toLocaleString())),
                React.createElement("div", { className: "space-y-6" },
                    React.createElement("div", { className: "flex justify-between items-center" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Order Status"),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                getOrderStatusBadge(viewingOrder.order.orderStatus),
                                React.createElement(Select, { defaultValue: viewingOrder.order.orderStatus, onValueChange: (value) => handleUpdateOrderStatus(viewingOrder.order.id, value) },
                                    React.createElement(SelectTrigger, { className: "h-8 w-[160px]" },
                                        React.createElement(SelectValue, { placeholder: "Change status" })),
                                    React.createElement(SelectContent, null,
                                        React.createElement(SelectItem, { value: "Processing" }, "Processing"),
                                        React.createElement(SelectItem, { value: "Shipped" }, "Shipped"),
                                        React.createElement(SelectItem, { value: "Delivered" }, "Delivered"),
                                        React.createElement(SelectItem, { value: "Cancelled" }, "Cancelled"))))),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Payment Status"),
                            React.createElement(Badge, { variant: viewingOrder.order.paymentStatus === "Paid"
                                    ? "default"
                                    : "outline" }, viewingOrder.order.paymentStatus)),
                        React.createElement("div", { className: "text-right" },
                            React.createElement("div", { className: "text-sm text-muted-foreground mb-1" }, "Total Amount"),
                            React.createElement("div", { className: "text-xl font-bold" },
                                "$",
                                viewingOrder.order.totalAmount.toFixed(2)))),
                    React.createElement(Separator, null),
                    React.createElement("div", { className: "grid grid-cols-2 gap-6" },
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-2" }, "Customer Information"),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement("p", null, viewingOrder.order.shippingAddress.name))),
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-2" }, "Shipping Address"),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement("p", null, viewingOrder.order.shippingAddress.name),
                                React.createElement("p", null, viewingOrder.order.shippingAddress.street),
                                React.createElement("p", null,
                                    viewingOrder.order.shippingAddress.city,
                                    ",",
                                    " ",
                                    viewingOrder.order.shippingAddress.state,
                                    " ",
                                    viewingOrder.order.shippingAddress.zipCode),
                                React.createElement("p", null, viewingOrder.order.shippingAddress.country)))),
                    React.createElement(Separator, null),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-medium mb-3" }, "Order Items"),
                        React.createElement("div", { className: "border rounded-lg overflow-hidden" },
                            React.createElement(Table, null,
                                React.createElement(TableHeader, null,
                                    React.createElement(TableRow, null,
                                        React.createElement(TableHead, null, "Product"),
                                        React.createElement(TableHead, { className: "text-right" }, "Quantity"),
                                        React.createElement(TableHead, { className: "text-right" }, "Unit Price"),
                                        React.createElement(TableHead, { className: "text-right" }, "Total"))),
                                React.createElement(TableBody, null,
                                    viewingOrder.products.map((item, index) => (React.createElement(TableRow, { key: index },
                                        React.createElement(TableCell, null, item.product ? (React.createElement("div", { className: "flex items-center gap-3" },
                                            React.createElement("div", { className: "h-10 w-10 bg-muted rounded flex items-center justify-center" },
                                                React.createElement("span", null, "\uD83D\uDDBC\uFE0F")),
                                            React.createElement("div", null,
                                                React.createElement("div", { className: "font-medium" }, item.product.title),
                                                React.createElement("div", { className: "text-xs text-muted-foreground" }, item.product.brand)))) : (React.createElement("span", { className: "text-muted-foreground italic" }, "Product unavailable"))),
                                        React.createElement(TableCell, { className: "text-right" }, item.quantity),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            item.price.toFixed(2)),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            (item.price * item.quantity).toFixed(2))))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Subtotal"),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            viewingOrder.order.totalAmount.toFixed(2))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Tax"),
                                        React.createElement(TableCell, { className: "text-right" },
                                            "$",
                                            (viewingOrder.order.totalAmount * 0.07).toFixed(2))),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Shipping"),
                                        React.createElement(TableCell, { className: "text-right" }, "Free")),
                                    React.createElement(TableRow, null,
                                        React.createElement(TableCell, { colSpan: 2 }),
                                        React.createElement(TableCell, { className: "text-right font-medium" }, "Total"),
                                        React.createElement(TableCell, { className: "text-right font-bold" },
                                            "$",
                                            (viewingOrder.order.totalAmount * 1.07).toFixed(2)))))))),
                React.createElement(DialogFooter, null,
                    React.createElement(Button, { variant: "outline", onClick: () => setOrderDetailsOpen(false) }, "Close"))))))));
}

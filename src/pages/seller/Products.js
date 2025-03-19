import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsBySeller } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ProductDialog from "@/components/seller/ProductDialog";
import ProductEditDialog from "@/components/seller/ProductEditDialog";
export default function SellerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            if (!user)
                return;
            try {
                const [sellerProducts, allCategories] = await Promise.all([
                    getProductsBySeller(user.id),
                    getCategories(),
                ]);
                setProducts(sellerProducts);
                setFilteredProducts(sellerProducts);
                setCategories(allCategories);
            }
            catch (error) {
                console.error("Error fetching seller products:", error);
                toast.error("Failed to load your products");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    useEffect(() => {
        // Filter products based on search term
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        }
        else {
            const lowerCaseSearch = searchTerm.toLowerCase();
            const filtered = products.filter((product) => product.title.toLowerCase().includes(lowerCaseSearch) ||
                product.description.toLowerCase().includes(lowerCaseSearch) ||
                product.brand.toLowerCase().includes(lowerCaseSearch));
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);
    const handleDeleteProduct = (productId, productTitle) => {
        // In a real application, this would call an API endpoint
        // For now, we'll just update the local state
        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        setFilteredProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
        toast.success(`Product "${productTitle}" deleted`);
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading your products...")));
    }
    const getCategoryName = (categoryId) => {
        var _a;
        return (((_a = categories.find((category) => category.id === categoryId)) === null || _a === void 0 ? void 0 : _a.name) ||
            "Unknown");
    };
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h1", { className: "text-3xl font-bold" }, "My Products"),
            React.createElement(ProductDialog, null)),
        React.createElement("div", { className: "relative" },
            React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" }),
            React.createElement(Input, { placeholder: "Search products...", className: "pl-10", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
        filteredProducts.length === 0 ? (React.createElement("div", { className: "text-center py-10 bg-card border rounded-lg" }, products.length === 0 ? (React.createElement("div", null,
            React.createElement("p", { className: "text-muted-foreground mb-4" }, "You don't have any products yet."),
            React.createElement(Button, { asChild: true },
                React.createElement(Link, { to: "/seller/products/add" }, "Add Your First Product")))) : (React.createElement("p", { className: "text-muted-foreground" }, "No products match your search criteria.")))) : (React.createElement(Card, null,
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "Product"),
                        React.createElement(TableHead, null, "Category"),
                        React.createElement(TableHead, null, "Price"),
                        React.createElement(TableHead, null, "Stock"),
                        React.createElement(TableHead, null, "Status"),
                        React.createElement(TableHead, { className: "text-right" }, "Actions"))),
                React.createElement(TableBody, null, filteredProducts.map((product) => (React.createElement(TableRow, { key: product.id },
                    React.createElement(TableCell, { className: "font-medium" },
                        React.createElement("div", { className: "flex items-center space-x-4" },
                            React.createElement("div", { className: "h-10 w-10 bg-muted rounded overflow-hidden flex items-center justify-center" },
                                React.createElement("span", null, "\uD83D\uDDBC\uFE0F")),
                            React.createElement("div", null,
                                React.createElement("div", { className: "font-medium" }, product.title),
                                React.createElement("div", { className: "text-sm text-muted-foreground" },
                                    "ID: ",
                                    product.id)))),
                    React.createElement(TableCell, null, getCategoryName(product.categoryId)),
                    React.createElement(TableCell, null,
                        "$",
                        product.price.toFixed(2),
                        product.discountPercentage > 0 && (React.createElement("span", { className: "ml-1 text-sm text-red-500" },
                            "-",
                            product.discountPercentage,
                            "%"))),
                    React.createElement(TableCell, null, product.stock),
                    React.createElement(TableCell, null,
                        React.createElement(Badge, { variant: product.stock > 0 ? "outline" : "destructive" }, product.stock > 0 ? "In Stock" : "Out of Stock")),
                    React.createElement(TableCell, { className: "text-right" },
                        React.createElement("div", { className: "flex justify-end space-x-1" },
                            React.createElement(ProductEditDialog, { productId: product.id }),
                            React.createElement(Button, { variant: "ghost", size: "sm", className: "text-destructive hover:text-destructive", onClick: () => handleDeleteProduct(product.id, product.title) },
                                React.createElement(Trash2, { className: "h-4 w-4 mr-1" }),
                                " Delete"))))))))))));
}

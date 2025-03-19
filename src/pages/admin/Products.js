import React from "react";
import { useState, useEffect } from "react";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProductDialog from "@/components/admin/ProductDialog";
import ProductEditDialog from "@/components/admin/ProductEditDialog";
import { deleteProduct } from "@/services/productService"; 
export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                setProducts(productsData);
                setFilteredProducts(productsData);
                setCategories(categoriesData);
            }
            catch (error) {
                console.error("Error fetching products data:", error);
                toast.error("Failed to load products");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    // Apply filters whenever search term or category filter changes
    useEffect(() => {
        let result = [...products];
        // Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter((product) => product.title.toLowerCase().includes(lowerCaseSearch) ||
                product.brand.toLowerCase().includes(lowerCaseSearch));
        }
        // Filter by category
        if (categoryFilter && categoryFilter !== "all") {
            result = result.filter((product) => product.categoryId === categoryFilter);
        }
        setFilteredProducts(result);
    }, [searchTerm, categoryFilter, products]);
    const handleDelete = async (id, title) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the product "${title}"?`);
        if (!isConfirmed) return;
      
        const success = await deleteProduct(id);
        if (success) {
          setProducts(products.filter((product) => product.id !== id));
          setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
          toast.success(`Product "${title}" deleted`);
        } else {
          toast.error(`Failed to delete product "${title}"`);
        }
      };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading products...")));
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h1", { className: "text-3xl font-bold" }, "Products"),
            React.createElement(ProductDialog, null)),
        React.createElement("div", { className: "flex flex-col sm:flex-row gap-4" },
            React.createElement("div", { className: "relative flex-1" },
                React.createElement(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                React.createElement(Input, { type: "search", placeholder: "Search products...", className: "pl-8", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
            React.createElement(Select, { value: categoryFilter, onValueChange: setCategoryFilter },
                React.createElement(SelectTrigger, { className: "sm:w-[200px]" },
                    React.createElement(SelectValue, { placeholder: "Category" })),
                React.createElement(SelectContent, null,
                    React.createElement(SelectItem, { value: "all" }, "All Categories"),
                    categories.map((category) => (React.createElement(SelectItem, { key: category.id, value: category.id }, category.name)))))),
        React.createElement(Card, null,
            React.createElement("div", { className: "rounded-md border" },
                React.createElement(Table, null,
                    React.createElement(TableHeader, null,
                        React.createElement(TableRow, null,
                            React.createElement(TableHead, null, "Product"),
                            React.createElement(TableHead, null, "Brand"),
                            React.createElement(TableHead, null, "Category"),
                            React.createElement(TableHead, null, "Price"),
                            React.createElement(TableHead, null, "Stock"),
                            React.createElement(TableHead, { className: "text-right" }, "Actions"))),
                    React.createElement(TableBody, null, filteredProducts.length === 0 ? (React.createElement(TableRow, null,
                        React.createElement(TableCell, { colSpan: 6, className: "text-center py-8 text-muted-foreground" }, "No products found"))) : (filteredProducts.map((product) => {
                        var _a;
                        const category = ((_a = categories.find((c) => c.id === product.categoryId)) === null || _a === void 0 ? void 0 : _a.name) ||
                            "Unknown";
                        return (React.createElement(TableRow, { key: product.id },
                            React.createElement(TableCell, null,
                                React.createElement("div", { className: "flex items-center gap-3" },
                                    React.createElement("div", { className: "h-10 w-10 bg-muted rounded flex items-center justify-center" }, product.thumbnail ? (React.createElement("img", { src: product.thumbnail, alt: "\uD83D\uDDBC\uFE0F" })) : (React.createElement("span", { className: "text-2xl" }, "\uD83D\uDDBC\uFE0F"))),
                                    React.createElement("div", { className: "flex flex-col" },
                                        React.createElement("span", { className: "font-medium" }, product.title),
                                        React.createElement("span", { className: "text-xs text-muted-foreground" },
                                            "ID: ",
                                            product.id)))),
                            React.createElement(TableCell, null, product.brand),
                            React.createElement(TableCell, null, category),
                            React.createElement(TableCell, null,
                                "$",
                                product.price.toFixed(2)),
                            React.createElement(TableCell, null,
                                React.createElement(Badge, { variant: "outline" },
                                    product.stock,
                                    " in stock")),
                            React.createElement(TableCell, { className: "text-right" },
                                React.createElement("div", { className: "flex justify-end gap-2" },
                                    React.createElement(ProductEditDialog, { productId: product.id }),
                                    React.createElement(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(product.id, product.title) },
                                        React.createElement(Trash2, { className: "h-4 w-4 text-destructive" }))))));
                    }))))))));
}

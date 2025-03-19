

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProductsByCategory, } from "@/services/productService";
import { getCategoryById } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) // Nếu không có ID, thoát khỏi hàm.
                return;
            setLoading(true);
            try {
                const productData = await getProductById(id); // Gọi API
                if (!productData) {
                    navigate("/products"); // Nếu không tìm thấy sản phẩm, chuyển hướng về trang sản phẩm.
                    return;
                }
                setProduct(productData);
                setSelectedImage(productData.thumbnail); // Mặc định chọn hình ảnh thumbnail làm ảnh chính.
                // Lấy thông tin danh mục sản phẩm.
                if (productData.categoryId) {
                    const categoryData = await getCategoryById(productData.categoryId);
                    setCategory(categoryData || null);
                    // Lấy danh sách sản phẩm liên quan cùng danh mục.
                    const relatedProductsData = await getProductsByCategory(productData.categoryId);
                    // Lọc danh sách sản phẩm liên quan (loại bỏ sản phẩm hiện tại).
                    const filteredRelated = relatedProductsData
                        .filter((p) => p.id !== id)
                        .slice(0, 4);
                    setRelatedProducts(filteredRelated);
                }
            }
            catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Error loading product details");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id, navigate]);// useEffect sẽ chạy lại mỗi khi `id` hoặc `navigate` thay đổi.


    const handleQuantityChange = (value) => {
        if (value < 1) // Không cho phép số lượng nhỏ hơn 1
            return;
        if (product && value > product.stock) {
            toast.error(`Sorry, only ${product.stock} items in stock`); // Thông báo nếu vượt quá số lượng trong kho.
            return;
        }
        setQuantity(value);
    };
    const handleAddToCart = () => {
        if (!product) // Nếu không có sản phẩm, thoát khỏi hàm.
            return;
        addToCart(product.id, quantity);// Gọi hàm thêm sản phẩm vào giỏ hàng.
        toast.success(`Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`);
    };
    const handleBuyNow = () => {
        handleAddToCart();
        navigate("/checkout"); // Điều hướng đến trang thanh toán.
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading product details...")));
    }
    if (!product) { //Hiển thị khi sản phẩm không tồn tại
        return (React.createElement("div", { className: "text-center py-10" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Product not found"),
            React.createElement(Button, { variant: "default", asChild: true },
                React.createElement(Link, { to: "/products" }, "Browse Products"))));
    }

    return (React.createElement("div", { className: "space-y-8 mx-12" },
        // Thanh điều hướng
        React.createElement(Breadcrumb, null,
            React.createElement(BreadcrumbList, null,
                React.createElement(BreadcrumbItem, null,
                    React.createElement(BreadcrumbLink, { asChild: true },
                        React.createElement(Link, { to: "/" }, "Home"))),
                React.createElement(BreadcrumbSeparator, null),
                React.createElement(BreadcrumbItem, null,
                    React.createElement(BreadcrumbLink, { asChild: true },
                        React.createElement(Link, { to: "/products" }, "Products"))),
                category && (React.createElement(React.Fragment, null,
                    React.createElement(BreadcrumbSeparator, null),
                    React.createElement(BreadcrumbItem, null,
                        React.createElement(BreadcrumbLink, { asChild: true },
                            React.createElement(Link, { to: `/products?category=${category.slug}` }, category.name))))),
                React.createElement(BreadcrumbSeparator, null),
                React.createElement(BreadcrumbItem, null,
                    React.createElement("span", { className: "text-muted-foreground" }, product.title)))),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
            React.createElement("div", null,
                // Hình ảnh sản phẩm
                React.createElement("div", { className: "aspect-square bg-muted relative mb-4 rounded-lg overflow-hidden" },
                    React.createElement("div", { className: "w-full h-full bg-muted flex items-center justify-center" },
                        React.createElement("img", { src: selectedImage || product.thumbnail, alt: product.title, className: "object-contain h-full w-full" }))),
                React.createElement("div", { className: "grid grid-cols-4 gap-2" }, product.images.map((image, index) => (React.createElement("div", { key: index, className: "aspect-square rounded-md overflow-hidden cursor-pointer border-2 \r\n                           transition-colors hover:border-primary", onClick: () => setSelectedImage(image) },
                    React.createElement("div", { className: "w-full h-full bg-muted flex items-center justify-center" },
                        React.createElement("img", { src: image, alt: product.title, className: "object-contain h-full w-full" }))))))),
            // Thông tin sản phẩm
            React.createElement("div", { className: "space-y-6" },
                React.createElement("div", null,
                    React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        React.createElement(Badge, { variant: "outline" }, product.brand),
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("span", { className: "text-yellow-500 mr-1" }, "\u2605"),
                            React.createElement("span", null, product.rating))),
                    React.createElement("h1", { className: "text-3xl font-bold mb-2" }, product.title),
                    React.createElement("div", { className: "text-muted-foreground mb-4" }, product.description),
                    React.createElement("div", { className: "flex items-baseline gap-2" },
                        React.createElement("span", { className: "text-3xl font-bold" },
                            "$",
                            product.price.toFixed(2)),
                        product.discountPercentage > 0 && (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: "text-lg text-muted-foreground line-through" },
                                "$",
                                (product.price /
                                    (1 - product.discountPercentage / 100)).toFixed(2)),
                            React.createElement("span", { className: "bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm font-medium" },
                                product.discountPercentage,
                                "% OFF"))))),
                React.createElement(Separator, null),
                React.createElement("div", null,

                    // Chọn số lượng và thêm vào giỏ hàng
                    React.createElement("div", { className: "flex items-center mb-4" },
                        React.createElement("span", { className: "w-20" }, "Quantity:"),
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(Button, { variant: "outline", size: "icon", onClick: () => handleQuantityChange(quantity - 1), disabled: quantity <= 1 }, "-"),
                            React.createElement("span", { className: "w-12 text-center" }, quantity),
                            React.createElement(Button, { variant: "outline", size: "icon", onClick: () => handleQuantityChange(quantity + 1), disabled: quantity >= product.stock }, "+"),
                            React.createElement("span", { className: "ml-4 text-sm text-muted-foreground" },
                                product.stock,
                                " available"))),
                    React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                        React.createElement(Button, { onClick: handleAddToCart, className: "w-full" }, "Add to Cart"),
                        React.createElement(Button, { onClick: handleBuyNow, variant: "secondary", className: "w-full" }, "Buy Now"))),
                React.createElement(Separator, null),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "grid grid-cols-2 gap-2" },
                        React.createElement("div", { className: "text-sm text-muted-foreground" }, "Brand"),
                        React.createElement("div", null, product.brand),
                        Object.entries(product.specifications).map(([key, value]) => (React.createElement(React.Fragment, { key: key },
                            React.createElement("div", { className: "text-sm text-muted-foreground capitalize" }, key.replace(/([A-Z])/g, " $1").trim()),
                            React.createElement("div", null, value)))))))),
        React.createElement("div", null,
            //Tabs hiển thị thông tin sản phẩm
            React.createElement(Tabs, { defaultValue: "features" },
                React.createElement(TabsList, { className: "w-full grid grid-cols-3" },
                    React.createElement(TabsTrigger, { value: "features" }, "Features"),
                    React.createElement(TabsTrigger, { value: "specifications" }, "Specifications"),
                    React.createElement(TabsTrigger, { value: "shipping" }, "Shipping & Returns")),
                React.createElement(TabsContent, { value: "features", className: "p-4 border rounded-md mt-2" },
                    React.createElement("ul", { className: "list-disc list-inside space-y-1" }, product.features.map((feature, index) => (React.createElement("li", { key: index }, feature))))),
                React.createElement(TabsContent, { value: "specifications", className: "p-4 border rounded-md mt-2" },
                    React.createElement("div", { className: "grid grid-cols-2 gap-2" }, Object.entries(product.specifications).map(([key, value]) => (React.createElement(React.Fragment, { key: key },
                        React.createElement("div", { className: "font-medium capitalize" }, key.replace(/([A-Z])/g, " $1").trim()),
                        React.createElement("div", null, value)))))),
                React.createElement(TabsContent, { value: "shipping", className: "p-4 border rounded-md mt-2" },
                    React.createElement("div", { className: "space-y-4" },
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-1" }, "Shipping Information"),
                            React.createElement("p", { className: "text-sm text-muted-foreground" }, "Free standard shipping on orders over $35. Estimated delivery time: 3-5 business days.")),
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-medium mb-1" }, "Return Policy"),
                            React.createElement("p", { className: "text-sm text-muted-foreground" }, "Returns accepted within 30 days of delivery. Item must be unused and in original packaging.")))))),
        relatedProducts.length > 0 && (React.createElement("div", null,
            React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Related Products"),
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" }, relatedProducts.map((relProduct) => (React.createElement(Card, { key: relProduct.id, className: "overflow-hidden" },
                React.createElement(Link, { to: `/products/${relProduct.id}`, className: "block h-40 overflow-hidden" },
                    React.createElement("div", { className: "w-full h-full bg-muted flex items-center justify-center" },
                        React.createElement("img", { src: relProduct.thumbnail, alt: "\uD83D\uDDBC\uFE0F" }))),
                React.createElement(CardContent, { className: "p-3" },
                    React.createElement("div", { className: "font-medium line-clamp-2 mb-1" },
                        React.createElement(Link, { to: `/products/${relProduct.id}` }, relProduct.title)),
                    React.createElement("div", { className: "text-sm font-bold" },
                        "$",
                        relProduct.price.toFixed(2)),
                    React.createElement(Button, {
                        variant: "outline", size: "sm", className: "w-full mt-2", onClick: (e) => {
                            e.preventDefault();
                            addToCart(relProduct.id, 1);
                            toast.success(`Added ${relProduct.title} to cart`);
                        }
                    }, "Add to Cart"))))))))));
}

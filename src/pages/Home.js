import React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export default function Home() {
    // State lưu trữ danh sách
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh sách từ API
                const allProducts = await getProducts();
                const allCategories = await getCategories();

                // Chọn 4 sản phẩm có rating cao nhất làm sản phẩm nổi bật
                const topProducts = [...allProducts]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4);
                setFeaturedProducts(topProducts);
                setCategories(allCategories);
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Hiển thị màn hình loading nếu dữ liệu chưa tải xong
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64 text-xl font-semibold" },
            React.createElement("p", null, "Loading...")));
    }


    return (React.createElement("div", { className: " bg-gray-50 dark:bg-gray-900" },
        /* Phần banner giới thiệu */
        React.createElement("section", { className: "w-full py-36 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center" },
            React.createElement("div", { className: " mx-auto px-6 md:px-12 lg:px-20" },
                React.createElement("h1", { className: "text-5xl md:text-6xl font-extrabold leading-tight" }, "WELCOME TO EBAY"),
                React.createElement("p", { className: "mt-4 text-lg md:text-xl max-w-2xl mx-auto" }, "Discover endless possibilities. Shop electronics, fashion, home & garden, and more!"),
                React.createElement("div", { className: "mt-6" },
                    React.createElement(Button, { className: "px-8 py-3 text-lg font-semibold bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-100" }, "Get Started")))),
        /* Phần Category */
        React.createElement("section", { className: "container mx-auto px-6 py-6" },
            React.createElement("h2", { className: "text-3xl font-semibold text-center mb-6" }, "Shop by Category"),
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" }, categories.map((category) => (React.createElement(Link, { key: category.id, to: `/products?category=${category.slug}`, className: "group" },
                React.createElement("div", { className: "border border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg bg-white dark:bg-gray-800" },
                    React.createElement("div", { className: "flex justify-center items-center mb-3 h-16 text-4xl" }, "\uD83D\uDCE6"),
                    React.createElement("h3", { className: "font-medium text-lg group-hover:text-blue-500" }, category.name))))))),
        /* Phần sản phẩm nổi bật */
        React.createElement("section", { className: "container mx-auto px-6 py-6" },
            React.createElement("h2", { className: "text-3xl font-semibold text-center mb-6" }, "Featured Products"),
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" }, featuredProducts.map((product) => (React.createElement(Card, { key: product.id, className: "overflow-hidden h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg" },
                /* Hình ảnh */
                React.createElement(Link, { to: `/products/${product.id}`, className: "overflow-hidden" },
                    React.createElement("div", { className: "h-56 overflow-hidden flex justify-center items-center bg-gray-100 dark:bg-gray-700" },
                        React.createElement("img", { src: product.thumbnail, alt: "🖼️", className: "object-contain h-48" }))),
                /* Thông tin sản phẩm */
                React.createElement(CardHeader, { className: "p-4" },
                    React.createElement("div", { className: "flex justify-between" },
                        React.createElement(Badge, { className: "bg-blue-500 text-white" }, product.brand),
                        React.createElement("div", { className: "flex items-center text-yellow-500" },
                            "\u2605",
                            " ",
                            React.createElement("span", { className: "ml-1 text-lg font-bold" }, product.rating))),
                    React.createElement(CardTitle, { className: "text-lg truncate mt-2" },
                        React.createElement(Link, { to: `/products/${product.id}`, className: "hover:text-blue-500" }, product.title))),
                React.createElement(CardContent, { className: "p-4 text-gray-600 dark:text-gray-300" },
                    React.createElement("p", { className: "line-clamp-2 text-sm" }, product.description)),
                React.createElement(CardFooter, { className: "p-4 flex justify-between items-center border-t" },
                    /* Giá sản phẩm */
                    React.createElement("div", { className: "font-bold text-lg text-blue-600" },
                        "$",
                        product.price.toFixed(2))))))),

            /* Nút xem tất cả sản phẩm */
            React.createElement("div", { className: "mt-8 text-center" },
                React.createElement(Button, { asChild: true, variant: "outline", className: "px-8 py-3 text-lg font-semibold border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white" },
                    React.createElement(Link, { to: "/products" }, "View All Products"))))));
}

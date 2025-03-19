import React from "react";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
export default function ProductList() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState("newest");
    const categoryParam = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allCategories = await getCategories();// Gọi API 
                setCategories(allCategories);
                const allProducts = await getProducts();

                // Lọc danh sách Brands (bỏ trùng lặp)
                const uniqueBrands = Array.from(new Set(allProducts.map((p) => p.brand)));
                setBrands(uniqueBrands);

                let filteredProducts = [...allProducts]; // Bản sao của danh sách sản phẩm để xử lý lọc(tránh thay đổi dữ liệu gốc)
                // Nếu có tham số category, lọc sản phẩm theo category
                if (categoryParam) {
                    const category = allCategories.find((c) => c.slug === categoryParam);
                    if (category) {
                        filteredProducts = filteredProducts.filter((p) => p.categoryId === category.id);
                    }
                }

                // Nếu có từ khóa tìm kiếm, lọc sản phẩm theo tên, mô tả hoặc thương hiệu
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filteredProducts = filteredProducts.filter((p) => p.title.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query) ||
                        p.brand.toLowerCase().includes(query));
                }
                setProducts(filteredProducts);
            }
            catch (error) {
                console.error("Error fetching data:", error); // In lỗi nếu có
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryParam, searchQuery]); // Chạy lại mỗi khi categoryParam hoặc searchQuery thay đổi

    const applyFilters = async () => {
        try {
            const filteredProducts = await getProducts();
            let updatedProducts = [...filteredProducts];

            // Lọc theo category
            if (categoryParam) {
                const category = categories.find((c) => c.slug === categoryParam);
                if (category) {
                    updatedProducts = updatedProducts.filter((p) => p.categoryId === category.id);
                }
            }

            // Lọc theo từ khóa tìm kiếm
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                updatedProducts = updatedProducts.filter((p) => p.title.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query));
            }

            // Lọc theo khoảng giá
            updatedProducts = updatedProducts.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

            // Lọc theo thương hiệu
            if (selectedBrands.length > 0) {
                updatedProducts = updatedProducts.filter((p) => selectedBrands.includes(p.brand));
            }

            // Sắp xếp sản phẩm
            if (sortBy === "price-asc") {
                updatedProducts.sort((a, b) => a.price - b.price);
            }
            else if (sortBy === "price-desc") {
                updatedProducts.sort((a, b) => b.price - a.price);
            }
            else if (sortBy === "rating") {
                updatedProducts.sort((a, b) => b.rating - a.rating);
            }
            setProducts(updatedProducts);
        }
        catch (error) {
            console.error("Error applying filters:", error);
        }
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" }, "Loading products..."));
    }
    return (React.createElement("div", { className: "flex flex-col lg:flex-row gap-8" },
        React.createElement(ProductFilters, { applyFilters: applyFilters, categories: categories, brands: brands, selectedBrands: selectedBrands, setSelectedBrands: setSelectedBrands, priceRange: priceRange, setPriceRange: setPriceRange, sortBy: sortBy, setSortBy: setSortBy }),
        React.createElement(ProductGrid, { products: products })));
}

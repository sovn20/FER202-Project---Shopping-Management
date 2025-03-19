import React, { useEffect } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Component bộ lọc sản phẩm (lọc theo giá, brand, sắp xếp)
export default function ProductFilters({ categories, brands, selectedBrands, setSelectedBrands, priceRange, setPriceRange, sortBy, setSortBy, applyFilters, }) {
    // Gọi applyFilters mỗi khi có thay đổi ở bộ lọc
    useEffect(() => {
        applyFilters();
    }, [selectedBrands, priceRange, sortBy]);

    return (
        React.createElement("div", { className: "lg:w-1/4 space-y-6 bg-white border-r-2 p-6 dark:bg-gray-800" },
            // Container chính của bộ lọc (chiếm 1/4 màn hình trên thiết bị lớn, có padding và border phải)

            React.createElement("div", null,
                // Bộ lọc "Sort by" 
                React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Sort by"),
                React.createElement(Select, { value: sortBy, onValueChange: setSortBy },
                    React.createElement(SelectTrigger, { className: "w-full" },
                        React.createElement(SelectValue, { placeholder: "Sort by" })
                    ),
                    React.createElement(SelectContent, null,
                        React.createElement(SelectItem, { value: "newest" }, "Newest"),
                        React.createElement(SelectItem, { value: "price-asc" }, "Price: Low to High"),
                        React.createElement(SelectItem, { value: "price-desc" }, "Price: High to Low"),
                        React.createElement(SelectItem, { value: "rating" }, "Rating")
                    )
                )
            ),

            React.createElement("div", null,
                // Bộ lọc "Price Range" 
                React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Price Range"),
                React.createElement(Slider, {
                    defaultValue: [0, 2000], // Giá trị mặc định
                    max: 2000, // Giá trị tối đa của slider
                    step: 10, // Bước nhảy khi kéo slider
                    value: priceRange, // Giá trị hiện tại của khoảng giá
                    onValueChange: (value) => setPriceRange(value), // Cập nhật state khi giá trị thay đổi
                    className: "mb-4"
                }),
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement(Input, {
                        type: "number",
                        value: priceRange[0],
                        onChange: (e) => setPriceRange([Number(e.target.value), priceRange[1]]),
                        className: "w-24"
                    }),
                    React.createElement("span", null, "to"),
                    React.createElement(Input, {
                        type: "number",
                        value: priceRange[1],
                        onChange: (e) => setPriceRange([priceRange[0], Number(e.target.value)]),
                        className: "w-24"
                    })
                )
            ),

            React.createElement("div", null,
                // Bộ lọc "Brand" 
                React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Brand"),
                React.createElement("div", { className: "space-y-2" },
                    brands.map((brand) => ( // Lặp qua danh sách brand
                        React.createElement("div", { key: brand, className: "flex items-center" },
                            React.createElement(Checkbox, {
                                id: `brand-${brand}`,
                                checked: selectedBrands.includes(brand), // Kiểm tra xem brand đã được chọn chưa
                                onCheckedChange: (checked) => setSelectedBrands(
                                    checked ? [...selectedBrands, brand] : selectedBrands.filter((b) => b !== brand)
                                ) // Nếu được chọn thì thêm vào danh sách, nếu bỏ chọn thì loại bỏ
                            }),
                            React.createElement("label", {
                                htmlFor: `brand-${brand}`,
                                className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                            }, brand)
                        )
                    ))
                )
            )
        )
    );
}

import React from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Component hiển thị danh sách sản phẩm theo dạng lưới
export default function ProductGrid({ products }) {
    return (
        React.createElement("div", { className: "lg:w-3/4 my-8" }, // Container chính có chiều rộng 3/4 trên màn hình lớn
            React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" },
                // Grid layout:
                // 1 cột trên mobile (grid-cols-1)
                // 2 cột trên màn hình nhỏ (sm:grid-cols-2)
                // 3 cột trên màn hình lớn (lg:grid-cols-3)
                // Khoảng cách giữa các cột là 6 (gap-6)

                products.map((product) => ( // Lặp qua danh sách sản phẩm
                    React.createElement(Card, { key: product.id, className: "overflow-hidden flex flex-col h-full" },
                        // Mỗi sản phẩm hiển thị trong một Card
                        // overflow-hidden: Giúp nội dung không tràn ra ngoài
                        // flex flex-col: Hiển thị theo chiều dọc
                        // h-full: Đảm bảo card có chiều cao đầy đủ

                        // Link bọc toàn bộ hình ảnh sản phẩm, điều hướng đến trang chi tiết
                        React.createElement(Link, { to: `/products/${product.id}`, className: "overflow-hidden" },
                            React.createElement("div", { className: "h-48 overflow-hidden" },
                                React.createElement("div", { className: "w-full h-full bg-muted flex items-center justify-center" },
                                    product.thumbnail
                                        ? React.createElement("img", { src: product.thumbnail, alt: product.title, className: "object-cover h-48" })
                                        : React.createElement("span", { className: "text-2xl" }, "\uD83D\uDDBC\uFE0F")
                                    // Nếu có ảnh, hiển thị ảnh với class "object-cover h-48"
                                    // Nếu không có ảnh, hiển thị emoji 🖼️ thay thế
                                )
                            )
                        ),

                        // Phần tiêu đề của Card chứa brand, đánh giá và tên sản phẩm
                        React.createElement(CardHeader, { className: "pb-2" },
                            React.createElement("div", { className: "flex justify-between" },
                                React.createElement(Badge, null, product.brand), // Hiển thị brand dưới dạng Badge
                                React.createElement("div", { className: "flex items-center" },
                                    React.createElement("span", { className: "text-yellow-500 mr-1" }, "\u2605"), // Biểu tượng sao ⭐
                                    React.createElement("span", { className: "text-sm" }, product.rating) // Hiển thị điểm đánh giá
                                )
                            ),
                            // Tiêu đề sản phẩm có thể điều hướng đến trang chi tiết
                            React.createElement(CardTitle, { className: "text-lg truncate" },
                                React.createElement(Link, { to: `/products/${product.id}` }, product.title)
                            )
                        ),

                        // Phần nội dung của sản phẩm: mô tả ngắn
                        React.createElement(CardContent, { className: "pb-2 flex-grow" },
                            React.createElement("p", { className: "text-muted-foreground line-clamp-2 text-sm" }, product.description)
                            // text-muted-foreground: Màu chữ nhẹ
                            // line-clamp-2: Giới hạn tối đa 2 dòng
                        ),

                        // Nút "View Details" để điều hướng đến chi tiết sản phẩm
                        React.createElement(CardFooter, null,
                            React.createElement(Button, { variant: "outline", asChild: true },
                                React.createElement(Link, { to: `/products/${product.id}` }, "View Details")
                                // Button có kiểu outline, khi bấm sẽ dẫn đến trang chi tiết sản phẩm
                            )
                        )
                    )
                ))
            )
        )
    );
}

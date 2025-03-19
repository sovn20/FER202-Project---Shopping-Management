import React from "react";

import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ShoppingCart, LogIn, UserCircle, LogOut, Search, Package, LayoutDashboard, } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Header() {
    var _a;
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };
    return (React.createElement("header", { className: "bg-white border-b h-24 border-border sticky top-0 z-50 shadow-md flex items-center px-8" },
        React.createElement("div", { className: "container mx-auto flex items-center justify-between" },
            React.createElement(Link, { to: "/", className: "flex items-center" },
                React.createElement("img", { 
                    src: "/images/2025-03-17_025746.png", 
                    alt: "eBay Clone", 
                    className: "h-10 w-auto" 
                })
            ),
            
            React.createElement("form", { onSubmit: handleSearch, className: "flex-1 mx-10" },
                React.createElement("div", { className: "relative w-full" },
                    React.createElement(Input, { type: "search", placeholder: "Search for anything...", className: "w-full h-12 text-2xl pr-12 py-6 rounded-full border-2", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }),
                    React.createElement(Button, { type: "submit", size: "icon", variant: "ghost", className: "absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full" // Thêm border radius
                     },
                        React.createElement(Search, { className: "h-6 w-6" })))),
            React.createElement("nav", { className: "flex items-center gap-6 p-4" }, isAuthenticated ? (React.createElement(React.Fragment, null,
                React.createElement(Link, { to: "/cart" },
                    React.createElement(Button, { variant: "outline", size: "icon", className: "relative p-6" },
                        React.createElement(ShoppingCart, { className: "h-16 w-16" }),
                        totalItems > 0 && (React.createElement("span", { className: "absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-sm w-8 h-8 flex items-center justify-center" }, totalItems)))),
                React.createElement(DropdownMenu, null,
                    React.createElement(DropdownMenuTrigger, { asChild: true },
                        React.createElement(Button, { variant: "ghost", size: "icon", className: "rounded-full p-3" },
                            React.createElement(Avatar, { className: "w-12 h-12" },
                                React.createElement(AvatarImage, { src: (user === null || user === void 0 ? void 0 : user.avatarUrl) || "", alt: user === null || user === void 0 ? void 0 : user.name }),
                                React.createElement(AvatarFallback, { className: "text-lg" }, ((_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.substring(0, 2).toUpperCase()) || "U")))),
                    React.createElement(DropdownMenuContent, { align: "end" },
                        React.createElement(DropdownMenuLabel, { className: "text-xl" }, "My Account"),
                        React.createElement(DropdownMenuSeparator, null),
                        React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/profile", className: "cursor-pointer text-lg" },
                                React.createElement(UserCircle, { className: "mr-3 h-6 w-6" }),
                                " Profile")),
                        React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/orders", className: "cursor-pointer text-lg" },
                                React.createElement(Package, { className: "mr-3 h-6 w-6" }),
                                " Orders")),
                        (user === null || user === void 0 ? void 0 : user.role) === "admin" && (React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/admin", className: "cursor-pointer text-lg" },
                                React.createElement(LayoutDashboard, { className: "mr-3 h-6 w-6" }),
                                " Admin Dashboard"))),
                        (user === null || user === void 0 ? void 0 : user.role) === "seller" && (React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/seller", className: "cursor-pointer text-lg" },
                                React.createElement(LayoutDashboard, { className: "mr-3 h-6 w-6" }),
                                " Seller Dashboard"))),
                        React.createElement(DropdownMenuSeparator, null),
                        React.createElement(DropdownMenuItem, { onClick: () => logout(), className: "cursor-pointer text-destructive text-lg" },
                            React.createElement(LogOut, { className: "mr-3 h-6 w-6" }),
                            " Logout"))))) : (React.createElement(React.Fragment, null,
                React.createElement(Button, { variant: "outline", asChild: true, className: "text-lg px-6 py-3" },
                    React.createElement(Link, { to: "/login" },
                        React.createElement(LogIn, { className: "mr-3 h-6 w-6" }),
                        " Login")),
                React.createElement(Button, { asChild: true, className: "text-lg px-6 py-3" },
                    React.createElement(Link, { to: "/register" }, "Register"))))))));
}

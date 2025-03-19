import React from "react";
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, ShoppingBasket, Users, Package, LogOut, ChevronRight, } from "lucide-react";
export function DashboardSidebar({ sidebarOpen, setSidebarOpen, user }) {
    const location = useLocation();
    const isAdmin = user.role === "admin";
    const basePath = isAdmin ? "/admin" : "/seller";
    const navItems = isAdmin
        ? [
            {
                name: "Dashboard",
                path: `${basePath}/dashboard`,
                icon: React.createElement(LayoutDashboard, { size: 20 }),
            },
            {
                name: "Products",
                path: `${basePath}/products`,
                icon: React.createElement(ShoppingBasket, { size: 20 }),
            },
            { name: "Users", path: `${basePath}/users`, icon: React.createElement(Users, { size: 20 }) },
            {
                name: "Orders",
                path: `${basePath}/orders`,
                icon: React.createElement(Package, { size: 20 }),
            },
        ]
        : [
            {
                name: "Dashboard",
                path: `${basePath}/dashboard`,
                icon: React.createElement(LayoutDashboard, { size: 20 }),
            },
            {
                name: "Products",
                path: `${basePath}/products`,
                icon: React.createElement(ShoppingBasket, { size: 20 }),
            },
            {
                name: "Orders",
                path: `${basePath}/orders`,
                icon: React.createElement(Package, { size: 20 }),
            },
        ];
    return (React.createElement("aside", { className: `bg-muted flex-shrink-0 border-r transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} relative` },
        React.createElement("div", { className: "p-4" },
            React.createElement("div", { className: `flex items-center w-full ${sidebarOpen ? "justify-start gap-2" : "justify-center"} mb-6` },
                React.createElement(
                    "div",
                    {
                        className: "bg-primary rounded-md p-1 text-primary-foreground font-bold text-lg w-full text-center",
                        onClick: () => window.location.href = "/home" // Đường dẫn đến trang chủ
                    },
                    sidebarOpen ? "eBay" : "eB"
                )
            ),
            React.createElement("nav", { className: "space-y-1" }, navItems.map((item) => (React.createElement(Link, {
                key: item.path, to: item.path, className: `flex items-center ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"} py-2 rounded-md hover:bg-secondary group ${location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground"}`
            },
                React.createElement("div", null, item.icon),
                sidebarOpen && React.createElement("span", null, item.name))))))));
}
export function DashboardHeader({ user, handleLogout, setSidebarOpen, sidebarOpen, }) {
    return (React.createElement("header", { className: "bg-background border-b z-10 h-16" },
        React.createElement("div", { className: "flex h-full justify-between items-center px-4" },
            React.createElement(Button, { variant: "outline", size: "icon", onClick: () => setSidebarOpen(!sidebarOpen) },
                React.createElement(ChevronRight, { size: 16, className: `transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}` })),
            React.createElement("div", { className: "ml-auto flex items-center gap-2" },
                React.createElement(DropdownMenu, null,
                    React.createElement(DropdownMenuTrigger, { asChild: true },
                        React.createElement(Button, { variant: "ghost", className: "relative h-10 rounded-full" },
                            React.createElement(Avatar, { className: "h-8 w-8" },
                                React.createElement(AvatarImage, { src: user.avatarUrl, alt: user.name }),
                                React.createElement(AvatarFallback, null, user.name.substring(0, 2).toUpperCase())))),
                    React.createElement(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true },
                        React.createElement("div", { className: "p-2" },
                            React.createElement("p", { className: "font-medium text-sm" }, user.name),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, user.email)),
                        React.createElement(DropdownMenuSeparator, null),
                        React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/" }, "Go to Main Site")),
                        React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/profile" }, "Profile")),
                        React.createElement(DropdownMenuItem, { asChild: true },
                            React.createElement(Link, { to: "/profile/settings" }, "Settings")),
                        React.createElement(DropdownMenuSeparator, null),
                        React.createElement(DropdownMenuItem, { className: "cursor-pointer", onClick: handleLogout },
                            React.createElement(LogOut, { className: "mr-2 h-4 w-4" }),
                            "Log out")))))));
}
export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    if (!user) {
        return null;
    }
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (React.createElement("div", { className: "flex h-screen bg-background" },
        React.createElement(DashboardSidebar, { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen, user: user }),
        React.createElement("div", { className: "flex flex-col flex-1 overflow-hidden" },
            React.createElement(DashboardHeader, { user: user, handleLogout: handleLogout, setSidebarOpen: setSidebarOpen, sidebarOpen: sidebarOpen }),
            React.createElement("main", { className: "flex-1 overflow-y-auto p-6" },
                React.createElement(Outlet, null)))));
}

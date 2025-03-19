import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// Public Pages
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserProfile from "@/pages/UserProfile";
// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminUsers from "@/pages/admin/Users";
// Seller Pages
import SellerDashboard from "@/pages/seller/Dashboard";
import SellerProducts from "@/pages/seller/Products";
import SellerOrders from "@/pages/seller/Orders";
export default function AppRoutes() {
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: "/", element: React.createElement(MainLayout, null) },
            React.createElement(Route, { index: true, element: React.createElement(Home, null) }),
            React.createElement(Route, { path: "products", element: React.createElement(ProductList, null) }),
            React.createElement(Route, { path: "products/:id", element: React.createElement(ProductDetail, null) }),
            React.createElement(Route, { path: "cart", element: React.createElement(Cart, null) }),
            React.createElement(Route, { path: "checkout", element: React.createElement(Checkout, null) }),
            React.createElement(Route, { path: "login", element: React.createElement(Login, null) }),
            React.createElement(Route, { path: "register", element: React.createElement(Register, null) }),
            React.createElement(Route, { path: "profile", element: React.createElement(UserProfile, null) })),
        React.createElement(Route, { path: "/admin", element: React.createElement(ProtectedRoute, { allowedRoles: ["admin"] },
                React.createElement(DashboardLayout, null)) },
            React.createElement(Route, { index: true, element: React.createElement(Navigate, { to: "/admin/dashboard", replace: true }) }),
            React.createElement(Route, { path: "dashboard", element: React.createElement(AdminDashboard, null) }),
            React.createElement(Route, { path: "products", element: React.createElement(AdminProducts, null) }),
            React.createElement(Route, { path: "users", element: React.createElement(AdminUsers, null) }),
            React.createElement(Route, { path: "orders", element: React.createElement(AdminOrders, null) })),
        React.createElement(Route, { path: "/seller", element: React.createElement(ProtectedRoute, { allowedRoles: ["seller"] },
                React.createElement(DashboardLayout, null)) },
            React.createElement(Route, { index: true, element: React.createElement(Navigate, { to: "/seller/dashboard", replace: true }) }),
            React.createElement(Route, { path: "dashboard", element: React.createElement(SellerDashboard, null) }),
            React.createElement(Route, { path: "products", element: React.createElement(SellerProducts, null) }),
            React.createElement(Route, { path: "orders", element: React.createElement(SellerOrders, null) })),
        React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: "/", replace: true }) })));
}

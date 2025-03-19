import React from "react";

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default function MainLayout() {
    return (React.createElement("div", { className: "flex flex-col bg-background" },
        React.createElement(Header, null),
        React.createElement("main", { className: "flex-1" },
            React.createElement(Outlet, null)),
        React.createElement(Footer, null)));
}

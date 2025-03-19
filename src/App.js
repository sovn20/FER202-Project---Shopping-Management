
import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import AppRoutes from "@/routes";
import "./App.css";
import { Toaster } from "sonner";
// Create a client
const queryClient = new QueryClient();
function App() {
    return (React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(AuthProvider, null,
            React.createElement(CartProvider, null,
                React.createElement(Router, null,
                    React.createElement(AppRoutes, null),
                    React.createElement(Toaster, { position: "bottom-right" }))))));
}
export default App;

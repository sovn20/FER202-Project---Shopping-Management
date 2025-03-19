import React from "react";

import { createContext, useContext, useState, useEffect, } from "react";
import { getUsers, registerUser } from "@/services/authService";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Thêm loading state
    useEffect(() => {
        // Đánh dấu đang loading
        setIsLoading(true);
        // Kiểm tra session user từ localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            }
            catch (error) {
                // Xử lý lỗi khi parse JSON
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem("user"); // Xóa dữ liệu không hợp lệ
            }
        }
        // Đánh dấu đã load xong
        setIsLoading(false);
    }, []);
    const login = async (email, password) => {
        try {
            const users = await getUsers();
            const foundUser = users.find((user) => user.email === email && user.password === password);
            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(foundUser));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
    };
    const register = async (userData) => {
        const success = await registerUser(userData);
        return success;
    };
    const hasRole = (roles) => {
        if (!user)
            return false;
        return roles.includes(user.role);
    };
    // Cung cấp isLoading cho consumer components
    return (React.createElement(AuthContext.Provider, { value: {
            user,
            isAuthenticated,
            isLoading,
            login,
            logout,
            register,
            hasRole,
        } }, children));
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

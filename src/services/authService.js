import React from "react";

import axiosInstance from "./axiosInstance";
export async function getUsers() {
    const response = await axiosInstance.get("/users");
    return response.data;
}
export async function getUserById(id) {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
}
export async function getUsersByRole(role) {
    const response = await axiosInstance.get(`/users`, { params: { role } });
    return response.data;
}
export async function deleteUser(userId) {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
export async function registerUser(userData) {
    var _a, _b;
    try {
        const newUser = Object.assign(Object.assign({}, userData), { id: Date.now().toString(), createdAt: new Date().toISOString(), storeInfo: userData.role === "seller"
                ? {
                    name: ((_a = userData.storeInfo) === null || _a === void 0 ? void 0 : _a.name) || "New Store",
                    description: ((_b = userData.storeInfo) === null || _b === void 0 ? void 0 : _b.description) || "Store Description",
                    rating: 0,
                    totalSales: 0,
                }
                : undefined });
        const response = await axiosInstance.post("/users", newUser);
        if (response.status === 201) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("Registration error:", error);
        return false;
    }
}

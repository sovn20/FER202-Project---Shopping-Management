import { v4 as uuidv4 } from "uuid";
import axiosInstance from "./axiosInstance";
export async function getOrders() {
    const response = await axiosInstance.get("/orders");
    return response.data;
}
export async function getOrderById(id) {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
}
export async function getOrdersByUser(userId) {
    const response = await axiosInstance.get(`/orders`, { params: { userId } });
    return response.data;
}
export async function createOrder(userId, items, totalAmount, shippingAddress, paymentMethod) {
    const newOrder = {
        id: uuidv4(),
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Processing",
        createdAt: new Date().toISOString(),
    };
    const response = await axiosInstance.post("/orders", newOrder);
    return response.data;
}

import axiosInstance from "./axiosInstance";
export async function getCategories() {
    const response = await axiosInstance.get("/categories");
    return response.data;
}
export async function getCategoryById(id) {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
}
export async function getCategoryBySlug(slug) {
    const response = await axiosInstance.get(`/categories`, { params: { slug } });
    return response.data.length > 0 ? response.data[0] : undefined;
}

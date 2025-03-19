import axiosInstance from "./axiosInstance"; // Import axiosInstance (đã được cấu hình sẵn với baseURL)

// 📌 Hàm lấy danh sách tất cả sản phẩm
export async function getProducts() {
    const response = await axiosInstance.get("/products"); // Gửi request GET đến endpoint /products
    return response.data; // Trả về dữ liệu sản phẩm từ API
}

// 📌 Hàm lấy thông tin chi tiết của một sản phẩm theo ID
export async function getProductById(id) {
    const response = await axiosInstance.get(`/products/${id}`); // Gửi request GET đến endpoint /products/{id}
    return response.data; // Trả về dữ liệu chi tiết của sản phẩm
}

// 📌 Hàm lấy danh sách sản phẩm theo danh mục
export async function getProductsByCategory(categoryId) {
    const response = await axiosInstance.get(`/products`, {
        params: { categoryId }, // Truyền categoryId dưới dạng query parameter
    });
    return response.data; // Trả về danh sách sản phẩm theo danh mục
}

// 📌 Hàm xóa một sản phẩm theo ID
export async function deleteProduct(id) {
    try {
        const response = await axiosInstance.delete(`/products/${id}`); // Gửi request DELETE đến /products/{id}
        return response.data; // Trả về phản hồi từ server nếu xóa thành công
    } catch (error) {
        console.error("Error deleting product:", error); // Log lỗi nếu có vấn đề khi xóa
        return false; // Trả về false nếu có lỗi xảy ra
    }
}

// 📌 Hàm lấy danh sách sản phẩm của một người bán
export async function getProductsBySeller(sellerId) {
    const response = await axiosInstance.get(`/products`, {
        params: { sellerId }, // Truyền sellerId dưới dạng query parameter
    });
    return response.data; // Trả về danh sách sản phẩm của người bán
}

// 📌 Hàm tạo một sản phẩm mới
export async function createProduct(productData) {
    try {
        // Thêm ID tạm thời và thời gian tạo cho sản phẩm mới
        const newProduct = {
            ...productData,
            id: Date.now().toString(), // Tạo ID tạm thời dựa trên timestamp
            createdAt: new Date().toISOString(), // Thêm timestamp cho sản phẩm
        };

        const response = await axiosInstance.post("/products", newProduct); // Gửi request POST đến /products
        return response.status === 201 ? newProduct : null; // Trả về sản phẩm mới nếu tạo thành công
    } catch (error) {
        console.error("Error creating product:", error); // Log lỗi nếu có vấn đề
        return null; // Trả về null nếu thất bại
    }
}

// 📌 Hàm tìm kiếm sản phẩm theo từ khóa
export async function searchProducts(query) {
    const response = await axiosInstance.get(`/products`, {
        params: { q: query }, // Truyền query dưới dạng tham số tìm kiếm
    });
    return response.data; // Trả về danh sách sản phẩm phù hợp
}

// 📌 Hàm chỉnh sửa sản phẩm theo ID
export async function editProduct(id, updatedData) {
    try {
        const response = await axiosInstance.put(`/products/${id}`, updatedData); // Gửi request PUT đến /products/{id}
        return response.status === 200; // Trả về true nếu cập nhật thành công
    } catch (error) {
        console.error("Error editing product:", error); // Log lỗi nếu có vấn đề
        return false; // Trả về false nếu thất bại
    }
}

// 📌 Hàm lọc sản phẩm theo nhiều tiêu chí (danh mục, giá, brand, sắp xếp)
export async function filterProducts({ categoryId, minPrice, maxPrice, brands, sortBy }) {
    const params = {
        categoryId, // Lọc theo danh mục
        price_gte: minPrice,
        price_lte: maxPrice,
        ...(brands && brands.length > 0 && { brand: brands }), // Nếu có brand, thêm vào bộ lọc
        _sort: sortBy === "newest" ? "createdAt"
            : sortBy === "rating" ? "rating"
                : "price", // Sắp xếp theo ngày tạo, đánh giá hoặc giá
        _order: sortBy === "price-desc" ? "desc" : "asc", // Sắp xếp tăng/giảm dần
    };

    const response = await axiosInstance.get(`/products`, { params }); // Gửi request GET với tham số lọc
    return response.data; // Trả về danh sách sản phẩm lọc được
}

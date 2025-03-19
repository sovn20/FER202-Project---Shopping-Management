import React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { createProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { PlusCircle, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export default function ProductDialog() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [features, setFeatures] = useState([]);
    const [specifications, setSpecifications] = useState({});
    const [specificationKeys, setSpecificationKeys] = useState({});
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        brand: "",
        categoryId: "",
        sellerId: user === null || user === void 0 ? void 0 : user.id, // Gán mặc định, cập nhật dựa trên user đăng nhập
        thumbnail: "",
        images: [],
        features: [],
        specifications: {},
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                const uniqueBrands = ["Samsung", "Apple", "Sony", "LG", "Dell"]; // Giả lập danh sách brands
                setBrands(uniqueBrands);
            }
            catch (error) {
                console.error("Error fetching categories and brands:", error);
            }
        };
        fetchData();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = [
            "price",
            "discountPercentage",
            "rating",
            "stock",
        ].includes(name)
            ? parseFloat(value)
            : value;
        setFormData(Object.assign(Object.assign({}, formData), { [name]: parsedValue }));
    };
    const handleCategoryChange = (categoryId) => {
        setFormData(Object.assign(Object.assign({}, formData), { categoryId }));
    };
    const handleBrandChange = (brand) => {
        setFormData(Object.assign(Object.assign({}, formData), { brand }));
    };
    // Handle Features
    const handleAddFeature = () => {
        setFeatures([...features, ""]);
    };
    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...features];
        updatedFeatures[index] = value;
        setFeatures(updatedFeatures);
    };
    const handleRemoveFeature = (index) => {
        const updatedFeatures = [...features];
        updatedFeatures.splice(index, 1);
        setFeatures(updatedFeatures);
    };
    // Improved specification handling
    const handleAddSpecification = () => {
        const newId = `spec-${Object.keys(specifications).length + 1}`;
        setSpecifications(Object.assign(Object.assign({}, specifications), { [newId]: "" }));
        setSpecificationKeys(Object.assign(Object.assign({}, specificationKeys), { [newId]: "" }));
    };
    const handleSpecKeyChange = (specId, keyValue) => {
        setSpecificationKeys(Object.assign(Object.assign({}, specificationKeys), { [specId]: keyValue }));
    };
    const handleSpecValueChange = (specId, value) => {
        setSpecifications(Object.assign(Object.assign({}, specifications), { [specId]: value }));
    };
    const handleRemoveSpecification = (specId) => {
        const updatedSpecs = Object.assign({}, specifications);
        const updatedSpecKeys = Object.assign({}, specificationKeys);
        delete updatedSpecs[specId];
        delete updatedSpecKeys[specId];
        setSpecifications(updatedSpecs);
        setSpecificationKeys(updatedSpecKeys);
    };
    const handleSubmit = async () => {
        if (!formData.title ||
            !formData.price ||
            !formData.categoryId ||
            !formData.brand) {
            toast.error("Please fill in required fields.");
            return;
        }
        // Create final specifications object with actual keys and values
        const finalSpecifications = {};
        Object.keys(specifications).forEach((specId) => {
            const actualKey = specificationKeys[specId] || specId;
            const value = specifications[specId];
            if (actualKey && value) {
                finalSpecifications[actualKey] = value;
            }
        });
        const formattedData = Object.assign(Object.assign({}, formData), {
            features, specifications: finalSpecifications, images: formData.images.length > 0
                ? formData.images
                : [
                    `${formData.thumbnail}`,
                    `${formData.thumbnail}`,
                    `${formData.thumbnail}`,
                ]
        });
        const success = await createProduct(formattedData);
        if (success) {
            toast.success("Product created successfully!");
        }
        else {
            toast.error("Failed to create product.");
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogTrigger, { asChild: true },
            React.createElement(Button, null,
                React.createElement(PlusCircle, { className: "mr-2 h-4 w-4" }),
                "Add Product")),
        React.createElement(DialogContent, { className: "max-w-lg" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null, "Create a New Product")),
            React.createElement(ScrollArea, { className: "max-h-[70vh] p-2" },
                React.createElement("div", { className: "grid gap-4" },
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "title" }, "Product Title"),
                        React.createElement(Input, { id: "title", name: "title", value: formData.title, onChange: handleChange })),
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "description" }, "Description"),
                        React.createElement(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleChange })),
                    
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "thumbnail" }, "Thumbnail"),
                        React.createElement(Input, { id: "thumbnail", name: "thumbnail", value: formData.thumbnail, onChange: handleChange })),
                    React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "price" }, "Price ($)"),
                            React.createElement(Input, { type: "number", id: "price", name: "price", value: formData.price, onChange: handleChange })),
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "stock" }, "Stock"),
                            React.createElement(Input, { type: "number", id: "stock", name: "stock", value: formData.stock, onChange: handleChange })),
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "discountPercentage" }, "Discount (%)"),
                            React.createElement(Input, { type: "number", id: "discountPercentage", name: "discountPercentage", value: formData.discountPercentage, onChange: handleChange }))),
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "brand" }, "Brand"),
                        React.createElement(Input, { type: "text", id: "brand", name: "brand", value: formData.brand, onChange: handleChange })),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Category"),
                        React.createElement(Select, { onValueChange: handleCategoryChange },
                            React.createElement(SelectTrigger, { className: "w-full" },
                                React.createElement(SelectValue, { placeholder: "Select a category" })),
                            React.createElement(SelectContent, null, categories.map((category) => (React.createElement(SelectItem, { key: category.id, value: category.id }, category.name)))))),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Features"),
                        features.map((feature, index) => (React.createElement("div", { key: index, className: "flex gap-2 mb-2" },
                            React.createElement(Input, { value: feature, onChange: (e) => handleFeatureChange(index, e.target.value) }),
                            React.createElement(Button, { variant: "destructive", size: "icon", onClick: () => handleRemoveFeature(index) },
                                React.createElement(Trash2, { size: 16 }))))),
                        React.createElement(Button, { onClick: handleAddFeature, className: "mt-2" },
                            React.createElement(Plus, { size: 16, className: "mr-2" }),
                            " Add Feature")),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Specifications"),
                        Object.keys(specifications).map((specId) => (React.createElement("div", { key: specId, className: "flex gap-2 mb-2" },
                            React.createElement(Input, { placeholder: "Specification Key", value: specificationKeys[specId] || "", onChange: (e) => handleSpecKeyChange(specId, e.target.value) }),
                            React.createElement(Input, { placeholder: "Specification Value", value: specifications[specId], onChange: (e) => handleSpecValueChange(specId, e.target.value) }),
                            React.createElement(Button, { variant: "destructive", size: "icon", onClick: () => handleRemoveSpecification(specId) },
                                React.createElement(Trash2, { size: 16 }))))),
                        React.createElement(Button, { onClick: handleAddSpecification, className: "mt-2" },
                            React.createElement(Plus, { size: 16, className: "mr-2" }),
                            " Add Specification")),
                    React.createElement(Button, { onClick: handleSubmit }, "Submit"))))));
}

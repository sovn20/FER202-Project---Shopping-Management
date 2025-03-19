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
import { editProduct, getProductById } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { Edit, Plus, Trash2 } from "lucide-react";
export default function ProductEditDialog({ productId, }) {
    var _a;
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        features: [],
        specifications: {},
    });
    const [specificationKeys, setSpecificationKeys] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await getProductById(productId);
                if (product) {
                    setFormData(product);
                    // Initialize specification keys from the product's specifications
                    const initialSpecKeys = {};
                    if (product.specifications) {
                        Object.keys(product.specifications).forEach((key, index) => {
                            const specId = `spec-${index}`;
                            initialSpecKeys[specId] = key;
                        });
                    }
                    setSpecificationKeys(initialSpecKeys);
                }
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            }
            catch (error) {
                console.error("Error fetching product or categories:", error);
            }
        };
        fetchData();
    }, [productId]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(Object.assign(Object.assign({}, formData), { [name]: ["price", "stock", "discountPercentage", "rating"].includes(name)
                ? Number(value)
                : value }));
    };
    const handleCategoryChange = (categoryId) => {
        setFormData(Object.assign(Object.assign({}, formData), { categoryId }));
    };
    // Handle Features
    const handleAddFeature = () => {
        setFormData(Object.assign(Object.assign({}, formData), { features: [...(formData.features || []), ""] }));
    };
    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...(formData.features || [])];
        updatedFeatures[index] = value;
        setFormData(Object.assign(Object.assign({}, formData), { features: updatedFeatures }));
    };
    const handleRemoveFeature = (index) => {
        const updatedFeatures = [...(formData.features || [])];
        updatedFeatures.splice(index, 1);
        setFormData(Object.assign(Object.assign({}, formData), { features: updatedFeatures }));
    };
    // Handle Specifications with key-value pairs
    const handleAddSpecification = () => {
        const newId = `spec-${Object.keys(specificationKeys).length + 1}`;
        // Update formData specifications
        setFormData(Object.assign(Object.assign({}, formData), { specifications: Object.assign(Object.assign({}, (formData.specifications || {})), { [newId]: "" }) }));
        // Add empty key to specificationKeys
        setSpecificationKeys(Object.assign(Object.assign({}, specificationKeys), { [newId]: "" }));
    };
    const handleSpecKeyChange = (specId, keyValue) => {
        setSpecificationKeys(Object.assign(Object.assign({}, specificationKeys), { [specId]: keyValue }));
    };
    const handleSpecValueChange = (specId, value) => {
        setFormData(Object.assign(Object.assign({}, formData), { specifications: Object.assign(Object.assign({}, (formData.specifications || {})), { [specId]: value }) }));
    };
    const handleRemoveSpecification = (specId) => {
        // Remove from specifications
        const updatedSpecifications = Object.assign({}, (formData.specifications || {}));
        delete updatedSpecifications[specId];
        setFormData(Object.assign(Object.assign({}, formData), { specifications: updatedSpecifications }));
        // Remove from specificationKeys
        const updatedSpecKeys = Object.assign({}, specificationKeys);
        delete updatedSpecKeys[specId];
        setSpecificationKeys(updatedSpecKeys);
    };
    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.categoryId) {
            toast.error("Please fill in required fields.");
            return;
        }
        // Create final specifications object with actual keys and values
        const finalSpecifications = {};
        Object.keys(formData.specifications || {}).forEach((specId) => {
            var _a;
            const actualKey = specificationKeys[specId] || specId;
            const value = ((_a = formData.specifications) === null || _a === void 0 ? void 0 : _a[specId]) || "";
            if (actualKey && value) {
                finalSpecifications[actualKey] = value;
            }
        });
        // Create a copy of formData with updated specifications
        const updatedFormData = Object.assign(Object.assign({}, formData), { specifications: finalSpecifications });
        const success = await editProduct(productId, updatedFormData);
        if (success) {
            toast.success("Product updated successfully!");
        }
        else {
            toast.error("Failed to update product.");
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogTrigger, { asChild: true },
            React.createElement(Button, { variant: "ghost", size: "icon" },
                React.createElement(Edit, { className: "h-4 w-4" }))),
        React.createElement(DialogContent, { className: "max-w-lg" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null, "Edit Product")),
            React.createElement(ScrollArea, { className: "max-h-[70vh] p-2" },
                React.createElement("div", { className: "grid gap-4" },
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "title" }, "Product Title"),
                        React.createElement(Input, { id: "title", name: "title", value: formData.title || "", onChange: handleChange })),
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "description" }, "Description"),
                        React.createElement(Textarea, { id: "description", name: "description", value: formData.description || "", onChange: handleChange })),
                    React.createElement("div", { className: "grid grid-cols-3 gap-4" },
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "price" }, "Price ($)"),
                            React.createElement(Input, { type: "number", id: "price", name: "price", value: formData.price || "", onChange: handleChange })),
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "stock" }, "Stock"),
                            React.createElement(Input, { type: "number", id: "stock", name: "stock", value: formData.stock || "", onChange: handleChange })),
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "discountPercentage" }, "Discount (%)"),
                            React.createElement(Input, { type: "number", id: "discountPercentage", name: "discountPercentage", value: formData.discountPercentage || "", onChange: handleChange }))),
                    React.createElement("div", null,
                        React.createElement(Label, { htmlFor: "thumbnail" }, "Thumbnail URL"),
                        React.createElement(Input, { id: "thumbnail", name: "thumbnail", value: formData.thumbnail || "", onChange: handleChange })),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Category"),
                        React.createElement(Select, { onValueChange: handleCategoryChange, defaultValue: formData.categoryId },
                            React.createElement(SelectTrigger, { className: "w-full" },
                                React.createElement(SelectValue, { placeholder: "Select a category" })),
                            React.createElement(SelectContent, null, categories.map((category) => (React.createElement(SelectItem, { key: category.id, value: category.id }, category.name)))))),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Features"), (_a = formData.features) === null || _a === void 0 ? void 0 :
                        _a.map((feature, index) => (React.createElement("div", { key: index, className: "flex gap-2 mb-2" },
                            React.createElement(Input, { value: feature, onChange: (e) => handleFeatureChange(index, e.target.value) }),
                            React.createElement(Button, { variant: "destructive", size: "icon", onClick: () => handleRemoveFeature(index) },
                                React.createElement(Trash2, { size: 16 }))))),
                        React.createElement(Button, { variant: "secondary", onClick: handleAddFeature, className: "mt-2" },
                            React.createElement(Plus, { size: 16, className: "mr-2" }),
                            "Add Feature")),
                    React.createElement("div", null,
                        React.createElement(Label, null, "Specifications"),
                        Object.keys(formData.specifications || {}).map((specId) => {
                            var _a;
                            return (React.createElement("div", { key: specId, className: "flex gap-2 mb-2" },
                                React.createElement(Input, { placeholder: "Specification Key", value: specificationKeys[specId] || "", onChange: (e) => handleSpecKeyChange(specId, e.target.value) }),
                                React.createElement(Input, { placeholder: "Specification Value", value: ((_a = formData.specifications) === null || _a === void 0 ? void 0 : _a[specId]) || "", onChange: (e) => handleSpecValueChange(specId, e.target.value) }),
                                React.createElement(Button, { variant: "destructive", size: "icon", onClick: () => handleRemoveSpecification(specId) },
                                    React.createElement(Trash2, { size: 16 }))));
                        }),
                        React.createElement(Button, { variant: "secondary", onClick: handleAddSpecification, className: "mt-2" },
                            React.createElement(Plus, { size: 16, className: "mr-2" }),
                            "Add Specification")),
                    React.createElement(Button, { onClick: handleSubmit }, "Update"))))));
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { Search } from "lucide-react";
export default function SearchBar({ categories = [], defaultQuery = "", defaultCategory = "", onSearch, variant = "default", className = "", }) {
    const [searchQuery, setSearchQuery] = useState(defaultQuery);
    const [categoryId, setCategoryId] = useState(defaultCategory);
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery, categoryId);
            return;
        }
        // Default behavior: navigate to products page with query params
        const queryParams = new URLSearchParams();
        if (searchQuery) {
            queryParams.set("search", searchQuery);
        }
        if (categoryId) {
            queryParams.set("category", categoryId);
        }
        navigate(`/products?${queryParams.toString()}`);
    };
    // Minimal variant - just the search input with icon
    if (variant === "minimal") {
        return (React.createElement("form", { onSubmit: handleSearch, className: `relative ${className}` },
            React.createElement(Input, { type: "search", placeholder: "Search...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pr-10" }),
            React.createElement(Button, { type: "submit", size: "icon", variant: "ghost", className: "absolute right-0 top-0 h-full" },
                React.createElement(Search, { className: "h-4 w-4" }))));
    }
    // Default variant - search input with category dropdown and submit button
    return (React.createElement("form", { onSubmit: handleSearch, className: `flex items-center gap-2 ${className}` },
        categories.length > 0 && (React.createElement(Select, { value: categoryId, onValueChange: setCategoryId },
            React.createElement(SelectTrigger, { className: "w-[180px]" },
                React.createElement(SelectValue, { placeholder: "All Categories" })),
            React.createElement(SelectContent, null,
                React.createElement(SelectItem, { value: "" }, "All Categories"),
                categories.map((category) => (React.createElement(SelectItem, { key: category.id, value: category.id }, category.name)))))),
        React.createElement("div", { className: "relative flex-1" },
            React.createElement(Input, { type: "search", placeholder: "Search for anything...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pr-10" }),
            React.createElement(Button, { type: "submit", size: "icon", variant: "ghost", className: "absolute right-0 top-0 h-full" },
                React.createElement(Search, { className: "h-4 w-4" })))));
}

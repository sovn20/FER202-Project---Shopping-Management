var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Loader2, UserPlus, Store } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
const registerSchema = z
    .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["buyer", "seller"]),
    storeInfo: z
        .object({
        name: z.string().optional(),
        description: z.string().optional(),
        rating: z.number().min(0).max(5).optional(),
        totalSales: z.number().min(0).optional(),
    })
        .optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function RegisterDialog() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { errors }, control, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "buyer",
            storeInfo: {
                name: "",
                description: "",
                rating: 4.5,
                totalSales: 0,
            },
        },
    });
    const role = watch("role");
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const { confirmPassword } = data, userData = __rest(data, ["confirmPassword"]);
            const formattedData = Object.assign(Object.assign({}, userData), { avatarUrl: `/images/avatars/${data.role}.png`, storeInfo: data.role === "seller" ? userData.storeInfo : undefined });
            const success = await registerUser(formattedData);
            if (success) {
                toast.success("Account created successfully!");
                navigate("/login");
            }
            else {
                toast.error("Failed to create account. Please try again.");
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogTrigger, { asChild: true },
            React.createElement(Button, null,
                React.createElement(UserPlus, { className: "mr-2 h-4 w-4" }),
                "Add New User")),
        React.createElement(DialogContent, { className: "max-w-md" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null, "Create an Account")),
            React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "name" }, "Full Name"),
                    React.createElement(Input, Object.assign({ id: "name", placeholder: "John Doe" }, register("name"), { disabled: isLoading })),
                    errors.name && (React.createElement("p", { className: "text-sm text-destructive" }, errors.name.message))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "email" }, "Email"),
                    React.createElement(Input, Object.assign({ id: "email", type: "email", placeholder: "you@example.com" }, register("email"), { disabled: isLoading })),
                    errors.email && (React.createElement("p", { className: "text-sm text-destructive" }, errors.email.message))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "password" }, "Password"),
                    React.createElement(Input, Object.assign({ id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, register("password"), { disabled: isLoading })),
                    errors.password && (React.createElement("p", { className: "text-sm text-destructive" }, errors.password.message))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, { htmlFor: "confirmPassword" }, "Confirm Password"),
                    React.createElement(Input, Object.assign({ id: "confirmPassword", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, register("confirmPassword"), { disabled: isLoading })),
                    errors.confirmPassword && (React.createElement("p", { className: "text-sm text-destructive" }, errors.confirmPassword.message))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(Label, null, "Account Type"),
                    React.createElement(Select, { onValueChange: (value) => setValue("role", value), defaultValue: "buyer" },
                        React.createElement(SelectTrigger, { className: "w-full" },
                            React.createElement(SelectValue, { placeholder: "Select account type" })),
                        React.createElement(SelectContent, null,
                            React.createElement(SelectItem, { value: "buyer" }, "I want to buyer"),
                            React.createElement(SelectItem, { value: "seller" }, "I want to sell"))),
                    errors.role && (React.createElement("p", { className: "text-sm text-destructive" }, errors.role.message))),
                role === "seller" && (React.createElement("div", { className: "space-y-2 border p-4 rounded-lg" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement(Store, { className: "h-5 w-5 text-muted-foreground" }),
                        React.createElement(Label, null, "Store Information")),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "storeName" }, "Store Name"),
                        React.createElement(Input, Object.assign({ id: "storeName", placeholder: "Your store name" }, register("storeInfo.name")))),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "storeDescription" }, "Store Description"),
                        React.createElement(Textarea, Object.assign({ id: "storeDescription", placeholder: "Tell customers about your store" }, register("storeInfo.description")))),
                    React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "rating" }, "Initial Rating"),
                            React.createElement(Input, Object.assign({ id: "rating", type: "number", step: "0.1" }, register("storeInfo.rating", { valueAsNumber: true })))),
                        React.createElement("div", null,
                            React.createElement(Label, { htmlFor: "totalSales" }, "Total Sales"),
                            React.createElement(Input, Object.assign({ id: "totalSales", type: "number" }, register("storeInfo.totalSales", {
                                valueAsNumber: true,
                            }))))))),
                React.createElement(Button, { type: "submit", className: "w-full", disabled: isLoading }, isLoading ? (React.createElement(React.Fragment, null,
                    React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Creating Account...")) : (React.createElement(React.Fragment, null,
                    React.createElement(UserPlus, { className: "mr-2 h-4 w-4" }),
                    "Create Account")))))));
}

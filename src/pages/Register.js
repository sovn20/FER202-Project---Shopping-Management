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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
const registerSchema = z
    .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["buyer", "seller"]),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
        
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Prepare user data (excluding confirmPassword)
            const { confirmPassword } = data, userData = __rest(data, ["confirmPassword"]);
            const success = await registerUser(Object.assign(Object.assign({}, userData), { avatarUrl: `/images/avatars/${data.role}.png` }));
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
    return (React.createElement("div", { className: "flex justify-center py-8" },
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement(CardTitle, { className: "text-2xl" }, "Create an Account"),
                React.createElement(CardDescription, null, "Sign up to start shopping or selling on eBay Clone")),
            React.createElement(CardContent, null,
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
                            React.createElement(RadioGroup, null, // Loại bỏ defaultValue để không áp giá trị mặc định
                                React.createElement("div", { className: "flex items-center space-x-2" },
                                    React.createElement(RadioGroupItem, Object.assign({ value: "buyer", id: "buyer", name: "role" }, register("role"))),
                                    React.createElement(Label, { htmlFor: "buyer" }, "I want to shop") 
                                )
                            ),
                        errors.role && (React.createElement("p", { className: "text-sm text-destructive" }, errors.role.message))),
                    React.createElement(Button, { type: "submit", className: "w-full", disabled: isLoading }, isLoading ? (React.createElement(React.Fragment, null,
                        React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                        "Creating Account...")) : (React.createElement(React.Fragment, null,
                        React.createElement(UserPlus, { className: "mr-2 h-4 w-4" }),
                        "Create Account"))))),
            React.createElement(CardFooter, { className: "flex justify-center" },
                React.createElement("p", { className: "text-sm text-center text-muted-foreground" },
                    "Already have an account?",
                    " ",
                    React.createElement(Link, { to: "/login", className: "text-primary hover:underline" }, "Sign in"))))));
}

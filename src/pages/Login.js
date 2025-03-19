import React from "react";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogIn, Loader2 } from "lucide-react";
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export default function Login() {
    var _a, _b;
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || "/";
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const success = await login(data.email, data.password);
            if (success) {
                toast.success("Logged in successfully!");
                navigate(from, { replace: true });
            }
            else {
                toast.error("Invalid email or password");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (React.createElement("div", { className: "flex justify-center py-8" },
        React.createElement(Card, { className: "w-full max-w-md" },
            React.createElement(CardHeader, { className: "text-center" },
                React.createElement(CardTitle, { className: "text-2xl" }, "Welcome Back"),
                React.createElement(CardDescription, null, "Sign in to your account to continue")),
            React.createElement(CardContent, null,
                React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4" },
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement(Label, { htmlFor: "email" }, "Email"),
                        React.createElement(Input, Object.assign({ id: "email", type: "email", placeholder: "you@example.com" }, register("email"), { disabled: isLoading })),
                        errors.email && (React.createElement("p", { className: "text-sm text-destructive" }, errors.email.message))),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement(Label, { htmlFor: "password" }, "Password"),
                            React.createElement(Link, { to: "/forgot-password", className: "text-sm text-primary hover:underline" }, "Forgot password?")),
                        React.createElement(Input, Object.assign({ id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, register("password"), { disabled: isLoading })),
                        errors.password && (React.createElement("p", { className: "text-sm text-destructive" }, errors.password.message))),
                    React.createElement(Button, { type: "submit", className: "w-full", disabled: isLoading }, isLoading ? (React.createElement(React.Fragment, null,
                        React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                        "Signing in...")) : (React.createElement(React.Fragment, null,
                        React.createElement(LogIn, { className: "mr-2 h-4 w-4" }),
                        "Sign In")))),
                React.createElement("div", { className: "mt-6" },
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "absolute inset-0 flex items-center" },
                            React.createElement(Separator, null)),
                        React.createElement("div", { className: "relative flex justify-center text-xs uppercase" },
                            React.createElement("span", { className: "bg-background px-2 text-muted-foreground" }, "Demo Accounts"))),
                    React.createElement("div", { className: "mt-4 grid grid-cols-1 gap-2" },
                        React.createElement(Button, { variant: "outline", onClick: () => {
                                onSubmit({
                                    email: "buyer@ebay-clone.com",
                                    password: "buyer123",
                                });
                            } }, "Sign in as Buyer"),
                        React.createElement(Button, { variant: "outline", onClick: () => {
                                onSubmit({
                                    email: "seller@ebay-clone.com",
                                    password: "seller123",
                                });
                            } }, "Sign in as Seller"),
                        React.createElement(Button, { variant: "outline", onClick: () => {
                                onSubmit({
                                    email: "admin@ebay-clone.com",
                                    password: "admin123",
                                });
                            } }, "Sign in as Admin")))),
            React.createElement(CardFooter, { className: "flex justify-center" },
                React.createElement("p", { className: "text-sm text-center text-muted-foreground" },
                    "Don't have an account?",
                    " ",
                    React.createElement(Link, { to: "/register", className: "text-primary hover:underline" }, "Create an account"))))));
}

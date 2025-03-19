import React from "react";
import { useState, useEffect } from "react";
import { getUsers } from "@/services/authService";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, UserPlus, Trash2 } from "lucide-react";
import RegisterDialog from "../../components/admin/RegisterDialog";
import { deleteUser } from "@/services/authService"; 
export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersData = await getUsers();
                setUsers(usersData);
                setFilteredUsers(usersData);
            }
            catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    useEffect(() => {
        // Apply filters
        let result = [...users];
        // Filter by search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter((user) => user.name.toLowerCase().includes(lowerCaseSearch) ||
                user.email.toLowerCase().includes(lowerCaseSearch));
        }
        // Filter by role
        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter);
        }
        setFilteredUsers(result);
    }, [searchTerm, roleFilter, users]);
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            return;
        }
    
        try {
            const success = await deleteUser(userId);
            if (success) {
                setUsers(users.filter((user) => user.id !== userId));
                setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
                toast.success(`User "${userName}" has been deleted.`);
            } else {
                toast.error(`Failed to delete user "${userName}".`);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("An error occurred while deleting the user.");
        }
    };
    const handleToggleUserStatus = (userId, isActive) => {
        // In a real app, this would call an API to change user status
        // This is a simulation
        const updatedUsers = users.map((user) => {
            if (user.id === userId) {
                return Object.assign(Object.assign({}, user), { isActive: !isActive });
            }
            return user;
        });
        setUsers(updatedUsers);
        toast.success(`User status updated`);
    };
    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "admin":
                return "default";
            case "seller":
                return "secondary";
            case "buyer":
                return "outline";
            default:
                return "outline";
        }
    };
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center h-64" },
            React.createElement("p", null, "Loading users...")));
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h1", { className: "text-3xl font-bold" }, "Users"),
            React.createElement(Button, null,
                React.createElement(RegisterDialog, { className: "mr-2 h-4 w-4" }),
                )),
        React.createElement("div", { className: "flex flex-col sm:flex-row gap-4" },
            React.createElement("div", { className: "relative flex-1" },
                React.createElement(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                React.createElement(Input, { placeholder: "Search users...", className: "pl-8", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
            React.createElement(Select, { value: roleFilter, onValueChange: setRoleFilter },
                React.createElement(SelectTrigger, { className: "sm:w-[180px]" },
                    React.createElement(SelectValue, { placeholder: "Filter by role" })),
                React.createElement(SelectContent, null,
                    React.createElement(SelectItem, { value: "all" }, "All Roles"),
                    React.createElement(SelectItem, { value: "admin" }, "Admin"),
                    React.createElement(SelectItem, { value: "seller" }, "Seller"),
                    React.createElement(SelectItem, { value: "buyer" }, "Buyer")))),
        React.createElement(Card, null,
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "User"),
                        React.createElement(TableHead, null, "Role"),
                        React.createElement(TableHead, null, "Status"),
                        React.createElement(TableHead, null, "Joined"),
                        React.createElement(TableHead, { className: "text-right" }, "Actions"))),
                React.createElement(TableBody, null, filteredUsers.length === 0 ? (React.createElement(TableRow, null,
                    React.createElement(TableCell, { colSpan: 5, className: "h-24 text-center" }, "No users found."))) : (filteredUsers.map((user) => (React.createElement(TableRow, { key: user.id },
                    React.createElement(TableCell, { className: "font-medium" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement(Avatar, null,
                                React.createElement(AvatarImage, { src: user.avatarUrl }),
                                React.createElement(AvatarFallback, null, user.name.substring(0, 2).toUpperCase())),
                            React.createElement("div", null,
                                React.createElement("div", { className: "font-medium" }, user.name),
                                React.createElement("div", { className: "text-sm text-muted-foreground" }, user.email)))),
                    React.createElement(TableCell, null,
                        React.createElement(Badge, { variant: getRoleBadgeVariant(user.role) }, user.role)),
                    React.createElement(TableCell, null,
                        React.createElement(Badge, { variant: user.isActive ? "outline" : "secondary" }, user.isActive === false ? "Inactive" : "Active")),
                    React.createElement(TableCell, null, new Date(user.createdAt).toLocaleDateString()),
                    React.createElement(TableCell, { className: "text-right" },
                        React.createElement("div", { className: "flex justify-end space-x-2" },
                            React.createElement(Button, { variant: "ghost", size: "icon", disabled: user.role === "admin", onClick: () => handleDeleteUser(user.id, user.name), title: "Delete user" },
                                React.createElement(Trash2, { className: "h-4 w-4 text-destructive" })))))))))))));
}

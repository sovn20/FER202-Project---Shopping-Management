import { cn } from "@/lib/utils";
export default function LoadingSpinner({ size = "md", className, }) {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };
    return (React.createElement("div", { className: "flex justify-center items-center h-full w-full" },
        React.createElement("div", { className: cn("animate-spin rounded-full border-4 border-solid border-primary border-t-transparent", sizeClasses[size], className) })));
}

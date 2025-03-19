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
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, } from "lucide-react";
export default function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1, }) {
    // Early return if there's only one page
    if (totalPages <= 1)
        return null;
    const generatePageNumbers = () => {
        // Generate a range of page numbers to show
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        // Determine when to show dots
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
        // Calculate the page range
        const pageRange = [];
        // Always show page 1
        pageRange.push(1);
        // Show left dots if needed
        if (shouldShowLeftDots) {
            pageRange.push("left-dots");
        }
        else if (leftSiblingIndex > 1) {
            // If we're not showing dots but leftSiblingIndex > 1, add page 2
            pageRange.push(2);
        }
        // Add the range between the sibling indices
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            if (i !== 1 && i !== totalPages) {
                pageRange.push(i);
            }
        }
        // Show right dots if needed
        if (shouldShowRightDots) {
            pageRange.push("right-dots");
        }
        else if (rightSiblingIndex < totalPages - 1) {
            // If we're not showing dots but rightSiblingIndex < totalPages-1, add totalPages-1
            pageRange.push(totalPages - 1);
        }
        // Always show the last page
        if (totalPages > 1) {
            pageRange.push(totalPages);
        }
        return pageRange;
    };
    const pageNumbers = generatePageNumbers();
    return (React.createElement("div", { className: "flex items-center justify-center space-x-2 mt-6" },
        React.createElement(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(1), disabled: currentPage === 1, "aria-label": "First page" },
            React.createElement(ChevronsLeft, { className: "h-4 w-4" })),
        React.createElement(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, "aria-label": "Previous page" },
            React.createElement(ChevronLeft, { className: "h-4 w-4" })),
        React.createElement("div", { className: "flex items-center space-x-2" }, pageNumbers.map((page, index) => {
            // Render ellipsis for dots
            if (page === "left-dots" || page === "right-dots") {
                return React.createElement("span", { key: `dots-${index}` }, "...");
            }
            // Render page numbers
            return (React.createElement(Button, { key: `page-${page}`, variant: currentPage === page ? "default" : "outline", size: "icon", onClick: () => onPageChange(page), "aria-label": `Page ${page}`, "aria-current": currentPage === page ? "page" : undefined }, page));
        })),
        React.createElement(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, "aria-label": "Next page" },
            React.createElement(ChevronRight, { className: "h-4 w-4" })),
        React.createElement(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(totalPages), disabled: currentPage === totalPages, "aria-label": "Last page" },
            React.createElement(ChevronsRight, { className: "h-4 w-4" }))));
}
function PaginationContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("ul", Object.assign({ "data-slot": "pagination-content", className: cn("flex flex-row items-center gap-1", className) }, props)));
}
function PaginationItem(_a) {
    var props = __rest(_a, []);
    return React.createElement("li", Object.assign({ "data-slot": "pagination-item" }, props));
}
function PaginationLink(_a) {
    var { className, isActive, size = "icon" } = _a, props = __rest(_a, ["className", "isActive", "size"]);
    return (React.createElement("a", Object.assign({ "aria-current": isActive ? "page" : undefined, "data-slot": "pagination-link", "data-active": isActive, className: cn(buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
        }), className) }, props)));
}
function PaginationPrevious(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(PaginationLink, Object.assign({ "aria-label": "Go to previous page", size: "default", className: cn("gap-1 px-2.5 sm:pl-2.5", className) }, props),
        React.createElement(ChevronLeftIcon, null),
        React.createElement("span", { className: "hidden sm:block" }, "Previous")));
}
function PaginationNext(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(PaginationLink, Object.assign({ "aria-label": "Go to next page", size: "default", className: cn("gap-1 px-2.5 sm:pr-2.5", className) }, props),
        React.createElement("span", { className: "hidden sm:block" }, "Next"),
        React.createElement(ChevronRightIcon, null)));
}
function PaginationEllipsis(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("span", Object.assign({ "aria-hidden": true, "data-slot": "pagination-ellipsis", className: cn("flex size-9 items-center justify-center", className) }, props),
        React.createElement(MoreHorizontalIcon, { className: "size-4" }),
        React.createElement("span", { className: "sr-only" }, "More pages")));
}
export { PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis, };

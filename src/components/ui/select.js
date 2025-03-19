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
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
function Select(_a) {
    var props = __rest(_a, []);
    return React.createElement(SelectPrimitive.Root, Object.assign({ "data-slot": "select" }, props));
}
function SelectGroup(_a) {
    var props = __rest(_a, []);
    return React.createElement(SelectPrimitive.Group, Object.assign({ "data-slot": "select-group" }, props));
}
function SelectValue(_a) {
    var props = __rest(_a, []);
    return React.createElement(SelectPrimitive.Value, Object.assign({ "data-slot": "select-value" }, props));
}
function SelectTrigger(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (React.createElement(SelectPrimitive.Trigger, Object.assign({ "data-slot": "select-trigger", className: cn("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className) }, props),
        children,
        React.createElement(SelectPrimitive.Icon, { asChild: true },
            React.createElement(ChevronDownIcon, { className: "size-4 opacity-50" }))));
}
function SelectContent(_a) {
    var { className, children, position = "popper" } = _a, props = __rest(_a, ["className", "children", "position"]);
    return (React.createElement(SelectPrimitive.Portal, null,
        React.createElement(SelectPrimitive.Content, Object.assign({ "data-slot": "select-content", className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className), position: position }, props),
            React.createElement(SelectScrollUpButton, null),
            React.createElement(SelectPrimitive.Viewport, { className: cn("p-1", position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1") }, children),
            React.createElement(SelectScrollDownButton, null))));
}
function SelectLabel(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(SelectPrimitive.Label, Object.assign({ "data-slot": "select-label", className: cn("px-2 py-1.5 text-sm font-medium", className) }, props)));
}
function SelectItem(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (React.createElement(SelectPrimitive.Item, Object.assign({ "data-slot": "select-item", className: cn("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className) }, props),
        React.createElement("span", { className: "absolute right-2 flex size-3.5 items-center justify-center" },
            React.createElement(SelectPrimitive.ItemIndicator, null,
                React.createElement(CheckIcon, { className: "size-4" }))),
        React.createElement(SelectPrimitive.ItemText, null, children)));
}
function SelectSeparator(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(SelectPrimitive.Separator, Object.assign({ "data-slot": "select-separator", className: cn("bg-border pointer-events-none -mx-1 my-1 h-px", className) }, props)));
}
function SelectScrollUpButton(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(SelectPrimitive.ScrollUpButton, Object.assign({ "data-slot": "select-scroll-up-button", className: cn("flex cursor-default items-center justify-center py-1", className) }, props),
        React.createElement(ChevronUpIcon, { className: "size-4" })));
}
function SelectScrollDownButton(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(SelectPrimitive.ScrollDownButton, Object.assign({ "data-slot": "select-scroll-down-button", className: cn("flex cursor-default items-center justify-center py-1", className) }, props),
        React.createElement(ChevronDownIcon, { className: "size-4" })));
}
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, };

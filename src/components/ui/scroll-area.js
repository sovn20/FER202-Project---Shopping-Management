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
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
function ScrollArea(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (React.createElement(ScrollAreaPrimitive.Root, Object.assign({ "data-slot": "scroll-area", className: cn("relative", className) }, props),
        React.createElement(ScrollAreaPrimitive.Viewport, { "data-slot": "scroll-area-viewport", className: "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1" }, children),
        React.createElement(ScrollBar, null),
        React.createElement(ScrollAreaPrimitive.Corner, null)));
}
function ScrollBar(_a) {
    var { className, orientation = "vertical" } = _a, props = __rest(_a, ["className", "orientation"]);
    return (React.createElement(ScrollAreaPrimitive.ScrollAreaScrollbar, Object.assign({ "data-slot": "scroll-area-scrollbar", orientation: orientation, className: cn("flex touch-none p-px transition-colors select-none", orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent", orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent", className) }, props),
        React.createElement(ScrollAreaPrimitive.ScrollAreaThumb, { "data-slot": "scroll-area-thumb", className: "bg-border relative flex-1 rounded-full" })));
}
export { ScrollArea, ScrollBar };

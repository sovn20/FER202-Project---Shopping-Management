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
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
function RadioGroup(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(RadioGroupPrimitive.Root, Object.assign({ "data-slot": "radio-group", className: cn("grid gap-3", className) }, props)));
}
function RadioGroupItem(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (React.createElement(RadioGroupPrimitive.Item, Object.assign({ "data-slot": "radio-group-item", className: cn("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className) }, props),
        React.createElement(RadioGroupPrimitive.Indicator, { "data-slot": "radio-group-indicator", className: "relative flex items-center justify-center" },
            React.createElement(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" }))));
}
export { RadioGroup, RadioGroupItem };

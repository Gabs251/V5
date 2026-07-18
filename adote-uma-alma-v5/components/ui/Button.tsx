import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const variantClass =
      variant === "outline"
        ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
        : variant === "secondary"
        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
        : "bg-blue-600 text-white hover:bg-blue-700";

    const sizeClass =
      size === "sm"
        ? "px-3 py-2 text-sm"
        : size === "lg"
        ? "px-6 py-3 text-lg"
        : "px-4 py-2";

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg transition ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
/* eslint-disable */
import React from "react";
import "./Button.css";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  isSuccess = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn-common btn-${variant} ${isSuccess ? "btn-success" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  );
}

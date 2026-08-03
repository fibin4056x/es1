/* eslint-disable */
import React from "react";
import "./Input.css";

export default function Input({
  label,
  id,
  type = "text",
  icon,
  placeholder,
  required = false,
  value,
  onChange,
  onFocus,
  onBlur,
  className = "",
  style,
  children,
  ...props
}) {
  return (
    <div className={`form-group ${className}`} style={style}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="input-container input-idle scanning-border">
        {icon && (
          <span 
            className="material-symbols-outlined input-icon" 
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          className="text-input"
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
        {children}
      </div>
    </div>
  );
}

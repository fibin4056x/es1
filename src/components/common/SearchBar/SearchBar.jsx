import React from "react";
import "./SearchBar.css";

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) {
  return (
    <div className={`search-bar-container ${className}`}>
      <span className="material-symbols-outlined search-icon">search</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => {
            if (onClear) onClear();
            else onChange("");
          }}
          title="Clear search"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}

export default SearchBar;

import React from "react";
import "./FilterBar.css";

function FilterBar({ children, activeCount = 0, onReset, className = "" }) {
  return (
    <div className={`filter-bar ${className}`}>
      <div className="filter-bar-header">
        <span className="material-symbols-outlined filter-icon">tune</span>
        <span className="filter-title">Filters</span>
        {activeCount > 0 && (
          <span className="filter-active-count">{activeCount} active</span>
        )}
      </div>

      <div className="filter-bar-controls">{children}</div>

      {activeCount > 0 && onReset && (
        <button
          type="button"
          className="filter-reset-btn"
          onClick={onReset}
          title="Reset all filters"
        >
          <span className="material-symbols-outlined">restart_alt</span>
          Reset
        </button>
      )}
    </div>
  );
}

export default FilterBar;

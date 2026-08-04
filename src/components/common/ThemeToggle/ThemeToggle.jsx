import { useTheme } from "../../../hooks/useTheme";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();


  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="material-symbols-outlined theme-toggle-icon" aria-hidden="true">
        {isDark ? "nights_stay" : "light_mode"}
      </span>
    </button>
  );
}


const reactSelectStyles = () => {
  const styles = getComputedStyle(document.documentElement);

  const inputBg = styles.getPropertyValue("--input-bg").trim() || "#ffffff";
  const borderColor =
    styles.getPropertyValue("--border-color").trim() || "#d1d5db";
  const textPrimary =
    styles.getPropertyValue("--text-primary").trim() || "#111827";
  const textSecondary =
    styles.getPropertyValue("--text-secondary").trim() || "#6b7280";
  const primary =
    styles.getPropertyValue("--primary-color").trim() || "#6366f1";
  const hoverBg =
    styles.getPropertyValue("--hover-bg").trim() || "#eef2ff";

  return {
    control: (base, state) => ({
      ...base,

      minHeight: 46,
      height: 46,

      backgroundColor: inputBg,

      border: `1px solid ${
        state.isFocused ? primary : borderColor
      }`,

      borderRadius: 12,

      boxShadow: state.isFocused
        ? `0 0 0 4px ${primary}22`
        : "none",

      transition: "all .2s ease",

      "&:hover": {
        borderColor: primary,
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 14px",
      height: 46,
    }),

    input: (base) => ({
      ...base,
      color: textPrimary,
      margin: 0,
      padding: 0,
      fontSize: 14,
    }),

    singleValue: (base) => ({
      ...base,
      color: textPrimary,
      fontSize: 14,
      fontWeight: 500,
    }),

    placeholder: (base) => ({
      ...base,
      color: textSecondary,
      fontSize: 14,
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base) => ({
      ...base,

      color: textSecondary,

      transition: ".2s",

      "&:hover": {
        color: primary,
      },
    }),

    menu: (base) => ({
      ...base,

      marginTop: 8,

      background: inputBg,

      border: `1px solid ${borderColor}`,

      borderRadius: 14,

      overflow: "hidden",

      boxShadow:
        "0 18px 40px rgba(15,23,42,.15)",

      zIndex: 9999,
    }),

    menuList: (base) => ({
      ...base,
      padding: 8,
    }),

    option: (base, state) => ({
      ...base,

      padding: "11px 14px",

      borderRadius: 10,

      marginBottom: 2,

      cursor: "pointer",

      fontSize: 14,

      fontWeight: 500,

      backgroundColor: state.isSelected
        ? primary
        : state.isFocused
        ? hoverBg
        : "transparent",

      color: state.isSelected
        ? "#ffffff"
        : textPrimary,

      transition: "all .15s ease",
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: textSecondary,
    }),
  };
};

export default reactSelectStyles;
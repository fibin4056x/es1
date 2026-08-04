import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
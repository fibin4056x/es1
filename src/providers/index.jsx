import { AuthProvider } from "../context/AuthContext";

function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default Providers;
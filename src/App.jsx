import Providers from "./providers";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
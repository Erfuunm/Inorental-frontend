import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ApiProvider from "./contexts/ApiProvider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <ApiProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
  </ApiProvider>
  </BrowserRouter>
);

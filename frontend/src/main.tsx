import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Base styles first so component stylesheets can override them
import "./App.css";
import App from "./App.tsx";
import Auth0ProviderWithNavigate from "./Auth0ProviderWithNavigate.tsx";
import ThemeProvider from "./theme/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

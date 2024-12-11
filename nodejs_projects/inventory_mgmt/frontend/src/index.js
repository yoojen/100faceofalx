import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { NavigationProvider } from "./context/SideNav.js";
import { AuthProvider } from "./context/AuthProvider.js";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} >
      <AuthProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

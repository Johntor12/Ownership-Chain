import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import "./src/index.css";
import { AuthProvider } from "./src/context/AuthContext";
import { PopUpProvider } from "./src/context/PopUpContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <PopUpProvider>
        <App />
      </PopUpProvider>
    </AuthProvider>
  </React.StrictMode>,
);

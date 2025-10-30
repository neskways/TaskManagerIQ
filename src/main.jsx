import "./styles/reset.scss";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { PopupProvider } from "./context/PopupContext";
import { App } from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <PopupProvider>
          <App />
        </PopupProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

import "./styles/reset.scss";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { PopupProvider } from "./context/PopupContext";
import { ActiveTaskProvider } from "./context/ActiveTaskContext";
import { App } from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ActiveTaskProvider>
      <ThemeProvider>
        <BrowserRouter>
          <PopupProvider>
            <App />
          </PopupProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ActiveTaskProvider>
  </React.StrictMode>
);

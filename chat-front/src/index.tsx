import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App"; // Note: You don't need .tsx extension in imports
import reportWebVitals from "./reportWebVitals";

// Type assertion for getElementById since it could be null
const rootElement = document.getElementById("root") as HTMLElement;

// Create root with proper typing
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// TypeScript type for the reportWebVitals callback
reportWebVitals((metric: any) => console.log(metric));

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // default import works now
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* This is required for useNavigate and other routing features */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

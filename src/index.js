import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use createRoot
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <Router>
    <App />
  </Router>
);

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Wrap App with Router
import App from "./App";

ReactDOM.render(
  <Router> {/* ✅ This should be the only <Router> */}
    <App />
  </Router>,
  document.getElementById("root")
);

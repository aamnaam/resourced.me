import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";

const env = process.env.REACT_APP_ENV;
if (env === "prod") {
	axios.defaults.baseURL = "https://resourced.me";
} else {
	axios.defaults.baseURL = "http://localhost:5000";
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

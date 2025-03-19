
import React from "react"; // Thêm dòng này
import ReactDOM from "react-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from "./App.js";
createRoot(document.getElementById('root')).render(React.createElement(StrictMode, null,
    React.createElement(App, null)));

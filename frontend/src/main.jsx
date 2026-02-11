import React from "react";
import ReactDOM from "react-dom/client";
import { CasesPage } from "./pages/CasesPage.jsx"; // make sure path matches your folder structure
import "./styles/index.css"; // import your global styles if you have any

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CasesPage />
    </React.StrictMode>
);

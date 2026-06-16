import * as React from "react";
import { createRoot } from "react-dom/client";

import InvestorProfileOnboarding from "../projeto";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento #root não encontrado no index.html.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <InvestorProfileOnboarding />
  </React.StrictMode>,
);

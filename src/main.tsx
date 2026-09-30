import React from "react";
import ReactDOM from "react-dom/client";
import { getDefaultWebsiteConfig } from "website-core";
import { LedgerTemplate } from "website-templates";
import "./index.css";

const config = getDefaultWebsiteConfig("firm_prod", "ledger");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LedgerTemplate config={config} />
  </React.StrictMode>
);

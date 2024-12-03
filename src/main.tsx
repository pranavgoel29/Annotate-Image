import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Annotorious } from "@annotorious/react";
import { Toaster } from "./components/ui/toaster.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Annotorious>
        <Toaster />
        <App />
      </Annotorious>
    </StrictMode>
  );
}

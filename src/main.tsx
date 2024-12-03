import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Annotorious } from "@annotorious/react";
import { Toaster } from "sonner";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Annotorious>
        <Toaster richColors />
        <App />
      </Annotorious>
    </StrictMode>
  );
}

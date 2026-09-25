import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import PromptsPage from "./PromptsPage";
import { LanguageProvider } from "./i18n";
import "./index.css";

const isPromptsPage = window.location.pathname.replace(/\/$/, "") === "/prompts";

document.title = isPromptsPage
  ? "Prompt Journey | CodeCraftHub"
  : "CodeCraftHub | Learning Dashboard";

const page = (
  <LanguageProvider>
    {isPromptsPage ? <PromptsPage /> : <App />}
  </LanguageProvider>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {page}
  </StrictMode>,
);

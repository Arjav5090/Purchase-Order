import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
        </BrowserRouter>
      
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);

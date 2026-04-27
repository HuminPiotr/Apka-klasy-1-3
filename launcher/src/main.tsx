import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

function updateScale() {
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  );
  document.documentElement.style.setProperty("--app-scale", String(scale));
}

updateScale();
window.addEventListener("resize", updateScale);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

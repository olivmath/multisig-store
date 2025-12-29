import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enable dark mode by default for the black/gold aesthetic
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);

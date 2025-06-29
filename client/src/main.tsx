import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/firebase-init";

createRoot(document.getElementById("root")!).render(<App />);

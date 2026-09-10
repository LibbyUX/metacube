import { createRoot } from "react-dom/client";
import PlaygroundApp from "./PlaygroundApp";
import { installTypography } from "../src/data/typography";

installTypography();

createRoot(document.getElementById("root")!).render(<PlaygroundApp />);

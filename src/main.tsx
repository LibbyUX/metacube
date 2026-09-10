import { createRoot } from "react-dom/client";
import App from "./App";
import FigureMode from "./FigureMode";
import { loadData } from "./data/loadData";
import { ThemeProvider } from "./data/themeContext";
import { DEFAULT_SCHEME } from "./data/theme";
import { installTypography } from "./data/typography";

const figureId = new URLSearchParams(window.location.search).get("figure");
const data = loadData();

installTypography();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider scheme={data.config.colour_scheme ?? DEFAULT_SCHEME}>
    {figureId ? <FigureMode figureId={figureId} data={data} /> : <App data={data} />}
  </ThemeProvider>,
);

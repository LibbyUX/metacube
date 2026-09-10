import robotoRegularUrl from "../fonts/roboto-latin-400-normal.woff2?inline";
import robotoItalicUrl from "../fonts/roboto-latin-400-italic.woff2?inline";
import robotoMediumUrl from "../fonts/roboto-latin-500-normal.woff2?inline";
import robotoSemiboldUrl from "../fonts/roboto-latin-600-normal.woff2?inline";
import robotoBoldUrl from "../fonts/roboto-latin-700-normal.woff2?inline";
import robotoRegular3dUrl from "../fonts/roboto-latin-400-normal.woff?inline";
import robotoBold3dUrl from "../fonts/roboto-latin-700-normal.woff?inline";

export const FONT_FAMILY = "Roboto, sans-serif";
export const ROBOTO_REGULAR_3D_URL = robotoRegular3dUrl;
export const ROBOTO_BOLD_3D_URL = robotoBold3dUrl;

const STYLE_ID = "metacube-roboto";

/**
 * Installs the locally bundled Roboto faces and applies them to document UI.
 *
 * @returns Nothing.
 */
export function installTypography(): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @font-face {
      font-family: "Roboto";
      src: url("${robotoRegularUrl}") format("woff2");
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${robotoItalicUrl}") format("woff2");
      font-style: italic;
      font-weight: 400;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${robotoMediumUrl}") format("woff2");
      font-style: normal;
      font-weight: 500;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${robotoSemiboldUrl}") format("woff2");
      font-style: normal;
      font-weight: 600;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${robotoBoldUrl}") format("woff2");
      font-style: normal;
      font-weight: 700;
      font-display: swap;
    }
    html, body, button, input, select, textarea {
      font-family: ${FONT_FAMILY};
    }
  `;
  document.head.appendChild(style);
}

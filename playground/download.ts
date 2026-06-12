import type { CubeData } from "../src/data/dataModel";

export async function downloadStandaloneHtml(data: CubeData, templateUrl: string): Promise<void> {
  const res = await fetch(templateUrl);
  if (!res.ok) throw new Error(`Could not fetch template (${res.status})`);
  const template = await res.text();
  const script = `<script>window.__CUBE_DATA__ = ${JSON.stringify(data)};<\/script>`;
  const html = template.replace(
    `<div id="root"></div>`,
    `${script}\n    <div id="root"></div>`,
  );
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "metacube.html" });
  a.click();
  URL.revokeObjectURL(url);
}

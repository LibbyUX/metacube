"""CubeData JSON → standalone HTML."""
from __future__ import annotations

import importlib.resources
import json
from pathlib import Path
from typing import Any

PLACEHOLDER = "window.__CUBE_DATA__ = {}"


def _get_template() -> str:
    try:
        ref = importlib.resources.files("metacube").joinpath("_template.html")
        return ref.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise FileNotFoundError(
            "Bundled template.html not found. "
            "Run 'pixi run export-template' in the cube JS project and copy "
            "template/index.html to python-pkg/src/metacube/_template.html, "
            "then reinstall the package."
        )


def _inject(template: str, data: dict[str, Any]) -> str:
    json_str = json.dumps(data, ensure_ascii=False)
    injection = f"window.__CUBE_DATA__ = {json_str};"
    return template.replace(
        "<div id=\"root\"></div>",
        f"<script>{injection}</script>\n    <div id=\"root\"></div>",
        1,
    )


def build_html(data: dict[str, Any], output_path: str | Path) -> Path:
    """Inject CubeData into the pre-built template and write a standalone HTML file.

    Args:
        data: CubeData dict (output of csv_to_cube_data or loaded from JSON).
        output_path: Destination .html file path.

    Returns:
        Resolved path to the written HTML file.
    """
    template = _get_template()
    html = _inject(template, data)
    out = Path(output_path)
    out.write_text(html, encoding="utf-8")
    return out.resolve()

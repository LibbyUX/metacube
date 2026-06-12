"""Local HTTP server for investigative mode."""
from __future__ import annotations

import http.server
import json
import threading
import webbrowser
from pathlib import Path
from typing import Any

from .build import _inject, _get_template


class _CubeHandler(http.server.BaseHTTPRequestHandler):
    server: "_CubeServer"

    def do_GET(self) -> None:
        if self.path in ("/", "/index.html"):
            template = _get_template()
            html = _inject(template, self.server.cube_data)
            body = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, fmt: str, *args: Any) -> None:
        pass


class _CubeServer(http.server.HTTPServer):
    def __init__(self, data: dict[str, Any], port: int) -> None:
        self.cube_data = data
        super().__init__(("127.0.0.1", port), _CubeHandler)


def serve(data: dict[str, Any], port: int = 8000, open_browser: bool = True) -> None:
    """Serve an interactive cube visualization locally.

    Args:
        data: CubeData dict (output of csv_to_cube_data or loaded from JSON).
        port: TCP port to listen on (default 8000).
        open_browser: Whether to open the browser automatically.
    """
    server = _CubeServer(data, port)
    url = f"http://localhost:{port}/"
    print(f"Cube visualization running at {url}")
    print("Press Ctrl+C to stop.")
    if open_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")

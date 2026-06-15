"""Bundled example datasets for metacube.

Use ``metacube.examples.path("census_tissue_general_treemap.yaml")`` to get a Path
to any bundled file, or ``metacube examples`` on the command line to copy
them into the current directory.
"""
from __future__ import annotations

from importlib.resources import files
from pathlib import Path


def path(filename: str) -> Path:
    """Return the absolute Path to a bundled example file."""
    ref = files(__name__).joinpath(filename)
    # importlib.resources returns a Traversable; convert to a real Path
    return Path(str(ref))


def list_files() -> list[str]:
    """Return the names of all bundled example files."""
    pkg = files(__name__)
    return sorted(
        r.name
        for r in pkg.iterdir()
        if not r.name.startswith("_") and r.is_file()
    )

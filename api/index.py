"""Vercel entrypoint: exposes the FastAPI app from backend/ as one serverless function.

vercel.json rewrites every /api/* request here; FastAPI still sees the original
path (e.g. /api/portfolio), so the backend's routes work unchanged.
"""
import os
import sys

BACKEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.main import app  # noqa: E402,F401

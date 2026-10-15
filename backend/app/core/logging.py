"""
Structured logging module for Synapse backend.
Configures standard library logging with request ID tracking.
"""

import logging
import sys
from typing import Any, Dict


class StructuredFormatter(logging.Formatter):
    """
    Formats log records into structured, readable output.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return f"[{log_obj['timestamp']}] [{log_obj['level']}] [{log_obj['logger']}] {log_obj['message']}"


def setup_logging(level: int = logging.INFO) -> None:
    """Configures root logger with clean stdout formatting."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter(datefmt="%Y-%m-%d %H:%M:%S"))

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers = [handler]

    # Suppress overly verbose third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)


logger = logging.getLogger("synapse")

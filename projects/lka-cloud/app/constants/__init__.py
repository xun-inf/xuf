import os
from dotenv import load_dotenv

load_dotenv()

def get_env(key: str, default: str | None =None):
    return os.getenv(key, default)

API_NAME = get_env("API_NAME", "LKA CLOUD API")
API_VERSION = get_env("API_VERSION", "1.0.0")

API_HOST = get_env("API_HOST", "127.0.0.1")
API_PORT = int(get_env("API_PORT", "8000"))

__all__ = ["get_env", "API_NAME", "API_VERSION", "API_HOST", "API_PORT"]
import uuid
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


def gen_id() -> str:
    return str(uuid.uuid4())[:8]
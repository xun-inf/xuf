from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from app.models import Base

db_path = Path(__file__).parent.parent / "data" / "data.db"
db_path.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    url=f"sqlite:///{db_path}",
    connect_args={"check_same_thread": False},
)
Base.metadata.create_all(bind=engine)

# 兼容旧库：为已存在的 tasks 表补充 references 列
with engine.begin() as conn:
    try:
        conn.execute(text('ALTER TABLE tasks ADD COLUMN "references" TEXT DEFAULT \'\''))
    except OperationalError:
        pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
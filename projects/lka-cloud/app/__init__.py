from pydantic import BaseModel
from datetime import datetime

class DocumentInfo(BaseModel):
    id: str
    title: str
    file_name: str
    chunk_count: int
    upload_time: datetime
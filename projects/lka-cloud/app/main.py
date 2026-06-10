from app.routers import documents, tasks
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.constants import API_NAME, API_VERSION, API_HOST, API_PORT

app = FastAPI(title=API_NAME, version=API_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(documents.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return JSONResponse({"message": API_NAME, "version": API_VERSION})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=API_HOST, port=API_PORT, reload=True)
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <-- I had put a comment here before
import os
from celery.result import AsyncResult
from api.tasks import run_analysis_task, celery_app
from api.core.config import get_settings

settings = get_settings()

app = FastAPI(title="WhatsApp Analyzer API")

# Create a directory for temporary images
os.makedirs("temp_images", exist_ok=True)

# Mount the static directory to serve images (Comment removed)
app.mount("/images", StaticFiles(directory="temp_images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", status_code=202)
async def upload_chat_file(file: UploadFile = File(...), language: str = Form("en")):
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .txt file.")
    
    file_content = await file.read()
    
    try:
        content_str = file_content.decode('utf-8')
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Could not decode file. Please ensure it is a UTF-8 encoded text file.")

    task = run_analysis_task.delay(content_str, language)
    return {"task_id": task.id}

@app.get("/status/{task_id}")
def get_task_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    
    response = {
        "task_id": task_id,
        "status": task_result.status,
        "result": None
    }

    if task_result.status == 'PROGRESS':
        response['result'] = task_result.info
    elif task_result.status == 'SUCCESS':
        response['result'] = task_result.get()
    elif task_result.status == 'FAILURE':
         response['result'] = task_result.info
    
    return response
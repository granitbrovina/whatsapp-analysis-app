from celery import Celery
from whatsapp_analyzer.parsing import parse_whatsapp_chat
from whatsapp_analyzer.analysis import generate_full_analysis
from api.core.config import get_settings
import traceback

settings = get_settings()

celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)
celery_app.conf.update(
    task_track_started=True,
    result_expires=3600,
)

@celery_app.task(bind=True)
def run_analysis_task(self, file_content: str):
    """
    Celery task that lets Celery handle its own exceptions.
    """
    # Celery will automatically catch exceptions from these functions
    
    self.update_state(state='PROGRESS', meta={'status': 'Parsing chat file...'})
    df = parse_whatsapp_chat(file_content)
    
    # Convert datetime to handle JSON serialization
    df_json = df.to_json(orient='split', date_format='iso')

    self.update_state(state='PROGRESS', meta={'status': 'Analyzing data...'})
    result = generate_full_analysis(df_json)
    
    # A successful run returns the result within a dictionary
    return {'status': 'Complete!', 'result': result}
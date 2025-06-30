# WhatsApp Chat Analyzer Web App

This project provides a web interface to upload and analyze WhatsApp chat history files (`.txt`). It uses a Python backend for analysis and a Next.js frontend for the user interface.

## Project Structure

-   `backend/`: FastAPI application, Celery for background tasks, and the core Python analysis logic.
-   `frontend/`: Next.js application for the UI.
-   `docker-compose.yml`: For running all services locally.

## How to Run Locally

### Prerequisites

-   Docker
-   Docker Compose

### Steps

1.  **Clone the repository and create the files:**
    Make sure all files and folders from the provided structure are created.

2.  **Set up the frontend dependencies:**
    The `docker-compose` setup handles this, but for IDE support you might want to run this once:
    ```sh
    cd frontend
    npm install
    cd ..
    ```

3.  **Start the services using Docker Compose:**
    From the root directory (`whatsapp-analysis-app/`), run:
    ```sh
    docker-compose up --build
    ```
    This command will:
    -   Build the Docker images for the frontend, backend, and Celery worker.
    -   Start all the containers.
    -   The `--build` flag ensures images are rebuilt if you make changes.

4.  **Access the application:**
    -   **Frontend:** Open your browser and go to `http://localhost:3000`
    -   **Backend API Docs:** Go to `http://localhost:8000/docs`

5.  **Stopping the application:**
    Press `Ctrl+C` in the terminal where `docker-compose` is running. To remove the containers, run:
    ```sh
    docker-compose down
    ```

## How it Works

1.  User uploads a `.txt` file via the frontend.
2.  The Next.js app sends the file to the FastAPI backend at the `/upload` endpoint.
3.  The backend creates a background task with Celery to process the file and immediately returns a `task_id`.
4.  The frontend polls the `/status/<task_id>` endpoint every few seconds.
5.  The Celery worker picks up the task, performs the analysis, and stores the result in Redis.
6.  Once the frontend sees the task is `SUCCESS`, it retrieves the full result and renders the dashboard.
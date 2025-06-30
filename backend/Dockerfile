FROM python:3.9-slim

WORKDIR /app

# Create a non-root user
RUN addgroup --system app && adduser --system --group app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc build-essential python3-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Create __init__.py files
RUN touch api/__init__.py && touch whatsapp_analyzer/__init__.py

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Change ownership of the app directory
RUN chown -R app:app /app

# Switch to the non-root user
USER app

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
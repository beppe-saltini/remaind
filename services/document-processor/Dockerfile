FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install requests

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the service
CMD ["python", "app.py"]

FROM python:3.11-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . .

RUN pip install --upgrade pip setuptools wheel \
    && pip install "numpy<2.0" "cython" \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

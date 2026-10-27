import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from app.predictor import InvalidImageError, PlantPredictor


logger = logging.getLogger("uvicorn.error")

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
}


class ClassScore(BaseModel):
    class_name: str
    score: float


class PredictionResponse(BaseModel):
    predicted_class: str
    score: float
    top_predictions: list[ClassScore]
    model_name: str
    notice: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading plant disease model...")

    app.state.predictor = PlantPredictor()

    logger.info("Plant disease model is ready.")

    try:
        yield
    finally:
        app.state.predictor = None


app = FastAPI(
    title="LeafScan AI API",
    description="Tomato leaf disease classification API.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "LeafScan AI API",
        "docs": "/docs",
    }


@app.get("/health")
def health(request: Request):
    predictor = getattr(request.app.state, "predictor", None)

    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not ready.",
        )

    return {
        "status": "ok",
        "model_loaded": True,
        "number_of_classes": len(predictor.class_names),
    }


@app.get("/api/classes")
def get_classes(request: Request):
    predictor = request.app.state.predictor

    return {
        "classes": predictor.class_names,
        "count": len(predictor.class_names),
    }


@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    openapi_extra={
        "requestBody": {
            "required": True,
            "content": {
                "image/jpeg": {
                    "schema": {
                        "type": "string",
                        "format": "binary",
                    }
                },
                "image/png": {
                    "schema": {
                        "type": "string",
                        "format": "binary",
                    }
                },
            },
        }
    },
)
async def predict(request: Request):
    content_type = (
        request.headers.get("content-type", "")
        .split(";")[0]
        .strip()
        .lower()
    )

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                "Send JPEG or PNG bytes directly with "
                "Content-Type image/jpeg or image/png."
            ),
        )

    # Read the image into memory without saving it to disk.
    image_buffer = bytearray()

    async for chunk in request.stream():
        if len(image_buffer) + len(chunk) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail="Image must be 10 MB or smaller.",
            )

        image_buffer.extend(chunk)

    if not image_buffer:
        raise HTTPException(
            status_code=400,
            detail="The image body is empty.",
        )

    try:
        return await run_in_threadpool(
            request.app.state.predictor.predict,
            bytes(image_buffer),
        )

    except InvalidImageError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        logger.exception("Prediction failed")

        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Please try again.",
        ) from error


# Local development server.
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
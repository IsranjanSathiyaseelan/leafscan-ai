import io
import json
import threading
import warnings
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps, UnidentifiedImageError


BACKEND_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BACKEND_DIR / "models"

MODEL_PATH = MODEL_DIR / "plant_model.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"
METADATA_PATH = MODEL_DIR / "metadata.json"

# Limit decoded image size as well as uploaded file size.
MAX_IMAGE_PIXELS = 20_000_000

Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


class InvalidImageError(ValueError):
    """The uploaded bytes are not a supported, usable image."""


class PlantPredictor:
    def __init__(self):
        required_paths = [
            MODEL_PATH,
            CLASS_NAMES_PATH,
            METADATA_PATH,
        ]

        for path in required_paths:
            if not path.is_file():
                raise FileNotFoundError(
                    f"Required model file is missing: {path}"
                )

        with CLASS_NAMES_PATH.open(encoding="utf-8") as file:
            self.class_names = json.load(file)

        with METADATA_PATH.open(encoding="utf-8") as file:
            self.metadata = json.load(file)

        if (
            not isinstance(self.class_names, list)
            or not self.class_names
            or not all(
                isinstance(name, str)
                for name in self.class_names
            )
        ):
            raise ValueError("class_names.json must contain a list of names.")

        # Optimizer and training configuration are unnecessary for inference.
        self.model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False,
        )

        if self.model.output_shape[-1] != len(self.class_names):
            raise ValueError(
                "Model output count does not match class_names.json."
            )

        input_shape = self.model.input_shape

        if len(input_shape) != 4 or input_shape[-1] != 3:
            raise ValueError("Expected an RGB image classification model.")

        self.image_size = (
            int(input_shape[1]),
            int(input_shape[2]),
        )

        self.lock = threading.Lock()

        # Warm up the model before accepting requests.
        sample = tf.zeros(
            (1, *self.image_size, 3),
            dtype=tf.float32,
        )

        self.model(sample, training=False)

    def preprocess(self, image_bytes: bytes):
        try:
            with warnings.catch_warnings():
                warnings.simplefilter(
                    "error",
                    Image.DecompressionBombWarning,
                )

                with Image.open(io.BytesIO(image_bytes)) as source:
                    if source.format not in {"JPEG", "PNG"}:
                        raise InvalidImageError(
                            "Only JPEG and PNG images are supported."
                        )

                    width, height = source.size

                    if width * height > MAX_IMAGE_PIXELS:
                        raise InvalidImageError(
                            "Image resolution is too large. "
                            "Use an image below 20 megapixels."
                        )

                    if getattr(source, "is_animated", False):
                        raise InvalidImageError(
                            "Animated images are not supported."
                        )

                    source.load()

                    image = ImageOps.exif_transpose(source).convert("RGB")

                    image_array = np.asarray(
                        image,
                        dtype=np.float32,
                    )

        except InvalidImageError:
            raise

        except (
            UnidentifiedImageError,
            OSError,
            ValueError,
            Image.DecompressionBombWarning,
            Image.DecompressionBombError,
        ) as error:
            raise InvalidImageError(
                "Unable to read this image. Upload a valid JPEG or PNG."
            ) from error

        # Match the TensorFlow resize used during training.
        image_tensor = tf.image.resize(
            image_array,
            self.image_size,
            method="bilinear",
        )

        # Keep pixels in [0, 255].
        # Normalization is already included inside the trained model.
        return tf.expand_dims(image_tensor, axis=0)

    def predict(self, image_bytes: bytes):
        batch = self.preprocess(image_bytes)

        with self.lock:
            scores = self.model(
                batch,
                training=False,
            ).numpy()[0]

        if not np.isfinite(scores).all():
            raise RuntimeError("The model returned invalid scores.")

        top_indices = np.argsort(scores)[::-1][:3]

        top_predictions = [
            {
                "class_name": self.class_names[int(index)],
                "score": round(float(scores[index]), 6),
            }
            for index in top_indices
        ]

        best_prediction = top_predictions[0]

        return {
            "predicted_class": best_prediction["class_name"],
            "score": best_prediction["score"],
            "top_predictions": top_predictions,
            "model_name": "MobileNetV2",
            "notice": (
                "This is a model prediction, not a confirmed diagnosis. "
                "Use a clear image of a tomato leaf."
            ),
        }
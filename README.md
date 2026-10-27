# LeafScan AI 🌿

A mobile app that classifies tomato leaf diseases from a photo using deep learning.

Built with **React Native (Expo)**, **FastAPI**, and **TensorFlow**. A trained **MobileNetV2** model predicts one of 10 tomato leaf classes.

> Portfolio project for educational use. Predictions may be incorrect and do not replace expert agricultural advice.

## Features

- Pick a leaf photo from the gallery or take one with the camera
- Automatic analysis after selection
- Predicted class, model score, and top three predictions
- Retry failed requests and remove the selected photo
- Backend connection status
- No database and no permanent storage of uploaded images

## Tech Stack

| Part | Technology |
|---|---|
| Mobile app | React Native, Expo, TypeScript |
| Backend | FastAPI, Uvicorn |
| Model | TensorFlow, Keras, MobileNetV2 |
| Training | Google Colab |
| Environment | Python 3.11, uv |

## How It Works

1. The user selects or captures a leaf photo.
2. The app checks that the backend is ready.
3. The image is sent as raw bytes to `/api/predict`.
4. The backend converts it to RGB, resizes it to 224 × 224, and runs the model.
5. The app shows the prediction and top three results.

## Model

- **Dataset:** tomato images from [PlantVillage (Kaggle)](https://www.kaggle.com/datasets/emmarex/plantdisease)
- **Approach:** transfer learning with a frozen MobileNetV2 backbone
- **Split:** 70% train, 15% validation, 15% test

| Metric | Result |
|---|---:|
| Test accuracy | 89.08% |
| Macro F1-score | 0.8710 |
| Test images | 2,400 |

These results are on the dataset test split, not on real farm images.

Classes: bacterial spot, early blight, late blight, leaf mold, Septoria leaf spot, spider mite damage, target spot, yellow leaf curl virus, mosaic virus, healthy.

## Project Structure

```text
leafscan-ai/
├── backend/      # FastAPI app and model files
├── mobile/       # Expo React Native app
├── training/     # Training notebook
├── data/         # Dataset splits
├── results/      # Metrics and plots
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11 and [uv](https://docs.astral.sh/uv/)
- Node.js LTS and npm
- Expo Go (physical phone) or Android Studio emulator

### Backend

```powershell
cd backend
uv python install 3.11
uv venv --python 3.11
uv pip install -r requirements.txt
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Make sure these files exist before starting:

```text
backend/models/plant_model.keras
backend/models/class_names.json
backend/models/metadata.json
```

Wait for `Application startup complete.` Then check http://localhost:8000/health.

### Mobile App

```powershell
cd mobile
npm install
```

Create `mobile/.env`:

```env
# Physical phone (use your computer's Wi-Fi IPv4 from `ipconfig`)
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:8000

# Android emulator
# EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
```

Start the app:

```powershell
npx expo start
```

After changing `.env`, restart with `npx expo start --clear`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API info |
| GET | `/health` | Model readiness |
| GET | `/api/classes` | Supported classes |
| POST | `/api/predict` | Predict a leaf image |

`/api/predict` accepts raw JPEG or PNG bytes (not multipart form data), up to 10 MB:

```powershell
curl.exe -X POST "http://localhost:8000/api/predict" `
  -H "Content-Type: image/jpeg" `
  --data-binary "@C:\path\to\tomato-leaf.jpg"
```

Example response:

```json
{
  "predicted_class": "Tomato_healthy",
  "score": 0.94,
  "top_predictions": [
    { "class_name": "Tomato_healthy", "score": 0.94 },
    { "class_name": "Tomato_Early_blight", "score": 0.04 },
    { "class_name": "Tomato_Late_blight", "score": 0.01 }
  ],
  "model_name": "MobileNetV2"
}
```

## Troubleshooting

- **Phone can't reach the backend:** open `http://YOUR_COMPUTER_IP:8000/health` in the phone's browser. Check that the backend uses `--host 0.0.0.0`, both devices are on the same Wi-Fi (not guest Wi-Fi), and the firewall or VPN is not blocking it.
- **Model file not found:** the path must be `backend/models/plant_model.keras`, with no extra nested folder.
- **HTTP 415:** send raw image bytes with `Content-Type: image/jpeg` or `image/png`.
- **Model loading error:** match the TensorFlow version listed in `backend/models/metadata.json`.

## Limitations

- Only the 10 trained tomato classes are supported.
- Unrelated images may still receive a disease label.
- Scores are not guaranteed probabilities of a correct diagnosis.
- Real-world lighting, blur, and backgrounds may reduce accuracy.
- Requires a network connection to the backend.

## Future Improvements

- Fine-tune MobileNetV2 layers
- Compare with a custom CNN and EfficientNetB0
- Test on independent phone and field images
- Add Grad-CAM explanations
- Explore on-device inference for offline use

## Acknowledgements

PlantVillage dataset contributors, TensorFlow and Keras, Expo and React Native, FastAPI.
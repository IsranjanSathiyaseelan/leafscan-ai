import { fetch } from "expo/fetch";
import { File } from "expo-file-system";

import type { PredictionResponse } from "../types/prediction";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL || API_URL.includes("YOUR_COMPUTER_IP")) {
    throw new Error(
      "Set your computer's actual IP in mobile/.env, then restart Expo."
    );
  }

  return API_URL;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "string") return error;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "An unexpected error occurred.";
}

export async function checkBackend(): Promise<void> {
  const url = getApiUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${url}/health`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Backend health check failed: HTTP ${response.status}.`
      );
    }

    const health = (await response.json()) as {
      model_loaded?: boolean;
    };

    if (health.model_loaded !== true) {
      throw new Error("The backend is reachable, but the model is not ready.");
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `Cannot reach ${url}/health within 10 seconds. ` +
          "Check your IP address, Wi-Fi, and Windows Firewall."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        `Cannot connect to ${url}. ` +
          "Try opening its /health page in your phone's browser."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function predictImage(
  imageUri: string
): Promise<PredictionResponse> {
  const url = getApiUrl();

  const file = new File(imageUri);

  if (!file.exists) {
    throw new Error("The image is unavailable. Select it again.");
  }

  if (file.size === 0) {
    throw new Error("The selected image is empty.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  // Read bytes explicitly instead of passing a File as the request body.
  const bytes = await file.bytes();

  // Copy into a plain ArrayBuffer suitable for the request body.
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(`${url}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
        Accept: "application/json",
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Prediction failed: HTTP ${response.status}.`;

      try {
        const data = (await response.json()) as {
          detail?: unknown;
        };

        if (typeof data.detail === "string") {
          message = data.detail;
        }
      } catch {
        // Keep the HTTP status message.
      }

      throw new Error(message);
    }

    const data = (await response.json()) as PredictionResponse;

    if (
      typeof data.predicted_class !== "string" ||
      typeof data.score !== "number" ||
      !Number.isFinite(data.score) ||
      data.score < 0 ||
      data.score > 1 ||
      typeof data.notice !== "string" ||
      typeof data.model_name !== "string" ||
      !Array.isArray(data.top_predictions) ||
      !data.top_predictions.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          typeof item.class_name === "string" &&
          typeof item.score === "number" &&
          Number.isFinite(item.score) &&
          item.score >= 0 &&
          item.score <= 1
      )
    ) {
      throw new Error("The backend returned an unexpected prediction.");
    }

    return data;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        "Prediction timed out after 60 seconds. Check the backend terminal."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Connection failed during prediction. Check the backend terminal and network."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
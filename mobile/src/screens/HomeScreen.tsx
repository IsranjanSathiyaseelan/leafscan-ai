import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import ImagePreview from "../components/ImagePreview";
import PredictionCard from "../components/PredictionCard";
import { checkBackend, getErrorMessage, predictImage } from "../services/api";
import { styles } from "../styles/HomeScreen.styles";
import type { PredictionResponse } from "../types/prediction";

async function toJpeg(uri: string): Promise<string> {
  const context = ImageManipulator.manipulate(uri).resize({ width: 1024 });
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.9,
  });
  return saved.uri;
}

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendReady, setBackendReady] = useState<boolean | null>(null);

  const verifyBackend = useCallback(async () => {
    setBackendReady(null);
    try {
      await checkBackend();
      setBackendReady(true);
    } catch (e) {
      setBackendReady(false);
      setError(getErrorMessage(e));
    }
  }, []);

  useEffect(() => {
    verifyBackend();
  }, [verifyBackend]);

  async function choosePhoto() {
    try {
      setError(null);

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (picked.canceled || !picked.assets?.length) return;

      setPrediction(null);
      setLoading(true);

      const jpegUri = await toJpeg(picked.assets[0].uri);
      setImageUri(jpegUri);

      setPrediction(await predictImage(jpegUri));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const statusColor =
    backendReady === null ? "#f9a825" : backendReady ? "#43a047" : "#e53935";
  const statusText =
    backendReady === null
      ? "Connecting…"
      : backendReady
        ? "Ready"
        : "Offline · tap to retry";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>LeafScan AI</Text>
        <Text style={styles.subtitle}>Tomato leaf disease detection</Text>

        <Pressable style={styles.statusRow} onPress={verifyBackend}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{statusText}</Text>
        </Pressable>
      </View>

      <ImagePreview imageUri={imageUri} />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={choosePhoto}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {imageUri ? "Choose another photo" : "Choose photo"}
          </Text>
        )}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {prediction && <PredictionCard prediction={prediction} />}
    </ScrollView>
  );
}

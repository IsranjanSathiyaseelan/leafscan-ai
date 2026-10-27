import { Image, Text, View } from "react-native";

import { styles } from "../styles/ImagePreview.styles";

interface Props {
  imageUri: string | null;
}

export default function ImagePreview({ imageUri }: Props) {
  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Selected leaf image"
      />
    );
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.icon}>🌱</Text>

      <Text style={styles.title}>Select a tomato leaf photo</Text>

      <Text style={styles.description}>
        Your image preview will appear here.
      </Text>
    </View>
  );
}
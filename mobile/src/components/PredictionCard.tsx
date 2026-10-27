import { Text, View } from "react-native";

import type { PredictionResponse } from "../types/prediction";
import { styles } from "../styles/PredictionCard.styles";

interface Props {
  prediction: PredictionResponse;
}

function formatClassName(value: string): string {
  return value
    .replace(/^tomato_+/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function percentage(score: number): number {
  return Math.min(100, Math.max(0, score * 100));
}

export default function PredictionCard({ prediction }: Props) {
  const healthy = /healthy/i.test(prediction.predicted_class);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{healthy ? "🌿" : "🍂"}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>LEAF ANALYSIS</Text>
          <Text style={styles.heading}>Your result</Text>
        </View>

        <View style={styles.completeBadge}>
          <Text style={styles.completeText}>Complete</Text>
        </View>
      </View>

      <View
        style={[
          styles.resultPanel,
          !healthy && styles.diseasePanel,
        ]}
      >
        <Text style={styles.resultLabel}>PREDICTED CLASS</Text>

        <Text style={styles.disease}>
          {formatClassName(prediction.predicted_class)}
        </Text>

        <View
          style={[
            styles.classBadge,
            !healthy && styles.diseaseBadge,
          ]}
        >
          <Text
            style={[
              styles.classBadgeText,
              !healthy && styles.diseaseBadgeText,
            ]}
          >
            {healthy ? "Healthy class" : "Disease class"}
          </Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Model score</Text>

          <Text style={styles.scoreValue}>
            {percentage(prediction.score).toFixed(1)}
            <Text style={styles.percentSymbol}>%</Text>
          </Text>
        </View>

        <Text style={styles.scoreHint}>
          A model score is not a confirmed diagnosis.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.subheading}>Prediction breakdown</Text>
        <Text style={styles.sectionCaption}>
          Top {prediction.top_predictions.length}
        </Text>
      </View>

      {prediction.top_predictions.map((item, index) => {
        const value = percentage(item.score);

        return (
          <View key={item.class_name} style={styles.predictionItem}>
            <View style={styles.predictionHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>

              <Text style={styles.label}>
                {formatClassName(item.class_name)}
              </Text>

              <Text style={styles.percentage}>
                {value.toFixed(1)}%
              </Text>
            </View>

            <View
              style={styles.track}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel={`${formatClassName(item.class_name)} model score`}
              accessibilityValue={{
                min: 0,
                max: 100,
                now: value,
              }}
            >
              <View
                style={[
                  styles.fill,
                  index > 0 && styles.secondaryFill,
                  { width: `${value}%` },
                ]}
              />
            </View>
          </View>
        );
      })}

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>Before you act</Text>
        <Text style={styles.notice}>{prediction.notice}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.modelDot} />
        <Text style={styles.model}>
          Powered by {prediction.model_name}
        </Text>
      </View>
    </View>
  );
}
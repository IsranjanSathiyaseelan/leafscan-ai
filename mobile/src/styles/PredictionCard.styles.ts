import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e1e9e3",
    padding: 20,
    marginBottom: 24,
    shadowColor: "#173b24",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
    flexWrap: "wrap",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#edf6ef",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 25,
  },

  headerText: {
    flex: 1,
    minWidth: 100,
  },

  eyebrow: {
    color: "#77867c",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  heading: {
    fontSize: 21,
    fontWeight: "800",
    color: "#193d28",
  },

  completeBadge: {
    backgroundColor: "#f0f5f1",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  completeText: {
    color: "#52695a",
    fontSize: 11,
    fontWeight: "600",
  },

  resultPanel: {
    backgroundColor: "#f0f8f2",
    borderWidth: 1,
    borderColor: "#dcece0",
    borderRadius: 18,
    padding: 20,
  },

  diseasePanel: {
    backgroundColor: "#fff9ee",
    borderColor: "#f0e3c7",
  },

  resultLabel: {
    color: "#738076",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  disease: {
    color: "#193d28",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 33,
    marginTop: 10,
    textTransform: "capitalize",
  },

  classBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcefe1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },

  diseaseBadge: {
    backgroundColor: "#f9e8c5",
  },

  classBadgeText: {
    color: "#28613c",
    fontSize: 11,
    fontWeight: "700",
  },

  diseaseBadgeText: {
    color: "#885d19",
  },

  scoreSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#dce5dc",
  },

  scoreLabel: {
    color: "#627367",
    fontSize: 13,
    marginBottom: 4,
  },

  scoreValue: {
    color: "#193d28",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
    fontVariant: ["tabular-nums"],
  },

  percentSymbol: {
    fontSize: 23,
    fontWeight: "600",
    color: "#6c7e70",
  },

  scoreHint: {
    color: "#738076",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 26,
    marginBottom: 18,
  },

  subheading: {
    color: "#193d28",
    fontSize: 15,
    fontWeight: "700",
  },

  sectionCaption: {
    color: "#829087",
    fontSize: 12,
  },

  predictionItem: {
    marginBottom: 18,
  },

  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
    gap: 9,
  },

  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: "#f0f4f1",
    alignItems: "center",
    justifyContent: "center",
  },

  rankText: {
    color: "#738076",
    fontSize: 10,
    fontWeight: "700",
  },

  label: {
    flex: 1,
    color: "#4d6154",
    fontSize: 13,
    lineHeight: 19,
    textTransform: "capitalize",
  },

  percentage: {
    color: "#244d33",
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  track: {
    height: 7,
    backgroundColor: "#edf2ee",
    borderRadius: 4,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#278650",
    borderRadius: 4,
  },

  secondaryFill: {
    backgroundColor: "#a5c6af",
  },

  noticeBox: {
    backgroundColor: "#f7f8fa",
    borderRadius: 14,
    padding: 15,
    marginTop: 4,
  },

  noticeTitle: {
    color: "#52616c",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },

  notice: {
    color: "#74808a",
    fontSize: 12,
    lineHeight: 19,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 20,
  },

  modelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7aa889",
  },

  model: {
    color: "#829087",
    fontSize: 11,
  },
});
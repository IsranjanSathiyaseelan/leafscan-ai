import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 40,
    gap: 18,
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1b5e20",
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#888",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#c62828",
    textAlign: "center",
    fontSize: 14,
  },
});
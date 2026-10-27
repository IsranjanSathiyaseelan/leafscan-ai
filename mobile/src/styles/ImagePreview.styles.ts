import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    backgroundColor: "#f0f5f1",
    marginBottom: 20,
  },
  placeholder: {
    height: 260,
    borderRadius: 16,
    backgroundColor: "#f0f7f1",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#abcbb3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 20,
  },
  icon: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#245334",
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: "#65756a",
    marginTop: 8,
    textAlign: "center",
  },
});
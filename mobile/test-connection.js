// Test connection script for mobile environment
const fs = require("fs");
const path = require("path");
const http = require("http");

// Read .env if present
let apiUrl = "http://localhost:8000";
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  const match = content.match(/EXPO_PUBLIC_API_URL\s*=\s*(.+)/);
  if (match && match[1]) {
    apiUrl = match[1].trim();
  }
}

console.log(`\nTesting connection to configured API URL: ${apiUrl}`);

const url = new URL("/health", apiUrl);
const req = http.get(url, { timeout: 5000 }, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log(`[SUCCESS] Status Code: ${res.statusCode}`);
    console.log(`Response body: ${data}`);
  });
});

req.on("error", (err) => {
  console.error(`[FAILED] Could not connect to ${apiUrl}:`, err.message);
  console.log("\nTips:");
  console.log("1. Ensure FastAPI is running on port 8000.");
  console.log("2. If testing from an Android device, localhost will NOT work. Use your PC's Wi-Fi IP or 'adb reverse tcp:8000 tcp:8000'.");
});

req.on("timeout", () => {
  req.destroy();
  console.error(`[TIMEOUT] Request to ${apiUrl} timed out. Check Windows Firewall and Wi-Fi network.`);
});

import io
import sys
from PIL import Image

try:
    import urllib.request
    import json
except ImportError:
    pass


def create_sample_leaf_image() -> bytes:
    """Generate a sample 224x224 green image in memory for testing."""
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))  # Forest green
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=90)
    return buffer.getvalue()


def test_endpoint(base_url: str):
    base_url = base_url.rstrip("/")
    print(f"\n==========================================")
    print(f" Testing LeafScan AI API at: {base_url}")
    print(f"==========================================")

    # 1. Health check
    health_url = f"{base_url}/health"
    print(f"\n1. Testing GET {health_url}...")
    try:
        req = urllib.request.Request(health_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            print(f"   [SUCCESS] Status: {resp.status}")
            print(f"   Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"   [FAILED] Could not connect to {health_url}: {e}")
        return False

    # 2. Classes check
    classes_url = f"{base_url}/api/classes"
    print(f"\n2. Testing GET {classes_url}...")
    try:
        req = urllib.request.Request(classes_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            print(f"   [SUCCESS] Status: {resp.status}")
            print(f"   Total classes: {data.get('count')}")
    except Exception as e:
        print(f"   [FAILED] Could not fetch classes: {e}")
        return False

    # 3. Predict check
    predict_url = f"{base_url}/api/predict"
    print(f"\n3. Testing POST {predict_url} with sample image...")
    image_bytes = create_sample_leaf_image()
    try:
        req = urllib.request.Request(
            predict_url,
            data=image_bytes,
            headers={"Content-Type": "image/jpeg"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print(f"   [SUCCESS] Status: {resp.status}")
            print(f"   Predicted Class : {data.get('predicted_class')}")
            print(f"   Confidence Score: {data.get('score')}")
            print(f"   Top Predictions :")
            for pred in data.get("top_predictions", []):
                print(f"     - {pred['class_name']}: {round(pred['score'] * 100, 2)}%")
    except Exception as e:
        print(f"   [FAILED] Prediction request failed: {e}")
        return False

    print("\n------------------------------------------")
    print(" ALL TESTS PASSED SUCCESSFULLY! ")
    print("------------------------------------------\n")
    return True


if __name__ == "__main__":
    # Test localhost by default, or an IP address if passed as argument
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
    test_endpoint(target_url)

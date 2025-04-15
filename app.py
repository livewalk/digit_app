from flask import Flask, request, jsonify, render_template
from PIL import Image
import numpy as np
import io
import base64
from tensorflow.keras.models import load_model
from PIL import ImageOps
import os, psutil

app = Flask(__name__)

# Load model once at startup
# model = load_model("digits_recognition_cnn.h5")

model = None

def get_model():
    global model
    if model is None:
        model = load_model("digits_recognition_cnn.h5")
        print(f"Model loaded ...{model}")
    return model

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        process = psutil.Process(os.getpid())
        mem_before = process.memory_info().rss / (1024 ** 2)  # in MB

        model = get_model()
        
        mem_after = process.memory_info().rss / (1024 ** 2)
        print(f"Memory before: {mem_before:.2f} MB, after: {mem_after:.2f} MB")
        
        # Get the base64 string from the request
        data = request.json["image"]
        #image.save("o_input.png")
        print("Incoming base64 string:", data[:30], "...")
        # Decode base64 string to image
        image_data = base64.b64decode(data.split(",")[1])
        image = Image.open(io.BytesIO(image_data)).convert("L")
        image = ImageOps.invert(image)
        image = image.resize((28, 28))
        image.save("debug_after_invert.png")
        image_array = np.array(image) / 255.0
        image_array = image_array.reshape(1, 28, 28, 1)

        prediction = model.predict(image_array)
        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
       
        print("Prediction:", predicted_class)
        print("Confidence:", confidence)

        return jsonify({
            'class': int(predicted_class),
            'confidence': float(confidence),
            'message':"Received and processed!", 
            'size': image.size,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

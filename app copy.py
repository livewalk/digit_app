from flask import Flask, request, jsonify, render_template
from PIL import Image
import numpy as np
import io
import base64
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load model once at startup
model = load_model("digits_recognition_cnn.h5")

# from flask import Flask, request, jsonify, render_template
# import base64
# from io import BytesIO
# from PIL import Image

# app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json['image']
        content = data.split(';base64,')[1]
        image_data = base64.b64decode(content)
        image = Image.open(io.BytesIO(image_data)).convert('L').resize((28, 28))
        
        # Convert to numpy array and normalize
        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 28, 28, 1)  # Shape for CNN input

        # Predict
        prediction = model.predict(img_array)
        predicted_digit = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        print("Prediction:", predicted_digit)
        print("Confidence:", confidence)


        return jsonify({
            'digit': predicted_digit,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.get_json()
#     image_data = data.get("image")

#     # Remove the prefix "data:image/png;base64,"
#     image_data = image_data.split(",")[1]

#     # Decode base64 image and open with PIL
#     image = Image.open(BytesIO(base64.b64decode(image_data)))
#     image = image.convert("L").resize((28, 28))  # Example preprocessing

#     # [Later: Run your model here and return prediction]


#     return jsonify({"message": "Image received and processed!", "size": image.size})

if __name__ == "__main__":
    app.run(debug=True)

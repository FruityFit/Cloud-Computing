from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import json
import re

app = Flask(__name__)

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = 'CNNModel.h5'
#print(model_folder)
loaded_model = load_model(model_path)
classes=['Apple', 'Avocado', 'Banana', 'Grape', 'Guava', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear', 'Strawberry', 'Watermelon']
classes_indo=['Apel', 'Alpukat', 'Pisang', 'Anggur', 'Jambu', 'Lemon', 'Mangga', 'Jeruk', 'Persik', 'Pir', 'Stroberi', 'Semangka']

#path
json_file_path1 = 'united_results_(o1).json'
json_file_path2 = 'united_results_(on).json'
fruitdesc_file_path = 'FruitDesc.json'


with open(fruitdesc_file_path, 'r') as json_file:
    fruits_json = json.load(json_file)



import csv


def get_nutrition_data(fruit_name):
    with open('nutrition_data.csv', mode='r', newline='') as file:
        reader = csv.DictReader(file)
        for nutrition_data in reader:
            if nutrition_data['name'].title() == fruit_name:
                return nutrition_data
        return 'data not found'



def preprocess_image(file_path):
    img = image.load_img(file_path, target_size=(100, 100))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Permintaan Error"})

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "Tidak ada file yang terpilih"})

        if file:
            # Save the uploaded file temporarily
            filename = secure_filename(file.filename)
            file_path = os.path.join("temp", filename)
            file.save(file_path)


            # Preprocess the image
            input_data = preprocess_image(file_path)

            # Make predictions using the loaded model
            predictions = loaded_model.predict(input_data)

            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
            os.remove(file_path)

            result = {
                "confidence": confidence,
                "description":  fruits_json[classes_indo[predicted_class]],
                **get_nutrition_data(classes_indo[predicted_class])
            }
            return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

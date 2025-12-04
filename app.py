from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from werkzeug.utils import secure_filename
from PIL import Image
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


try:
    cnn_model = load_model("cnn_model.h5")
    dbn_model = joblib.load("dbn_pipeline_model.pkl")
    sdae_model = load_model("sdae_classifier.h5")
except Exception as e:
    print(f" Model Loading Error: {str(e)}")
    raise

CLASSES = [
    'Squamous Cell Carcinoma',
    'Large Cell Carcinoma',
    'Adenocarcinoma',
    'Normal'
]
NUM_CLASSES = len(CLASSES)

def preprocess_image(image_path):
    """Process image for CNN, DBN, and SDAE"""
    try:
        img = Image.open(image_path).convert('RGB').resize((128, 128))
        img_array = np.array(img, dtype=np.float32) / 255.0

        return {
            'cnn': np.expand_dims(img_array, axis=0),       
            'dbn': img_array.reshape(1, -1).astype(np.float64), 
            'sdae': img_array.reshape(1, -1).astype(np.float32)  
        }
    except Exception as e:
        print(f" Image Processing Error: {str(e)}")
        raise

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
     
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        
        processed = preprocess_image(filepath)
        print(f" Shapes - CNN: {processed['cnn'].shape}, DBN: {processed['dbn'].shape}, SDAE: {processed['sdae'].shape}")

        
        cnn_pred = cnn_model.predict(processed['cnn'], verbose=0)[0]
        dbn_pred = dbn_model.predict_proba(processed['dbn'])[0]
        sdae_pred = sdae_model.predict(processed['sdae'], verbose=0)[0]

        
        if len(cnn_pred) != NUM_CLASSES or len(dbn_pred) != NUM_CLASSES or len(sdae_pred) != NUM_CLASSES:
            raise ValueError(
                f"Model outputs mismatch - Expected {NUM_CLASSES}, "
                f"Got CNN: {len(cnn_pred)}, DBN: {len(dbn_pred)}, SDAE: {len(sdae_pred)}"
            )

        
        combined = [
            {
                'id': CLASSES[i].lower().replace(' ', '-'),
                'name': CLASSES[i],
                'probability': float((cnn_pred[i] + dbn_pred[i] + sdae_pred[i]) / 3),
                'color': ''
            }
            for i in range(NUM_CLASSES)
        ]

        print(" Successful Analysis:")
        for res in combined:
            print(f" - {res['name']}: {res['probability']:.2%}")

        return jsonify({
            'predictions': combined,
            'processed_image_url': f"/uploads/{filename}"
        })

    except Exception as e:
        print(f"❌ Analysis Failed: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'details': str(e),
            'expected_classes': NUM_CLASSES,
            'received': {
                'cnn': len(cnn_pred) if 'cnn_pred' in locals() else 0,
                'dbn': len(dbn_pred) if 'dbn_pred' in locals() else 0,
                'sdae': len(sdae_pred) if 'sdae_pred' in locals() else 0
            }
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

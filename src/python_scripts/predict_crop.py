import os
import sys
import pickle
import pandas as pd

script_dir = os.path.dirname(os.path.realpath(__file__))
model_path = os.path.join(script_dir, '../../ai_model/trained_models/Crop_Recommendation.pkl')
model_path = os.path.normpath(model_path)

if not os.path.exists(model_path):
    print(f"Model file not found at: {model_path}")
    sys.exit(1)

try:
    model = pickle.load(open(model_path, 'rb'))
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

nitrogen    = float(sys.argv[1])
phosphorus  = float(sys.argv[2])
potassium   = float(sys.argv[3])
temperature = float(sys.argv[4])
humidity    = float(sys.argv[5])
ph          = float(sys.argv[6])
rainfall    = float(sys.argv[7])

input_data = pd.DataFrame(
    [
        [nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]
    ],
    columns=[
        'nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall'
    ]
)

try:
    prediction = model.predict(input_data)
    print(prediction[0])
except Exception as e:
    print(f"Error making prediction: {e}")
    sys.exit(1)

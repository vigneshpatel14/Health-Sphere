import os
import pickle
from flask import Flask, render_template, request, session, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Initialize Flask app
app = Flask(__name__)
app.secret_key = "Kass#11928"  # Secret key for session handling

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'static', 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'static', 'model')

# Load pre-trained model and datasets
model_path = os.path.join(MODEL_DIR, 'svc.pkl')
model = pickle.load(open(model_path, 'rb'))

df = pd.read_csv(os.path.join(DATA_DIR, 'Training.csv'))
symptoms_df = pd.read_csv(os.path.join(DATA_DIR, 'SYMTOMS_DF.CSV'))
precautions_df = pd.read_csv(os.path.join(DATA_DIR, 'precautions_df.csv'))
workouts_df = pd.read_csv(os.path.join(DATA_DIR, 'workout_df.csv'))
diets_df = pd.read_csv(os.path.join(DATA_DIR, 'diets.csv'))
severity_df = pd.read_csv(os.path.join(DATA_DIR, 'Symptom-severity.csv'))
description_df = pd.read_csv(os.path.join(DATA_DIR, 'description.csv'))
medications_df = pd.read_csv(os.path.join(DATA_DIR, 'medications.csv'))

# Encode target variable
label_encoder = LabelEncoder()
y = df['prognosis']
label_encoder.fit(y)

# Helper function for fetching disease-related information
def helper(predicted_disease):
    precautions_row = precautions_df[precautions_df['Disease'] == predicted_disease]
    precautions = ", ".join(map(str, precautions_row.iloc[0, 1:].dropna().values)) if not precautions_row.empty else "No precautions available."

    workouts_row = workouts_df[workouts_df['disease'] == predicted_disease]
    workouts = ", ".join(map(str, workouts_row.iloc[0, 1:].dropna().values)) if not workouts_row.empty else "No workouts available."

    diets_row = diets_df[diets_df['Disease'] == predicted_disease]
    diets = ", ".join(map(str, diets_row.iloc[0, 1:].dropna().values)) if not diets_row.empty else "No diets available."

    symptoms = symptoms_df[symptoms_df['Disease'] == predicted_disease].iloc[0, 1:].dropna().values
    severity_rows = severity_df[severity_df['Symptom'].isin(symptoms)]
    severity = ", ".join(map(str, severity_rows['severity'].dropna().values)) if 'severity' in severity_rows.columns and not severity_rows.empty else "No symptom severity available."

    description_row = description_df[description_df['Disease'] == predicted_disease]
    description = description_row.iloc[0, 1] if not description_row.empty else "No description available."

    medications_row = medications_df[medications_df['Disease'] == predicted_disease]
    medications = ", ".join(map(str, medications_row.iloc[0, 1:].dropna().values)) if not medications_row.empty else "No medications available."

    return precautions, workouts, diets, severity, description, medications

# Home route
@app.route('/')
def home():
    return render_template('index.html')

# Disease Prediction API
@app.route('/api/predict-disease', methods=['POST'])
def predict_disease():
    data = request.json
    symptoms = data.get('symptoms', [])
    user_input = [0] * len(df.columns[:-1])
    for sym in symptoms:
        if sym.strip() in df.columns:
            user_input[df.columns.get_loc(sym.strip())] = 1

    prediction = model.predict([user_input])
    predicted_disease = label_encoder.inverse_transform(prediction)[0]
    precautions, workouts, diets, severity, description, medications = helper(predicted_disease)

    return jsonify({
        'disease': predicted_disease,
        'description': description,
        'precautions': precautions.split(', '),
        'medications': medications.split(', '),
        'workout': workouts.split(', '),
        'diets': diets.split(', ')
    })

if __name__ == "__main__":
    app.run(debug=True)

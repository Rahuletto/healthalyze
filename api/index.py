from fastapi import FastAPI
import uvicorn
import joblib
import tensorflow as tf
import numpy as np
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

ml_model = joblib.load("model/stroke_prediction_model.pkl")
dl_model = tf.keras.models.load_model("model/saved_models/stroke_cnn_model.h5")

class StrokeInput(BaseModel):
    age: float
    hypertension: int
    heart_disease: int
    avg_glucose_level: float
    bmi: float
    gender: str
    smoking_status: str
    residence: str
    work_type: str
    ever_married: str
    physical_activity: str

def preprocess_input(data):
    gender_onehot = [0, 0, 0]
    smoking_onehot = [0, 0, 0]
    residence_onehot = [0, 0]
    work_onehot = [0, 0, 0, 0, 0]
    activity_onehot = [0, 0, 0]
    
    gender_map = {"Male": 0, "Female": 1}
    smoking_map = {"Never smoked": 0, "formerly smoked": 1, "smokes": 2}  
    residence_map = {"Urban": 0, "Rural": 1}
    work_map = {"Private": 0, "Self-employed": 1, "Govt_job": 2, "Never_worked": 3}
    activity_map = {"Low": 0, "Moderate": 1, "High": 2}
    
    if data.gender in gender_map:
        gender_onehot[gender_map[data.gender]] = 1
    if data.smoking_status in smoking_map:
        smoking_onehot[smoking_map[data.smoking_status]] = 1
    if data.residence in residence_map:
        residence_onehot[residence_map[data.residence]] = 1
    if data.work_type in work_map:
        work_onehot[work_map[data.work_type]] = 1
    if data.physical_activity in activity_map:
        activity_onehot[activity_map[data.physical_activity]] = 1
    
    ever_married = 1 if data.ever_married == "Yes" else 0
    
    scaler = joblib.load("model/scaler.pkl")
    num_features = np.array([[data.age, data.hypertension, data.heart_disease, data.avg_glucose_level, data.bmi]])
    num_features = scaler.transform(num_features)
    
    final_features = np.array([[
        *num_features[0],
        *gender_onehot,  
        *smoking_onehot,  
        *residence_onehot,  
        *work_onehot,
        *activity_onehot,
        ever_married
    ]])
    
    return final_features

@app.post("/api/predict")
def predict_stroke(data: StrokeInput):
    input_data = preprocess_input(data)
    
    ml_pred = float(ml_model.predict_proba(input_data)[:, 1])  
    dl_raw = dl_model.predict(input_data)[0][0]
    dl_pred = float(tf.keras.activations.sigmoid(dl_raw))  

    final_probability = (0.45 * ml_pred) + (0.85 * dl_pred)
    final_probability = np.clip(final_probability ** (1 - (0.8 * final_probability)), 0, 1)

    if final_probability < 0.20:
        risk_level = "Very Low"
        advice = "Your lifestyle seems solid! Stay active, eat well, and keep an eye on any unusual symptoms."

    elif final_probability < 0.40:
        risk_level = "Low"
        advice = "You're doing fine, but small tweaks like better sleep, hydration, and regular exercise can help prevent issues."

    elif final_probability < 0.65:
        risk_level = "Moderate"
        advice = "Your risk is starting to rise. Cut down on processed foods, stay consistent with workouts, and get regular checkups."

    else:
        risk_level = "High"
        advice = "Your stroke risk is concerning. Consult a doctor, monitor blood pressure, and take immediate steps to improve heart health."

    return {
        "stroke_probability": round(final_probability * 100, 2),
        "risk_level": risk_level,
        "advice": advice
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

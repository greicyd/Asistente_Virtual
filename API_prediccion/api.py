from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import numpy as np
import pickle

app = FastAPI()

# Cargar modelo
modelo_path = Path("models/Random_Forest_model.pkl")
with open(modelo_path, "rb") as f:
    modelo = pickle.load(f)

# Estructura de un solo dato
class Dato(BaseModel):
    cms: float
    concentrazione: float
    oxygen: float
    nitrogen: float

# Estructura de la ventana
class VentanaEntrada(BaseModel):
    datos: List[Dato]

@app.post("/predecir")
def predecir_fallo(ventana: VentanaEntrada):
    # Convertir a numpy array
    arr = np.array([[d.cms, d.concentrazione, d.oxygen, d.nitrogen] for d in ventana.datos])
    
    # Reshape para que quede igual que en el Colab: (1, window_size, n_features)
    arr = np.expand_dims(arr, axis=0)  
    
    # Aplanar
    entrada = arr.reshape((arr.shape[0], arr.shape[1] * arr.shape[2]))
    
    # Predicción
    prediccion = modelo.predict(entrada)[0]
    probabilidades = modelo.predict_proba(entrada)[0]
    
    return {
        "prediccion": int(prediccion), 
        "probabilidad_falla": float(probabilidades[1])
    }
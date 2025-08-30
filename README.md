# Asistente_Virtual
Asistente virtual para monitoreo de indicadores de desempeño y predicción de fallas en maquinaria, facilitando análisis y toma de decisiones.

## Estructura del proyecto

El repositorio contiene tres carpetas principales:

- `frontend/` → Código del frontend de la aplicación.  
- `backend/` → Código de soporte y lógica del backend, si aplica.  
- `API_prediccion/` → Código de la API de predicción y modelos entrenados.



---

## Levantamiento y configuración de la API de modelo predictivo

Dentro de `API_prediccion/` se encuentran:

- `api.py` → Archivo principal de la API.  
- `requirements.txt` → Lista de dependencias de Python necesarias.  
- `models/` → Carpeta que contiene `Random_Forest_model.pkl`, el modelo entrenado.

Sigue estos pasos para ejecutar la API de predicción en tu máquina local.

Dentro del repositorio, debes ingresar a la carpeta que contiene el código de la API

```bash
cd API_prediccion
```
Esta carpeta incluye los archivos api.py, requirements.txt y la carpeta models/ con el modelo entrenado

Es recomendable usar un entorno virtual para mantener las dependencias aisladas y evitar conflictos con otras instalaciones de Python:

```bash
python -m venv venv
```

Activar el entorno virtual:

```bash
venv\Scripts\activate
```

Una vez activado, tu consola debería mostrar el nombre del entorno, por ejemplo (venv)

Con el entorno virtual activo, instala todas las librerías necesarias desde el archivo requirements.txt:

```bash
pip install -r requirements.txt
```

Una vez instaladas las dependencias, ejecuta la API con Uvicorn:

```bash
uvicorn api:app --reload
```

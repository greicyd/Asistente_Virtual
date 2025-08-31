# Documentación de aplicación de Asistente Virtual

Este proyecto permite desplegar un Asistente Virtual que, mediante una interfaz web, ofrece consultas en tiempo real sobre datos de indicadores de desempeño (KPI). Además, integra un modelo predictivo para anticipar fallos de máquina y brindar soporte en la toma de decisiones. De esta manera, se monitorea de indicadores de desempeño y predicce de fallas en maquinaria, facilitando análisis y toma de decisiones.

## Objetivos

El objetivo de esta aplicación es permitir:

- Realizar consultas sobre indicadores clave de desempeño (KPI) mediante una interfaz web.

- Mostrar datos históricos y en tiempo real relacionados con la producción y desempeño de las máquinas.

- Integrar un modelo predictivo para anticipar posibles fallos de máquina.

- Brindar respuestas en lenguaje natural que faciliten la interpretación de la información.

## Estructura del proyecto

El repositorio contiene tres carpetas principales:

- `frontend/` → Código del frontend de la aplicación.  
- `backend/` → Código de soporte y lógica del backend.  
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
Esta carpeta incluye los archivos `api.py`, `requirements.txt` y la carpeta `models/` con el modelo entrenado

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

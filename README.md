# Documentación de aplicación de Asistente Virtual

Este proyecto permite desplegar un Asistente Virtual que, mediante una interfaz web, ofrece consultas en tiempo real sobre datos de indicadores de desempeño (KPI). Además, integra un modelo predictivo para anticipar fallos de máquina y brindar soporte en la toma de decisiones. De esta manera, se monitorea de indicadores de desempeño y predicce de fallas en maquinaria, facilitando análisis y toma de decisiones.

## Objetivos

El objetivo de esta aplicación es permitir:

- Realizar consultas sobre indicadores clave de desempeño (KPI) mediante una interfaz web.

- Mostrar datos históricos y en tiempo real relacionados con la producción y desempeño de las máquinas.

- Integrar un modelo predictivo para anticipar posibles fallos de máquina.

- Brindar respuestas en lenguaje natural que faciliten la interpretación de la información.

## Requisitos

- Sistema operativo: Windows 10 o superior
- Procesador: x64 compatible
- Memoria RAM: 16 GB o superior
- Node.js: versión 22.17.0 o superior (https://nodejs.org/es/download)
- Python: versión 3.10 o superior (https://www.python.org/downloads/)
- Ollama: versión 0.9.3 o superior (https://ollama.com/download/windows)
- Modelo LLaMA3: versión 8b (https://ollama.com/library/llama3)
- PostgreSQL: verión 17 o superior (https://www.postgresql.org/download/windows/) 

## Estructura del proyecto

El repositorio contiene tres carpetas principales relacionadas al levantamiento del sistema del asistente virtual:

- `frontend/` → Código del diseño visual de la aplicación de Asistente Virtual.  
- `backend/` → Código de soporte y lógica del sistema.  
- `API_prediccion/` → Código de la API de predicción y modelos entrenados.


---
## Levantamiento y configuración del frontend

Dentro de `frontend/` se encuentran:

- `src/` → Código fuente del frontend (componentes, vistas, lógica).
- `public/` → Archivos estáticos públicos.
- `index.html` → Archivo HTML base.
- `vite.config.js` → Configuración de Vite para el proyecto.
- `eslint.config.js` → Configuración de reglas de linting.
- `package.json` y `package-lock.json` → Dependencias del frontend.

Sigue estos pasos para ejecutar el frontend en tu máquina local.

Dentro del repositorio, debes ingresar a la carpeta que contiene el código del frontend

```bash
cd frontend
```
Instalar todas las dependicencias necesarias

```bash
npm install
```
Una vez instaladas las dependencias, ejecuta el archivo principal para levantar el servidor

```bash
npm run dev
```

## Levantamiento y configuración del backend

Dentro de `backend/` se encuentran:

- `src/` → Código fuente del backend (`controllers/`,`utils/`,`index.js`).  
- `package.json` y `package-lock.json` → Dependencias del backend.

Previo al levantamiento del backend, se debe de configurar el archivo `src/util/baseDatos.js`, con las credenciales adecuadas acorde a su servidor PostgreSQL y base de datos

```JavaScript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'HOST',
  user: 'USER NAME',
  port: PUERTO,
  password: 'PASSWORD',
  database: 'DATABASE NAME',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```
De la misma forma, el sistema esta configurado para trabajar con las tablas `datos_usuarios` , `datos_maquina` , `datos_kpi` 

Sigue estos pasos para ejecutar el backend en tu máquina local.

Dentro del repositorio, debes ingresar a la carpeta que contiene el código del backend

```bash
cd backend
```
Instalar todas las dependicencias necesarias

```bash
npm install
```
Una vez instaladas las dependencias, ejecuta el archivo principal para levantar el servidor

```bash
node src/index.js
```


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

Con el entorno virtual activo, instala todas las librerías necesarias desde el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

Una vez instaladas las dependencias, ejecuta la API con Uvicorn:

```bash
uvicorn api:app --reload
```

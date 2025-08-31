const express = require('express');
const cors = require('cors');
const path = require('path');
const { procesarPregunta } = require('./controllers/consultaController');
const { obtenerIntencion } = require('./controllers/intencionController');
const { procesarPrediccion } = require('./controllers/prediccionController');
const { loginController } = require('./controllers/loginController');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

// 👉 Servir el frontend compilado
app.use(express.static(path.join(__dirname, "../../frontend_asistente_virtual/dist")));


// Ruta principal
app.post('/preguntar', async (req, res) => {
  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'No se recibió la pregunta' });
  }

  try {
    console.log('📌 Detectando intención...');
    const intencion = await obtenerIntencion(pregunta);
    console.log(`🧠 Intención detectada: ${intencion}`);

    if (intencion === 'CONSULTA') {
      const respuesta = await procesarPregunta(pregunta);
      res.json({ respuesta });
    } 
    else if (intencion === 'PREDICCION') {
      try {
        const respuestaPrediccion = await procesarPrediccion(pregunta);
        res.json({ respuesta: respuestaPrediccion });
      } catch (error) {
        console.error('❌ Error en predicción:', error.message);
        res.status(500).json({ error: 'Error al procesar la predicción.' });
      }
    }
    else {
      respuesta = "La pregunta que has realizado no corresponde a ninguna consulta de KPIs o predicción de fallo, por favor reformula tu pregunta para ir acorde al objetivo para el que fui diseñado"
      res.json({ respuesta });
    }
  } catch (error) {
    console.error('❌ Error en el backend:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ruta de login
app.post('/login', loginController);

// 👉 Para cualquier otra ruta (React Router)


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend_asistente_virtual/dist", "index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor backend escuchando en http://0.0.0.0:${PORT}`);
});
const fetch = require('node-fetch');
const db = require('../utils/baseDatos');


// ======= PostgreSQL: Ejecutar consulta ===========
async function ejecutarConsultaEnPostgres(sql) {
  try {
    const res = await db.query(sql);
    return res.rows;
  } catch (err) {
    throw new Error(`Error al ejecutar la consulta: ${err.message}`);
  }
}

// ======= FastAPI: Enviar datos al modelo ===========
async function predecirConModelo(datos) {
  // Armamos la estructura que espera FastAPI
  const payload = {
    datos: datos.map(d => ({
      cms: d.cms,
      concentrazione: d.concentrazione,
      oxygen: d.oxygen,
      nitrogen: d.nitrogen
    }))
  };

  const response = await fetch('http://localhost:8000/predecir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error al predecir: ${response.statusText}`);
  }

  const resultado = await response.json();
  return resultado.prediccion; // 0 o 1
}

// ======= Llama3: Explica la predicción ===========
async function generarExplicacionDePrediccion(pregunta, datos, prediccion) {
  const prompt = `
Pregunta del usuario:
"${pregunta}"

Datos utilizados para la predicción:
${JSON.stringify(datos)}

Resultado del modelo: ${prediccion}

Redacta una respuesta en español clara y breve para el usuario. Si el resultado fue 1 es porque el modelo predice, indica que es probable que ocurra una falla. Si fue 0 es porque el modelo predice, indica que no se espera una falla. Usa lenguaje simple y directo.
no menciones el resultado es 0 o 1, di el modelo predice que , de esa forma se entiende mejor , di cual es el porcentaje de probabilidad 
`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  let respuesta = data.response.trim();
  return respuesta.replace(/^"|"$/g, "").replace(/\\"/g, '"');
}

// ========== Proceso completo ============
async function procesarPrediccion(preguntaUsuario) {
  try {
    sql = "SELECT cms, concentrazione, oxygen, nitrogen FROM datos_maquina  ORDER BY timestamp DESC LIMIT 11"

    console.log('🔍 Ejecutando consulta en PostgreSQL...');
    const resultados = await ejecutarConsultaEnPostgres(sql);
    console.log('📊 Resultados obtenidos:\n', resultados);

    if (!resultados.length) {
      throw new Error("No se encontraron datos para la máquina tipo L.");
    }


    console.log('📤 Enviando datos al modelo de predicción...');
    // Mandar TODOS los últimos 10 resultados como ventana
    const prediccion = await predecirConModelo(resultados);
    console.log('📈 Resultado de predicción:', prediccion);

    console.log('🗣️ Generando respuesta basada en predicción...');
    const respuestaNatural = await generarExplicacionDePrediccion(preguntaUsuario, resultados, prediccion);
    console.log('\n✅ Respuesta final:\n' + respuestaNatural);

    return respuestaNatural;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}


module.exports = { procesarPrediccion };
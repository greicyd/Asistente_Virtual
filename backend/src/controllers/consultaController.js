const fetch = require('node-fetch');
const db = require('../utils/baseDatos');

// ======= Llama3: Pregunta a SQL ===========
async function obtenerConsultaSQL(preguntaUsuario) {
  const prompt = `

Esquema de la tabla:
kpis(id: integer, mttr: integer, mtbf: integer, fecha: date)

${preguntaUsuario}

Usa sintaxis SQL compatible con PostgreSQL. No uses funciones de MySQL como DATE_SUB.

Responde únicamente en formato JSON, sin explicaciones, usando esta estructura:

{"sql_query": "AQUÍ_LA_CONSULTA",
 "original_query": "AQUÍ_EL_RESUMEN_EN_LENGUAJE_NATURAL"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 5 AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)",
 "original_query": "mttr del mes de mayo"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 8 AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE) - 1",
 "original_query": "mttr del mes de agosto del año pasado"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE fecha >= DATE_TRUNC('year', CURRENT_DATE) AND fecha <= CURRENT_DATE",
 "original_query": "mttr de lo que va del año"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 5 AND EXTRACT(YEAR FROM fecha) IN (EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE) - 1)",
 "original_query": "comparar mttr de mayo de este año y del año pasado"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 6 AND EXTRACT(YEAR FROM fecha) = 2025",
 "original_query": "mttr del mes de junio del 2025"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 5 AND EXTRACT(YEAR FROM fecha) IN (2024, 2023)",
 "original_query": "comparar mttr de mayo 2024 y mayo 2023"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(YEAR FROM fecha) = 2022",
 "original_query": "mttr del año 2022"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE EXTRACT(MONTH FROM fecha) = 2 AND EXTRACT(YEAR FROM fecha) = 2023",
 "original_query": "mttr de febrero del 2023"}

<example>
{"sql_query": "SELECT mttr FROM kpis WHERE fecha >= '2024-01-01' AND fecha <= '2024-03-31'",
 "original_query": "mttr entre enero y marzo de 2024"}
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
  const json = JSON.parse(data.response);
  return json.sql_query;
}

// ========== PostgreSQL: Ejecutar consulta ============
async function ejecutarConsultaEnPostgres(sql) {
  try {
    const res = await db.query(sql);
    return res.rows;
  } catch (err) {
    throw new Error(`Error al ejecutar la consulta: ${err.message}`);
  }
}

// ======= Llama3: Explica el resultado en lenguaje natural =========
async function generarRespuestaNatural(pregunta, resultados) {
  const prompt = `
Pregunta del usuario:
"${pregunta}"

Resultado de la consulta SQL:
${JSON.stringify(resultados)}

Redacta una respuesta en español corta de una sola oracion en lenguaje natural. Sé claro y directo. Si hay múltiples valores, explica que hay más de uno. El MTTR es tiempo promedio para reparacion y MTBF tiempo promedio entre fallas ambas en minutos
SI hay mas de un valor, DEBES realizar una comparación cuantitativa de los valores, por ejemplo cual es la diferencia entre esos datos , o incrementos o decrementos, comparalos
si se pide comparacion indica cual es la diferencia entre los valores, si son varios valores de comparar, indica el más grande el menor de ellos y la diferente entre cada uno

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

  // Eliminar comillas extra si las hay
  if (respuesta.startsWith('"') && respuesta.endsWith('"')) {
    respuesta = respuesta.slice(1, -1);
  }

  // Limpieza de caracteres escapados
  respuesta = respuesta.replace(/\\"/g, '"').replace(/\\n/g, '\n');

  return respuesta;
}

// ========== Proceso completo ============
async function procesarPregunta(preguntaUsuario) {
  try {
    console.log('🧠 Enviando pregunta a Llama3...');
    const sql = await obtenerConsultaSQL(preguntaUsuario);
    console.log('📝 Consulta generada:\n', sql);

    console.log('🔍 Ejecutando consulta en PostgreSQL...');
    const resultados = await ejecutarConsultaEnPostgres(sql);
    console.log('📊 Resultados obtenidos:\n', resultados);

    console.log('🗣️ Generando respuesta en lenguaje natural...');
    const respuestaNatural = await generarRespuestaNatural(preguntaUsuario, resultados);
    console.log('\n✅ Respuesta final:\n' + respuestaNatural);

    return respuestaNatural;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// === Usuario escribe su pregunta aquí ===
module.exports = {
  procesarPregunta
};

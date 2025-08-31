const fetch = require('node-fetch');

async function obtenerIntencion(preguntaUsuario) {
  const prompt = `
Clasifica la intención de la siguiente pregunta en UNA SOLA de estas categorías:

- PREDICCION: si lo que el usuario pregunta si maquina envasadora o maquina L fallara en un periodo de tiempo, o si pregunta el estado actual de la maquina L o maquina tipo L
- CONSULTA: si la pregunta busca conocer datos historicos de MTTR o MTBF en un periodo de tiempo
- OTRA: si no corresponde a ninguna de las anteriores, como capitales de paises, sumas , restas, o cualquier pregunta que sea de cultura general o basica de matematica.

### Formato de respuesta:
Responde ÚNICAMENTE en formato JSON **válido** y sin explicaciones, usando esta estructura:
<example>
{"intencion": "PREDICCION"}  
<example>
{"intencion": "CONSULTA"}  
<example>
{"intencion": "OTRA"}

intencion sin TILDE

### Pregunta del usuario:
${preguntaUsuario}
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

  // 🔍 Mostrar toda la respuesta que envía el modelo
 // console.log("=== RESPUESTA COMPLETA DE LLAMA3 ===");
  //console.log(JSON.stringify(data, null, 2)); // Ver formato real
  //console.log("====================================");
  console.log(data);
  console.log(data.response);
  try {
    if (!data || !data.response) {
      throw new Error("No se recibió respuesta válida del modelo.");
      
    }

    const jsonMatch = data.response.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo encontrar un JSON válido en la respuesta.");
    }

    const json = JSON.parse(jsonMatch[0]);
    return json["intención"] || json.intencion || "OTRA";
  } catch (err) {
    console.error("Error al analizar la intención:", err);
    return "OTRA"; // o null si prefieres
  }
}

module.exports = {
  obtenerIntencion,
};

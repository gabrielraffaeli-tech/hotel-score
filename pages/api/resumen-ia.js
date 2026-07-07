export default async function handler(req, res) {
  // 1. Nos aseguramos de que la app se esté comunicando correctamente
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { hotel, reseñas } = req.body;

  if (!hotel || !reseñas || reseñas.length === 0) {
    return res.status(400).json({ error: 'Faltan datos del hotel o las opiniones.' });
  }

  try {
    // 2. Aquí va la llave secreta para usar la Inteligencia Artificial
    const API_KEY = process.env.GEMINI_API_KEY;

    // 3. Juntamos todas las opiniones en un solo texto largo
    const textoReseñas = reseñas.map(r => r.texto || r.text || '').join('\n\n');

    // 4. Le damos la instrucción estricta a la IA (El Prompt)
    const prompt = `Lee estas opiniones del hotel ${hotel.nombre} en la ciudad de ${hotel.ciudad}. Redacta una única oración de máximo 30 palabras que resuma su categoría, ubicación y su mayor atractivo, sin listar servicios. Opiniones a analizar:\n${textoReseñas}`;

    // 5. Nos conectamos con Google Gemini para pedirle el resumen rápido
    const respuestaIA = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await respuestaIA.json();

    // Si la IA nos devuelve un error, cortamos acá
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Extraemos el texto exacto que escribió la IA
    const resumenFinal = data.candidates[0].content.parts[0].text;

    // 6. Le devolvemos el resumen listo a la pantalla
    return res.status(200).json({ resumen: resumenFinal });

  } catch (error) {
    console.error("Error en el motor de IA:", error);
    return res.status(500).json({ error: 'No se pudo generar el resumen inteligente.' });
  }
}
const BASE_URL = 'https://maps.googleapis.com/maps/api'

export async function buscarHotel(nombre, ciudad, domicilio = '') {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null

  const query = domicilio
    ? `${nombre} ${domicilio} ${ciudad}`
    : `hotel ${nombre} ${ciudad}`

  const searchUrl = `${BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}&type=lodging&key=${apiKey}`
  const res = await fetch(searchUrl)
  const data = await res.json()

  if (!data.results || data.results.length === 0) return null

  if (data.results.length > 1 && !domicilio) {
    return {
      multipleResultados: true,
      total: data.results.length,
      opciones: data.results.slice(0, 10).map(c => ({
        place_id: c.place_id,
        nombre: c.name,
        direccion: c.formatted_address,
      })),
    }
  }

  return data.results[0]
}

async function fetchReviews(placeId, apiKey, idioma, sort) {
  const url = `${BASE_URL}/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,url&language=${idioma}&reviews_sort=${sort}&key=${apiKey}`
  const res = await fetch(url)
  const data = await res.json()
  return data.result || null
}

export async function obtenerReseñas(placeId) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null

  // 4 combinaciones: 2 idiomas x 2 ordenamientos = hasta 20 reseñas únicas
  const combinaciones = [
    { idioma: 'es', sort: 'most_relevant' },
    { idioma: 'es', sort: 'newest' },
    { idioma: 'en', sort: 'most_relevant' },
    { idioma: 'en', sort: 'newest' },
  ]

  const resultados = await Promise.all(
    combinaciones.map(c => fetchReviews(placeId, apiKey, c.idioma, c.sort))
  )

  const base = resultados.find(r => r !== null)
  if (!base) return null

  const { name, rating, user_ratings_total, formatted_address, url } = base

  // Combinar eliminando duplicados por author_name
  const reseñasMap = new Map()
  for (const resultado of resultados) {
    if (!resultado?.reviews) continue
    for (const r of resultado.reviews) {
      const clave = r.author_name
      if (!reseñasMap.has(clave) && r.text && r.text.length > 10) {
        reseñasMap.set(clave, {
          autor: r.author_name,
          calificacion: r.rating,
          texto: r.text,
          fecha: r.relative_time_description,
          idioma: r.language,
          time: r.time || 0,
        })
      }
    }
  }

  const reseñas = Array.from(reseñasMap.values())
    .sort((a, b) => b.time - a.time)

  console.log(`✅ Reseñas únicas para ${name}: ${reseñas.length}`)

  return {
    fuente: 'Google',
    nombre: name,
    rating,
    totalReseñas: user_ratings_total,
    direccion: formatted_address,
    url,
    reseñas,
  }
}

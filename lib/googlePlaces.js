// Integración con Google Places API para buscar hoteles y obtener reseñas.

const BASE_URL = 'https://maps.googleapis.com/maps/api'

export async function buscarHotel(nombre, ciudad, domicilio = '') {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null

  const query = domicilio
    ? `${nombre} ${domicilio} ${ciudad}`
    : `hotel ${nombre} ${ciudad}`

  // textsearch devuelve múltiples resultados
  const searchUrl = `${BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}&type=lodging&key=${apiKey}`

  const res = await fetch(searchUrl)
  const data = await res.json()

  console.log('Google textsearch resultados:', data.results?.length, data.results?.map(r => r.name + ' - ' + r.formatted_address))

  if (!data.results || data.results.length === 0) return null

  // Si hay varios resultados y no se ingresó domicilio, avisamos
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

export async function obtenerReseñas(placeId) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null

  const detailsUrl = `${BASE_URL}/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,url&language=es&key=${apiKey}`

  const res = await fetch(detailsUrl)
  const data = await res.json()

  if (!data.result) return null

  const { name, rating, user_ratings_total, reviews = [], formatted_address, url } = data.result

  return {
    fuente: 'Google',
    nombre: name,
    rating,
    totalReseñas: user_ratings_total,
    direccion: formatted_address,
    url,
    reseñas: reviews.map(r => ({
      autor: r.author_name,
      calificacion: r.rating,
      texto: r.text,
      fecha: r.relative_time_description,
      idioma: r.language,
    })),
  }
}

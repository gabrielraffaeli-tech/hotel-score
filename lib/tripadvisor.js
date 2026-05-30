// Integración con TripAdvisor Content API (gratuita con registro).
// Docs: https://tripadvisor-content-api.readme.io/reference/overview

const BASE_URL = 'https://api.content.tripadvisor.com/api/v1'

export async function buscarHotelTripAdvisor(nombre, ciudad) {
  const apiKey = process.env.TRIPADVISOR_API_KEY
  if (!apiKey) return null

  const query = `${nombre} ${ciudad}`
  const url = `${BASE_URL}/location/search?searchQuery=${encodeURIComponent(query)}&category=hotels&language=es&key=${apiKey}`

  const res = await fetch(url, { headers: { accept: 'application/json' } })
  const data = await res.json()

  if (!data.data || data.data.length === 0) return null
  return data.data[0]
}

export async function obtenerReseñasTripAdvisor(locationId) {
  const apiKey = process.env.TRIPADVISOR_API_KEY
  if (!apiKey) return null

  const [detailsRes, reviewsRes] = await Promise.all([
    fetch(`${BASE_URL}/location/${locationId}/details?language=es&key=${apiKey}`, {
      headers: { accept: 'application/json' },
    }),
    fetch(`${BASE_URL}/location/${locationId}/reviews?language=es&key=${apiKey}`, {
      headers: { accept: 'application/json' },
    }),
  ])

  const details = await detailsRes.json()
  const reviewsData = await reviewsRes.json()

  return {
    fuente: 'TripAdvisor',
    nombre: details.name,
    rating: details.rating ? parseFloat(details.rating) : null,
    totalReseñas: details.num_reviews ? parseInt(details.num_reviews) : null,
    direccion: details.address_obj?.address_string,
    url: details.web_url,
    reseñas: (reviewsData.data || []).map(r => ({
      autor: r.user?.username || 'Anónimo',
      calificacion: r.rating,
      texto: r.text,
      fecha: r.published_date?.split('T')[0],
      idioma: r.lang,
    })),
  }
}

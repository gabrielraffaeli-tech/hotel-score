// Integración con SerpAPI para obtener reseñas de Google Maps.
// Trae hasta 100+ reseñas reales, mucho más que el límite de 5 de Places API.

const SERPAPI_BASE = 'https://serpapi.com/search'

export async function buscarHotelSerpApi(nombre, ciudad, domicilio = '') {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) return null

  const query = domicilio
    ? `${nombre} ${domicilio} ${ciudad}`
    : `${nombre} hotel ${ciudad}`

  const params = new URLSearchParams({
    engine: 'google_maps',
    q: query,
    type: 'search',
    api_key: apiKey,
    hl: 'es',
  })

  const res = await fetch(`${SERPAPI_BASE}?${params}`)
  const data = await res.json()

  if (!data.local_results || data.local_results.length === 0) return null

  return data.local_results[0]
}

export async function obtenerReseñasSerpApi(dataId, nombre) {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) return null

  // Traer reseñas paginadas — hasta 3 páginas = ~90 reseñas
  const todasLasReseñas = []
  let nextPageToken = null
  let pagina = 0
  const MAX_PAGINAS = 3

  while (pagina < MAX_PAGINAS) {
    const params = new URLSearchParams({
      engine: 'google_maps_reviews',
      data_id: dataId,
      api_key: apiKey,
      hl: 'es',
      sort_by: pagina === 0 ? 'ratingHigh' : 'newestFirst',
    })

    if (nextPageToken) params.set('next_page_token', nextPageToken)

    const res = await fetch(`${SERPAPI_BASE}?${params}`)
    const data = await res.json()

    if (!data.reviews || data.reviews.length === 0) break

    for (const r of data.reviews) {
      todasLasReseñas.push({
        autor: r.user?.name || 'Anónimo',
        calificacion: r.rating,
        texto: r.snippet || '',
        fecha: r.date || '',
        idioma: 'es',
      })
    }

    nextPageToken = data.serpapi_pagination?.next_page_token
    if (!nextPageToken) break
    pagina++
  }

  console.log(`✅ SerpAPI reseñas para ${nombre}: ${todasLasReseñas.length}`)

  return todasLasReseñas
}

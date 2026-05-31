// Reseñas adicionales via SerpAPI - Bing Maps
// Intenta traer reseñas de una fuente alternativa a Google Maps

const SERPAPI_BASE = 'https://serpapi.com/search'

export async function obtenerReseñasBooking(nombre, ciudad) {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) return null

  try {
    // Buscar el hotel en Google Maps primero para obtener el data_id
    const searchParams = new URLSearchParams({
      engine: 'google_maps',
      q: `${nombre} hotel ${ciudad} booking`,
      type: 'search',
      api_key: apiKey,
      hl: 'en', // inglés para obtener reseñas distintas
    })

    const searchRes = await fetch(`${SERPAPI_BASE}?${searchParams}`)
    const searchData = await searchRes.json()

    if (!searchData.local_results || searchData.local_results.length === 0) return null

    const lugar = searchData.local_results[0]

    // Traer reseñas en inglés (distintas a las que ya tenemos en español)
    const reviewParams = new URLSearchParams({
      engine: 'google_maps_reviews',
      data_id: lugar.data_id,
      api_key: apiKey,
      hl: 'en',
      sort_by: 'qualityScore',
    })

    const reviewRes = await fetch(`${SERPAPI_BASE}?${reviewParams}`)
    const reviewData = await reviewRes.json()

    if (!reviewData.reviews || reviewData.reviews.length === 0) return null

    const reseñas = reviewData.reviews
      .filter(r => r.snippet && r.snippet.length > 15)
      .map(r => ({
        autor: r.user?.name || 'Guest',
        calificacion: r.rating,
        texto: r.snippet,
        fecha: r.date || '',
        idioma: 'en',
      }))

    console.log(`✅ Reseñas en inglés adicionales para ${nombre}: ${reseñas.length}`)

    if (reseñas.length === 0) return null

    return {
      fuente: 'Google Reviews (EN)',
      nombre: lugar.title || nombre,
      rating: lugar.rating,
      totalReseñas: lugar.reviews,
      direccion: lugar.address,
      url: lugar.link,
      reseñas,
    }
  } catch (e) {
    console.error('Error reseñas adicionales:', e.message)
    return null
  }
}

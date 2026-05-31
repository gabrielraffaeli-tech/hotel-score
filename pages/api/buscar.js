import { buscarHotel, obtenerReseñas } from '../../lib/googlePlaces'
import { buscarHotelSerpApi, obtenerReseñasSerpApi } from '../../lib/serpapi'
import { analizarReseñas } from '../../lib/reviewAnalyzer'
import { generarDemoData } from '../../lib/mockData'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombre, ciudad, domicilio } = req.body

  if (!nombre || !ciudad) {
    return res.status(400).json({ error: 'Nombre del hotel y ciudad son requeridos' })
  }

  const tieneGoogle = !!process.env.GOOGLE_PLACES_API_KEY
  const tieneSerpApi = !!process.env.SERPAPI_KEY

  // Sin APIs: modo demo
  if (!tieneGoogle && !tieneSerpApi) {
    const demo = generarDemoData(nombre, ciudad)
    const todasLasReseñas = demo.fuentes.flatMap(f =>
      f.reseñas.map(r => ({ text: r.texto || r.text, rating: r.calificacion || r.rating }))
    )
    return res.status(200).json({
      hotel: demo.hotel,
      fuentes: demo.fuentes,
      analisis: analizarReseñas(todasLasReseñas),
      esDemo: true,
    })
  }

  const fuentes = []
  let todasLasReseñas = []
  let hotelInfo = null

  // PASO 1: Buscar el hotel con Google Places (para info base y detección de duplicados)
  if (tieneGoogle) {
    try {
      const lugar = await buscarHotel(nombre, ciudad, domicilio)

      if (lugar?.multipleResultados) {
        return res.status(300).json({
          multipleResultados: true,
          mensaje: 'Encontramos varios hoteles con ese nombre. Agregá la dirección para identificar el correcto.',
          opciones: lugar.opciones,
          total: lugar.total,
        })
      }

      if (lugar) {
        hotelInfo = lugar
        // Traer las 5 reseñas de Google Places como base
        const datos = await obtenerReseñas(lugar.place_id)
        if (datos) {
          fuentes.push({
            fuente: 'Google',
            nombre: datos.nombre,
            rating: datos.rating,
            totalReseñas: datos.totalReseñas,
            direccion: datos.direccion,
            url: datos.url,
            reseñas: datos.reseñas,
          })
          todasLasReseñas = todasLasReseñas.concat(
            datos.reseñas.map(r => ({ text: r.texto, rating: r.calificacion }))
          )
        }
      }
    } catch (e) {
      console.error('Error Google Places:', e.message)
    }
  }

  // PASO 2: SerpAPI Google Maps Reviews — trae muchas más reseñas
  if (tieneSerpApi) {
    try {
      const lugar = await buscarHotelSerpApi(nombre, ciudad, domicilio)

      if (lugar) {
        const reseñasSerpApi = await obtenerReseñasSerpApi(lugar.data_id, nombre)

        if (reseñasSerpApi && reseñasSerpApi.length > 0) {
          // Agregar como fuente separada "Google Maps (extendido)"
          fuentes.push({
            fuente: 'Google Maps',
            nombre: lugar.title || nombre,
            rating: lugar.rating,
            totalReseñas: lugar.reviews,
            direccion: lugar.address,
            url: lugar.link,
            reseñas: reseñasSerpApi,
          })

          todasLasReseñas = todasLasReseñas.concat(
            reseñasSerpApi.map(r => ({ text: r.texto, rating: r.calificacion }))
          )
        }
      }
    } catch (e) {
      console.error('Error SerpAPI:', e.message)
    }
  }

  if (fuentes.length === 0) {
    return res.status(404).json({ error: 'No se encontró información para este hotel' })
  }

  const analisis = analizarReseñas(todasLasReseñas)

  return res.status(200).json({
    hotel: {
      nombre,
      ciudad,
      direccion: domicilio || fuentes[0]?.direccion || '',
    },
    fuentes,
    analisis,
    esDemo: false,
  })
}

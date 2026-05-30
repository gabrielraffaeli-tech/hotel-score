import { buscarHotel, obtenerReseñas } from '../../lib/googlePlaces'
import { buscarHotelTripAdvisor, obtenerReseñasTripAdvisor } from '../../lib/tripadvisor'
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
  const tieneTripAdvisor = !!process.env.TRIPADVISOR_API_KEY

  // Sin APIs configuradas: modo demo con datos realistas
  if (!tieneGoogle && !tieneTripAdvisor) {
    const demo = generarDemoData(nombre, ciudad)
    const todasLasReseñas = demo.fuentes.flatMap(f =>
      f.reseñas.map(r => ({
        text: r.texto || r.text,
        rating: r.calificacion || r.rating,
      }))
    )
    const analisis = analizarReseñas(todasLasReseñas)

    return res.status(200).json({
      hotel: demo.hotel,
      fuentes: demo.fuentes,
      analisis,
      esDemo: true,
    })
  }

  // Con APIs reales
  const fuentes = []
  let todasLasReseñas = []

  // Google Places
  if (tieneGoogle) {
    try {
      const lugar = await buscarHotel(nombre, ciudad, domicilio)

      // Múltiples resultados — pedir dirección al usuario
      if (lugar?.multipleResultados) {
        return res.status(300).json({
          multipleResultados: true,
          mensaje: 'Encontramos varios hoteles con ese nombre. Agregá la dirección para identificar el correcto.',
          opciones: lugar.opciones,
        })
      }

      if (lugar) {
        const datos = await obtenerReseñas(lugar.place_id)
        if (datos) {
          fuentes.push({
            ...datos,
            rating: datos.rating,
            totalReseñas: datos.totalReseñas,
          })
          todasLasReseñas = todasLasReseñas.concat(
            datos.reseñas.map(r => ({ text: r.texto, rating: r.calificacion }))
          )
        }
      }
    } catch (e) {
      console.error('Error Google Places:', e.message)
      return res.status(500).json({ error: 'Error Google Places: ' + e.message })
    }
  }

  // TripAdvisor
  if (tieneTripAdvisor) {
    try {
      const lugar = await buscarHotelTripAdvisor(nombre, ciudad)
      if (lugar) {
        const datos = await obtenerReseñasTripAdvisor(lugar.location_id)
        if (datos) {
          fuentes.push(datos)
          todasLasReseñas = todasLasReseñas.concat(
            datos.reseñas.map(r => ({ text: r.texto, rating: r.calificacion }))
          )
        }
      }
    } catch (e) {
      console.error('Error TripAdvisor:', e.message)
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

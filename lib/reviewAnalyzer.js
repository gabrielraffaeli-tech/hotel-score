// Analiza el texto de reseñas y extrae señales para cada dimensión de puntaje.
// Funciona en español e inglés sin necesidad de APIs externas de NLP.

const DIMENSIONS = {
  ubicacion: {
    label: 'Ubicación',
    icon: '📍',
    description: 'Cercanía al centro, playas y atracciones',
    keywords: {
      positive: [
        'céntrico', 'centrico', 'bien ubicado', 'buena ubicación', 'buena ubicacion',
        'cerca del centro', 'cerca de la playa', 'cerca de todo', 'excelente ubicación',
        'great location', 'perfect location', 'central', 'close to beach', 'walking distance',
        'a pasos', 'a metros', 'caminando', 'conveniente', 'accesible', 'bien situado',
        'frente al mar', 'primera línea', 'en el corazón', 'zona ideal', 'perfecta ubicación',
        'tranquilo', 'muy tranquilo', 'silencioso', 'zona tranquila', 'quiet', 'peaceful',
        'nice and quiet', 'very quiet', 'zona segura', 'barrio lindo', 'barrio seguro',
      ],
      negative: [
        'lejos del centro', 'alejado', 'lejos de todo', 'mal ubicado', 'mala ubicación',
        'far from center', 'far from beach', 'too far', 'remote', 'isolated',
        'zona peligrosa', 'barrio malo', 'difícil de llegar', 'necesita taxi',
        'muy lejos', 'retirado', 'fuera de mano',
        'mucho ruido', 'demasiado ruido', 'ruido toda la noche', 'noisy', 'very noisy',
        'no dormí por el ruido', 'zona ruidosa',
      ],
    },
  },
  atencion: {
    label: 'Atención al huésped',
    icon: '🤝',
    description: 'Calidad del personal y servicio al cliente',
    keywords: {
      positive: [
        'amable', 'amabilidad', 'simpático', 'simpatico', 'atento', 'servicial',
        'excelente atención', 'muy buena atención', 'personal increíble', 'staff amazing',
        'friendly', 'helpful', 'professional', 'kind', 'welcoming', 'warm',
        'bienvenida', 'recibimiento', 'calidez', 'cordial', 'hospitalario',
        'check-in rápido', 'eficiente', 'dispuesto a ayudar', 'muy atentos',
        'personal profesional', 'trato excelente', 'buena predisposición',
        'lo recomiendo', 'lo recomendamos', 'volvería', 'volveria', 'volvemos',
        'totalmente recomendable', 'sin dudas volvería', 'highly recommend',
        'will return', 'would return', 'definitely recommend', 'excellent service',
        'superó expectativas', 'mejor de lo esperado', 'una experiencia increíble',
      ],
      negative: [
        'mala atención', 'mal trato', 'grosero', 'descortés', 'descortes',
        'indiferente', 'rude', 'unfriendly', 'unhelpful', 'slow service',
        'ignoraron', 'no ayudaron', 'pésima atención', 'pesima atencion',
        'arrogante', 'sin ganas', 'desinteresado', 'tardaron',
        'no lo recomiendo', 'no volvería', 'do not recommend', 'would not return',
        'decepcionante', 'disappointing', 'terrible experience',
      ],
    },
  },
  limpieza: {
    label: 'Limpieza e higiene',
    icon: '✨',
    description: 'Estado de habitaciones y áreas comunes',
    keywords: {
      positive: [
        'limpio', 'limpia', 'impecable', 'muy limpio', 'bien limpio',
        'clean', 'spotless', 'immaculate', 'hygienic', 'tidy',
        'higiene', 'aseado', 'prolijo', 'sin olores', 'fresco',
        'habitaciones limpias', 'baño limpio', 'sábanas limpias',
      ],
      negative: [
        'sucio', 'sucia', 'mugre', 'mugrienta', 'inmundo', 'inmunda',
        'dirty', 'filthy', 'smelly', 'unclean', 'stained',
        'olor feo', 'olor a humedad', 'cucarachas', 'insectos', 'plagas',
        'pelo en la cama', 'manchas', 'sin cambiar', 'descuidado',
      ],
    },
  },
  servicios: {
    label: 'Servicios e instalaciones',
    icon: '🏊',
    description: 'Piscina, spa, gimnasio, desayuno y amenities',
    keywords: {
      positive: [
        'piscina linda', 'piscina excelente', 'spa increíble', 'gym completo',
        'desayuno delicioso', 'desayuno abundante', 'variedad en el desayuno',
        'pool amazing', 'great breakfast', 'good facilities', 'nice amenities',
        'todo incluido bien', 'buffet excelente', 'restaurante rico',
        'buenas instalaciones', 'muy completo', 'muchas actividades',
        'aire acondicionado', 'buen aire', 'wifi rápido', 'buena wifi',
        'cama increíble', 'excelente cama', 'cama muy buena', 'cama cómoda',
        'cómodo', 'comodo', 'muy cómodo', 'habitación espaciosa', 'habitación amplia',
        'comfortable', 'cozy', 'great bed', 'amazing bed', 'comfortable bed',
        'spacious room', 'large room', 'nice room', 'beautiful room',
        'temperatura ideal', 'buen clima', 'bien climatizado',
      ],
      negative: [
        'piscina sucia', 'no tiene piscina', 'sin piscina',
        'desayuno malo', 'desayuno escaso', 'poca variedad',
        'no funciona el gym', 'instalaciones viejas', 'poor facilities',
        'bad breakfast', 'no pool', 'wifi lento', 'sin wifi', 'mala conexión',
        'aire roto', 'calefacción rota', 'todo viejo', 'mantenimiento malo',
        'cama dura', 'cama vieja', 'cama incómoda', 'colchón malo',
        'habitación pequeña', 'cuarto muy pequeño', 'muy chico',
        'uncomfortable', 'sin ventilación', 'mucho calor en la habitación',
      ],
    },
  },
  relacion_precio: {
    label: 'Relación precio/valor',
    icon: '💰',
    description: 'Vale lo que cuesta vs. alternativas',
    keywords: {
      positive: [
        'vale la pena', 'buen precio', 'económico', 'economico', 'barato',
        'great value', 'worth it', 'affordable', 'reasonable price',
        'buena relación', 'precio justo', 'muy por su precio', 'excelente precio',
        'recomendable por precio', 'costo-beneficio', 'muy conveniente',
      ],
      negative: [
        'muy caro', 'demasiado caro', 'no vale lo que cobran', 'overpriced',
        'expensive for what it is', 'too expensive', 'rip off',
        'te roban', 'abusivo', 'precio exagerado', 'cobros extras',
        'sorpresas en la factura', 'no vale la pena', 'decepcionante',
      ],
    },
  },
  accesibilidad: {
    label: 'Accesibilidad',
    icon: '♿',
    description: 'Acceso para personas con movilidad reducida',
    keywords: {
      positive: [
        'accesible', 'rampa', 'ascensor', 'elevator', 'wheelchair',
        'accessible', 'disabled friendly', 'sin barreras', 'fácil acceso',
        'estacionamiento', 'parking', 'apto para discapacitados',
        'buen acceso', 'escalones mínimos', 'adaptado',
      ],
      negative: [
        'muchos escalones', 'no hay ascensor', 'sin rampa', 'no accessible',
        'difícil para sillas de ruedas', 'barreras', 'no apto',
        'escaleras sin ascensor', 'problema de acceso',
      ],
    },
  },
  gastronomia: {
    label: 'Gastronomía',
    icon: '🍽️',
    description: 'Restaurante, bar y oferta gastronómica',
    keywords: {
      positive: [
        'comida rica', 'comida deliciosa', 'excelente restaurante',
        'great food', 'delicious', 'tasty', 'good restaurant',
        'variedad de comidas', 'menú variado', 'chef excelente',
        'cena maravillosa', 'muy rico', 'recomiendo el restaurante',
        'buena carta', 'bebidas ricas', 'cócteles excelentes',
      ],
      negative: [
        'comida mala', 'mala comida', 'restaurante caro', 'comida fría',
        'bad food', 'terrible food', 'overpriced restaurant',
        'poca variedad', 'sin opciones vegetarianas', 'tardaron mucho',
        'pedido mal', 'comida sin sabor', 'insípido',
      ],
    },
  },
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
}

const NEGACIONES = ['no ', 'sin ', 'nunca ', 'jamas ', 'jamás ', 'tampoco ', 'neither ', 'no hay ', 'not ']

function tieneNegacionAntes(texto, posicion) {
  const fragmento = texto.slice(Math.max(0, posicion - 25), posicion).toLowerCase()
  return NEGACIONES.some(neg => fragmento.includes(neg))
}

function contarMencionesEnReseña(texto, keywords, rating = null) {
  const textoNorm = normalizarTexto(texto)
  let positivas = 0
  let negativas = 0

  for (const kw of keywords.positive) {
    const kwNorm = normalizarTexto(kw)
    const regex = new RegExp(kwNorm.replace(/\s+/g, '\\s+'), 'gi')
    let match
    while ((match = regex.exec(textoNorm)) !== null) {
      if (tieneNegacionAntes(textoNorm, match.index)) {
        negativas += 0.5 // negación de positivo → leve negativo
      } else {
        positivas++
      }
    }
  }

  for (const kw of keywords.negative) {
    const kwNorm = normalizarTexto(kw)
    const regex = new RegExp(kwNorm.replace(/\s+/g, '\\s+'), 'gi')
    let match
    while ((match = regex.exec(textoNorm)) !== null) {
      if (tieneNegacionAntes(textoNorm, match.index)) {
        positivas += 0.5 // negación de negativo → leve positivo
      } else {
        negativas++
      }
    }
  }

  return { positivas, negativas }
}

function contarMenciones(texto, keywords) {
  return contarMencionesEnReseña(texto, keywords, null)
}

function calcularPuntajeDimension(menciones, totalReviews) {
  const { positivas, negativas } = menciones
  const total = positivas + negativas

  if (total === 0) return null

  const ratio = positivas / total
  const puntaje = 2 + ratio * 8
  const confianza = Math.min(total / (totalReviews * 0.3), 1)
  return { puntaje: Math.round(puntaje * 10) / 10, confianza, total }
}

export function analizarReseñas(reseñas) {
  if (!reseñas || reseñas.length === 0) return null

  const totalReviews = reseñas.length

  // Promedio de calificaciones (escala 1-5 normalizado a 1-10)
  const reseñasConRating = reseñas.filter(r => r.rating)
  const promedioRating =
    reseñasConRating.length > 0
      ? reseñasConRating.reduce((acc, r) => acc + r.rating, 0) / reseñasConRating.length
      : null
  // Si el rating promedio está en escala 1-5, convertir a 1-10
  const puntajeEstimado = promedioRating
    ? Math.round((promedioRating <= 5 ? promedioRating * 2 : promedioRating) * 10) / 10
    : null

  const resultados = {}

  for (const [key, dim] of Object.entries(DIMENSIONS)) {
    const mencionesTotales = { positivas: 0, negativas: 0 }
    for (const r of reseñas) {
      if (!r.text) continue
      const m = contarMencionesEnReseña(r.text, dim.keywords, r.rating)
      mencionesTotales.positivas += m.positivas
      mencionesTotales.negativas += m.negativas
    }
    const calc = calcularPuntajeDimension(mencionesTotales, totalReviews)

    resultados[key] = {
      label: dim.label,
      icon: dim.icon,
      description: dim.description,
      puntaje: calc ? calc.puntaje : null,
      puntajeEstimado: calc === null ? puntajeEstimado : null,
      confianza: calc ? calc.confianza : 0,
      menciones: calc ? calc.total : 0,
      sinDatos: calc === null,
    }
  }

  // Puntaje global ponderado (dimensiones con datos)
  const dimensionesConDatos = Object.values(resultados).filter(d => !d.sinDatos)
  const puntajeGlobal =
    dimensionesConDatos.length > 0
      ? dimensionesConDatos.reduce((acc, d) => acc + d.puntaje, 0) / dimensionesConDatos.length
      : puntajeEstimado

  return {
    dimensiones: resultados,
    puntajeGlobal: puntajeGlobal ? Math.round(puntajeGlobal * 10) / 10 : null,
    totalReseñas: totalReviews,
  }
}

// Filtra reseñas que mencionan keywords de una dimensión específica
export function filtrarReseñasPorDimension(reseñas, dimensionKey) {
  const dim = DIMENSIONS[dimensionKey]
  if (!dim) return []

  const todasLasKeywords = [...dim.keywords.positive, ...dim.keywords.negative]

  return reseñas
    .filter(r => {
      if (!r.text) return false
      const textoNorm = normalizarTexto(r.text)
      return todasLasKeywords.some(kw => textoNorm.includes(normalizarTexto(kw)))
    })
    .slice(0, 5) // máximo 5 reseñas por dimensión
}

export { DIMENSIONS }

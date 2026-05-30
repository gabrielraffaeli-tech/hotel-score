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
      ],
      negative: [
        'lejos del centro', 'alejado', 'lejos de todo', 'mal ubicado', 'mala ubicación',
        'far from center', 'far from beach', 'too far', 'remote', 'isolated',
        'zona peligrosa', 'barrio malo', 'difícil de llegar', 'necesita taxi',
        'muy lejos', 'retirado', 'fuera de mano',
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
      ],
      negative: [
        'mala atención', 'mal trato', 'grosero', 'descortés', 'descortes',
        'indiferente', 'rude', 'unfriendly', 'unhelpful', 'slow service',
        'ignoraron', 'no ayudaron', 'pésima atención', 'pesima atencion',
        'arrogante', 'sin ganas', 'desinteresado', 'tardaron',
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
      ],
      negative: [
        'piscina sucia', 'no tiene piscina', 'sin piscina',
        'desayuno malo', 'desayuno escaso', 'poca variedad',
        'no funciona el gym', 'instalaciones viejas', 'poor facilities',
        'bad breakfast', 'no pool', 'wifi lento', 'sin wifi', 'mala conexión',
        'aire roto', 'calefacción rota', 'todo viejo', 'mantenimiento malo',
      ],
    },
  },
  comodidad: {
    label: 'Comodidad y confort',
    icon: '🛏️',
    description: 'Camas, ruido, temperatura y descanso',
    keywords: {
      positive: [
        'cómodo', 'comodo', 'muy cómodo', 'cama increíble', 'excelente cama',
        'comfortable', 'cozy', 'quiet', 'peaceful', 'good sleep', 'well rested',
        'tranquilo', 'silencioso', 'descansé bien', 'dormi genial',
        'almohadas buenas', 'colchón bueno', 'habitación espaciosa', 'amplio',
        'buen clima', 'temperatura ideal', 'bien aislado', 'oscuro',
      ],
      negative: [
        'incómodo', 'incomodo', 'cama dura', 'cama vieja', 'colchón malo',
        'uncomfortable', 'noisy', 'loud', 'cold', 'hot', 'humid',
        'mucho ruido', 'no dormí', 'no pude dormir', 'pequeño', 'muy chico',
        'no cerraba la ventana', 'sin ventilación', 'mucho calor', 'mucho frío',
        'mosquitos', 'bichos',
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

function contarMenciones(texto, keywords) {
  const textoNorm = normalizarTexto(texto)
  let positivas = 0
  let negativas = 0

  for (const kw of keywords.positive) {
    const kwNorm = normalizarTexto(kw)
    const regex = new RegExp(kwNorm.replace(/\s+/g, '\\s+'), 'gi')
    const matches = textoNorm.match(regex)
    if (matches) positivas += matches.length
  }

  for (const kw of keywords.negative) {
    const kwNorm = normalizarTexto(kw)
    const regex = new RegExp(kwNorm.replace(/\s+/g, '\\s+'), 'gi')
    const matches = textoNorm.match(regex)
    if (matches) negativas += matches.length
  }

  return { positivas, negativas }
}

function calcularPuntajeDimension(menciones, totalReviews) {
  const { positivas, negativas } = menciones
  const total = positivas + negativas

  if (total === 0) return null // sin datos suficientes

  const ratio = positivas / total
  // Escala de 1 a 10, mínimo 2 si hay algún dato
  const puntaje = 2 + ratio * 8
  const confianza = Math.min(total / (totalReviews * 0.3), 1) // confianza sube con menciones
  return { puntaje: Math.round(puntaje * 10) / 10, confianza, total }
}

export function analizarReseñas(reseñas) {
  if (!reseñas || reseñas.length === 0) return null

  const textoTotal = reseñas.map(r => r.text || '').join(' ')
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
    const menciones = contarMenciones(textoTotal, dim.keywords)
    const calc = calcularPuntajeDimension(menciones, totalReviews)

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

export { DIMENSIONS }

import ScoreBar from './ScoreBar'

function colorPuntaje(p) {
  if (p >= 8) return 'text-green-600'
  if (p >= 6) return 'text-yellow-600'
  return 'text-red-500'
}

function labelPuntaje(p) {
  if (p >= 9) return 'Excelente'
  if (p >= 8) return 'Muy bueno'
  if (p >= 7) return 'Bueno'
  if (p >= 5) return 'Regular'
  if (p >= 3) return 'Deficiente'
  return 'Malo'
}

export default function ScoreCard({ analisis }) {
  if (!analisis) return null

  const { dimensiones, puntajeGlobal, totalReseñas } = analisis

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header con puntaje global */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white">
        <p className="text-sm font-medium opacity-90 mb-1">Puntaje general</p>
        <div className="flex items-end gap-3">
          <span className="text-6xl font-black tracking-tight">
            {puntajeGlobal ?? '—'}
          </span>
          <div className="pb-2">
            <span className="text-lg font-medium opacity-80">/ 10</span>
            {puntajeGlobal && (
              <p className="text-sm font-semibold">{labelPuntaje(puntajeGlobal)}</p>
            )}
          </div>
        </div>
        <p className="text-xs opacity-75 mt-2">
          Basado en {totalReseñas} reseñas analizadas
        </p>
      </div>

      {/* Dimensiones */}
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
          Desglose por categoría
        </h3>

        {Object.values(dimensiones).map((dim) => (
          <div key={dim.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{dim.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{dim.label}</p>
                  <p className="text-xs text-gray-400">{dim.description}</p>
                </div>
              </div>
              <div className="text-right ml-2 shrink-0">
                {dim.sinDatos && !dim.puntajeEstimado ? (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Sin datos
                  </span>
                ) : dim.sinDatos && dim.puntajeEstimado ? (
                  <span className={`text-lg font-bold text-blue-400`}>
                    {dim.puntajeEstimado}
                  </span>
                ) : (
                  <span className={`text-lg font-bold ${colorPuntaje(dim.puntaje)}`}>
                    {dim.puntaje}
                  </span>
                )}
              </div>
            </div>
            {!dim.sinDatos && (
              <ScoreBar valor={dim.puntaje} />
            )}
            {dim.sinDatos && dim.puntajeEstimado && (
              <ScoreBar valor={dim.puntajeEstimado} estimado />
            )}
            {!dim.sinDatos && (
              <p className="text-xs text-gray-400 text-right">
                {dim.menciones} menciones · {labelPuntaje(dim.puntaje)}
              </p>
            )}
            {dim.sinDatos && dim.puntajeEstimado && (
              <p className="text-xs text-blue-400 text-right">
                Estimado por calificación general
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import ScoreBar from './ScoreBar'
import { filtrarReseñasPorDimension } from '../lib/reviewAnalyzer'

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

function ReseñasDimension({ dimensionKey, reseñas }) {
  const relevantes = filtrarReseñasPorDimension(reseñas, dimensionKey)

  if (relevantes.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic px-1 py-2">
        No se encontraron reseñas específicas para esta categoría.
      </p>
    )
  }

  return (
    <div className="space-y-2 mt-2">
      {relevantes.map((r, i) => (
        <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-600">{r.autor || 'Anónimo'}</span>
            {r.rating && (
              <span className="text-xs text-yellow-500">
                {'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
        </div>
      ))}
    </div>
  )
}

export default function ScoreCard({ analisis, reseñasCompletas = [] }) {
  const [expandida, setExpandida] = useState(null)

  if (!analisis) return null

  const { dimensiones, puntajeGlobal, totalReseñas } = analisis

  function toggleDimension(key) {
    setExpandida(expandida === key ? null : key)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header con puntaje global */}
      <div className="bg-navy-700 px-6 py-5 text-white relative overflow-hidden" style={{ background: '#0D1B48' }}>
        <div className="absolute right-0 top-0 bottom-0 flex opacity-20">
          <div className="w-3 bg-hcyan" style={{ background: '#00AEEF' }} />
          <div className="w-3 ml-1 bg-hyellow" style={{ background: '#FFD100' }} />
          <div className="w-3 ml-1 bg-hgreen" style={{ background: '#00A651' }} />
        </div>
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
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-400 italic px-1">
          Puntaje basado en la cantidad y calidad de menciones. Pocas menciones pueden bajar el puntaje aunque las opiniones sean buenas.
        </p>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
          Desglose por categoría
        </h3>

        {Object.entries(dimensiones).map(([key, dim]) => (
          <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Fila clickeable */}
            <button
              onClick={() => toggleDimension(key)}
              className="w-full text-left px-3 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{dim.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{dim.label}</p>
                    <p className="text-xs text-gray-400">{dim.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  {dim.sinDatos && !dim.puntajeEstimado ? (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Sin datos</span>
                  ) : dim.sinDatos && dim.puntajeEstimado ? (
                    <span className="text-lg font-bold text-blue-400">{dim.puntajeEstimado}</span>
                  ) : (
                    <span className={`text-lg font-bold ${colorPuntaje(dim.puntaje)}`}>{dim.puntaje}</span>
                  )}
                  <span className="text-gray-400 text-xs">{expandida === key ? '▲' : '▼'}</span>
                </div>
              </div>
              {!dim.sinDatos && (
                <div className="mt-2">
                  <ScoreBar valor={dim.puntaje} />
                </div>
              )}
              {dim.sinDatos && dim.puntajeEstimado && (
                <div className="mt-2">
                  <ScoreBar valor={dim.puntajeEstimado} estimado />
                </div>
              )}
              {!dim.sinDatos && (
                <p className="text-xs text-gray-400 text-right mt-1">
                  {dim.menciones} menciones · {labelPuntaje(dim.puntaje)}
                </p>
              )}
              {dim.sinDatos && dim.puntajeEstimado && (
                <p className="text-xs text-blue-400 text-right mt-1">Estimado por calificación general</p>
              )}
            </button>

            {/* Reseñas expandidas */}
            {expandida === key && (
              <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2 mb-1">
                  Reseñas sobre {dim.label}
                </p>
                <ReseñasDimension dimensionKey={key} reseñas={reseñasCompletas} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

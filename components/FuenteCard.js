const LOGOS = {
  'Google': '🔍',
  'TripAdvisor': '🦉',
  'Booking.com': '🏨',
}

const COLORES = {
  'Google': 'bg-blue-50 border-blue-200',
  'TripAdvisor': 'bg-green-50 border-green-200',
  'Booking.com': 'bg-blue-50 border-blue-200',
}

function Estrellas({ rating, max = 5 }) {
  const normalized = max === 10 ? rating / 2 : rating
  const llenas = Math.floor(normalized)
  const media = normalized % 1 >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="text-sm">
          {i <= llenas ? '★' : i === llenas + 1 && media ? '½' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default function FuenteCard({ fuente }) {
  const logo = LOGOS[fuente.fuente] || '📋'
  const color = COLORES[fuente.fuente] || 'bg-gray-50 border-gray-200'
  const ratingDisplay = fuente.ratingMax === 10
    ? `${fuente.rating}/10`
    : `${fuente.rating}/5`

  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{logo}</span>
          <span className="font-semibold text-gray-800 text-sm">{fuente.fuente}</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">{ratingDisplay}</p>
          <p className="text-xs text-gray-500">{fuente.totalReseñas?.toLocaleString()} reseñas</p>
        </div>
      </div>

      <Estrellas rating={fuente.rating} max={fuente.ratingMax || 5} />

      {fuente.reseñas && fuente.reseñas.length > 0 && (
        <div className="mt-3 space-y-2">
          {fuente.reseñas.slice(0, 2).map((r, i) => (
            <div key={i} className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{r.autor}</span>
                <span className="text-xs text-yellow-500">{'★'.repeat(Math.round(r.calificacion || (r.rating / 2)))}</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-3">{r.texto || r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

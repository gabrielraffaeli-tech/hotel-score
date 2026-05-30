export default function ScoreBar({ valor, max = 10, estimado = false }) {
  const porcentaje = Math.min((valor / max) * 100, 100)

  const barColor = estimado
    ? 'bg-blue-300'
    : valor >= 7
    ? 'bg-green-500'
    : valor >= 5
    ? 'bg-yellow-500'
    : 'bg-red-500'

  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-700 ease-out ${barColor} ${estimado ? 'opacity-70' : ''}`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  )
}

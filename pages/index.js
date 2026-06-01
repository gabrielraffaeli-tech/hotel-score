import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { LogoCompact } from '../components/Logo'
import ScoreCard from '../components/ScoreCard'
import FuenteCard from '../components/FuenteCard'

const EJEMPLOS = [
  { nombre: 'Alvear Palace', ciudad: 'Buenos Aires' },
  { nombre: 'Panamericano', ciudad: 'Bariloche' },
  { nombre: 'Esplendor', ciudad: 'Mendoza' },
]

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-navy-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-navy-700 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center">
          <LogoCompact height={28} />
        </span>
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-700">Analizando reseñas...</p>
        <p className="text-sm text-gray-400 mt-1">Google · TripAdvisor · Booking</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [nombre, setNombre] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [domicilio, setDomicilio] = useState('')
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [mostrarReseñas, setMostrarReseñas] = useState(false)
  const [multipleOpciones, setMultipleOpciones] = useState(null)
  const resultRef = useRef(null)
  const [compartido, setCompartido] = useState(false)

  // Al cargar la página, leer parámetros de la URL y buscar automáticamente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hotelParam = params.get('hotel')
    const ciudadParam = params.get('ciudad')
    const domicilioParam = params.get('domicilio')
    if (hotelParam && ciudadParam) {
      setNombre(hotelParam)
      setCiudad(ciudadParam)
      if (domicilioParam) setDomicilio(domicilioParam)
      // Buscar automáticamente
      buscarDirecto(hotelParam, ciudadParam, domicilioParam || '')
    }
  }, [])

  async function buscarDirecto(nombreVal, ciudadVal, domicilioVal = '') {
    setCargando(true)
    setError(null)
    setResultado(null)
    setMultipleOpciones(null)
    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreVal, ciudad: ciudadVal, domicilio: domicilioVal }),
      })
      const data = await res.json()
      if (data.multipleResultados) { setMultipleOpciones(data); return }
      if (!res.ok) throw new Error(data.error || 'Error al buscar el hotel')
      setResultado(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  function compartir() {
    const params = new URLSearchParams()
    params.set('hotel', nombre.trim())
    params.set('ciudad', ciudad.trim())
    if (domicilio.trim()) params.set('domicilio', domicilio.trim())
    const url = `${window.location.origin}/?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCompartido(true)
      setTimeout(() => setCompartido(false), 3000)
    })
  }

  async function buscar(e) {
    e.preventDefault()
    if (!nombre.trim() || !ciudad.trim()) return
    // Actualizar URL con los parámetros
    const params = new URLSearchParams()
    params.set('hotel', nombre.trim())
    params.set('ciudad', ciudad.trim())
    if (domicilio.trim()) params.set('domicilio', domicilio.trim())
    window.history.replaceState({}, '', `/?${params.toString()}`)
    await buscarDirecto(nombre.trim(), ciudad.trim(), domicilio.trim())
  }

  function usarEjemplo(ej) {
    setNombre(ej.nombre)
    setCiudad(ej.ciudad)
  }

  function limpiar() {
    setNombre('')
    setCiudad('')
    setDomicilio('')
    setResultado(null)
    setError(null)
    setMultipleOpciones(null)
  }

  return (
    <>
      <Head>
        <title>Hannover · HotelScore</title>
        <meta name="description" content="Analizá reseñas de Google, TripAdvisor y Booking en segundos" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect x='0' y='8' width='8' height='44' fill='%2300AEEF'/><rect x='11' y='8' width='8' height='44' fill='%23FFD100'/><rect x='22' y='8' width='8' height='44' fill='%2300A651'/></svg>" />
      </Head>

      <div className="min-h-dvh" style={{ background: '#F4F6F9' }}>
        {/* Header */}
        <div className="bg-white border-b border-orange-100 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoCompact height={52} />
              <div>
                <h1 className="text-lg font-black text-gray-900 leading-none">HotelScore</h1>
                <p className="text-xs text-orange-500 font-medium">Opiniones al instante</p>
              </div>
            </div>
            {resultado && (
              <button onClick={limpiar} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                Nueva búsqueda
              </button>
            )}
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pb-8">
          {/* Hero */}
          {!resultado && !cargando && (
            <div className="pt-8 pb-6 text-center">
              <h2 className="text-2xl font-black text-navy-700 mb-2">
                ¿Vale la pena ese hotel?
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Ingresá el nombre y la ciudad. Analizamos miles de reseñas de Google,
                TripAdvisor y Booking para darte un puntaje real en segundos.
              </p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={buscar} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Nombre del hotel *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Alvear Palace Hotel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base transition-all"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Ciudad *
              </label>
              <input
                type="text"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                placeholder="Ej: Buenos Aires"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base transition-all"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Dirección <span className="font-normal text-gray-400 normal-case">(opcional, mejora la precisión)</span>
              </label>
              <input
                type="text"
                value={domicilio}
                onChange={e => setDomicilio(e.target.value)}
                placeholder="Ej: Av. Alvear 1891"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base transition-all"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={cargando || !nombre.trim() || !ciudad.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-all text-base active:scale-95"
            >
              {cargando ? 'Analizando...' : '🔍 Analizar hotel'}
            </button>
          </form>


          {/* Loading */}
          {cargando && <Spinner />}

          {/* Múltiples resultados — pedir dirección */}
          {multipleOpciones && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-3">
                <span className="text-xl">🔎</span>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Encontramos varios hoteles con ese nombre</p>
                  <p className="text-blue-600 text-xs mt-0.5">
                    {multipleOpciones.total > multipleOpciones.opciones.length
                      ? `Mostrando ${multipleOpciones.opciones.length} de ${multipleOpciones.total} resultados — agregá más detalles para afinar la búsqueda.`
                      : 'Tocá una opción para autocompletar la dirección, luego buscá de nuevo.'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {multipleOpciones.opciones.map((op, i) => (
                  <button
                    key={i}
                    onClick={() => setDomicilio(op.direccion)}
                    className="w-full text-left bg-white border border-blue-100 rounded-lg px-3 py-2 hover:border-blue-400 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-800">{op.nombre}</p>
                    <p className="text-xs text-gray-500">{op.direccion}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-400 mt-2 text-center">Tocá una opción para autocompletar la dirección, luego buscá de nuevo.</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 text-sm font-medium">😕 {error}</p>
              <p className="text-red-400 text-xs mt-1">Verificá el nombre del hotel y la ciudad</p>
            </div>
          )}

          {/* Resultados */}
          {resultado && (
            <div ref={resultRef} className="mt-6 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-black text-navy-700">{resultado.hotel.nombre}</h2>
                <p className="text-sm text-gray-500">
                  📍 {resultado.hotel.ciudad}
                  {resultado.hotel.direccion && ` · ${resultado.hotel.direccion}`}
                </p>
                {resultado.esDemo && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1.5 rounded-full">
                    <span>⚡</span>
                    <span>Modo demo — conectá Google Places API para datos reales</span>
                  </div>
                )}
              </div>

              <ScoreCard analisis={resultado.analisis} reseñasCompletas={resultado.reseñasCompletas || []} />

              {/* Botón compartir */}
              <button
                onClick={compartir}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
              >
                {compartido ? (
                  <>
                    <span>✅</span>
                    <span className="text-green-600">¡Link copiado! Listo para compartir</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Compartir resultado</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 pb-4">
                El puntaje se calcula automáticamente analizando el texto de las reseñas.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

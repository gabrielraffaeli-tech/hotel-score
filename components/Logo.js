export function LogoCompact({ height = 36 }) {
  return (
    <svg height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="30" fill="#0D1B48" />
      {/* 3 rayas finas + "h." todo junto, centrado */}
      {/* Ancho total: 3+2+3+2+3 = 13 rayas + ~20 h. = 33 → empieza en x=13 */}
      <rect x="13" y="16" width="3" height="28" fill="#00AEEF" />
      <rect x="18" y="16" width="3" height="28" fill="#FFD100" />
      <rect x="23" y="16" width="3" height="28" fill="#00A651" />
      <text
        x="27" y="44"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="32"
        fill="white"
      >
        h.
      </text>
    </svg>
  )
}

export function LogoFull({ height = 32 }) {
  return (
    <svg height={height} viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0"  y="6" width="6" height="48" fill="#00AEEF" />
      <rect x="9"  y="6" width="6" height="48" fill="#FFD100" />
      <rect x="18" y="6" width="6" height="48" fill="#00A651" />
      <text
        x="26" y="52"
        fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="52"
        fill="#0D1B48"
      >
        hannover.
      </text>
    </svg>
  )
}

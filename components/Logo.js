import Image from 'next/image'

export function LogoCompact({ height = 36 }) {
  return (
    <div
      style={{
        width: height,
        height: height,
        borderRadius: '50%',
        background: '#0D1B48',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo.png"
        alt="HotelScore logo"
        height={height}
        width={height}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

export function LogoFull({ height = 36 }) {
  return (
    <div
      style={{
        width: height,
        height: height,
        borderRadius: '50%',
        background: '#0D1B48',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo.png"
        alt="HotelScore logo"
        height={height}
        width={height}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

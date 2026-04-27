import Fan from './Fan'

const FAN_DATA = [
  {
    direction: 'left' as const,
    cards: [
      {
        fragment: 'FRAGMENT 001',
        label: 'PETAL ISLANDS',
        imageSrc: 'https://static.wixstatic.com/media/62f926_53045ad0c6e64d31b5edb93f9afdc8cc~mv2.png',
        objectPosition: 'center',
      },
      {
        fragment: 'FRAGMENT 002',
        label: 'GRASS CONTOUR LINES',
        imageSrc: 'https://static.wixstatic.com/media/62f926_963db0641ecb4368a64e912092d05af7~mv2.png',
        objectPosition: 'center',
      },
      {
        fragment: 'FRAGMENT 003',
        label: 'UNKNOWN RIVER',
        imageSrc: 'https://static.wixstatic.com/media/62f926_77df68f122fd43ffa002f1709f2201ee~mv2.png',
        objectPosition: 'center',
      },
    ],
  },
  {
    direction: 'center' as const,
    cards: [
      {
        fragment: 'FRAGMENT 004',
        label: 'POLLEN MAP',
        imageSrc: 'https://static.wixstatic.com/media/62f926_d1565bc35a0c4a20bb688cec18a8e2ed~mv2.png',
        objectPosition: 'center',
      },
      {
        fragment: 'FRAGMENT 005',
        label: 'THE SOFT BORDER',
        imageSrc: 'https://static.wixstatic.com/media/62f926_8678f9f9b1fc42c59d08c6d5905b87f9~mv2.png',
        objectPosition: 'center',
      },
      {
        fragment: 'FRAGMENT 006',
        label: 'CLOUDED TERRAIN',
        imageSrc: 'https://static.wixstatic.com/media/62f926_20ec03fa4c4342b4ad8e545c6ccdf3e4~mv2.png',
        objectPosition: 'center',
      },
    ],
  },
  {
    direction: 'right' as const,
    cards: [
      {
        fragment: 'FRAGMENT 007',
        label: 'THE LIVING COASTLINE',
        imageSrc: 'https://static.wixstatic.com/media/62f926_4b6f96b79a1945b5a123fcc30afcaa56~mv2.png',
        objectPosition: 'top',
        imageScale: 1.2,
      },
      {
        fragment: 'FRAGMENT 008',
        label: 'VALLEY SPECIMEN',
        imageSrc: 'https://static.wixstatic.com/media/62f926_647d111a63184f2ba532fa538b3a774d~mv2.png',
        objectPosition: 'bottom',
      },
      {
        fragment: 'FRAGMENT 009',
        label: 'ARCHIVE OF WIND',
        imageSrc: 'https://static.wixstatic.com/media/62f926_aac47c94dd8e4000982b074f69464261~mv2.png',
        objectPosition: 'center',
        imageScale: 1.3,
      },
    ],
  },
]

export default function FragmentArchive() {
  return (
    <section
      style={{
        background: 'var(--paper)',
        padding: '8rem 2rem 10rem',
      }}
    >
      {/* Section header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '6rem',
          maxWidth: '700px',
          margin: '0 auto 6rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono-sans)',
            fontWeight: 500,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--ink-faded)',
            marginBottom: '2rem',
          }}
        >
          THE FRAGMENT ARCHIVE
        </p>
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '1.25rem',
            lineHeight: 1.7,
            maxWidth: '52ch',
            margin: '0 auto',
            color: 'var(--ink-soft)',
          }}
        >
          Nine visual records recovered from territories without names. Each fragment suggests a place, but none of them can be located.
        </p>
      </div>

      {/* Fans row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '4rem',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {FAN_DATA.map((fan, i) => (
          <Fan key={i} cards={fan.cards} direction={fan.direction} />
        ))}
      </div>
    </section>
  )
}

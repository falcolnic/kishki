import { useTypewriter } from '../hooks/useTypewriter'
import { squadName, tagline } from '../data/squad'

const bootLines = [
  '> connecting to ctOS relay...',
  '> handshake accepted [KISHKI_NET]',
  '> decrypting squad dossier...',
  '> access level: PUBLIC',
]

export default function Hero() {
  const { output } = useTypewriter(bootLines)

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden">
      {/* ambient grid glow */}
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-scanlines" />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <div className="font-mono text-xs sm:text-sm text-ink/80 text-left mb-8 h-24 sm:h-20">
          {output.map((line, i) => (
            <div key={i}>
              {line}
              {i === output.length - 1 && <span className="animate-blink">▍</span>}
            </div>
          ))}
        </div>

        <h1
          data-text={squadName}
          className="glitch-text font-display text-7xl sm:text-9xl tracking-widest text-ink animate-flicker"
        >
          {squadName}
        </h1>

        <p className="mt-4 text-dim text-sm sm:text-base tracking-wide">{tagline}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#breach"
            className="glyph-tag !text-sm !px-4 !py-2 hover:bg-ink/15 hover:text-white transition-colors"
          >
            initiate breach ▸
          </a>
          <a
            href="#history"
            className="glyph-tag !text-sm !px-4 !py-2 !border-dim !text-dim hover:text-ink hover:!border-ink transition-colors"
          >
            view dossier
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 text-dim text-[11px] tracking-[0.3em] animate-pulse">
        scroll to decrypt ▾
      </div>
    </section>
  )
}

import { history } from '../data/squad'

export default function History() {
  return (
    <section id="history" className="relative py-28 px-5">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl text-ink tracking-widest mb-2">// SQUAD_LOG</h2>
        <p className="text-dim text-sm mb-12">read-only archive — chronological, unedited</p>

        <div className="relative border-l border-dim/50 pl-6 space-y-10">
          {history.map((h, i) => {
            const isLast = i === history.length - 1
            return (
              <div key={h.date} className="relative animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
                <span
                  className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full ${
                    isLast ? 'bg-red' : 'bg-ink'
                  }`}
                />
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="text-ink text-sm">[{h.date}]</span>
                  <span className="glyph-tag !text-[10px] !py-0">{h.tag}</span>
                  {isLast && <span className="text-red text-[10px] animate-blink">● live</span>}
                </div>
                <p className="text-ink/90 text-sm sm:text-base leading-relaxed max-w-xl">{h.entry}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

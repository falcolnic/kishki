import { useInView } from '../hooks/useInView'

export default function ProfilerCard({ member }) {
  const { ref, inView } = useInView(0.4)

  return (
    <div ref={ref} className="terminal-panel relative p-5 overflow-hidden group">
      {/* scanning sweep, plays once when card enters view */}
      {inView && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-ink/40 to-transparent animate-scan" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-2xl text-ink tracking-wide">{member.handle}</p>
          <p className="text-ink text-xs tracking-widest uppercase">{member.role}</p>
        </div>
        <span className="text-[10px] text-dim">since {member.joined}</span>
      </div>

      <p className="mt-3 text-sm text-ink/80 leading-relaxed">{member.bio}</p>

      <div
        className={`mt-4 transition-opacity duration-700 ${
          inView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] text-dim mb-1">
          <span>TRUST INDEX</span>
          <span className="text-ink">{member.trust}%</span>
        </div>
        <div className="h-1 w-full bg-dim/20">
          <div
            className="h-1 bg-ink transition-all duration-1000 ease-out"
            style={{ width: inView ? `${member.trust}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}

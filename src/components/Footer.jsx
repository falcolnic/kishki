import { socials, squadName } from '../data/squad'

export default function Footer() {
  return (
    <footer id="live" className="relative py-20 px-5 border-t border-dim/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl text-ink tracking-widest mb-6">// DIRECTORY</h2>
        <ul className="space-y-2 text-sm">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-ink/80 hover:text-ink transition-colors group"
              >
                <span className="text-dim">{s.dir}</span>
                <span className="flex-1 border-b border-dashed border-dim/30 group-hover:border-ink/40" />
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-[11px] text-dim tracking-widest">
          {squadName}_NET © {new Date().getFullYear()} — connection encrypted
        </p>
      </div>
    </footer>
  )
}

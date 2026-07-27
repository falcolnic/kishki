import { squad } from '../data/squad'
import ProfilerCard from './ProfilerCard'

export default function Squad() {
  return (
    <section id="squad" className="relative py-28 px-5 bg-panel/20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl text-ink tracking-widest mb-2">// PROFILER</h2>
        <p className="text-dim text-sm mb-12">scan in progress — scroll to reveal each profile</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {squad.map((m) => (
            <ProfilerCard key={m.handle} member={m} />
          ))}
        </div>
      </div>
    </section>
  )
}

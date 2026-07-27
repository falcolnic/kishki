import { squadName } from '../data/squad'

// Not navigation — nothing here is clickable. It's a fixed HUD readout,
// same spirit as the ENV/NODE box in the reference clip. This is a one-way
// scroll experience, so there's nothing to navigate to.
export default function CornerMark() {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2 text-[11px] tracking-[0.25em] text-dim pointer-events-none">
      <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
      <span className="text-ink">{squadName}</span>
      <span>_NET</span>
    </div>
  )
}

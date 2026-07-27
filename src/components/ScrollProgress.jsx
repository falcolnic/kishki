import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const value = max > 0 ? (doc.scrollTop / max) * 100 : 0
      setPct(Math.min(100, Math.max(0, value)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 right-0 z-50 h-full w-[3px] bg-dim/10 pointer-events-none">
      <div className="w-full bg-ink/70 transition-[height] duration-150 ease-out" style={{ height: `${pct}%` }} />
      <div
        className="fixed right-4 text-[10px] tracking-widest text-dim transition-[top] duration-150 ease-out"
        style={{ top: `calc(${pct}% - 8px)` }}
      >
        {Math.round(pct)}%
      </div>
    </div>
  )
}

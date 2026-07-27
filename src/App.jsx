import { useState, useRef } from 'react'
import CornerMark from './components/CornerMark'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import History from './components/History'
import Squad from './components/Squad'
import BreachMinigame from './components/BreachMinigame'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [showNarekFlash, setShowNarekFlash] = useState(false)
  const narekAudioRef = useRef(null)

  const handleLoadingComplete = () => {
    setLoading(false)

    const audio = narekAudioRef.current
    if (!audio) return

    const startDelay = 700 // ms gap after loading screen's own sound finishes — tweak to taste

    setTimeout(() => {
      audio.currentTime = 0
      audio.playbackRate = 0.85

      const handleEnded = () => {
        setShowNarekFlash(true)
        setTimeout(() => setShowNarekFlash(false), 500)
        audio.removeEventListener('ended', handleEnded)
      }
      audio.addEventListener('ended', handleEnded)

      audio.play().catch(() => {
        audio.removeEventListener('ended', handleEnded)
      })
    }, startDelay)
  }

  return (
    <div className="relative min-h-screen">
      <div className="crt-overlay" />
      <div className="crt-vignette" />

      <audio ref={narekAudioRef} src="/audio/narek_gay.wav" preload="auto" />

      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {showNarekFlash && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80">
          <p className="text-5xl sm:text-7xl font-mono font-black tracking-widest text-white uppercase">
            NAREK ГЕЙ
          </p>
        </div>
      )}

      {!loading && (
        <>
          <CornerMark />
          <ScrollProgress />
          <main>
            <Hero />
            <History />
            <Squad />
            <BreachMinigame />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

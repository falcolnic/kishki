import { useState, useRef, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Desktop from './components/desktop/Desktop'
import { setBusVolume } from './audio/audioBus'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [showNarekFlash, setShowNarekFlash] = useState(false)
  const narekAudioRef = useRef(null)
  const [volume, setVolume] = useState(70)

  useEffect(() => {
    setBusVolume(volume / 100)
    if (narekAudioRef.current) narekAudioRef.current.volume = volume / 100
  }, [volume])

  const handleLoadingComplete = () => {
    setLoading(false)

    const audio = narekAudioRef.current
    if (!audio) return

    const startDelay = 5000

    setTimeout(() => {
      audio.currentTime = 0
      audio.playbackRate = 0.75
      audio.volume = volume / 100

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

      {loading && (
        <LoadingScreen onComplete={handleLoadingComplete} volume={volume} onVolumeChange={setVolume} />
      )}

      {showNarekFlash && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80">
          <p className="text-5xl sm:text-7xl font-mono font-black tracking-widest text-white uppercase">
            NAREK ГЕЙ
          </p>
        </div>
      )}

      {!loading && <Desktop volume={volume} onVolumeChange={setVolume} />}
    </div>
  )
}

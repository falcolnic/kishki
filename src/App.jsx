import { useState } from 'react'
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

  return (
    <div className="relative min-h-screen">
      <div className="crt-overlay" />
      <div className="crt-vignette" />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

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

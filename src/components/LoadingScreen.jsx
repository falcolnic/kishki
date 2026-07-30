import { audioBus } from '../audio/audioBus'
import VolumeControl from './shared/VolumeControl'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  Web Audio API Synthesizer (Watch Dogs / ctOS Audio Engine)       */
/* ------------------------------------------------------------------ */
let globalAudioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) globalAudioCtx = new AudioContextClass()
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume()
  }
  return globalAudioCtx
}

// Utility to generate procedural white noise buffers
function createNoiseBuffer(ctx, duration) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

const playSFX = (type) => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const v = audioBus.volume
    if (v <= 0) return

    if (type === 'boot') {
      // Clean sci-fi UI blip (inspired by minimalist computer-terminal aesthetics)
      const osc = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc2.type = 'sine'

      const baseFreq = 1000 + Math.random() * 400
      osc.frequency.setValueAtTime(baseFreq, now)
      osc2.frequency.setValueAtTime(baseFreq * 2, now) // octave harmonic for "digital" shimmer

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.15 * v, now + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

      osc.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.06)
      osc2.stop(now + 0.06)
    } else if (type === 'type') {
      // Hacker Terminal Key Switch Transients
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1400 + Math.random() * 400, now)
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.015)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.015)

    } else if (type === 'node') {
      // ctOS Network Node Link (Sub-bass impact + Digital Chirp + Static Burst)

      // 1. Heavy Sub-Bass Impact Thud
      const sub = ctx.createOscillator()
      const subGain = ctx.createGain()
      sub.type = 'sine'
      sub.frequency.setValueAtTime(160, now)
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.08)
      subGain.gain.setValueAtTime(0.22, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
      sub.connect(subGain)
      subGain.connect(ctx.destination)
      sub.start(now)
      sub.stop(now + 0.08)

      // 2. High-Tech Digital Node Sweep
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(700, now)
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)

      // 3. Crisp Static Snap
      const noise = ctx.createBufferSource()
      noise.buffer = createNoiseBuffer(ctx, 0.015)
      const nFilter = ctx.createBiquadFilter()
      nFilter.type = 'highpass'
      nFilter.frequency.value = 3500
      const nGain = ctx.createGain()
      nGain.gain.setValueAtTime(0.07, now)
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)
      noise.connect(nFilter)
      nFilter.connect(nGain)
      nGain.connect(ctx.destination)
      noise.start(now)

    } else if (type === 'error') {
      // Industrial System Denied / Glitch Buzz
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.setValueAtTime(90, now + 0.08)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)

    } else if (type === 'success') {
      // ctOS Override Success (Sub drop + Tri-tone ascending chord)

      // Sub Impact
      const sub = ctx.createOscillator()
      const subGain = ctx.createGain()
      sub.type = 'triangle'
      sub.frequency.setValueAtTime(150, now)
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.25)
      subGain.gain.setValueAtTime(0.25, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
      sub.connect(subGain)
      subGain.connect(ctx.destination)
      sub.start(now)
      sub.stop(now + 0.25)

      // Ascending Digital Chord
      const freqs = [523.25, 783.99, 1046.5] // C5, G5, C6
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now + i * 0.05)

        gain.gain.setValueAtTime(0.12, now + i * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.18)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.05)
        osc.stop(now + i * 0.05 + 0.18)
      })
    }
  } catch (e) {
    // Audio Context fallback
  }
}

/* ------------------------------------------------------------------ */
/*  Config — sasaOS / KISHKI Systems Sequence Settings                */
/* ------------------------------------------------------------------ */

const INITIAL_BOOT_LINES = [
  'REGION_LINK_ESTABLISHED : EU-CENTRAL-1',
  'LOG_STREAM_CONNECTED // 1B7C5296-469D-4595-AD5D-4E31349CF13F',
  'WL_OUTPUT_FOUND: DP-3 <-> ADDR_PTR: 0xF3ED6BD1',
  '------------  GREETER_UI_INITIALIZING  ------------',
  '* [KISHKI_IDP] Using Protocol::KISHKI',
  '[PATROL] CIPHER_NEGOTIATED <-> knet://0x8D2A4F1B:1443',
]

const SESSION_TAG = 'kishki-krn-1.0.8  <>  sasaOS-1.0.0-a'
const ENV_LABEL = 'Moscow, RU'
const NODE_IP = '109.389.013.301'
const CIPHER_ID = 'SAS-AVOT-02|8D5A6D11-139H-141-BCAA-817499300DD9F'

const OS_PREFIX = 'sasa'
const OS_SUFFIX = 'OS'
const USERNAME = 'operator'
const PASSWORD_LENGTH = 8

const CARD = {
  empId: 'ЧЛЕН-0141',
  cls: 'L2_СКВАДА',
  fullName: 'ГЛЕБ БОРИСОВИЧ',
  hex: '7D2A12F9B1SDFA4',
}

const FOOTER_NOTE = 'Собственность KISHKI Squad. Все действия подлежат активному мониторингу Твича'

// Target Pattern Indices on 3x3 Grid (0 to 8)
const TARGET_PATTERN = [0, 3, 6, 4, 8, 5, 2]

/* ------------------------------------------------------------------ */

export default function LoadingScreen({ onComplete, volume = 70, onVolumeChange }) {
  const [hasUserStarted, setHasUserStarted] = useState(false)
  const [bootLines, setBootLines] = useState(INITIAL_BOOT_LINES)
  const [bootLinesShown, setBootLinesShown] = useState(0)
  const [showSessionTag, setShowSessionTag] = useState(false)
  const [showCenterIntro, setShowCenterIntro] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [panelProgress, setPanelProgress] = useState(0)
  const [showFrame, setShowFrame] = useState(false)
  const [cipherResolved, setCipherResolved] = useState(false)
  const [cipherIdActive, setCipherIdActive] = useState(false)
  const [showCorners, setShowCorners] = useState(false)
  const [wordmarkSplit, setWordmarkSplit] = useState(false)
  const [barGrown, setBarGrown] = useState(false)
  const [prefixShown, setPrefixShown] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [usernameRevealed, setUsernameRevealed] = useState(false)
  const [typedCount, setTypedCount] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [justVerified, setJustVerified] = useState(false)

  // Stages: 'intro' | 'login' | 'flash-card' | 'card' | 'minigame' | 'flash-entering' | 'entering'
  const [stage, setStage] = useState('intro')
  const [waitingForEnter, setWaitingForEnter] = useState(false)
  const [enteringProgress, setEnteringProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)

  const [showNarekFlash, setShowNarekFlash] = useState(false)
  const narekAudioRef = useRef(null)

  const minigameResolverRef = useRef(null)
  const enteringAudioRef = useRef(null)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsedSec(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const handleStartBoot = () => {
    getAudioContext()
    playSFX('boot')
    setHasUserStarted(true)
  }

  useEffect(() => {
    if (!hasUserStarted) return

    let cancelled = false
    let enterListenerCleanup = null
    const timeouts = []
    const delay = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeouts.push(id)
      })

    function animateFill(setter, duration) {
      return new Promise((resolve) => {
        const start = performance.now()
        function tick(ts) {
          if (cancelled) {
            resolve()
            return
          }
          const pct = Math.min(100, Math.round(((ts - start) / duration) * 100))
          setter(pct)
          if (pct < 100) requestAnimationFrame(tick)
          else resolve()
        }
        requestAnimationFrame(tick)
      })
    }

    async function run() {
      setShowSessionTag(true)
      playSFX('boot')
      await delay(700)
      if (cancelled) return

      for (let i = 0; i < INITIAL_BOOT_LINES.length; i++) {
        if (cancelled) return
        setBootLinesShown(i + 1)
        playSFX('boot')
        await delay(350)
      }
      await delay(400)
      if (cancelled) return

      setShowCenterIntro(true)
      await delay(4000)
      if (cancelled) return

      setShowCenterIntro(false)
      setStage('login')
      setShowPanel(true)
      await animateFill(setPanelProgress, 2600)
      if (cancelled) return

      // 1. bar sits full, then thickens
      await delay(450)
      if (cancelled) return
      setBarGrown(true)
      playSFX('boot')
      await delay(950)
      if (cancelled) return

      setShowFrame(true)
      await delay(800)
      if (cancelled) return

      setCipherResolved(true)
      playSFX('boot')
      await delay(700)
      if (cancelled) return
      setCipherIdActive(true)
      await delay(400)
      if (cancelled) return

      // 2. bar retracts right→left, uncovering OS
      setShowCorners(true)
      setWordmarkSplit(true)
      await delay(1350)
      if (cancelled) return

      // 3. sasa fades in inside the white block
      setPrefixShown(true)
      await delay(1250)
      if (cancelled) return

      setShowLoginForm(true)
      setBootLines((prev) => [...prev, `[PATROL] Opened session for user(${USERNAME})`])
      setBootLinesShown((prev) => prev + 1)
      playSFX('boot')

      await delay(800)
      if (cancelled) return

      setUsernameRevealed(true)
      await delay(600)
      if (cancelled) return

      for (let i = 0; i < PASSWORD_LENGTH; i++) {
        if (cancelled) return
        setTypedCount(i + 1)
        playSFX('type')

        // Base typing speed varies naturally per keystroke
        let pause = 140 + Math.random() * 180 // ~140-320ms base range

        // Occasionally add a longer "thinking" pause (like recalling next char)
        if (Math.random() < 0.25) {
          pause += 220 + Math.random() * 300
        }

        await delay(pause)
      }
      await delay(500)
      if (cancelled) return

      setSubmitting(true)
      await delay(1200)
      if (cancelled) return
      setSubmitting(false)
      setJustVerified(true)
      playSFX('success')

      setBootLines((prev) => [...prev, `[PATROL] IDENTITY_VERIFIED // WELCOME BACK`])
      setBootLinesShown((prev) => prev + 1)

      await delay(900)
      if (cancelled) return

      setJustVerified(false)
      setShowLoginForm(false)
      await delay(1500)
      if (cancelled) return

      setStage('flash-card')
      await delay(500)
      if (cancelled) return

      setStage('card')
      await delay(800)
      if (cancelled) return
      setWaitingForEnter(true)

      await new Promise((resolve) => {
        function onKey(e) {
          if (e.key === 'Enter') {
            playSFX('type')
            window.removeEventListener('keydown', onKey)
            resolve()
          }
        }
        window.addEventListener('keydown', onKey)
        enterListenerCleanup = () => window.removeEventListener('keydown', onKey)
      })
      if (cancelled) return

      setWaitingForEnter(false)
      setBootLines((prev) => [...prev, `[PATROL] Pattern Override Required...`])
      setBootLinesShown((prev) => prev + 1)
      playSFX('boot')

      setStage('minigame')
      await new Promise((resolve) => {
        minigameResolverRef.current = resolve
      })
      if (cancelled) return

      setBootLines((prev) => [...prev, `[PATROL] Session closed for user(${USERNAME})`])
      setBootLinesShown((prev) => prev + 1)
      playSFX('boot')

      setStage('flash-entering')
      await delay(600)
      if (cancelled) return

      setStage('entering')
      if (enteringAudioRef.current) {
        enteringAudioRef.current.currentTime = 0
        enteringAudioRef.current.volume = audioBus.volume
        enteringAudioRef.current.play().catch(() => {})
      }
      await animateFill(setEnteringProgress, 3500)
      if (cancelled) return

      setExiting(true)
      await delay(600)
      if (cancelled) return
      if (onComplete) onComplete()
    }

    run()
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      if (enterListenerCleanup) enterListenerCleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUserStarted])

  const handleMinigameSuccess = () => {
    if (minigameResolverRef.current) {
      minigameResolverRef.current()
    }
  }

  useEffect(() => {
    if (enteringAudioRef.current) enteringAudioRef.current.volume = volume / 100
  }, [volume])

  const minutes = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
  const seconds = String(elapsedSec % 60).padStart(2, '0')
  const clockLabel = `${minutes}:${seconds}`

  return (
    <div
      onClick={!hasUserStarted ? handleStartBoot : undefined}
      onKeyDown={!hasUserStarted ? handleStartBoot : undefined}
      tabIndex={0}
      className={`fixed inset-0 z-[100] bg-[#0d0d0d] text-[#e2e2e2] font-mono overflow-hidden select-none outline-none transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {onVolumeChange && (
        <div className="absolute top-8 right-8 z-20">
          <VolumeControl volume={volume} onChange={onVolumeChange} />
        </div>
      )}
      <audio ref={enteringAudioRef} src="/audio/bababa.ogg" preload="auto" />
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.45)_51%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Initial User Gesture Prompt Overlay */}
      {!hasUserStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d]/90 cursor-pointer">
          <div className="border border-[#3a3a3a] bg-[#171717] px-8 py-6 text-center shadow-2xl relative">
            <CornerBrackets />
            <p className="text-sm tracking-[0.3em] text-emerald-400 font-bold uppercase animate-pulse mb-2 font-mono">
              [ СИСТЕМА ГОТОВА К ЗАПУСКУ ]
            </p>
            <p className="text-base tracking-[0.2em] text-[#e2e2e2] uppercase font-mono">
              НАЖМИТЕ ЛЮБУЮ КНОПКУ, ЧТОБЫ ПРОДОЛЖИТЬ
            </p>
          </div>
        </div>
      )}

      {/* Boot Log — Bottom Left */}
      <div className="absolute left-6 sm:left-8 bottom-6 sm:bottom-8 w-[500px] max-w-[85vw] text-xs sm:text-sm leading-relaxed text-[#888888] font-mono z-10">
        <AnimatePresence>
          {bootLines.slice(0, bootLinesShown).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={i === bootLinesShown - 1 ? 'text-[#e2e2e2] font-semibold' : ''}
            >
              » {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {showSessionTag && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative mt-3 w-full border border-[#333333] bg-[#171717] px-4 py-2 text-xs sm:text-sm text-[#cccccc]"
          >
            <DotCorners />
            {SESSION_TAG}
          </motion.div>
        )}
      </div>

      {/* Top Left: Clock & Date */}
      <AnimatePresence>
        {showCorners && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex absolute top-8 left-8 items-center gap-5 z-10"
          >
            <DiamondMark />
            <div>
              <p className="text-4xl sm:text-5xl leading-none text-[#e2e2e2] font-light tracking-tight tabular-nums">{clockLabel}</p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#888888] tracking-wider">
                Wednesday <span className="mx-1 text-[#444444]">|</span> 11 February
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right: Environment Info */}
      <AnimatePresence>
        {showCorners && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex absolute top-8 right-8 gap-8 border border-[#2a2a2a] bg-[#171717]/90 px-5 py-3 z-10"
          >
            <div>
              <p className="text-xs text-[#777777] tracking-widest uppercase">ENV</p>
              <p className="text-sm sm:text-base text-[#e2e2e2]">{ENV_LABEL}</p>
            </div>
            <div>
              <p className="text-xs text-[#777777] tracking-widest uppercase">NODE</p>
              <p className="text-sm sm:text-base text-[#e2e2e2] tabular-nums">{NODE_IP}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Edge: Noise Grid Rail & Vertical CIPHER_ID */}
      <AnimatePresence>
        {showFrame && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex absolute bottom-8 right-8 items-stretch gap-4 z-20"
          >
            <div className="flex flex-col items-center gap-2 shrink-0">
              <DiamondMark small />
              {cipherResolved && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <DecodeText
                    text={CIPHER_ID}
                    active={cipherIdActive}
                    className="text-xs tracking-[0.15em] text-[#888888] whitespace-nowrap font-mono leading-none"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  />
                </motion.div>
              )}
            </div>

            <NoiseGridRail resolved={cipherResolved} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Stage */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-6">
        {showCenterIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative border border-[#2a2a2a] bg-[#171717]/95 p-8 max-w-sm text-center"
          >
            <CornerBrackets />
            <div className="flex justify-center mb-5">
              <DiamondMark />
            </div>
            <p className="text-xs sm:text-base leading-relaxed text-[#cccccc] uppercase tracking-wider">
              {FOOTER_NOTE}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {stage === 'login' && showPanel && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: showLoginForm ? -30 : 0 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center p-3"
              >
                <CornerBrackets />
                <div className="flex items-center w-64 sm:w-72">
                  <motion.div
                    initial={false}
                    animate={{
                      height: barGrown ? 48 : 30,
                      width: wordmarkSplit ? '68%' : '100%',
                    }}
                    transition={{
                      height: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      width: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
                    }}
                    style={{ transformOrigin: 'left center' }}
                    className="bg-[#1c1c1c] relative overflow-hidden border border-[#2a2a2a] shrink-0"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#e2e2e2]"
                      style={{
                        width: `${panelProgress}%`,
                        transition: 'width 340ms cubic-bezier(0.2, 0, 0.38, 0.9)',
                      }}
                    />
                    <motion.span
                      initial={false}
                      animate={{ opacity: prefixShown ? 1 : 0 }}
                      transition={{ duration: 1.15, ease: 'easeOut' }}
                      className="absolute right-3 bottom-0.5 text-[#0d0d0d] font-mono font-black text-2xl sm:text-3xl tracking-tighter uppercase leading-none"
                    >
                      {OS_PREFIX}
                    </motion.span>
                  </motion.div>
                  <motion.span
                    initial={false}
                    animate={{ opacity: wordmarkSplit ? 1 : 0 }}
                    transition={{ duration: 1.1, delay: wordmarkSplit ? 0.55 : 0, ease: 'easeOut' }}
                    className="flex-1 pl-3 font-sans text-5xl sm:text-6xl font-light text-[#e2e2e2] tracking-wider leading-none whitespace-nowrap"
                  >
                    {OS_SUFFIX}
                  </motion.span>
                </div>
              </motion.div>

              <AnimatePresence>
                {showLoginForm && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 w-72 sm:w-80 flex flex-col items-end"
                  >
                    <p className="w-full text-xs tracking-[0.2em] text-[#888888] uppercase mb-1 font-mono">
                      {usernameRevealed ? `greeter :: ${USERNAME}` : '••••••••••••'}
                    </p>
                    <div className="w-full flex border border-[#3a3a3a] bg-[#171717] px-4 py-2.5 min-h-[3rem] items-center gap-2">
                      <AnimatePresence>
                        {Array.from({ length: typedCount }).map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`inline-block w-3 h-5 ${
                              justVerified ? 'bg-emerald-400' : 'bg-[#e2e2e2]'
                            }`}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    <button
                      disabled
                      className="px-6 py-1.5 text-xs sm:text-sm tracking-widest bg-[#e2e2e2] text-[#0d0d0d] font-bold flex items-center justify-center min-w-[6rem] border-x border-b border-[#3a3a3a]"
                    >
                      {submitting ? (
                        <span className="w-4 h-4 border-2 border-[#0d0d0d]/30 border-t-[#0d0d0d] rounded-full animate-spin" />
                      ) : (
                        'LOGIN'
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-8 max-w-sm text-center text-xs sm:text-sm text-[#888888] leading-relaxed flex items-center gap-2">
                <DiamondMark tiny />
                <span>{FOOTER_NOTE}</span>
              </p>
            </motion.div>
          )}

          {stage === 'flash-card' && (
            <motion.div
              key="flash-card"
              initial={{ opacity: 0, scale: 0.8, width: 120, height: 40 }}
              animate={{ opacity: 1, scale: 1, width: 220, height: 90 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#e2e2e2] relative flex items-center justify-center"
            >
              <CornerBrackets />
            </motion.div>
          )}

          {stage === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <IdCard confirming={waitingForEnter} />
            </motion.div>
          )}

          {stage === 'minigame' && (
            <motion.div
              key="minigame"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <PatternUnlockMinigame onUnlockSuccess={handleMinigameSuccess} />
            </motion.div>
          )}

          {stage === 'flash-entering' && (
            <motion.div
              key="flash-entering"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative border border-[#2a2a2a] bg-[#171717] p-8 max-w-xs text-center"
            >
              <CornerBrackets />
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e2e2e2] font-mono font-bold">
                ENTERING ER1FIED
              </p>
            </motion.div>
          )}

          {stage === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <EnteringBar progress={enteringProgress} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-Component: Pattern Unlock Minigame                             */
/* ------------------------------------------------------------------ */

function PatternUnlockMinigame({ onUnlockSuccess }) {
  const [selected, setSelected] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [status, setStatus] = useState('playing')

  const gridRef = useRef(null)
  const [nodePositions, setNodePositions] = useState([])

  const updatePositions = () => {
    if (!gridRef.current) return
    const nodes = gridRef.current.querySelectorAll('.pattern-node')

    const coords = Array.from(nodes).map((node) => ({
      x: node.offsetLeft + node.offsetWidth / 2,
      y: node.offsetTop + node.offsetHeight / 2,
    }))
    setNodePositions(coords)
  }

  useEffect(() => {
    updatePositions()
    const timer = setTimeout(updatePositions, 50)
    window.addEventListener('resize', updatePositions)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updatePositions)
    }
  }, [])

  const addNode = (index) => {
    if (status !== 'playing') return
    if (!selected.includes(index)) {
      const newSelected = [...selected, index]
      setSelected(newSelected)
      playSFX('node')

      if (
        newSelected.length === TARGET_PATTERN.length &&
        newSelected.every((val, idx) => val === TARGET_PATTERN[idx])
      ) {
        checkPattern(newSelected)
      }
    }
  }

  const checkPattern = (sequence) => {
    const isCorrect =
      sequence.length === TARGET_PATTERN.length &&
      sequence.every((val, idx) => val === TARGET_PATTERN[idx])

    if (isCorrect) {
      setStatus('success')
      playSFX('success')
      setTimeout(() => {
        if (onUnlockSuccess) onUnlockSuccess()
      }, 2600)
    } else {
      setStatus('failed')
      playSFX('error')
      setTimeout(() => {
        setSelected([])
        setStatus('playing')
      }, 600)
    }
  }

  const handlePointerDown = (index) => {
    if (status !== 'playing') return
    setIsDrawing(true)
    setSelected([index])
    playSFX('node')
  }

  const handlePointerEnter = (index) => {
    if (isDrawing) {
      addNode(index)
    }
  }

  const handlePointerUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (status === 'playing' && selected.length > 0) {
      checkPattern(selected)
    }
  }

  return (
    <div className="relative w-[340px] sm:w-[380px] bg-[#141414] border border-[#2a2a2a] p-6 shadow-2xl flex flex-col items-center select-none overflow-hidden">
      <PuzzleTechBackdrop />
      <CornerBrackets />

      <div className="relative z-10 w-full bg-[repeating-linear-gradient(45deg,#1f1f1f,#1f1f1f_8px,#2a2a2a_8px,#2a2a2a_16px)] border border-[#333333] py-2 px-3 text-center mb-6">
        <p className="text-base tracking-[0.2em] font-bold text-[#e2e2e2] uppercase font-mono">
          ВВЕДИТЕ КЛЮЧ ДЛЯ ПОДТВЕРЖДЕНИЯ
        </p>
      </div>

      <div className="relative z-10 mb-6 flex flex-col items-center">
        <TargetPatternGuide />
      </div>

      <div
        ref={gridRef}
        onPointerUp={handlePointerUp}
        className="relative z-10 grid grid-cols-3 gap-8 sm:gap-10 p-4 touch-none"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {selected.map((nodeIdx, i) => {
            if (i === 0) return null
            const prevNode = nodePositions[selected[i - 1]]
            const currNode = nodePositions[nodeIdx]
            if (!prevNode || !currNode) return null

            const isSuccess = status === 'success'
            const isFailed = status === 'failed'

            return (
              <line
                key={i}
                x1={prevNode.x}
                y1={prevNode.y}
                x2={currNode.x}
                y2={currNode.y}
                stroke={isSuccess ? '#a3e635' : isFailed ? '#dc2626' : '#e2e2e2'}
                strokeWidth="2.5"
                strokeDasharray={isSuccess ? 'none' : '4 4'}
                className="transition-colors duration-200"
              />
            )
          })}
        </svg>

        {Array.from({ length: 9 }).map((_, idx) => {
          const isSelected = selected.includes(idx)
          const isSuccess = status === 'success' && isSelected
          const isFailed = status === 'failed' && isSelected

          return (
            <div
              key={idx}
              onPointerDown={() => handlePointerDown(idx)}
              onPointerEnter={() => handlePointerEnter(idx)}
              className="pattern-node relative z-20 w-12 h-12 flex items-center justify-center cursor-pointer"
            >
              {isFailed ? (
                <div className="w-full h-full bg-[#dc2626] border border-red-500 flex items-center justify-center p-1 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  <SkullSprite />
                </div>
              ) : isSuccess ? (
                <div className="w-full h-full bg-[#a3e635] text-[#0d0d0d] border border-[#bef264] flex items-center justify-center p-1 relative shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                  <PixelGlyphSprite />
                </div>
              ) : isSelected ? (
                <div className="w-full h-full bg-[#e2e2e2] text-[#0d0d0d] border border-white flex items-center justify-center p-1 relative">
                  <PixelGlyphSprite />
                </div>
              ) : (
                <div className="w-full h-full cursor-pointer hover:border-[#555555] transition-colors">
                  <IdleNodeSprite />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 right-4 left-4 z-30 bg-[#a3e635] text-black p-4 border border-[#bef264] shadow-xl"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="bg-black text-[#a3e635] font-bold text-xs px-2 py-0.5 uppercase tracking-wider font-mono">
                УСПЕШЕНЫЙ ВХОД
              </span>
            </div>
            <p className="text-sm font-mono font-bold tracking-wider uppercase mt-1.5">
              ДАННЫЕ ПОДТВЕРЖДЕНЫ
            </p>
            <p className="text-xs font-mono tracking-widest uppercase opacity-80">
              ЗАПУСК СИСТЕМЫ ...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sci-Fi Schematic Backdrop Component                                */
/* ------------------------------------------------------------------ */

function PuzzleTechBackdrop() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <svg className="absolute inset-0 w-full h-full opacity-15" width="100%" height="100%">
        <defs>
          <pattern id="dot-matrix" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-matrix)" />
      </svg>

      <div className="absolute top-2 left-3 w-28 h-20 bg-[#ffffff]/[0.02] border-r border-b border-[#ffffff]/[0.05]" />
      <div className="absolute top-16 right-4 w-36 h-40 bg-[#000000]/40 border-l border-t border-[#ffffff]/[0.04]" />
      <div className="absolute bottom-6 left-2 w-40 h-32 bg-[#ffffff]/[0.015] border-t border-r border-[#ffffff]/[0.05]" />
      <div className="absolute bottom-2 right-3 w-28 h-24 bg-[#000000]/30 border-t border-[#ffffff]/[0.03]" />

      <div className="absolute top-5 left-5 font-mono text-[9px] text-[#ffffff]/20 leading-tight">
        <p>»&gt; ++ ~</p>
        <p>+даша ¤</p>
        <p className="mt-1 font-bold">1C0</p>
        <p>»&gt; 21</p>
      </div>

      <div className="absolute top-8 right-6 font-mono text-[9px] text-[#ffffff]/20 leading-none text-right">
        <p>]каTя</p>
        <p className="mt-0.5">///3</p>
      </div>

      <div className="absolute top-[42%] left-[45%] font-mono text-[9px] text-[#ffffff]/15 leading-tight">
        <p>*сочи S</p>
        <p>♥ [X]</p>
        <p className="mt-1">01</p>
      </div>

      <div className="absolute bottom-16 left-6 font-mono text-[9px] text-[#ffffff]/15 leading-tight">
        <p>»» лерка</p>
        <p>oo 1</p>
        <p>S крис</p>
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#ffffff]/20 leading-none">
        <p>/ростик¬ •J</p>
      </div>

      <div className="absolute bottom-6 right-8 font-mono text-[9px] text-[#ffffff]/15 text-right leading-none">
        <p>[0кирилF]</p>
        <p className="mt-1">:: 89</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sprite Graphics Sub-Components                                     */
/* ------------------------------------------------------------------ */

function IdleNodeSprite() {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" shapeRendering="crispEdges">
      <rect x="0" y="0" width="24" height="24" fill="#141414" />
      <rect x="0" y="0" width="24" height="24" fill="none" stroke="#3a3a3a" strokeWidth="1" />

      <rect x="1" y="1" width="2" height="2" fill="#777777" />
      <rect x="21" y="1" width="2" height="2" fill="#777777" />
      <rect x="1" y="21" width="2" height="2" fill="#777777" />
      <rect x="21" y="21" width="2" height="2" fill="#777777" />

      <rect x="3" y="3" width="18" height="18" fill="none" stroke="#282828" strokeWidth="1" />
      <rect x="6" y="6" width="12" height="12" fill="none" stroke="#555555" strokeWidth="1" />
      <rect x="8" y="8" width="8" height="8" fill="none" stroke="#222222" strokeWidth="1" />

      <rect x="11" y="9" width="2" height="2" fill="#888888" />
      <rect x="11" y="13" width="2" height="2" fill="#888888" />
      <rect x="9" y="11" width="2" height="2" fill="#888888" />
      <rect x="13" y="11" width="2" height="2" fill="#888888" />

      <rect x="10" y="10" width="1" height="1" fill="#cccccc" />
      <rect x="13" y="10" width="1" height="1" fill="#cccccc" />
      <rect x="10" y="13" width="1" height="1" fill="#cccccc" />
      <rect x="13" y="13" width="1" height="1" fill="#cccccc" />
    </svg>
  )
}

function PixelGlyphSprite() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-current" />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-current" />
      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-current" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-current" />
      <div className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center">
        <div className="w-1 h-1 bg-current rounded-full" />
      </div>
    </div>
  )
}

function SkullSprite() {
  return (
    <svg viewBox="0 0 16 16" className="w-full h-full" shapeRendering="crispEdges">
      <rect x="5" y="2" width="6" height="1" fill="#ffffff" />
      <rect x="4" y="3" width="8" height="1" fill="#ffffff" />
      <rect x="3" y="4" width="10" height="5" fill="#ffffff" />
      <rect x="4" y="9" width="8" height="1" fill="#ffffff" />

      <rect x="5" y="10" width="6" height="3" fill="#ffffff" />

      <rect x="5" y="5" width="2" height="3" fill="#dc2626" />
      <rect x="9" y="5" width="2" height="3" fill="#dc2626" />

      <rect x="7" y="8" width="2" height="1" fill="#dc2626" />

      <rect x="6" y="11" width="1" height="2" fill="#dc2626" />
      <rect x="9" y="11" width="1" height="2" fill="#dc2626" />
    </svg>
  )
}

function TargetPatternGuide() {
  return (
    <div className="relative flex flex-col items-center p-2 border border-[#2a2a2a] bg-[#111111]">
      <svg className="w-12 h-14" viewBox="0 0 40 50" fill="none">
        <circle cx="8" cy="8" r="2.5" fill="#e2e2e2" />
        <circle cx="8" cy="25" r="2.5" fill="#e2e2e2" />
        <circle cx="8" cy="42" r="2.5" fill="#e2e2e2" />
        <circle cx="20" cy="25" r="2.5" fill="#e2e2e2" />
        <circle cx="32" cy="8" r="2.5" fill="#e2e2e2" />
        <circle cx="32" cy="25" r="2.5" fill="#e2e2e2" />
        <circle cx="32" cy="42" r="2.5" fill="#e2e2e2" />

        <line x1="8" y1="8" x2="8" y2="42" stroke="#e2e2e2" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="8" y1="42" x2="20" y2="25" stroke="#e2e2e2" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="20" y1="25" x2="32" y2="42" stroke="#e2e2e2" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="32" y1="42" x2="32" y2="8" stroke="#e2e2e2" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    </div>
  )
}

function NoiseGridRail({ resolved }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!resolved) {
      const interval = setInterval(() => setTick((t) => t + 1), 70)
      return () => clearInterval(interval)
    }
  }, [resolved])

  const seg1 = useRef(Array.from({ length: 28 }, () => Math.random() > 0.45)).current
  const seg2 = useRef(Array.from({ length: 64 }, () => Math.random() > 0.38)).current
  const seg3 = useRef(Array.from({ length: 36 }, () => Math.random() > 0.5)).current

  return (
    <div className="h-full flex flex-col justify-between items-center w-10 bg-[#171717]/90 p-1.5 border-l border-r border-[#2a2a2a] shrink-0">
      <div className="w-full shrink-0 flex flex-col gap-1.5">
        <div className="w-full h-12 bg-[#e2e2e2]" />
        <div className="flex flex-col gap-[3px] w-full my-1">
          <div className="h-[4px] w-full bg-[#e2e2e2]" />
          <div className="h-[12px] w-full bg-[#e2e2e2]" />
          <div className="h-[12px] w-full bg-[#e2e2e2]" />
          <div className="h-[4px] w-full bg-[#e2e2e2]" />
        </div>
      </div>

      <div className="flex-1 w-full my-1.5 flex flex-col justify-evenly items-center gap-1.5 overflow-hidden">
        <div className="grid grid-cols-4 gap-[3px] w-full shrink-0">
          {seg1.map((active, i) => {
            const isOn = !resolved ? Math.random() > 0.45 : active
            return <span key={i} className={`w-full aspect-square ${isOn ? 'bg-[#e2e2e2]' : 'bg-[#222222]'}`} />
          })}
        </div>

        <div className="w-full h-[2px] bg-[#383838] shrink-0" />

        <div className="grid grid-cols-4 gap-[3px] w-full shrink-0">
          {seg2.map((active, i) => {
            const isOn = !resolved ? Math.random() > 0.4 : active
            return <span key={i} className={`w-full aspect-square ${isOn ? 'bg-[#e2e2e2]' : 'bg-[#222222]'}`} />
          })}
        </div>

        <div className="w-full h-[2px] bg-[#383838] shrink-0" />

        <div className="grid grid-cols-4 gap-[3px] w-full shrink-0">
          {seg3.map((active, i) => {
            const isOn = !resolved ? Math.random() > 0.5 : active
            return <span key={i} className={`w-full aspect-square ${isOn ? 'bg-[#e2e2e2]' : 'bg-[#222222]'}`} />
          })}
        </div>
      </div>

      <div className="w-full shrink-0 flex flex-col gap-1.5">
        <div className="w-full h-10 bg-[#e2e2e2]" />
        <div className="flex flex-col gap-[3px] w-full my-1">
          <div className="h-[4px] w-full bg-[#e2e2e2]" />
          <div className="h-[4px] w-full bg-[#e2e2e2]" />
          <div className="h-[4px] w-full bg-[#e2e2e2]" />
        </div>
        <div className="w-full h-[2px] bg-[#e2e2e2]" />
      </div>
    </div>
  )
}

function DotCorners() {
  const corners = [
    { anchor: '-top-1.5 -left-1.5', border: 'border-t-2 border-l-2' },
    { anchor: '-top-1.5 -right-1.5', border: 'border-t-2 border-r-2' },
    { anchor: '-bottom-1.5 -left-1.5', border: 'border-b-2 border-l-2' },
    { anchor: '-bottom-1.5 -right-1.5', border: 'border-b-2 border-r-2' },
  ]
  return (
    <>
      {corners.map((c, i) => (
        <span
          key={i}
          className={`absolute w-2 h-2 border-[#e2e2e2] ${c.anchor} ${c.border}`}
        />
      ))}
    </>
  )
}

function CornerBrackets() {
  const common = 'absolute w-3.5 h-3.5 border-[#e2e2e2]'
  return (
    <>
      <span className={`${common} -top-1.5 -left-1.5 border-t-2 border-l-2`} />
      <span className={`${common} -top-1.5 -right-1.5 border-t-2 border-r-2`} />
      <span className={`${common} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
      <span className={`${common} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} />
    </>
  )
}

function DiamondMark({ small, tiny }) {
  const size = tiny ? 'w-4 h-4' : small ? 'w-6 h-6' : 'w-10 h-10'
  return (
    <div className={`${size} shrink-0 border border-[#e2e2e2] rotate-45 flex items-center justify-center`}>
      <span className="w-1/2 h-1/2 bg-[#e2e2e2] -rotate-45" />
    </div>
  )
}

const HEX_CHARS = '0123456789ABCDEF'
const KEEP_LITERAL = new Set(['-', '|'])

function scrambleKeepingSeparators(str) {
  return str
    .split('')
    .map((c) => (KEEP_LITERAL.has(c) ? c : HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]))
    .join('')
}

function DecodeText({ text, active, className, style }) {
  const [display, setDisplay] = useState(() => scrambleKeepingSeparators(text))

  useEffect(() => {
    if (!active) return
    let revealed = 0
    const id = setInterval(() => {
      revealed += 1
      setDisplay(text.slice(0, revealed) + scrambleKeepingSeparators(text.slice(revealed)))
      if (revealed >= text.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [active, text])

  return (
    <p className={className} style={style}>
      {display}
    </p>
  )
}

function IdCard({ confirming }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#e2e2e2] mb-5 font-bold">
        ЛИЧНОСТЬ ПОДТВЕРЖДЕНА
      </p>
      <div className="border border-[#2a2a2a] bg-[#171717] p-6 flex gap-8 items-center">
        <div className="min-w-[210px]">
          <div className="flex gap-8 mb-4">
            <div>
              <p className="text-xs text-[#777777] tracking-widest">ПОЗЫВНОЙ</p>
              <p className="text-base text-[#e2e2e2] font-mono font-semibold">{CARD.empId}</p>
            </div>
            <div>
              <p className="text-xs text-[#777777] tracking-widest">КЛАСС</p>
              <p className="text-base text-[#e2e2e2] font-mono font-semibold">{CARD.cls}</p>
            </div>
          </div>
          <p className="text-xs text-[#777777] tracking-widest">ФИО</p>
          <p className="text-lg sm:text-xl text-[#e2e2e2] font-mono font-bold tracking-wide">{CARD.fullName}</p>

          <div className="mt-4 flex items-center gap-2 border border-[#2a2a2a] px-3 py-1.5 w-fit bg-[#0d0d0d]">
            <DiamondMark tiny />
            <span className="text-xs text-[#cccccc] font-mono">{CARD.hex}</span>
          </div>
        </div>

        <div className="w-28 h-32 bg-[#222222] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          <img
            src="/images/id-photo.jpg"
            alt="ID photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <p className={`mt-8 text-xs sm:text-sm tracking-[0.2em] text-[#888888] font-semibold ${confirming ? 'animate-pulse' : 'opacity-0'}`}>
        <span className="text-emerald-400">[ENTER]</span> ЧТОБЫ ПРОДОЛЖИТЬ
      </p>
    </div>
  )
}

function EnteringBar({ progress }) {
  return (
    <div className="flex flex-col items-center w-80 sm:w-96">
      <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#e2e2e2] mb-5 font-mono font-semibold">
        ВХОД В СИСТЕМУ
      </p>
      <div className="relative w-full flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 bg-[#e2e2e2]" />
        <div className="flex-1 h-[3px] bg-[#222222]">
          <div className="h-full bg-[#e2e2e2] transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <span className="w-1.5 h-1.5 bg-[#e2e2e2]" />
      </div>
    </div>
  )
}

// --- preview bridge: exposes the component to the sasaOS desktop page ---
window.KishkiLoadingScreen = LoadingScreen
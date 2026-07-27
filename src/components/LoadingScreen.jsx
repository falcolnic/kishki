import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  empId: 'KSH-0417',
  cls: 'L3_CREW',
  fullName: 'ГЛЕБ БОРИСОВИЧ',
  hex: '7D2A12F9B1SDFA4',
}

const FOOTER_NOTE = 'Property of KISHKI Systems. All usage is subject to PATROL Active Monitoring.'

// Target Pattern Indices on 3x3 Grid (0 to 8)
const TARGET_PATTERN = [0, 3, 6, 4, 8, 5, 2] 

/* ------------------------------------------------------------------ */

export default function LoadingScreen({ onComplete }) {
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

  const minigameResolverRef = useRef(null)

  // Session stopwatch
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsedSec(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
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
      // 1. Session tag appears
      setShowSessionTag(true)
      await delay(700)
      if (cancelled) return

      // 2. Boot log fills upwards
      for (let i = 0; i < INITIAL_BOOT_LINES.length; i++) {
        if (cancelled) return
        setBootLinesShown(i + 1)
        await delay(350)
      }
      await delay(400)
      if (cancelled) return

      // 3. Center intro notice card
      setShowCenterIntro(true)
      await delay(1200)
      if (cancelled) return

      // 4. Center panel loading bar & HUD outline
      setShowCenterIntro(false)
      setStage('login')
      setShowPanel(true)
      await animateFill(setPanelProgress, 1400)
      if (cancelled) return

      setShowFrame(true)
      await delay(800)
      if (cancelled) return

      // 5. Cipher rail decodes & HUD corners reveal
      setCipherResolved(true)
      await delay(700)
      if (cancelled) return
      setCipherIdActive(true)
      await delay(400)
      if (cancelled) return

      setShowCorners(true)
      setWordmarkSplit(true)
      await delay(800)
      if (cancelled) return

      // 6. Wordmark shifts UP, Login Form slides DOWN
      setShowLoginForm(true)
      setBootLines((prev) => [...prev, `[PATROL] Opened session for user(${USERNAME})`])
      setBootLinesShown((prev) => prev + 1)

      await delay(800)
      if (cancelled) return

      setUsernameRevealed(true)
      await delay(600)
      if (cancelled) return

      // 7. Password types out
      for (let i = 0; i < PASSWORD_LENGTH; i++) {
        if (cancelled) return
        setTypedCount(i + 1)
        await delay(280)
      }
      await delay(500)
      if (cancelled) return

      // 8. Auto-submit & Verification
      setSubmitting(true)
      await delay(1200)
      if (cancelled) return
      setSubmitting(false)
      setJustVerified(true)

      setBootLines((prev) => [...prev, `[PATROL] IDENTITY_VERIFIED // WELCOME BACK`])
      setBootLinesShown((prev) => prev + 1)

      await delay(900)
      if (cancelled) return

      setJustVerified(false)
      setShowLoginForm(false)
      await delay(500)
      if (cancelled) return

      // 9. Identity Card Stage
      setStage('flash-card')
      await delay(500)
      if (cancelled) return

      setStage('card')
      await delay(800)
      if (cancelled) return
      setWaitingForEnter(true)

      // Wait for Enter key press
      await new Promise((resolve) => {
        function onKey(e) {
          if (e.key === 'Enter') {
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

      // 10. Transition to Pattern Unlock Minigame Stage
      setStage('minigame')
      await new Promise((resolve) => {
        minigameResolverRef.current = resolve
      })
      if (cancelled) return

      setBootLines((prev) => [...prev, `[PATROL] Session closed for user(${USERNAME})`])
      setBootLinesShown((prev) => prev + 1)

      // 11. Intermediate block morph -> Final "ENTERING SYSTEM" progress
      setStage('flash-entering')
      await delay(600)
      if (cancelled) return

      setStage('entering')
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
  }, [])

  const handleMinigameSuccess = () => {
    if (minigameResolverRef.current) {
      minigameResolverRef.current()
    }
  }

  const minutes = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
  const seconds = String(elapsedSec % 60).padStart(2, '0')
  const clockLabel = `${minutes}:${seconds}`

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0d0d0d] text-[#e2e2e2] font-mono overflow-hidden select-none transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Neutral Scanlines & Grid Noise overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.45)_51%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Boot Log — Bottom Left */}
      <div className="absolute left-6 sm:left-8 bottom-6 sm:bottom-8 w-[460px] max-w-[85vw] text-xs sm:text-sm leading-relaxed text-[#888888] font-mono z-10">
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
        {/* Intro Notice Card */}
        {showCenterIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative border border-[#2a2a2a] bg-[#171717]/95 p-10 max-w-sm text-center"
          >
            <CornerBrackets />
            <div className="flex justify-center mb-5">
              <DiamondMark />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#cccccc] uppercase tracking-wider">
              {FOOTER_NOTE}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* 1. Main Login Stage */}
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
                animate={{ y: showLoginForm ? -20 : 0 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-center justify-center p-3"
              >
                <CornerBrackets />
                {!wordmarkSplit ? (
                  <div className="w-64 sm:w-72 h-12 bg-[#1c1c1c] relative overflow-hidden border border-[#2a2a2a]">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#e2e2e2] transition-[width] duration-100 ease-linear"
                      style={{ width: `${panelProgress}%` }}
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-48 sm:w-56 h-12 sm:h-14 bg-[#e2e2e2] flex items-end justify-end px-3 py-1 shrink-0"
                    >
                      <span className="text-[#0d0d0d] font-mono font-black text-2xl sm:text-3xl tracking-tighter uppercase leading-none">
                        {OS_PREFIX}
                      </span>
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="font-sans text-5xl sm:text-6xl font-light text-[#e2e2e2] tracking-wider"
                    >
                      {OS_SUFFIX}
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {showLoginForm && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
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
                            className={`inline-block w-3 h-3 ${
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

          {/* Morph Block Transition before Identity Card */}
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

          {/* 2. Identity Card Stage */}
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

          {/* 3. Pattern Unlock Minigame Stage */}
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

          {/* Morph Block Transition before Entering System Bar */}
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

          {/* 4. Final "ENTERING SYSTEM" Progress Stage */}
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
  const [status, setStatus] = useState('playing') // 'playing' | 'success' | 'failed'
  
  const gridRef = useRef(null)
  const [nodePositions, setNodePositions] = useState([])

  // Recalculates exact center points using offset relative to gridRef container
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
    // Initial measurement + small timeout to handle post-mount reflow
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

      if (newSelected.length === TARGET_PATTERN.length) {
        checkPattern(newSelected)
      }
    }
  }

  const checkPattern = (sequence) => {
    const isCorrect = sequence.every((val, idx) => val === TARGET_PATTERN[idx])

    if (isCorrect) {
      setStatus('success')
      setTimeout(() => {
        if (onUnlockSuccess) onUnlockSuccess()
      }, 4000)
    } else {
      setStatus('failed')
      setTimeout(() => {
        setSelected([])
        setStatus('playing')
      }, 600)
    }
  }

  const handlePointerDown = (index) => {
    setIsDrawing(true)
    setSelected([index])
  }

  const handlePointerEnter = (index) => {
    if (isDrawing) {
      addNode(index)
    }
  }

  const handlePointerUp = () => {
    setIsDrawing(false)
    if (selected.length > 0 && selected.length < TARGET_PATTERN.length && status === 'playing') {
      setStatus('failed')
      setTimeout(() => {
        setSelected([])
        setStatus('playing')
      }, 500)
    }
  }

  return (
    <div className="relative w-[340px] sm:w-[380px] bg-[#171717] border border-[#2a2a2a] p-6 shadow-2xl flex flex-col items-center select-none">
      <CornerBrackets />

      {/* Top Banner */}
      <div className="w-full bg-[repeating-linear-gradient(45deg,#1f1f1f,#1f1f1f_8px,#2a2a2a_8px,#2a2a2a_16px)] border border-[#333333] py-2 px-3 text-center mb-6">
        <p className="text-[11px] tracking-[0.2em] font-bold text-[#e2e2e2] uppercase font-mono">
          НАРИСУЙТЕ ПАТТЕРН ДЛЯ ПОДТВЕРЖДЕНИЯ
        </p>
      </div>

      {/* Target Guide Icon */}
      <div className="mb-6 flex flex-col items-center">
        <TargetPatternGuide />
      </div>

      {/* 3x3 Grid Container */}
      <div
        ref={gridRef}
        onPointerUp={handlePointerUp}
        className="relative grid grid-cols-3 gap-8 sm:gap-10 p-4 touch-none"
      >
        {/* SVG Connecting Lines Overlay */}
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
                stroke={isSuccess ? '#34d399' : isFailed ? '#ef4444' : '#e2e2e2'}
                strokeWidth="2"
                strokeDasharray={isSuccess ? 'none' : '4 4'}
                className="transition-colors duration-200"
              />
            )
          })}
        </svg>

        {/* 9 Interactive Nodes */}
        {Array.from({ length: 9 }).map((_, idx) => {
          const isSelected = selected.includes(idx)
          const isSuccess = status === 'success' && isSelected
          const isFailed = status === 'failed' && isSelected

          return (
            <div
              key={idx}
              onPointerDown={() => handlePointerDown(idx)}
              onPointerEnter={() => handlePointerEnter(idx)}
              className={`pattern-node relative w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-150 ${
                isSuccess
                  ? 'bg-emerald-400 text-black border-emerald-300'
                  : isFailed
                  ? 'bg-red-600 text-white border-red-500'
                  : isSelected
                  ? 'bg-[#e2e2e2] text-[#0d0d0d] border-[#ffffff]'
                  : 'bg-[#1c1c1c] border border-[#3a3a3a] hover:border-[#666666]'
              }`}
            >
              <span className="text-[10px] font-bold font-mono">
                {isSelected ? '■' : '¤'}
              </span>

              {isSelected && (
                <>
                  <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-current" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-current" />
                  <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-current" />
                  <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-current" />
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Success Notification Popup */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 right-4 left-4 z-30 bg-emerald-400 text-black p-4 border border-emerald-300 shadow-xl"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="bg-black text-emerald-400 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider font-mono">
                ПОДТВЕРЖДЕНИЕ УСПЕШНО
              </span>
            </div>
            <p className="text-xs font-mono font-bold tracking-wider uppercase mt-1.5">
              УЧЕТНЫЕ ДАННЫЕ ПОДТВЕРЖДЕНЫ.
            </p>
            <p className="text-[11px] font-mono tracking-widest uppercase opacity-80">
              STARTING SYSTEM ...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TargetPatternGuide() {
  return (
    <div className="relative flex flex-col items-center p-2 border border-[#2a2a2a] bg-[#111111]">
      <svg className="w-14 h-16" viewBox="0 0 40 50" fill="none">
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

/* ------------------------------------------------------------------ */
/* Presentational Helpers                                            */
/* ------------------------------------------------------------------ */

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
              <p className="text-xs text-[#777777] tracking-widest">EMPID NO.</p>
              <p className="text-base text-[#e2e2e2] font-mono font-semibold">{CARD.empId}</p>
            </div>
            <div>
              <p className="text-xs text-[#777777] tracking-widest">CLASS</p>
              <p className="text-base text-[#e2e2e2] font-mono font-semibold">{CARD.cls}</p>
            </div>
          </div>
          <p className="text-xs text-[#777777] tracking-widest">FULL NAME</p>
          <p className="text-lg sm:text-xl text-[#e2e2e2] font-mono font-bold tracking-wide">{CARD.fullName}</p>
          
          <div className="mt-4 flex items-center gap-2 border border-[#2a2a2a] px-3 py-1.5 w-fit bg-[#0d0d0d]">
            <DiamondMark tiny />
            <span className="text-xs text-[#cccccc] font-mono">{CARD.hex}</span>
          </div>
        </div>

        <div className="w-28 h-32 bg-[#222222] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          <svg className="w-20 h-20 text-[#555555] fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      </div>

      <p className={`mt-8 text-xs sm:text-sm tracking-[0.2em] text-[#888888] font-semibold ${confirming ? 'animate-pulse' : 'opacity-0'}`}>
        <span className="text-emerald-400">[ENTER]</span> TO CONFIRM
      </p>
    </div>
  )
}

function EnteringBar({ progress }) {
  return (
    <div className="flex flex-col items-center w-80 sm:w-96">
      <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#e2e2e2] mb-5 font-mono font-semibold">
        ENTERING SYSTEM
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
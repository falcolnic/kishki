import { useEffect, useRef, useState } from 'react'

const GLYPHS = ['◈', '◉', '◎', '◐', '◭', '◬']
const DECRYPT_TARGET = 'KISHKI'
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&01'

function randomGlyphSequence(length) {
  const seq = []
  for (let i = 0; i < length; i++) {
    seq.push(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
  }
  return seq
}

function scrambleWord(word) {
  return word
    .split('')
    .map((c) => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
    .join('')
}

const STAGES = {
  INTRO: 'intro',
  MEMORY: 'memory',
  DECRYPT: 'decrypt',
  NODES: 'nodes',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export default function BreachMinigame() {
  const [stage, setStage] = useState(STAGES.INTRO)

  return (
    <section id="breach" className="relative py-28 px-5">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-4xl text-ink tracking-widest mb-2">// BREACH_PROTOCOL</h2>
        <p className="text-dim text-sm mb-10">
          three-stage intrusion. clear all stages to unlock the squad's private access code.
        </p>

        <div className="terminal-panel p-6 sm:p-8 min-h-[420px] flex flex-col">
          <StageProgress stage={stage} />

          <div className="flex-1 flex items-center justify-center mt-6">
            {stage === STAGES.INTRO && <Intro onStart={() => setStage(STAGES.MEMORY)} />}
            {stage === STAGES.MEMORY && (
              <MemoryStage
                onPass={() => setStage(STAGES.DECRYPT)}
                onFail={() => setStage(STAGES.FAILED)}
              />
            )}
            {stage === STAGES.DECRYPT && (
              <DecryptStage
                onPass={() => setStage(STAGES.NODES)}
                onFail={() => setStage(STAGES.FAILED)}
              />
            )}
            {stage === STAGES.NODES && (
              <NodesStage
                onPass={() => setStage(STAGES.SUCCESS)}
                onFail={() => setStage(STAGES.FAILED)}
              />
            )}
            {stage === STAGES.SUCCESS && <Success onRestart={() => setStage(STAGES.INTRO)} />}
            {stage === STAGES.FAILED && (
              <Failed onRetry={() => setStage(STAGES.INTRO)} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function StageProgress({ stage }) {
  const order = [STAGES.MEMORY, STAGES.DECRYPT, STAGES.NODES]
  const labels = ['memory', 'decrypt', 'firewall']
  const currentIndex =
    stage === STAGES.INTRO
      ? -1
      : stage === STAGES.SUCCESS
        ? 3
        : stage === STAGES.FAILED
          ? order.indexOf(stage)
          : order.indexOf(stage)

  return (
    <div className="flex items-center gap-3 text-[11px] tracking-widest uppercase">
      {labels.map((label, i) => {
        const complete = currentIndex > i || stage === STAGES.SUCCESS
        const active = currentIndex === i
        return (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`px-2 py-1 border ${
                complete
                  ? 'border-ink text-ink bg-ink/10'
                  : active
                    ? 'border-ink/70 text-ink animate-pulse'
                    : 'border-dim/40 text-dim'
              }`}
            >
              0{i + 1} {label}
            </span>
            {i < labels.length - 1 && <span className="text-dim">—</span>}
          </div>
        )
      })}
    </div>
  )
}

function Intro({ onStart }) {
  return (
    <div className="text-center">
      <p className="text-ink/80 text-sm max-w-md mb-6">
        Access requires override. You'll be asked to mirror a memory pattern, decrypt a
        callsign, then bypass a firewall grid before the connection times out. Stay sharp.
      </p>
      <button
        onClick={onStart}
        className="glyph-tag !text-sm !px-5 !py-2 hover:bg-ink/15 hover:text-white transition-colors"
      >
        connect ▸
      </button>
    </div>
  )
}

/* ---------------- Stage 1: Memory sequence ---------------- */
function MemoryStage({ onPass, onFail }) {
  const [round, setRound] = useState(1)
  const maxRounds = 3
  const [sequence, setSequence] = useState([])
  const [showing, setShowing] = useState(true)
  const [input, setInput] = useState([])

  useEffect(() => {
    const seq = randomGlyphSequence(2 + round)
    setSequence(seq)
    setInput([])
    setShowing(true)
    const t = setTimeout(() => setShowing(false), 900 + seq.length * 500)
    return () => clearTimeout(t)
  }, [round])

  function handlePick(glyph) {
    if (showing) return
    const next = [...input, glyph]
    const idx = next.length - 1
    if (sequence[idx] !== glyph) {
      onFail()
      return
    }
    setInput(next)
    if (next.length === sequence.length) {
      if (round >= maxRounds) {
        onPass()
      } else {
        setTimeout(() => setRound((r) => r + 1), 500)
      }
    }
  }

  return (
    <div className="text-center w-full">
      <p className="text-dim text-xs mb-4 tracking-widest uppercase">
        round {round}/{maxRounds} — {showing ? 'memorize the pattern' : 'repeat it'}
      </p>
      <div className="flex justify-center gap-3 mb-8 min-h-[3rem]">
        {showing
          ? sequence.map((g, i) => (
              <span key={i} className="text-3xl text-ink animate-rise" style={{ animationDelay: `${i * 120}ms` }}>
                {g}
              </span>
            ))
          : input.map((g, i) => (
              <span key={i} className="text-3xl text-ink/70">
                {g}
              </span>
            ))}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {GLYPHS.map((g) => (
          <button
            key={g}
            disabled={showing}
            onClick={() => handlePick(g)}
            className="text-2xl py-3 border border-dim/50 text-ink hover:border-ink hover:text-ink disabled:opacity-30 transition-colors"
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Stage 2: Decrypt terminal ---------------- */
function DecryptStage({ onPass, onFail }) {
  const [scramble, setScramble] = useState(() => scrambleWord(DECRYPT_TARGET))
  const [guess, setGuess] = useState('')
  const [timeLeft, setTimeLeft] = useState(20)
  const revealRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScramble((prev) =>
        prev
          .split('')
          .map((c, i) => (i < revealRef.current ? DECRYPT_TARGET[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
          .join(''),
      )
    }, 90)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      onFail()
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, onFail])

  function handleChange(e) {
    const value = e.target.value.toUpperCase().slice(0, DECRYPT_TARGET.length)
    setGuess(value)
    let correctPrefix = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === DECRYPT_TARGET[i]) correctPrefix++
      else break
    }
    revealRef.current = correctPrefix
    if (value === DECRYPT_TARGET) {
      onPass()
    }
  }

  return (
    <div className="text-center w-full">
      <p className="text-dim text-xs mb-4 tracking-widest uppercase">decrypt the callsign — {timeLeft}s left</p>
      <p className="font-display text-5xl tracking-[0.3em] text-ink mb-6 select-none">{scramble}</p>
      <input
        autoFocus
        value={guess}
        onChange={handleChange}
        placeholder="TYPE HERE"
        className="bg-transparent border-b-2 border-dim text-center text-2xl tracking-[0.3em] text-ink placeholder:text-dim/40 focus:outline-none focus:border-ink w-64"
      />
      <p className="text-dim text-[10px] mt-4">hint: it's the squad name</p>
    </div>
  )
}

/* ---------------- Stage 3: Firewall node bypass ---------------- */
function NodesStage({ onPass, onFail }) {
  const size = 9
  const [order] = useState(() => shuffle([...Array(size).keys()]))
  const [nextIndex, setNextIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(12)
  const [wrongNode, setWrongNode] = useState(null)

  useEffect(() => {
    if (timeLeft <= 0) {
      onFail()
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, onFail])

  function handleClick(node) {
    if (order[nextIndex] === node) {
      if (nextIndex + 1 === size) {
        onPass()
      } else {
        setNextIndex((n) => n + 1)
      }
    } else {
      setWrongNode(node)
      setTimeout(() => setWrongNode(null), 250)
    }
  }

  return (
    <div className="text-center w-full">
      <p className="text-dim text-xs mb-4 tracking-widest uppercase">
        bypass nodes in ascending order — {timeLeft}s left
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {order.map((node, i) => {
          const cleared = i < nextIndex
          return (
            <button
              key={node}
              onClick={() => handleClick(node)}
              disabled={cleared}
              className={`aspect-square flex items-center justify-center border font-display text-2xl transition-colors ${
                cleared
                  ? 'border-ink text-ink bg-ink/10'
                  : wrongNode === node
                    ? 'border-red text-red bg-red/10'
                    : 'border-dim/50 text-ink hover:border-ink hover:text-ink'
              }`}
            >
              {cleared ? '✓' : node + 1}
            </button>
          )
        })}
      </div>
      <p className="text-dim text-[10px] mt-4">next node: {nextIndex + 1}</p>
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ---------------- End states ---------------- */
function Success({ onRestart }) {
  return (
    <div className="text-center">
      <p className="glyph-tag !border-ink !text-ink mb-4">ACCESS GRANTED</p>
      <p className="font-display text-3xl text-ink mb-2">welcome to KISHKI_NET</p>
      <p className="text-dim text-sm mb-6">private access code: KSHK-7741-CTOS</p>
      <button
        onClick={onRestart}
        className="glyph-tag !text-xs !px-4 !py-2 !border-dim !text-dim hover:text-ink hover:!border-ink transition-colors"
      >
        run again
      </button>
    </div>
  )
}

function Failed({ onRetry }) {
  return (
    <div className="text-center">
      <p className="glyph-tag !border-red !text-red mb-4">CONNECTION TERMINATED</p>
      <p className="text-dim text-sm mb-6">trace detected. protocol reset.</p>
      <button
        onClick={onRetry}
        className="glyph-tag !text-sm !px-5 !py-2 hover:bg-ink/15 hover:text-white transition-colors"
      >
        retry ▸
      </button>
    </div>
  )
}

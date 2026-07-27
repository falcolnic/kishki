import { useEffect, useState } from 'react'

/**
 * Types out a list of lines one character at a time, like a terminal boot log.
 * Returns the lines completed so far and whether typing has finished.
 */
export function useTypewriter(lines, speed = 18) {
  const [output, setOutput] = useState([''])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let cancelled = false

    function tick() {
      if (cancelled) return
      if (lineIndex >= lines.length) {
        setDone(true)
        return
      }
      const currentLine = lines[lineIndex]
      charIndex += 1
      setOutput((prev) => {
        const next = [...prev]
        next[lineIndex] = currentLine.slice(0, charIndex)
        return next
      })
      if (charIndex >= currentLine.length) {
        lineIndex += 1
        charIndex = 0
        setOutput((prev) => [...prev, ''])
        setTimeout(tick, 260)
      } else {
        setTimeout(tick, speed)
      }
    }

    const start = setTimeout(tick, 300)
    return () => {
      cancelled = true
      clearTimeout(start)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { output: output.filter((l) => l !== '' || output.length === 1), done }
}

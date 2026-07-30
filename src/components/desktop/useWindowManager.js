import { useState, useRef, useCallback } from 'react'

const DEFAULT_WIDTHS = {
    agent: 520,
    msg: 720,
    files: 560,
    doc: 600,
    gallery: 620,
    timeline: 600,
    roster: 640,
    term: 540,
}

export function useWindowManager() {
    const [windows, setWindows] = useState({})
    const [order, setOrder] = useState([])
    const zTop = useRef(30)

    const show = useCallback((id) => {
        setWindows((w) => {
        if (w[id]) {
            zTop.current += 1
            return { ...w, [id]: { ...w[id], z: zTop.current } }
        }
        const n = Object.keys(w).length
        const width = DEFAULT_WIDTHS[id] || 600
        const maxX = Math.max(24, window.innerWidth - width - 24)
        const x = Math.min(maxX, 168 + n * 32)
        const y = 76 + n * 28
        zTop.current += 1
        return { ...w, [id]: { x, y, z: zTop.current } }
        })
        setOrder((o) => (o.includes(id) ? o : [...o, id]))
    }, [])

    const hide = useCallback((id) => {
        setWindows((w) => {
        const next = { ...w }
        delete next[id]
        return next
        })
        setOrder((o) => o.filter((v) => v !== id))
    }, [])

    const focus = useCallback((id) => {
        setWindows((w) => {
        if (!w[id]) return w
        zTop.current += 1
        return { ...w, [id]: { ...w[id], z: zTop.current } }
        })
    }, [])

    const moveWindow = useCallback((id, x, y) => {
        setWindows((w) => (w[id] ? { ...w, [id]: { ...w[id], x, y } } : w))
    }, [])

    const topId = order.length
        ? order.reduce((top, id) => ((windows[id]?.z ?? -1) > (windows[top]?.z ?? -1) ? id : top), order[0])
        : null

    return { windows, order, topId, show, hide, focus, moveWindow, widths: DEFAULT_WIDTHS }
}
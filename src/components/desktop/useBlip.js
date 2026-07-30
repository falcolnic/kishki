import { useCallback } from 'react'
import { audioBus } from '../../audio/audioBus'

let sharedCtx = null
function getCtx() {
    if (typeof window === 'undefined') return null
    if (!sharedCtx) {
        const AC = window.AudioContext || window.webkitAudioContext
        if (AC) sharedCtx = new AC()
    }
    if (sharedCtx && sharedCtx.state === 'suspended') sharedCtx.resume()
    return sharedCtx
}

export function useBlip() {
    return useCallback((freq) => {
        const vol = audioBus.volume
        if (vol <= 0) return
        try {
        const ctx = getCtx()
        if (!ctx) return
        const now = ctx.currentTime
        const o = ctx.createOscillator()
        const o2 = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o2.type = 'sine'
        o.frequency.value = freq
        o2.frequency.value = freq * 2
        const peak = 0.09 * vol
        g.gain.setValueAtTime(0.0001, now)
        g.gain.exponentialRampToValueAtTime(peak, now + 0.008)
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
        o.connect(g)
        o2.connect(g)
        g.connect(ctx.destination)
        o.start(now)
        o2.start(now)
        o.stop(now + 0.07)
        o2.stop(now + 0.07)
        } catch (e) {
        // ignore
        }
    }, [])
}
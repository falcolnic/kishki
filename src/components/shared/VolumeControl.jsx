import { useState, useRef } from 'react'

const base = {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
}

function VolHigh(props) {
    return (
        <svg {...base} {...props}>
        <path d="M4 9v6h4l5 5V4L8 9H4Z" />
        <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
        <path d="M18.5 6a8 8 0 0 1 0 12" />
        </svg>
    )
}
function VolLow(props) {
    return (
        <svg {...base} {...props}>
        <path d="M4 9v6h4l5 5V4L8 9H4Z" />
        <path d="M16 9.5a3 3 0 0 1 0 5" />
        </svg>
    )
}
function VolMute(props) {
    return (
        <svg {...base} {...props}>
        <path d="M4 9v6h4l5 5V4L8 9H4Z" />
        <path d="M16 9l5 6M21 9l-5 6" />
        </svg>
    )
}

export default function VolumeControl({
    volume,
    onChange,
    className = '',
    accent = '#e2e2e2',
    panelBg = '#171717',
    panelBorder = '#3a3a3a',
    dim = '#888888',
    accentTrack = '#e2e2e2',
    }) {
    const [hover, setHover] = useState(false)
    const closeTimer = useRef(null)
    const Icon = volume === 0 ? VolMute : volume < 50 ? VolLow : VolHigh

    const open = () => {
        if (closeTimer.current) {
        clearTimeout(closeTimer.current)
        closeTimer.current = null
        }
        setHover(true)
    }

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setHover(false), 250)
    }

    return (
        <div className={`relative ${className}`} onMouseEnter={open} onMouseLeave={scheduleClose}>
        <button
            type="button"
            className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ color: accent }}
        >
            <Icon width={18} height={18} />
        </button>

        {hover && (
            <div
            className="absolute top-full right-0 w-40 shadow-[0_2px_10px_rgba(0,0,0,0.5)] pt-3 z-[80]"
            style={{ background: 'transparent' }}
            >
            <div className="p-3.5" style={{ background: panelBg, border: `1px solid ${panelBorder}` }}>
                <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] tracking-wide" style={{ color: accent }}>Звук</span>
                <span className="font-mono text-[11px]" style={{ color: dim }}>{volume}%</span>
                </div>
                <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: accentTrack }}
                />
            </div>
            </div>
        )}
        </div>
    )
}
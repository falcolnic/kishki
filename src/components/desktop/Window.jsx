import { useRef, useCallback } from 'react'
import { IconClose } from './Icons'

export default function Window({
    id, title, icon, width = 600, x, y, z,
    accentBorder, barBackground, onClose, onFocus, onMove, children,
    }) {
    const dragRef = useRef(null)

    const handlePointerDown = useCallback(
        (e) => {
        if (e.target.closest('[data-close-btn]')) return
        onFocus(id)
        dragRef.current = { ox: e.clientX - x, oy: e.clientY - y }
        const bar = e.currentTarget
        bar.setPointerCapture(e.pointerId)
        bar.style.cursor = 'grabbing'

        const move = (ev) => {
            if (!dragRef.current) return
            const nx = Math.max(-160, Math.min(window.innerWidth - 120, ev.clientX - dragRef.current.ox))
            const ny = Math.max(52, Math.min(window.innerHeight - 40, ev.clientY - dragRef.current.oy))
            onMove(id, nx, ny)
        }
        const up = () => {
            dragRef.current = null
            bar.style.cursor = 'grab'
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
        },
        [id, x, y, onFocus, onMove]
    )

    return (
        <div
        className="absolute overflow-hidden shadow-[0_2px_6px_0_rgba(0,0,0,0.4)] bg-[#393939]"
        style={{ left: x, top: y, zIndex: z, width, border: `1px solid ${accentBorder || '#525252'}` }}
        onPointerDownCapture={() => onFocus(id)}
        >
        <div
            onPointerDown={handlePointerDown}
            className="flex items-center justify-between h-10 px-3 border-b cursor-grab select-none"
            style={{ background: barBackground || '#4c4c4c', borderColor: accentBorder || '#525252' }}
        >
            <span className="flex items-center gap-2 text-[13px] font-semibold text-[#f4f4f4] min-w-0">
            {icon}
            <span className="truncate">{title}</span>
            </span>
            <button
            type="button"
            data-close-btn
            onClick={() => onClose(id)}
            className="w-7 h-7 flex items-center justify-center text-[#c6c6c6] hover:bg-white/10 hover:text-white"
            >
            <IconClose width={14} height={14} />
            </button>
        </div>
        {children}
        </div>
    )
}
import { TITLES } from '../../data/desktop/desktopData'

export default function Taskbar({ order, topId, onSelect, openLabel }) {
    return (
        <div className="absolute left-0 right-0 bottom-0 h-8 bg-[#161616] border-t border-[#393939] flex items-center gap-1.5 px-2.5 z-[60]">
        <div className="flex gap-1 flex-none">
            {order.map((id) => {
            const active = id === topId
            return (
                <button
                key={id}
                onClick={() => onSelect(id)}
                className="h-[22px] px-2.5 text-[11px] border"
                style={{ background: active ? '#393939' : 'transparent', borderColor: '#525252', color: active ? '#fff' : '#c6c6c6' }}
                >
                {TITLES[id] || id}
                </button>
            )
            })}
        </div>
        <span className="flex-1" />
        <span className="font-mono text-[11px] text-[#8d8d8d]">{openLabel}</span>
        </div>
    )
}
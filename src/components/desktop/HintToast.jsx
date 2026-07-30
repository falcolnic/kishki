import { IconAgent, IconClose } from './Icons'

export default function HintToast({ text, onDismiss, onOpen }) {
    if (!text) return null

    return (
        <div className="absolute right-5 bottom-12 w-[308px] bg-[#3b3145] border border-[#6f4fa8] border-l-[3px] shadow-[0_2px_6px_0_rgba(0,0,0,0.4)] z-[55] p-3.5">
        <div className="flex items-center justify-between gap-2.5 mb-1.5">
            <span className="flex items-center gap-2 text-[11px] tracking-widest text-[#d4bbff]">
            <IconAgent width={14} height={14} style={{ filter: 'invert(1)' }} />
            М.А.К.С
            </span>
            <button onClick={onDismiss} className="w-[22px] h-[22px] flex items-center justify-center text-[#c6c6c6] hover:bg-white/10 hover:text-white">
            <IconClose width={12} height={12} />
            </button>
        </div>
        <p className="m-0 mb-3 text-[13px] leading-[1.55] text-[#f4f4f4]" style={{ textWrap: 'pretty' }}>
            {text}
        </p>
        <div className="flex gap-2">
            <button onClick={onOpen} className="bg-[#a56eff] text-[#161616] border-0 text-xs font-semibold py-1.5 px-3 cursor-pointer hover:bg-[#b98cff]">
            Ответить
            </button>
            <button onClick={onDismiss} className="bg-transparent text-[#c6c6c6] border border-[#6f6f6f] text-xs py-1.5 px-3 cursor-pointer hover:border-white hover:text-white">
            Позже
            </button>
        </div>
        </div>
    )
}
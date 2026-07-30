import { IconArchive } from './Icons'

export default function ArchiveWindow({ files, onOpenDoc }) {
  return (
        <div className="max-h-[52vh] overflow-auto">
        <div className="grid grid-cols-[minmax(0,1fr)_96px_92px] gap-3 px-4 py-2 bg-[#2f2f2f] border-b border-[#525252] text-[11px] font-semibold text-[#c6c6c6] tracking-wide">
            <span>Имя</span>
            <span>Период</span>
            <span>Размер</span>
        </div>
        {files.map((f) => (
            <button
            key={f.id}
            onClick={() => onOpenDoc(f.id)}
            className="w-full grid grid-cols-[minmax(0,1fr)_96px_92px] gap-3 items-center text-left px-4 py-[11px] border-0 border-b border-[#464646] cursor-pointer hover:bg-white/10"
            >
            <span className="flex items-center gap-2.5 min-w-0">
                <IconArchive width={16} height={16} style={{ filter: 'invert(1)' }} />
                <span className="text-[13px] text-[#f4f4f4] truncate">{f.name}</span>
            </span>
            <span className="font-mono text-xs text-[#c6c6c6]">{f.period}</span>
            <span className="font-mono text-xs text-[#c6c6c6]">{f.size}</span>
            </button>
        ))}
        </div>
    )
}
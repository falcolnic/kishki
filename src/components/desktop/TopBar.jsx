import VolumeControl from '../shared/VolumeControl'

export default function TopBar({ clock, volume, onVolumeChange, onOpenMessages, onOpenAgent, onOpenArchive }) {
    return (
        <header className="absolute top-0 left-0 right-0 h-12 bg-[#161616] text-[#f4f4f4] flex items-center justify-between z-[60]">
            <div className="flex items-center h-12">
            <div className="flex items-center gap-2.5 px-4 h-12 border-r border-[#393939]">
            <span className="w-3.5 h-3.5 border border-[#f4f4f4] rotate-45 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#f4f4f4]" />
            </span>
            <span className="text-sm font-semibold tracking-wide">sasaOS</span>
            <span className="text-xs text-[#8d8d8d]">Кишки</span>
            </div>

            <button onClick={onOpenMessages} className="h-12 px-4 bg-transparent border-0 text-[#c6c6c6] text-sm cursor-pointer hover:bg-[#353535] hover:text-white">
            Сообщения
            </button>
            <button onClick={onOpenAgent} className="h-12 px-4 bg-transparent border-0 text-[#c6c6c6] text-sm cursor-pointer hover:bg-[#353535] hover:text-white">
            Агент
            </button>
            <button onClick={onOpenArchive} className="h-12 px-4 bg-transparent border-0 text-[#c6c6c6] text-sm cursor-pointer hover:bg-[#353535] hover:text-white">
            Архив
            </button>
        </div>

        <div className="flex items-center h-12">
            <span className="flex items-center gap-1.5 px-3.5 h-12 border-l border-[#393939]">
            <span className="w-1.5 h-1.5 bg-[#a56eff]" />
            <span className="text-xs text-[#c6c6c6]">М.А.К.С · онлайн</span>
            </span>
            <span className="px-3.5 font-mono text-xs text-[#c6c6c6] tabular-nums border-l border-[#393939]">
            {clock}
            </span>
        <div className="h-12 border-l border-[#393939] flex items-center">
            <VolumeControl
                volume={volume}
                onChange={onVolumeChange}
                accent="#c6c6c6"
                panelBg="#262626"
                panelBorder="#393939"
                dim="#8d8d8d"
                accentTrack="#0f62fe"
            />
            </div>

            <div className="flex items-center gap-2 px-4 h-12 border-l border-[#393939]">
            <span className="w-6 h-6 bg-[#0f62fe] text-white flex items-center justify-center text-[11px] font-semibold">
                ГО
            </span>
            <span className="text-[13px] text-[#e0e0e0]">Глеб Орлов</span>
            </div>
        </div>
        </header>
    )
}
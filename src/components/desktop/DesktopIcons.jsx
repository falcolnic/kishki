import { IconAgent, IconMessages, IconArchive, IconGallery, IconTimeline, IconRoster, IconTerminal } from './Icons'

const ICONS = [
  { id: 'agent', label: 'М.А.К.С', bg: '#a56eff', Icon: IconAgent, badgeKey: 'agentUnread' },
  { id: 'msg', label: 'Сообщения', bg: '#0f62fe', Icon: IconMessages, badgeKey: 'totalUnread' },
  { id: 'files', label: 'Архив', bg: '#3d3d3d', border: '#6f6f6f', Icon: IconArchive },
  { id: 'term', label: 'Терминал', bg: '#161616', border: '#6f6f6f', Icon: IconTerminal },
]

export default function DesktopIcons({ onOpen, agentUnread, totalUnread }) {
    const badges = { agentUnread, totalUnread }

    return (
        <div className="absolute top-[68px] left-5 w-[104px] flex flex-col gap-1.5 z-10">
        {ICONS.map(({ id, label, bg, border, Icon, badgeKey }) => {
            const badge = badgeKey ? badges[badgeKey] : 0
            return (
            <button
                key={id}
                onClick={() => onOpen(id)}
                className="flex flex-col items-center gap-2 py-3 px-1.5 bg-transparent border border-transparent text-[#f4f4f4] cursor-pointer hover:bg-white/[0.06] hover:border-[#8d8d8d]"
            >
                <span
                className="relative w-10 h-10 flex items-center justify-center"
                style={{ background: bg, border: border ? `1px solid ${border}` : undefined }}
                >
                <Icon width={22} height={22} style={{ filter: 'invert(1)' }} />
                {!!badge && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-[#fa4d56] text-[#161616] text-[10px] font-semibold flex items-center justify-center box-border">
                    {badge}
                    </span>
                )}
                </span>
                <span className="text-[11px] leading-tight text-center">{label}</span>
            </button>
            )
        })}
        </div>
    )
}
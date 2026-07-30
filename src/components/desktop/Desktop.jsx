import { useState, useEffect, useRef, useCallback } from 'react'
import { useWindowManager } from './useWindowManager'
import { useBlip } from './useBlip'
import { CONTACTS, THREADS, REPLIES, AGENT_START, AGENT_REPLIES, HINTS, FILES, TITLES } from '../../data/desktop/desktopData'
import Window from './Window'
import TopBar from './TopBar'
import DesktopIcons from './DesktopIcons'
import Taskbar from './Taskbar'
import HintToast from './HintToast'
import AgentWindow from './AgentWindow'
import MessagesWindow from './MessagesWindow'
import ArchiveWindow from './ArchiveWindow'
import DocWindow from './DocWindow'
import TerminalWindow from './TerminalWindow'
import { IconAgent, IconMessages, IconArchive, IconGallery, IconTimeline, IconRoster, IconTerminal } from './Icons'

const WINDOW_META = {
    agent: { title: 'КОМАР', icon: IconAgent, width: 520, accentBorder: '#6f4fa8', barBackground: '#3b3145' },
    msg: { title: 'Сообщения', icon: IconMessages, width: 720 },
    files: { title: 'Архив · /kishki', icon: IconArchive, width: 560 },
    doc: { title: null, icon: IconArchive, width: 600 },
    gallery: { title: 'Галерея · мемы и моменты', icon: IconGallery, width: 620 },
    timeline: { title: 'Хронология 2021—2024', icon: IconTimeline, width: 600 },
    roster: { title: 'Состав · 9 участников', icon: IconRoster, width: 640 },
    term: { title: 'operator@sasaos', icon: IconTerminal, width: 540, barBackground: '#262626' },
}

function now() {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Desktop({ autoOpen = true, hintInterval = 55, volume, onVolumeChange }) {
    const { windows, order, topId, show, hide, focus, moveWindow } = useWindowManager()

    const [clock, setClock] = useState(now())
    const blip = useBlip()

    const [activeContact, setActiveContact] = useState('squad')
    const [unread, setUnread] = useState({ squad: 3, spok: 2 })
    const [agentUnread, setAgentUnread] = useState(1)
    const [extraMessages, setExtraMessages] = useState({})
    const [agentMessages, setAgentMessages] = useState(AGENT_START)
    const [doc, setDoc] = useState(FILES[0])
    const [term, setTerm] = useState([
        { t: 'sasaOS 1.0.0-a · архив «Кишки»' },
        { t: 'Агент М.А.К.С подключён. Введите help.' },
    ])
    const [hint, setHint] = useState(null)
    const hintIdxRef = useRef(0)


    useEffect(() => {
        const id = setInterval(() => setClock(now()), 10000)
        return () => clearInterval(id)
    }, [])

    const openWindow = useCallback((id) => {
        show(id)
        blip(1000)
        if (id === 'agent') setAgentUnread(0)
    }, [show, blip])

    const closeWindow = useCallback((id) => {
        hide(id)
        blip(620)
    }, [hide, blip])

    useEffect(() => {
        if (!autoOpen) return
        const id = setTimeout(() => openWindow('agent'), 500)
        return () => clearTimeout(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const every = hintInterval * 1000
        const id = setInterval(() => {
        setHint((current) => {
            if (current) return current
            const next = HINTS[hintIdxRef.current % HINTS.length]
            hintIdxRef.current += 1
            blip(760)
            return next
        })
        }, every)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hintInterval])

    const thread = (id) => (THREADS[id] || []).concat(extraMessages[id] || [])

    const pickContact = (id) => {
        setActiveContact(id)
        setUnread((u) => {
        const next = { ...u }
        delete next[id]
        return next
        })
        blip(880)
    }

    const sendMessage = (text) => {
        const id = activeContact
        setExtraMessages((s) => ({ ...s, [id]: (s[id] || []).concat([{ t: text, time: now(), mine: true }]) }))
        blip(1400)
        setTimeout(() => {
        const reply = REPLIES[(Math.random() * REPLIES.length) | 0]
        setExtraMessages((s) => ({ ...s, [id]: (s[id] || []).concat([{ t: reply, time: now() }]) }))
        blip(760)
        }, 1100 + Math.random() * 900)
    }

    const agentSend = (text) => {
        setAgentMessages((s) => s.concat([{ t: text, time: now(), mine: true }]))
        blip(1400)
        setTimeout(() => {
        const reply = AGENT_REPLIES[(Math.random() * AGENT_REPLIES.length) | 0]
        setAgentMessages((s) => s.concat([{ t: reply, time: now() }]))
        blip(700)
        }, 1200 + Math.random() * 900)
    }

    const openDoc = (fileId) => {
        const f = FILES.find((x) => x.id === fileId)
        if (!f) return
        setDoc(f)
        openWindow('doc')
    }

    const runCommand = (raw) => {
        const cmd = raw.trim()
        const lines = []
        const out = (t) => lines.push({ t })
        out('operator@sasaos:~$ ' + cmd)
        const c = cmd.toLowerCase()
        if (cmd) {
        if (c === 'help') {
            out('help · ls · cat <файл> · whoami · agent <вопрос> · open <msg|agent|files|gallery|timeline|roster> · clear')
        } else if (c === 'ls') {
            FILES.forEach((f) => out('  ' + f.name.padEnd(22, ' ') + f.period))
        } else if (c === 'whoami') {
            out('operator · Глеб Орлов · sasavot · L2_СКВАДА')
        } else if (c === 'clear') {
            setTerm([])
            blip(1300)
            return
        } else if (c.startsWith('agent')) {
            out('[М.А.К.С] ' + AGENT_REPLIES[(Math.random() * AGENT_REPLIES.length) | 0])
        } else if (c.startsWith('cat')) {
            const q = cmd.slice(3).trim()
            const f = FILES.find((x) => x.name.toLowerCase().startsWith(q.toLowerCase())) || FILES.find((x) => String(x.id) === q)
            if (f) {
            out('— ' + f.title)
            f.paras.forEach((p) => out(p))
            } else {
            out('файл не найден: ' + q)
            }
        } else if (c.startsWith('open')) {
            const q = cmd.slice(4).trim()
            if (TITLES[q]) {
            openWindow(q)
            out('открыто: ' + TITLES[q])
            } else {
            out('нет приложения: ' + q)
            }
        } else {
            out('неизвестная команда: ' + cmd + ' — попробуй help')
        }
        }
        setTerm((s) => s.concat(lines))
        blip(1300)
    }

    const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0)
    const contacts = CONTACTS.map((c) => {
        const th = thread(c.id)
        const last = th[th.length - 1]
        const u = unread[c.id] || 0
        return { id: c.id, name: c.name, ini: c.ini, last: last ? last.t : '—', unread: u }
    })
    const activeContactMeta = CONTACTS.find((c) => c.id === activeContact) || CONTACTS[0]
    const openLabel = order.length ? `открыто окон: ${order.length}` : 'рабочий стол'

    const renderWindowContent = (id) => {
        switch (id) {
        case 'agent':
            return <AgentWindow messages={agentMessages.map((m) => ({ ...m, mine: !!m.mine }))} onSend={agentSend} />
        case 'msg':
            return (
            <MessagesWindow
                contacts={contacts}
                activeId={activeContact}
                onPickContact={pickContact}
                messages={thread(activeContact).map((m) => ({ ...m, mine: !!m.mine }))}
                activeName={activeContactMeta.name}
                activeIni={activeContactMeta.ini}
                activeMeta={activeContactMeta.meta}
                onSend={sendMessage}
            />
            )
        case 'files':
            return <ArchiveWindow files={FILES} onOpenDoc={openDoc} />
        case 'doc':
            return <DocWindow doc={doc} />
        case 'term':
            return <TerminalWindow lines={term.map((l) => l.t)} onCommand={runCommand} />
        default:
            return null
        }
    }

    return (
        <div className="fixed inset-0 bg-[#262626] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#2d2d2d 1px,transparent 1px),linear-gradient(90deg,#2d2d2d 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.03), transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.12) 51%)', backgroundSize: '100% 4px' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-[280px] h-[280px] opacity-[0.16]">
            <span className="absolute inset-0 border border-[#3d3d3d] rotate-45" />
            <span className="absolute inset-14 border border-[#3d3d3d] rotate-45" />
            <span className="absolute w-5 h-5 bg-[#3d3d3d] rotate-45" />
        </div>

        <TopBar
            clock={clock}
            volume={volume}
            onVolumeChange={onVolumeChange}
            onOpenMessages={() => openWindow('msg')}
            onOpenAgent={() => openWindow('agent')}
            onOpenArchive={() => openWindow('files')}
        />

        <DesktopIcons onOpen={openWindow} agentUnread={agentUnread} totalUnread={totalUnread} />

        {order.map((id) => {
            const win = windows[id]
            if (!win) return null
            const meta = WINDOW_META[id]
            const Icon = meta.icon
            const title = id === 'doc' ? doc?.name : meta.title
            return (
            <Window
                key={id}
                id={id}
                title={title}
                icon={<Icon width={16} height={16} style={{ filter: 'invert(1)' }} />}
                width={meta.width}
                x={win.x}
                y={win.y}
                z={win.z}
                accentBorder={meta.accentBorder}
                barBackground={meta.barBackground}
                onClose={closeWindow}
                onFocus={focus}
                onMove={moveWindow}
            >
                {renderWindowContent(id)}
            </Window>
            )
        })}

        <HintToast text={hint} onDismiss={() => setHint(null)} onOpen={() => { setHint(null); openWindow('agent') }} />

        <Taskbar order={order} topId={topId} onSelect={openWindow} openLabel={openLabel} />
        </div>
    )
}
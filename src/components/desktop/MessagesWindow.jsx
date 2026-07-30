import { useRef, useEffect } from 'react'
import { IconSend } from './Icons'

export default function MessagesWindow({ contacts, activeId, onPickContact, messages, activeName, activeIni, activeMeta, onSend }) {
    const threadRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
    }, [messages])

    const send = () => {
        const val = inputRef.current?.value.trim()
        if (!val) return
        inputRef.current.value = ''
        onSend(val)
    }

    return (
        <div className="grid grid-cols-[236px_minmax(0,1fr)] h-[clamp(220px,calc(100vh-210px),440px)] overflow-hidden">
        <div className="border-r border-[#525252] overflow-auto bg-[#2f2f2f]">
            {contacts.map((c) => {
            const active = c.id === activeId
            return (
                <button
                key={c.id}
                onClick={() => onPickContact(c.id)}
                className="w-full grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 text-left px-3 py-2.5 border-0 border-b border-[#464646] cursor-pointer hover:bg-white/10"
                style={{ background: active ? '#393939' : 'transparent', boxShadow: active ? 'inset 3px 0 0 0 #4589ff' : 'none' }}
                >
                <span className="w-8 h-8 flex items-center justify-center text-[11px] font-semibold" style={{ background: active ? '#f4f4f4' : '#6f6f6f', color: '#161616' }}>
                    {c.ini}
                </span>
                <span className="min-w-0 block text-left">
                    <span className="block text-[13px] font-semibold text-[#f4f4f4] truncate">{c.name}</span>
                    <span className="block text-[11px] text-[#a8a8a8] truncate">{c.last}</span>
                </span>
                {c.unread > 0 && (
                    <span className="min-w-[16px] h-4 px-1 bg-[#4589ff] text-[#161616] text-[10px] font-semibold flex items-center justify-center box-border">
                    {c.unread}
                    </span>
                )}
                </button>
            )
            })}
        </div>

        <div className="grid grid-rows-[auto_minmax(0,1fr)_auto] min-w-0 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#525252]">
            <span className="w-7 h-7 bg-[#161616] text-white flex items-center justify-center text-[10px] font-semibold">
                {activeIni}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">{activeName}</span>
                <span className="block font-mono text-[11px] text-[#a8a8a8]">{activeMeta}</span>
            </span>
            </div>

            <div ref={threadRef} className="min-h-0 overflow-auto p-4 flex flex-col gap-2.5">
            {messages.map((m, i) =>
                m.mine ? (
                <div key={i} className="flex justify-end">
                    <div className="max-w-[78%] bg-[#0f62fe] px-3 py-2.5">
                    <p className="m-0 text-[13px] leading-[1.5] text-white" style={{ textWrap: 'pretty' }}>{m.text}</p>
                    <p className="mt-1 mb-0 font-mono text-[10px] text-[#d0e2ff]">{m.time}</p>
                    </div>
                </div>
                ) : (
                <div key={i} className="flex justify-start">
                    <div className="max-w-[78%] bg-[#4c4c4c] border border-[#5e5e5e] px-3 py-2.5">
                    <p className="m-0 text-[13px] leading-[1.5] text-[#f4f4f4]" style={{ textWrap: 'pretty' }}>{m.text}</p>
                    <p className="mt-1 mb-0 font-mono text-[10px] text-[#a8a8a8]">{m.time}</p>
                    </div>
                </div>
                )
            )}
            </div>

            <div className="flex items-stretch border-t border-[#525252]">
            <input
                ref={inputRef}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Написать сообщение"
                className="flex-1 min-w-0 border-0 border-b border-[#8d8d8d] bg-[#2f2f2f] px-4 h-11 text-[13px] text-[#f4f4f4] outline-none"
            />
            <button onClick={send} className="w-[52px] bg-[#0f62fe] border-0 cursor-pointer flex items-center justify-center hover:bg-[#0353e9]">
                <IconSend width={16} height={16} style={{ filter: 'invert(1)' }} />
            </button>
            </div>
        </div>
        </div>
    )
}
import { useRef, useEffect } from 'react'
import { IconSend } from './Icons'

export default function AgentWindow({ messages, onSend }) {
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
        <div className="grid grid-rows-[auto_minmax(0,1fr)_auto] h-[clamp(220px,calc(100vh-210px),420px)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#525252] bg-[#332b3c]">
            <p className="m-0 text-xs leading-relaxed text-[#d4bbff]">
            Модель обучена на 4 года переписок, стримов и голосовых. Отвечает как Максим. Это не он.
            </p>
        </div>

        <div ref={threadRef} className="min-h-0 overflow-auto p-4 flex flex-col gap-2.5">
            {messages.map((m, i) =>
            m.mine ? (
                <div key={i} className="flex justify-end">
                <div className="max-w-[80%] bg-[#0f62fe] px-3 py-2.5">
                    <p className="m-0 text-[13px] leading-[1.55] text-white" style={{ textWrap: 'pretty' }}>{m.text}</p>
                    <p className="mt-1 mb-0 font-mono text-[10px] text-[#d0e2ff]">{m.time}</p>
                </div>
                </div>
            ) : (
                <div key={i} className="flex justify-start">
                <div className="max-w-[80%] bg-[#3b3145] border-l-2 border-[#a56eff] px-3 py-2.5">
                    <p className="m-0 text-[13px] leading-[1.55] text-[#f4f4f4]" style={{ textWrap: 'pretty' }}>{m.text}</p>
                    <p className="mt-1 mb-0 font-mono text-[10px] text-[#c9a9ff]">{m.time === '00:00' ? 'сессия' : m.time}</p>
                </div>
                </div>
            )
            )}
        </div>

        <div className="flex items-stretch border-t border-[#525252]">
            <input
            ref={inputRef}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Спросить М.А.К.С"
            className="flex-1 min-w-0 border-0 border-b border-[#a56eff] bg-[#2f2f2f] px-4 h-11 text-[13px] text-[#f4f4f4] outline-none"
            />
            <button onClick={send} className="w-[52px] bg-[#a56eff] border-0 cursor-pointer flex items-center justify-center hover:bg-[#b98cff]">
            <IconSend width={16} height={16} />
            </button>
        </div>
        </div>
    )
}
import { useRef, useEffect } from 'react'

export default function TerminalWindow({ lines, onCommand }) {
    const outRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
    }, [lines])

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        const val = e.currentTarget.value
        e.currentTarget.value = ''
        onCommand(val)
    }

    return (
        <div className="px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-[#c6c6c6]">
        <div ref={outRef} className="max-h-[200px] overflow-auto">
            {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap text-[#c6c6c6]">{l}</div>
            ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-[#78a9ff]">operator@sasaos:~$</span>
            <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="help"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[#f4f4f4] font-mono text-[12.5px]"
            />
        </div>
        </div>
    )
}
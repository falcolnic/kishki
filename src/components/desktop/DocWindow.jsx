export default function DocWindow({ doc }) {
    if (!doc) return null
    return (
        <div className="px-7 py-6 max-h-[52vh] overflow-auto">
        <p className="m-0 mb-1 font-mono text-[11px] text-[#a8a8a8] tracking-wide">{doc.period2}</p>
        <h2 className="m-0 mb-4 text-xl font-normal leading-tight">{doc.title}</h2>
        {doc.paras.map((p, i) => (
            <p key={i} className="m-0 mb-3.5 text-sm leading-[1.55] text-[#d8d8d8]" style={{ textWrap: 'pretty' }}>
            {p}
            </p>
        ))}
        </div>
    )
}
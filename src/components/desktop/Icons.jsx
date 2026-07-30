const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconAgent(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V8a5 5 0 0 0-5-5Z" />
      <path d="M8 13v1a4 4 0 0 0 8 0v-1" />
      <path d="M12 19v2" />
      <path d="M9 21h6" />
    </svg>
  )
}

export function IconMessages(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a8 8 0 1 1-3.4-6.5" />
      <path d="M21 4v5h-5" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  )
}

export function IconArchive(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="4" rx="0.5" />
      <path d="M5 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </svg>
  )
}

export function IconGallery(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="0.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5L3 20" />
    </svg>
  )
}

export function IconTimeline(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h10M4 18h13" />
      <circle cx="20" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconRoster(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      <path d="M16 4.5a3 3 0 0 1 0 5.8" />
      <path d="M18.5 14.3c2.6.6 4.5 2.8 4.5 5.7" />
    </svg>
  )
}

export function IconTerminal(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="0.5" />
      <path d="M7 9l3 3-3 3" />
      <path d="M13 15h4" />
    </svg>
  )
}

export function IconSend(props) {
  return (
    <svg {...base} {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
export function IconVolumeHigh(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h4l5 5V4L8 9H4Z" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M18.5 6a8 8 0 0 1 0 12" />
    </svg>
  )
}

export function IconVolumeLow(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h4l5 5V4L8 9H4Z" />
      <path d="M16 9.5a3 3 0 0 1 0 5" />
    </svg>
  )
}

export function IconVolumeMute(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6h4l5 5V4L8 9H4Z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  )
}
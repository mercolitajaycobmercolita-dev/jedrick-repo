const iconPaths = {
  arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  github: <path d="M8 19c-4 1.2-4-2-5.6-2.4M13.6 21v-3.1c0-.9.3-1.7.8-2.3-2.7-.3-5.6-1.3-5.6-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.6 5.9.5.4.8 1.2.8 2.3V21" />,
  mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  linkedin: <><path d="M6.5 9.5v8M6.5 6.5v.1M10.5 17.5v-4.3c0-1.8 1-3 2.8-3 1.7 0 2.7 1.1 2.7 3v4.3M10.5 12.3c.5-1.3 1.5-2.1 3-2.1" /><rect x="4" y="4" width="16" height="16" rx="2" /></>,
  facebook: <><path d="M14 20v-7h2.5l.5-3H14V8.5c0-.9.3-1.5 1.6-1.5H17V4.3c-.6-.1-1.3-.2-2.1-.2-2.2 0-3.7 1.3-3.7 3.8V10H8.8v3h2.4v7" /><rect x="4" y="4" width="16" height="16" rx="2" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.3" /><path d="M17.2 6.9h.01" /></>,
  tiktok: <path d="M14 4v10.1a3.5 3.5 0 1 1-3-3.5M14 4c.8 2.3 2.3 3.5 4.5 3.7" />,
  copy: <><rect x="8" y="8" width="10" height="10" rx="1" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  check: <path d="m5 12 4.2 4L19 6.5" />,
  code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />,
  sparkle: <path d="m12 3 1.1 5.2L18 10l-4.9 1.8L12 17l-1.1-5.2L6 10l4.9-1.8L12 3ZM5 16l.5 2.5L8 19l-2.5.5L5 22l-.5-2.5L2 19l2.5-.5L5 16ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z" />,
  hash: <path d="M9 3 7 21M17 3l-2 18M4 9h16M3 15h16" />,
}

export function Icon({ name, size = 20, strokeWidth = 1.7, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`.trim()}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {iconPaths[name] ?? iconPaths.arrow}
    </svg>
  )
}

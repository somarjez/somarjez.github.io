export default function TerminalWindow({ title = '~', className = '', children }) {
  return (
    <div className={`term-window overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-panel-2/60 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#f7768e]" />
        <span className="h-3 w-3 rounded-full bg-[#e0af68]" />
        <span className="h-3 w-3 rounded-full bg-[#9ece6a]" />
        <span className="ml-3 font-mono text-xs text-slate-500">{title}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-7 sm:p-6">{children}</div>
    </div>
  )
}

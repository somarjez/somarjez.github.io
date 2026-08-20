export default function CredentialCard({ credential, onOpen }) {
  const { title, issuer, issued, badge, certificatePreview, skills } = credential
  const shownSkills = skills.slice(0, 2)
  const extraSkills = skills.length - shownSkills.length

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`View ${title} credential details`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-panel text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
    >
      <div className="relative flex h-28 items-center justify-center overflow-hidden border-b border-line bg-panel-2">
        {badge ? (
          <img src={badge} alt="" className="h-20 w-20 object-contain p-1" loading="lazy" decoding="async" />
        ) : (
          <img src={certificatePreview} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        )}
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 font-mono text-[11px] font-semibold opacity-0 transition-all duration-200 group-hover:bg-slate-950/50 group-hover:opacity-100 group-hover:backdrop-blur-[1px]">
          <span className="rounded-md border border-white/20 bg-white/95 px-2 py-1 text-slate-900 shadow-sm">View certificate</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-foreground">{title}</h3>
        <p className="truncate font-mono text-[11px] text-primary">
          {issuer}
          {issued && <span className="text-subtle"> · {issued}</span>}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {shownSkills.map((skill) => (
            <span key={skill} className="rounded border border-line bg-primary/5 px-1.5 py-0.5 font-mono text-[10px] text-accent">
              {skill}
            </span>
          ))}
          {extraSkills > 0 && <span className="self-center font-mono text-[10px] text-subtle">+{extraSkills}</span>}
        </div>
      </div>
    </button>
  )
}

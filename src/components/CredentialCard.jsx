export default function CredentialCard({ credential, onOpen }) {
  const { title, issuer, issued, badge, icon, skills } = credential
  const shownSkills = skills.slice(0, 2)
  const extraSkills = skills.length - shownSkills.length

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`View ${title} credential details`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-panel text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        aria-hidden="true"
      />
      <div className="flex h-24 items-center justify-center border-b border-line bg-panel-2 p-4">
        {badge ? (
          <img src={badge} alt="" className="h-14 w-14 object-contain" loading="lazy" decoding="async" />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <i className={`fas ${icon}`} aria-hidden="true" />
          </span>
        )}
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

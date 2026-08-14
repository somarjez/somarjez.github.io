export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-muted transition-colors hover:border-primary/60 hover:text-primary"
    >
      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
    </button>
  )
}

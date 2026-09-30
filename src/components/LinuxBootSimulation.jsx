import { useEffect, useReducer, useRef } from 'react'

const PHASES = ['post', 'grub', 'kernel', 'systemd', 'login']

const PHASE_DURATION = {
  post: 1400,
  grub: 2200,
  kernel: 1200,
  systemd: 6500,
}

const SYSTEMD_LOGS = [
  'Reached target Local File Systems.',
  'Mounted Temporary Directory /tmp.',
  'Started Journal Service.',
  'Started Rule-based Manager for Device Events and Files.',
  'Reached target Network.',
  'Started Network Name Resolution.',
  'Started User Login Management.',
  'Started Authorization Manager.',
  'Started Display Manager.',
  'Reached target Graphical Interface.',
]

function reducer(state, action) {
  if (action.type === 'advance') {
    const next = PHASES[Math.min(PHASES.indexOf(state.phase) + 1, PHASES.length - 1)]
    return {
      ...state,
      phase: next,
      grubSeconds: next === 'grub' ? 2 : state.grubSeconds,
      logCount: next === 'systemd' ? 1 : state.logCount,
    }
  }
  if (action.type === 'show-log') {
    return { ...state, logCount: Math.min(state.logCount + 1, SYSTEMD_LOGS.length) }
  }
  if (action.type === 'tick-grub') {
    return { ...state, grubSeconds: Math.max(0, state.grubSeconds - 1) }
  }
  if (action.type === 'skip') return { ...state, phase: 'login' }
  if (action.type === 'login') return { ...state, phase: 'desktop' }
  if (action.type === 'restart') {
    return { ...state, phase: state.reduceMotion ? 'login' : 'post', grubSeconds: 2, logCount: 0 }
  }
  if (action.type === 'reset') {
    return {
      phase: action.reduceMotion ? 'login' : 'post',
      grubSeconds: 2,
      logCount: 0,
      reduceMotion: action.reduceMotion,
    }
  }
  return state
}

function PostScreen() {
  return (
    <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
      <h2 className="sr-only">Power-on self-test</h2>
      <p className="text-base font-semibold text-slate-100 sm:text-lg">JEZ Unified Firmware v2.6</p>
      <p>Copyright (C) 2026 Jez Systems</p>
      <div className="pt-4">
        <p>CPU: 8-core virtual processor ........ detected</p>
        <p>Memory test: 16384 MB .................. OK</p>
        <p>NVMe controller 00:04.0 ............... ready</p>
        <p>USB keyboard ........................... attached</p>
      </div>
      <p className="animate-pulse pt-5 text-cyan-300">Power-on self-test complete</p>
    </div>
  )
}

function GrubScreen({ grubSeconds }) {
  return (
    <div className="mx-auto w-full max-w-3xl border-2 border-slate-300 bg-black p-3 font-mono text-sm text-slate-100 sm:p-6">
      <h2 className="mb-5 text-center text-base font-bold sm:text-lg">GNU GRUB version 2.12</h2>
      <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-950">Jez_OS Linux 6.8.0</div>
      <div className="px-3 py-2">Advanced options for Jez_OS</div>
      <p className="mt-8 text-xs leading-relaxed text-slate-300">
        Booting selected entry in {grubSeconds} {grubSeconds === 1 ? 'second' : 'seconds'}. Press Enter to boot now.
      </p>
    </div>
  )
}

function KernelScreen() {
  return (
    <div className="font-mono text-xs leading-6 text-slate-300 sm:text-sm">
      <h2 className="sr-only">Loading Linux kernel</h2>
      <p>Loading Linux 6.8.0-jez ...</p>
      <p>Loading initial ramdisk ...</p>
      <p className="mt-2 text-slate-500">[    0.000000] Linux version 6.8.0-jez (build@jez-os)</p>
      <p className="text-slate-500">[    0.142813] Initializing cgroup subsys cpuset</p>
      <p className="text-slate-500">[    0.391204] Mounted root filesystem read-only</p>
    </div>
  )
}

function SystemdScreen({ logCount }) {
  const endRef = useRef(null)

  useEffect(() => {
    if (logCount > 1) endRef.current?.scrollIntoView({ block: 'end' })
  }, [logCount])

  return (
    <div className="font-mono text-xs leading-6 text-slate-300 sm:text-sm">
      <h2 className="mb-4 font-sans text-lg font-semibold text-slate-100">Starting system services</h2>
      <ol aria-label="System startup log" aria-live="off">
        {SYSTEMD_LOGS.slice(0, logCount).map((line) => (
          <li key={line} className="flex min-w-0 gap-2">
            <span className="shrink-0 text-emerald-400">[  OK  ]</span>
            <span className="min-w-0 break-words">{line}</span>
          </li>
        ))}
      </ol>
      <span ref={endRef} aria-hidden="true" />
    </div>
  )
}

function LoginScreen({ onLogin }) {
  return (
    <div className="grid min-h-[30rem] place-items-center text-center">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-3xl text-cyan-200">
          <i className="fas fa-terminal" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold text-white">Welcome to Jez_OS</h2>
        <p className="mt-2 text-sm text-slate-300">Boot complete. Select the profile to continue.</p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-7 inline-flex items-center gap-3 rounded-xl border border-cyan-300/40 bg-slate-900/80 px-6 py-3 text-left transition-colors hover:border-cyan-300 hover:bg-slate-800"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan-300/15 text-cyan-200">
            <i className="fas fa-user" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-semibold text-white">Jezreel</span>
            <span className="block text-xs text-slate-400">Sign in as Jezreel</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function DesktopScreen({ onRestart, onExit }) {
  return (
    <div className="relative min-h-[30rem] overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900 shadow-2xl">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 font-mono text-xs text-slate-300">
        <span>Jez_OS</span>
        <span>Workspace 1</span>
      </div>
      <div className="grid min-h-[27.5rem] place-items-center p-5">
        <section className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-600 bg-slate-950/90 shadow-2xl">
          <div className="border-b border-slate-700 px-5 py-3 font-mono text-xs text-slate-400">welcome@jez-os: ~</div>
          <div className="p-6 sm:p-8">
            <p className="font-mono text-sm text-emerald-400">systemctl status graphical.target</p>
            <h2 className="mt-4 font-display text-2xl font-bold text-white">Startup complete</h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              Jez_OS reached the graphical interface successfully. The simulated workstation is ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRestart}
                className="rounded-lg bg-cyan-300 px-4 py-2 font-mono text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              >
                Restart Jez_OS
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-lg border border-slate-600 px-4 py-2 font-mono text-sm text-slate-200 hover:border-cyan-300 hover:text-white"
              >
                Exit simulation
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

const PHASE_SCREEN = {
  post: PostScreen,
  grub: GrubScreen,
  kernel: KernelScreen,
  systemd: SystemdScreen,
  login: LoginScreen,
  desktop: DesktopScreen,
}

const PHASE_LABEL = {
  post: 'Power-on self-test',
  grub: 'GRUB bootloader',
  kernel: 'Linux kernel',
  systemd: 'System services',
  login: 'Graphical login',
  desktop: 'Jez_OS desktop',
}

export default function LinuxBootSimulation({ open, onClose }) {
  const reduceMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [state, dispatch] = useReducer(reducer, reduceMotion, (reduce) => ({
    phase: reduce ? 'login' : 'post',
    grubSeconds: 2,
    logCount: 0,
    reduceMotion: reduce,
  }))
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const Screen = PHASE_SCREEN[state.phase]

  useEffect(() => {
    if (open) dispatch({ type: 'reset', reduceMotion })
  }, [open, reduceMotion])

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) || [])
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const focusIsOutside = !dialogRef.current?.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open || !PHASE_DURATION[state.phase]) return undefined
    const timer = window.setTimeout(() => dispatch({ type: 'advance' }), PHASE_DURATION[state.phase])
    const logTimer = state.phase === 'systemd'
      ? window.setInterval(() => dispatch({ type: 'show-log' }), 450)
      : null
    const grubTimer = state.phase === 'grub'
      ? window.setInterval(() => dispatch({ type: 'tick-grub' }), 1000)
      : null
    return () => {
      window.clearTimeout(timer)
      if (logTimer) window.clearInterval(logTimer)
      if (grubTimer) window.clearInterval(grubTimer)
    }
  }, [open, state.phase])

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Jez_OS Linux boot simulation"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (state.phase === 'grub' && event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
          event.preventDefault()
          dispatch({ type: 'advance' })
        }
      }}
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-slate-950 text-slate-100"
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 font-mono text-xs sm:text-sm">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="truncate text-slate-200">Jez_OS Linux · boot simulation</span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close boot simulation"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-600 text-slate-300 transition-colors hover:border-cyan-300 hover:text-white"
        >
          <i className="fas fa-xmark" aria-hidden="true" />
        </button>
      </header>
      <p role="status" aria-live="polite" className="sr-only">
        Boot phase: {PHASE_LABEL[state.phase]}
      </p>
      <main className="min-h-0 flex-1 overflow-auto p-5 sm:p-8 lg:p-12">
        <div className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center">
          <div className="w-full">
            <Screen
              logCount={state.logCount}
              grubSeconds={state.grubSeconds}
              onLogin={() => dispatch({ type: 'login' })}
              onRestart={() => dispatch({ type: 'restart' })}
              onExit={onClose}
            />
          </div>
        </div>
      </main>
      {PHASE_DURATION[state.phase] && (
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/90 px-4 py-3 font-mono text-[11px] text-slate-500 sm:px-6 sm:text-xs">
          <span>Simulated environment · no system access</span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'skip' })}
            className="shrink-0 rounded-md border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:border-cyan-300 hover:text-white"
          >
            Skip to login
          </button>
        </footer>
      )}
    </div>
  )
}

import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LinuxBootSimulation from '../LinuxBootSimulation.jsx'

function setReducedMotion(matches) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

describe('LinuxBootSimulation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setReducedMotion(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    document.body.style.overflow = ''
  })

  it('progresses from POST to login in the declared boot order', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /power-on self-test/i })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1400))
    expect(screen.getByRole('heading', { name: /gnu grub/i })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2200))
    expect(screen.getByRole('heading', { name: /loading linux kernel/i })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1200))
    expect(screen.getByRole('heading', { name: /starting system services/i })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(6500))
    expect(screen.getByRole('heading', { name: /welcome to jez_os/i })).toBeInTheDocument()
  })

  it('streams additional systemd service results while services start', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    act(() => vi.advanceTimersByTime(1400))
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(1200))
    expect(screen.getByRole('dialog')).toHaveTextContent(/reached target local file systems/i)
    expect(screen.getByRole('dialog')).not.toHaveTextContent(/mounted temporary directory/i)

    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByRole('dialog')).toHaveTextContent(/mounted temporary directory/i)
  })

  it('lets visitors skip to login and enter the focused desktop', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /skip to login/i }))
    expect(screen.getByRole('heading', { name: /welcome to jez_os/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /sign in as jezreel/i }))
    expect(screen.getByRole('heading', { name: /startup complete/i })).toBeInTheDocument()
  })

  it('boots the selected GRUB entry when Enter is pressed', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    act(() => vi.advanceTimersByTime(1400))
    const selectedEntry = screen.getByRole('button', { name: /jez_os linux 6\.8\.0/i })
    expect(selectedEntry).toHaveFocus()
    fireEvent.keyDown(document.activeElement, { key: 'Enter' })

    expect(screen.getByRole('heading', { name: /loading linux kernel/i })).toBeInTheDocument()
  })

  it('restarts the simulation and exits from the desktop controls', () => {
    const onClose = vi.fn()
    render(<LinuxBootSimulation open onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: /skip to login/i }))
    fireEvent.click(screen.getByRole('button', { name: /sign in as jezreel/i }))
    fireEvent.click(screen.getByRole('button', { name: /restart jez_os/i }))
    expect(screen.getByRole('heading', { name: /power-on self-test/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /skip to login/i }))
    fireEvent.click(screen.getByRole('button', { name: /sign in as jezreel/i }))
    fireEvent.click(screen.getByRole('button', { name: /exit simulation/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('opens directly at login when reduced motion is preferred', () => {
    setReducedMotion(true)

    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /welcome to jez_os/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /skip to login/i })).toBeNull()
  })

  it('starts a clean boot whenever the dialog is reopened', () => {
    const { rerender } = render(<LinuxBootSimulation open onClose={vi.fn()} />)
    act(() => vi.advanceTimersByTime(1400))
    expect(screen.getByRole('heading', { name: /gnu grub/i })).toBeInTheDocument()

    rerender(<LinuxBootSimulation open={false} onClose={vi.fn()} />)
    rerender(<LinuxBootSimulation open onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /power-on self-test/i })).toBeInTheDocument()
  })

  it('keeps keyboard focus inside the open simulation', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)
    const close = screen.getByRole('button', { name: /close boot simulation/i })
    const skip = screen.getByRole('button', { name: /skip to login/i })
    expect(close).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(skip).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(close).toHaveFocus()
  })

  it('announces phase changes without making the service log live', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Boot phase: Power-on self-test')

    act(() => vi.advanceTimersByTime(1400))
    expect(screen.getByRole('status')).toHaveTextContent('Boot phase: GRUB bootloader')

    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(1200))
    expect(screen.getByRole('status')).toHaveTextContent('Boot phase: System services')
    expect(screen.getByRole('list', { name: /system startup log/i })).toHaveAttribute('aria-live', 'off')
  })

  it('shows the GRUB autoboot countdown', () => {
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    act(() => vi.advanceTimersByTime(1400))
    expect(screen.getByText(/booting selected entry in 2 seconds/i)).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText(/booting selected entry in 1 second/i)).toBeInTheDocument()
  })

  it('keeps the newest systemd result in view', () => {
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView')
    render(<LinuxBootSimulation open onClose={vi.fn()} />)

    act(() => vi.advanceTimersByTime(1400))
    act(() => vi.advanceTimersByTime(2200))
    act(() => vi.advanceTimersByTime(1200))
    scrollSpy.mockClear()
    act(() => vi.advanceTimersByTime(500))

    expect(scrollSpy).toHaveBeenCalled()
  })
})

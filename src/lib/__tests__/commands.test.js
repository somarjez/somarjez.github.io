import { describe, expect, it, vi } from 'vitest'
import { buildCommands } from '../commands.js'

describe('buildCommands', () => {
  it('scrolls to the Leadership section from the command palette entry', () => {
    const target = document.createElement('section')
    target.id = 'leadership'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)

    const command = buildCommands({ links: {} }).find((item) => item.id === 'leadership')
    expect(command).toMatchObject({ label: 'Go to Leadership', hint: 'section' })

    command.run()
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import usePackage from './index'

const locationMock = {
  hostname: 'konghq.com',
  href: 'https://konghq.com/api/path',
  origin: 'https://konghq.com',
  pathname: '/api/path',
  search: '?testing=true',
}

describe('usePackage', () => {
  beforeEach(() => {
    const windowSpy = vi.spyOn(global, 'window', 'get')
    windowSpy.mockImplementation(() => ({
      // Ignore missing properties
      // @ts-ignore
      location: locationMock,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('placeholder test', () => {
    const { loadingPackage } = usePackage()

    expect(loadingPackage.value).toEqual(true)
  })
})

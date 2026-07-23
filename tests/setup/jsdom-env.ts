import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html lang="pl" data-variant="A" data-theme="light" data-glass="subtle"><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

Object.defineProperties(globalThis, {
  window: { configurable: true, value: dom.window },
  document: { configurable: true, value: dom.window.document },
  navigator: { configurable: true, value: dom.window.navigator },
  localStorage: { configurable: true, value: dom.window.localStorage },
  HTMLElement: { configurable: true, value: dom.window.HTMLElement },
  HTMLButtonElement: { configurable: true, value: dom.window.HTMLButtonElement },
  HTMLDetailsElement: { configurable: true, value: dom.window.HTMLDetailsElement },
  Node: { configurable: true, value: dom.window.Node },
  Event: { configurable: true, value: dom.window.Event },
  KeyboardEvent: { configurable: true, value: dom.window.KeyboardEvent },
  MouseEvent: { configurable: true, value: dom.window.MouseEvent },
  getComputedStyle: { configurable: true, value: dom.window.getComputedStyle.bind(dom.window) },
  IS_REACT_ACT_ENVIRONMENT: { configurable: true, writable: true, value: true },
  __APP_NAME__: { configurable: true, value: 'pilot-app' },
  __APP_VERSION__: { configurable: true, value: '0.0.0' },
})

Object.defineProperty(dom.window, 'matchMedia', {
  configurable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }),
})

import { bus } from '../core/EventBus';

/**
 * Full-screen overlay plumbing.
 *
 * Only one overlay is up at a time, and while one is up the game suspends
 * gameplay input and releases the pointer lock. That is handled by whoever
 * listens to `ui:open` / `ui:close`, so this module stays purely about the DOM.
 */

const root = (): HTMLElement => {
  const el = document.getElementById('overlay-root');
  if (!el) throw new Error('[overlay] #overlay-root is missing');
  return el;
};

let currentScreen: string | null = null;
let onEscape: (() => void) | null = null;

function handleKey(event: KeyboardEvent): void {
  if (event.key === 'Escape' && onEscape) {
    event.preventDefault();
    event.stopPropagation();
    onEscape();
  }
}

export interface OverlayHandle {
  /** The element to put content into. */
  body: HTMLElement;
  close(): void;
}

/** Mount a node as the current overlay. Replaces anything already shown. */
export function mountOverlay(screen: string, node: HTMLElement, opts: { onEscape?: () => void } = {}): OverlayHandle {
  const host = root();
  host.replaceChildren(node);
  host.hidden = false;
  currentScreen = screen;
  onEscape = opts.onEscape ?? null;
  window.addEventListener('keydown', handleKey, true);
  bus.emit('ui:open', { screen });

  return {
    body: node,
    close: () => closeOverlay(),
  };
}

export function closeOverlay(): void {
  const host = root();
  host.replaceChildren();
  host.hidden = true;
  window.removeEventListener('keydown', handleKey, true);
  onEscape = null;
  if (currentScreen) {
    bus.emit('ui:close', { screen: currentScreen });
    currentScreen = null;
  }
}

export function overlayOpen(): boolean {
  return currentScreen !== null;
}

export function currentOverlay(): string | null {
  return currentScreen;
}

// ------------------------------------------------------------------ builders

/** A standard panel: head, scrolling body, foot. */
export function buildPanel(opts: {
  title: string;
  subtitle?: string;
  width?: 'narrow' | 'normal' | 'wide';
  closable?: boolean;
  onClose?: () => void;
}): { panel: HTMLElement; body: HTMLElement; foot: HTMLElement } {
  const panel = el('div', 'panel');
  if (opts.width === 'narrow') panel.classList.add('narrow');
  if (opts.width === 'wide') panel.classList.add('wide');

  const head = el('header', 'panel-head');
  const titleWrap = el('div');
  const h2 = el('h2');
  h2.textContent = opts.title;
  titleWrap.appendChild(h2);
  if (opts.subtitle) {
    const sub = el('div', 'ph-sub');
    sub.textContent = opts.subtitle;
    titleWrap.appendChild(sub);
  }
  head.appendChild(titleWrap);

  if (opts.closable !== false) {
    const close = el('button', 'close-x') as HTMLButtonElement;
    close.type = 'button';
    close.textContent = '✕';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => (opts.onClose ? opts.onClose() : closeOverlay()));
    head.appendChild(close);
  }

  const body = el('div', 'panel-body');
  const foot = el('footer', 'panel-foot');

  panel.append(head, body, foot);
  return { panel, body, foot };
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function button(label: string, className = 'btn'): HTMLButtonElement {
  const b = el('button', className);
  b.type = 'button';
  b.textContent = label;
  return b;
}

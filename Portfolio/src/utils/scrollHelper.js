// Smooth scroll helper integrating Lenis with fallback
export function smoothScrollTo(target, offset = -70) {
  if (typeof window === 'undefined') return;

  let el = null;
  if (typeof target === 'string') {
    el = document.getElementById(target.replace(/^#/, ''));
  } else if (target instanceof HTMLElement) {
    el = target;
  }

  if (window.__lenis) {
    if (el) {
      window.__lenis.scrollTo(el, { offset, duration: 1.1 });
    } else if (typeof target === 'number') {
      window.__lenis.scrollTo(target, { duration: 1.1 });
    }
  } else {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }
}


import { useEffect, useState } from 'react';

export function parseRoute(hash: string): string[] {
  const path = hash.startsWith('#/') ? hash.slice(2) : '';
  return path.split('/').filter(Boolean);
}

export function getAnchorFromHash(hash: string): string | null {
  if (!hash || hash.startsWith('#/') || hash === '#') return null;
  return decodeURIComponent(hash.slice(1));
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}

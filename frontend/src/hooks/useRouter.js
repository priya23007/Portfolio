import { useEffect, useState } from 'react';

// Minimal path router: the site only has two routes ("/" and "/admin"),
// so a full router dependency isn't needed.
const ROUTE_EVENT = 'app:navigate';

export const navigate = (to) => {
  if (window.location.pathname === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(ROUTE_EVENT));
  window.scrollTo(0, 0);
};

export const usePathname = () => {
  const [pathname, setPathname] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/');

  useEffect(() => {
    const update = () => setPathname(window.location.pathname.replace(/\/+$/, '') || '/');
    window.addEventListener('popstate', update);
    window.addEventListener(ROUTE_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(ROUTE_EVENT, update);
    };
  }, []);

  return pathname;
};

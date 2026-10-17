import { onLinkClick } from '../router.js';

/** An in-app link: a real <a href>, routed in place on a plain click. */
export function Link({ to, children, onClick, ...rest }) {
  return (
    <a href={to} {...rest} onClick={(e) => { onClick?.(e); onLinkClick(e, to); }}>
      {children}
    </a>
  );
}

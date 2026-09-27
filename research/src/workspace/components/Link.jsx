// An in-app link: a real <a href> (so it can open in a new tab and reads as a link), navigating
// without a page reload on a plain click. An onClick given by the caller runs first. OWNER: workspace role.
import { linkHandler } from '../../router.js';

/** @param {{ to: string, replace?: boolean, className?: string, onClick?: (e: any) => void, children: any } & Record<string, any>} props */
export default function Link({ to, replace = false, className = '', onClick, children, ...rest }) {
  const go = linkHandler(to, { replace });
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
        go(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

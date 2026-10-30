import Link from "next/link";

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
  isAnchor?: boolean;
}

export function NavLink({ href, active, children, isAnchor }: NavLinkProps) {
  const cls = `group header-nav-link ${active ? "header-nav-link-active" : "header-nav-link-inactive"}`;
  const bar = (
    <span className={`header-nav-underline ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
  );
  return isAnchor
    ? <a href={href} className={cls}>{children}{bar}</a>
    : <Link href={href} className={cls}>{children}{bar}</Link>;
}

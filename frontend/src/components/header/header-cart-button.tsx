import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  href: string;
  active: boolean;
  count: number;
}

export function CartButton({ href, active, count }: CartButtonProps) {
  return (
    <a href={href} aria-label="Cart" className={`header-icon-btn ${active ? "header-cart-active" : ""}`}>
      <ShoppingCart className="h-[18px] w-[18px]" />
      {count > 0 && <span className="header-cart-badge" />}
    </a>
  );
}

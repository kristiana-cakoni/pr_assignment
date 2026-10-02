import { NavLink } from "react-router-dom";
import { Icon } from "./icons.tsx";
import type { IconName } from "./icons.tsx";

const NAV: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/products", label: "Products", icon: "box" },
  { to: "/orders", label: "Orders", icon: "cart" },
];

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <aside className={open ? "sidebar is-open" : "sidebar"}>
      <NavLink to="/" className="brand" onClick={onNavigate} end>
        <Icon name="grid" />
        <span>MarketOne</span>
      </NavLink>

      <nav className="side-nav" aria-label="Menyja">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            onClick={onNavigate}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

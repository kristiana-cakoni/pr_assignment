import { Link } from "react-router-dom";
import { Icon } from "./icons.tsx";
import { useAuth } from "../state/auth-context.tsx";
import { useOrder } from "../state/order-context.tsx";

export function TopBar({
  title,
  menuOpen,
  onMenu,
}: {
  title: string;
  menuOpen: boolean;
  onMenu: () => void;
}) {
  const { session, logout } = useAuth();
  const { itemCount } = useOrder();
  if (!session) return null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button menu-button"
          aria-label="Hap menunë"
          aria-expanded={menuOpen}
          onClick={onMenu}
        >
          <Icon name="menu" />
        </button>
        <h1>{title}</h1>
      </div>

      <div className="topbar-right">
        <Link to="/orders" className="order-link">
          <Icon name="cart" />
          <span>Porosia</span>
          <strong>{itemCount}</strong>
        </Link>
        <div className="user-pill">
          <span className="avatar" aria-hidden="true">
            {session.email.charAt(0).toUpperCase()}
          </span>
          <span className="user-email">{session.email}</span>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Dil
          </button>
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useOrder } from "../state/order-context.tsx";
import { OrderDock } from "./order-panel.tsx";
import { Sidebar } from "./sidebar.tsx";
import { TopBar } from "./topbar.tsx";

export function Shell() {
  const location = useLocation();
  const [menuPath, setMenuPath] = useState(location.pathname);
  const [open, setOpen] = useState(false);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setOpen(false);
  }
  const title = pageTitle(location.pathname);
  const showDock = location.pathname !== "/orders";
  const { notice, dismissNotice } = useOrder();

  useEffect(() => {
    document.title = `${title} · MarketOne`;
  }, [title]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(dismissNotice, 3600);
    return () => window.clearTimeout(timeoutId);
  }, [notice, dismissNotice]);

  return (
    <div className="shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      {open && (
        <button type="button" className="backdrop" aria-label="Mbyll menunë" onClick={() => setOpen(false)} />
      )}
      <div className="shell-main">
        <TopBar title={title} menuOpen={open} onMenu={() => setOpen(true)} />
        <main className={showDock ? "shell-content has-dock" : "shell-content"}>
          <Outlet />
        </main>
      </div>
      {showDock && <OrderDock />}
      {notice && (
        <div className={showDock ? "toast is-raised" : "toast"} role="status">
          <span>{notice}</span>
          <button type="button" className="btn btn-text" onClick={dismissNotice}>
            Mbyll
          </button>
        </div>
      )}
    </div>
  );
}

function pageTitle(pathname: string): string {
  if (pathname === "/products") return "Products";
  if (pathname === "/orders") return "Orders";
  return "Home";
}

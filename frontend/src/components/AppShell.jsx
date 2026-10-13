import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, Tags, Settings, LogOut, Wallet, Menu, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { label: "Reports", icon: BarChart3, soon: true },
  { label: "Categories", icon: Tags, soon: true },
  { label: "Settings", icon: Settings, soon: true },
];

export default function AppShell({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = (user?.name || "U")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={`shell${open ? " shell--open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar__top">
          <span className="brand">
            <span className="brand__mark"><Wallet size={17} /></span>
            PaisaTrack
          </span>
          <button className="icon-btn icon-btn--dark" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="nav">
          <p className="nav__label">Workspace</p>
          {NAV.map(({ to, label, icon: Icon, soon }) =>
            soon ? (
              <span key={label} className="nav__item nav__item--soon">
                <Icon size={17} />
                <span>{label}</span>
                <em>Soon</em>
              </span>
            ) : (
              <NavLink
                key={label}
                to={to}
                end
                className={({ isActive }) => `nav__item${isActive ? " is-active" : ""}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar__foot">
          <div className="userchip">
            <span className="avatar">{initials}</span>
            <span className="userchip__meta">
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </span>
          </div>
          <button className="btn btn--dark-ghost btn--block btn--sm" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <div className="shell__overlay" onClick={() => setOpen(false)} />

      <div className="shell__main">
        <header className="topbar">
          <button className="icon-btn topbar__menu" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <div className="topbar__titles">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="topbar__actions">{actions}</div>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}

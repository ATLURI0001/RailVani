import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Train, LogOut, Radio, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SERVICES } from "../utils/api";

export default function Header({ pages = [] }) {
  const { session, isAdmin, email, signOut } = useAuth();

  const visiblePages = pages.filter((page) => !page.admin || isAdmin);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Train size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                RailVani
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Indian Rail & Metro Announcement Portal
            </p>
          </div>
        </Link>

        {/* Primary Network Switcher */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {SERVICES.map((s) => (
            <NavLink
              key={s.path}
              to={`/${s.path}`}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <Radio size={12} className="animate-pulse" />
              <span>{s.short}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin Access Controls */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/70 border border-amber-500/50 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ADMIN ACTIVE</span>
              </span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-700 transition"
                title="Sign out of Admin Console"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-amber-400 px-2.5 py-1 rounded-lg border border-neutral-800 hover:border-amber-500/40 transition"
              title="Sign In to Admin Panel"
            >
              <Key size={13} />
              <span className="hidden sm:inline">Admin Access</span>
            </Link>
          )}
        </div>
      </div>

      {/* Secondary Service Sub-navigation */}
      {visiblePages.length > 0 && (
        <div className="bg-slate-900/70 border-t border-slate-800/80 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs font-medium overflow-x-auto">
            {visiblePages.map((page) => (
              <NavLink
                key={page.to}
                to={page.to}
                end={page.end}
                className={({ isActive }) =>
                  `whitespace-nowrap transition pb-0.5 ${
                    isActive
                      ? "text-blue-400 font-bold border-b-2 border-blue-500"
                      : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                {page.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

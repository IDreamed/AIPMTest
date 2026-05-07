import { createContext, useContext, useEffect, useState } from "react";
import { navItems, prototypeRoles } from "../data/mockData";

const PrototypeRoleContext = createContext(null);

export function usePrototypeRole() {
  const context = useContext(PrototypeRoleContext);
  if (!context) {
    throw new Error("usePrototypeRole must be used inside AppShell");
  }
  return context;
}

export function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const [roleKey, setRoleKey] = useState(() => window.localStorage.getItem("prototype-role") || "visitor");
  const [showNotes, setShowNotes] = useState(() => window.localStorage.getItem("prototype-notes") === "true");
  const hash = window.location.hash || "#/";
  const role = prototypeRoles.find((item) => item.key === roleKey) || prototypeRoles[0];

  useEffect(() => {
    window.localStorage.setItem("prototype-role", role.key);
  }, [role.key]);

  useEffect(() => {
    window.localStorage.setItem("prototype-notes", String(showNotes));
  }, [showNotes]);

  return (
    <PrototypeRoleContext.Provider value={{ role, roleKey: role.key, setRoleKey, roles: prototypeRoles, showNotes, setShowNotes }}>
      <div className="min-h-screen bg-wash">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[68px] w-[calc(100%_-_40px)] max-w-[1180px] flex-wrap items-center justify-between gap-4">
            <a href="#/" className="flex min-w-[210px] items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-ui bg-gradient-to-br from-blue-600 to-teal-700 font-bold text-white">职</span>
              <span>
                <strong className="block text-base">职教高考学习平台</strong>
                <span className="text-xs text-muted">学生端组件化原型</span>
              </span>
            </a>
            <nav className={`${open ? "flex" : "hidden"} order-3 w-full gap-1 overflow-x-auto md:order-none md:flex md:w-auto`}>
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`rounded-ui px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 ${
                    activeNav(hash, item.path) ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <select
                aria-label="原型登录状态"
                className="min-h-10 rounded-ui border border-line bg-white px-3 text-sm"
                value={role.key}
                onChange={(event) => setRoleKey(event.target.value)}
              >
                {prototypeRoles.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </select>
              <button
                className={`rounded-ui border px-3 py-2 text-sm ${showNotes ? "border-amber-500 bg-amber-50 text-amber-700" : "border-line bg-white text-slate-700"}`}
                onClick={() => setShowNotes((value) => !value)}
                type="button"
              >
                标注
              </button>
              <button className="rounded-ui border border-line bg-white px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)}>
                菜单
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-[calc(100%_-_40px)] max-w-[1180px] py-8">{children}</main>
      </div>
    </PrototypeRoleContext.Provider>
  );
}

function activeNav(hash, path) {
  if (path === "#/") return hash === "#/" || hash.startsWith("#/news") || hash.startsWith("#/course-preview");
  if (path === "#/papers") return hash.startsWith("#/papers") || hash.startsWith("#/paper-answer");
  if (path === "#/exams") return hash.startsWith("#/exams") || hash.startsWith("#/exam-");
  if (path === "#/learning") return hash.startsWith("#/learning") || hash.startsWith("#/class") || hash.startsWith("#/course-study") || hash.startsWith("#/qa") || hash.startsWith("#/wrong-book");
  if (path === "#/profile") return hash.startsWith("#/profile") || hash.startsWith("#/school-apply");
  return hash.startsWith(path);
}

export function PageHeader({ title, desc, action }) {
  const context = useContext(PrototypeRoleContext);
  const showNotes = context?.showNotes;

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="m-0 text-2xl font-semibold tracking-normal">{title}</h1>
        {desc && showNotes ? (
          <div className="mt-3 max-w-3xl rounded-ui border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
            <strong>原型标注：</strong>{desc}
          </div>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PrototypeNote({ children, className = "" }) {
  const context = useContext(PrototypeRoleContext);
  if (!context?.showNotes || !children) return null;

  return (
    <div className={`rounded-ui border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900 ${className}`}>
      <strong>原型标注：</strong>{children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <section className={`rounded-ui border border-line bg-white p-5 shadow-panel ${className}`}>{children}</section>;
}

export function Button({ children, href, tone = "primary", onClick }) {
  const cls = {
    primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-line bg-white text-ink hover:bg-slate-50",
    ghost: "border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100",
    warning: "border-amber-600 bg-amber-600 text-white",
  }[tone];
  const className = `inline-flex min-h-10 items-center justify-center rounded-ui border px-4 py-2 ${cls}`;
  if (href) return <a className={className} href={href} onClick={onClick}>{children}</a>;
  return <button className={className} onClick={onClick}>{children}</button>;
}

export function Tag({ children, tone = "gray" }) {
  const cls = {
    gray: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    cyan: "bg-cyan-50 text-cyan-700",
  }[tone];
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs ${cls}`}>{children}</span>;
}

export function Meta({ children }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}

export function DataTable({ columns, rows, renderRow, gridTemplateColumns }) {
  const gridStyle = { gridTemplateColumns: gridTemplateColumns || `repeat(${columns.length}, minmax(0, 1fr))` };

  return (
    <div className="overflow-hidden rounded-ui border border-line bg-white">
      <div className="hidden gap-4 bg-slate-50 px-4 py-3 text-xs text-muted md:grid" style={gridStyle}>
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>
      {rows.map((row, index) => (
        <div key={row.title || index} className="grid gap-3 border-t border-line px-4 py-4 md:items-center" style={gridStyle}>
          {renderRow(row)}
        </div>
      ))}
    </div>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-6" onClick={onClose}>
      <div className="max-h-[calc(100vh_-_48px)] w-[min(620px,100%)] overflow-auto rounded-ui bg-white p-6 shadow-lift" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="m-0 text-xl font-semibold">{title}</h3>
          <Button tone="secondary" onClick={onClose}>关闭</Button>
        </div>
        <div className="leading-8 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ label, value }) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <b className="text-2xl">{value}</b>
    </Card>
  );
}

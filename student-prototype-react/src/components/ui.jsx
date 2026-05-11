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
  const [accountOpen, setAccountOpen] = useState(false);
  const [prototypeControlsOpen, setPrototypeControlsOpen] = useState(false);
  const [schoolApplyOpen, setSchoolApplyOpen] = useState(false);
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

  useEffect(() => {
    setAccountOpen(false);
  }, [role.key]);

  function openSchoolApply() {
    setSchoolApplyOpen(true);
  }

  function handleShellClickCapture(event) {
    const link = event.target.closest?.('a[href="#/school-apply"]');
    if (link) {
      event.preventDefault();
      openSchoolApply();
    }
  }

  return (
    <PrototypeRoleContext.Provider value={{ role, roleKey: role.key, setRoleKey, roles: prototypeRoles, showNotes, setShowNotes, openSchoolApply }}>
      <div className="min-h-screen bg-wash" onClickCapture={handleShellClickCapture}>
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-[68px] w-[calc(100%_-_40px)] max-w-[1180px] flex-wrap items-center justify-between gap-4">
            <a href="#/" className="flex min-w-[210px] items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-ui bg-gradient-to-br from-blue-600 to-teal-700 font-bold text-white">职</span>
              <span>
                <strong className="block text-base">职教高考学习平台</strong>
                <span className="text-xs text-muted">学生端学习平台</span>
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
              <div className="relative">
                {role.key === "visitor" ? (
                  <a className="flex min-h-10 items-center gap-2 rounded-ui border border-line bg-white px-2 py-1 text-sm text-slate-700 hover:bg-slate-50" href="#/login">
                    <Avatar text={role.avatarText} muted />
                    <span>登录/注册</span>
                  </a>
                ) : (
                  <>
                    <button
                      className="flex min-h-10 items-center gap-2 rounded-ui border border-line bg-white px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setAccountOpen((value) => !value)}
                      type="button"
                    >
                      <Avatar text={role.avatarText} />
                      <span>{role.accountName}</span>
                      <span className="text-xs text-muted">▾</span>
                    </button>
                    {accountOpen ? (
                      <div className="absolute right-0 top-[calc(100%_+_8px)] z-30 min-w-40 overflow-hidden rounded-ui border border-line bg-white py-1 shadow-lift">
                        <a className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600" href="#/profile">个人中心</a>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            setRoleKey("visitor");
                            setAccountOpen(false);
                          }}
                          type="button"
                        >
                          退出登录
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <button className="rounded-ui border border-line bg-white px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)}>
                菜单
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-[calc(100%_-_40px)] max-w-[1180px] py-8">{children}</main>
        <div className="fixed right-4 top-20 z-40">
          {prototypeControlsOpen ? (
            <div className="w-[min(280px,calc(100vw_-_32px))] rounded-ui border border-line bg-white p-3 shadow-lift">
              <div className="mb-3 flex items-center justify-between gap-3">
                <strong className="text-sm">演示控制</strong>
                <button
                  className="rounded-ui border border-line bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => setPrototypeControlsOpen(false)}
                  type="button"
                >
                  收起
                </button>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs text-muted">
                  当前身份
                  <select
                    aria-label="原型登录状态"
                    className="min-h-10 rounded-ui border border-line bg-white px-3 text-sm text-slate-700"
                    value={role.key}
                    onChange={(event) => setRoleKey(event.target.value)}
                  >
                    {prototypeRoles.map((item) => (
                      <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                  </select>
                </label>
                <button
                  className={`min-h-10 rounded-ui border px-3 py-2 text-sm ${showNotes ? "border-amber-500 bg-amber-50 text-amber-700" : "border-line bg-white text-slate-700"}`}
                  onClick={() => setShowNotes((value) => !value)}
                  type="button"
                >
                  {showNotes ? "隐藏标注" : "显示标注"}
                </button>
                <a
                  className="inline-flex min-h-10 items-center justify-center rounded-ui border border-line bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  href="#/admin"
                  onClick={() => setPrototypeControlsOpen(false)}
                >
                  进入运营后台
                </a>
              </div>
            </div>
          ) : (
            <button
              className="rounded-ui border border-line bg-white px-3 py-2 text-sm text-slate-700 shadow-panel hover:bg-slate-50"
              onClick={() => setPrototypeControlsOpen(true)}
              type="button"
            >
              演示控制
            </button>
          )}
        </div>
        <SchoolApplyModal open={schoolApplyOpen} onClose={() => setSchoolApplyOpen(false)} />
      </div>
    </PrototypeRoleContext.Provider>
  );
}

function Avatar({ text, muted = false }) {
  return (
    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
      muted ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-blue-600 to-teal-600 text-white"
    }`}>
      {text}
    </span>
  );
}

function activeNav(hash, path) {
  if (path === "#/") return hash === "#/" || hash.startsWith("#/news") || hash.startsWith("#/course-preview");
  if (path === "#/papers") return hash.startsWith("#/papers") || hash.startsWith("#/paper-answer");
  if (path === "#/exams") return hash.startsWith("#/exams") || hash.startsWith("#/exam-");
  if (path === "#/learning") return hash.startsWith("#/learning") || hash.startsWith("#/class") || hash.startsWith("#/course-study") || hash.startsWith("#/course-lesson") || hash.startsWith("#/course-material") || hash.startsWith("#/paper-practice") || hash.startsWith("#/my-exams") || hash.startsWith("#/qa") || hash.startsWith("#/learning-record") || hash.startsWith("#/wrong");
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

export function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange, label = "列表", pageSizeOptions = [20, 30, 50] }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(total, currentPage * pageSize);
  const pageButtonClass = "inline-flex min-h-10 items-center justify-center rounded-ui border border-line bg-white px-4 py-2 text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Card className="mt-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <p className="m-0 text-sm text-muted">
          {label}：第 {currentPage} / {totalPages} 页，显示 {start}-{end} 条，共 {total} 条
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-muted">
            每页
            <select
              className="min-h-10 rounded-ui border border-line bg-white px-3 text-slate-700"
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              value={pageSize}
            >
              {pageSizeOptions.map((size) => <option key={size} value={size}>{size} 条</option>)}
            </select>
          </label>
          <button
            className={pageButtonClass}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            type="button"
          >
            上一页
          </button>
          <button
            className={pageButtonClass}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            type="button"
          >
            下一页
          </button>
        </div>
      </div>
    </Card>
  );
}

export function Modal({ open, title, children, onClose, className = "w-[min(620px,100%)]" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-6" onClick={onClose}>
      <div className={`max-h-[calc(100vh_-_48px)] overflow-auto rounded-ui bg-white p-6 shadow-lift ${className}`} onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="m-0 text-xl font-semibold">{title}</h3>
          <Button tone="secondary" onClick={onClose}>关闭</Button>
        </div>
        <div className="leading-8 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

export function SchoolApplyModal({ open, onClose }) {
  const [identity, setIdentity] = useState("student");
  const isStudent = identity === "student";
  const proofNote = isStudent
    ? "请上传您的身份证明，需体现您的姓名、院系等信息，或者其他能证明您学生身份的证件。"
    : "请上传您的工作证，需体现您的姓名、工作院系等信息，或者其他能证明您教师身份的证件。";

  return (
    <Modal open={open} title="申请加入学校" onClose={onClose}>
      <div className="grid gap-5 text-sm">
        <div className="rounded-ui bg-slate-50 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <ApplyIdentityOption
              active={isStudent}
              desc="加入学校后查看班级课程、考试和学习资源。"
              label="学生身份"
              onClick={() => setIdentity("student")}
            />
            <ApplyIdentityOption
              active={!isStudent}
              desc="用于教师入驻、课程管理或后续教学协作。"
              label="教师身份"
              onClick={() => setIdentity("teacher")}
            />
          </div>
        </div>

        <ApplySection title="基础信息">
          <div className="grid gap-4 md:grid-cols-2">
            <ApplyFormField label="姓名"><input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入姓名" /></ApplyFormField>
            <ApplyFormField label="手机号"><input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入手机号" /></ApplyFormField>
            <ApplyFormField className={isStudent ? "md:col-span-2" : ""} label="学校">
              <select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue="">
                <option value="" disabled>请选择学校</option>
                <option>示范中职学校</option>
                <option>东方职业学校</option>
                <option>南湖中职学校</option>
              </select>
            </ApplyFormField>
            {!isStudent ? (
              <>
                <ApplyFormField label="职位（非必选）"><input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入职位" /></ApplyFormField>
                <ApplyFormField label="职称（非必选）"><input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入职称" /></ApplyFormField>
              </>
            ) : null}
          </div>
        </ApplySection>

        <ApplySection title="身份证明">
          <label className="grid cursor-pointer gap-4 rounded-ui border border-dashed border-blue-200 bg-blue-50/60 p-4 hover:bg-blue-50 md:grid-cols-[86px_1fr] md:items-center">
            <input accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="sr-only" type="file" />
            <span className="grid h-20 w-20 place-items-center rounded-ui border border-blue-100 bg-white text-xl font-semibold text-blue-600">+</span>
            <span>
              <strong className="block text-slate-800">上传图片</strong>
              <span className="mt-1 block text-sm leading-6 text-muted">{proofNote}</span>
              <span className="mt-2 block text-xs text-blue-700">支持 jpg、jpeg、png 格式，文件大小不得超过 10MB</span>
            </span>
          </label>
        </ApplySection>

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button tone="secondary" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>提交申请</Button>
        </div>
      </div>
    </Modal>
  );
}

function ApplyIdentityOption({ active, label, desc, onClick }) {
  return (
    <button
      className={`rounded-ui border p-4 text-left transition ${active ? "border-blue-600 bg-white shadow-panel" : "border-transparent bg-transparent hover:bg-white"}`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center justify-between gap-3">
        <strong className={active ? "text-blue-700" : "text-slate-800"}>{label}</strong>
        <span className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${active ? "border-blue-600 bg-blue-600 text-white" : "border-line text-transparent"}`}>✓</span>
      </span>
      <span className="mt-2 block text-xs leading-5 text-muted">{desc}</span>
    </button>
  );
}

function ApplySection({ title, children }) {
  return (
    <section className="rounded-ui border border-line bg-white p-4">
      <h3 className="mb-4 mt-0 text-base font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function ApplyFormField({ label, children, className = "" }) {
  return (
    <label className={`grid gap-2 text-sm ${className}`}>
      <span>{label}</span>
      {children}
    </label>
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

import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";
import { navItems, platformSchools, professionalCategories, prototypeRoles } from "../data/mockData";

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
  const [annotationPanelOpen, setAnnotationPanelOpen] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [schoolApplyOpen, setSchoolApplyOpen] = useState(false);
  const [accessPrompt, setAccessPrompt] = useState(null);
  const [roleKey, setRoleKey] = useState(() => window.localStorage.getItem("prototype-role") || "visitor");
  const hash = window.location.hash || "#/";
  const role = prototypeRoles.find((item) => item.key === roleKey) || prototypeRoles[0];
  const blockedStudentRoute = isProtectedStudentRoute(hash) && role.key !== "student";
  const brandSubtitle = role.key === "teacher" ? "教师端教学平台" : "学生端学习平台";

  useEffect(() => {
    window.localStorage.setItem("prototype-role", role.key);
  }, [role.key]);

  useEffect(() => {
    setAccountOpen(false);
  }, [role.key]);

  function openSchoolApply() {
    setSchoolApplyOpen(true);
  }

  function requestStudentAreaAccess() {
    if (role.key === "student") return true;
    setAccessPrompt(getAccessPromptCopy(role.key));
    return false;
  }

  const registerAnnotation = useCallback((annotation) => {
    setAnnotations((current) => [...current.filter((item) => item.id !== annotation.id), annotation]);
  }, []);

  const unregisterAnnotation = useCallback((id) => {
    setAnnotations((current) => current.filter((item) => item.id !== id));
  }, []);

  function handleShellClickCapture(event) {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    if (link.dataset.publicBannerLink === "true") return;

    const href = link.getAttribute("href");
    if (isProtectedStudentRoute(href) && !requestStudentAreaAccess()) {
      event.preventDefault();
    }
  }

  return (
    <PrototypeRoleContext.Provider value={{
      role,
      roleKey: role.key,
      setRoleKey,
      roles: prototypeRoles,
      openSchoolApply,
      requestStudentAreaAccess,
      registerAnnotation,
      unregisterAnnotation,
    }}>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#f5f7fb_260px,#f5f7fb_100%)]" onClickCapture={handleShellClickCapture}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur">
          <div className="mx-auto flex min-h-[68px] w-[calc(100%_-_40px)] max-w-[1180px] flex-wrap items-center justify-between gap-4">
            <a href="#/" className="flex min-w-[210px] items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-ui bg-gradient-to-br from-blue-600 to-teal-600 font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)]">职</span>
              <span>
                <strong className="block text-[15px] font-semibold leading-5 text-slate-950">职教高考学习平台</strong>
                <span className="text-xs leading-5 text-muted">{brandSubtitle}</span>
              </span>
            </a>
            <nav className={`${open ? "flex" : "hidden"} order-3 w-full gap-1 overflow-x-auto md:order-none md:flex md:w-auto`}>
              {[...navItems, ...(role.key === "teacher" ? [{ label: "教师端", path: "#/teacher" }] : [])].map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`rounded-ui px-3 py-2 text-sm font-medium transition ${
                    activeNav(hash, item.path) ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
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
        <main className="mx-auto w-[calc(100%_-_40px)] max-w-[1180px] py-8">
          {blockedStudentRoute ? <AccessBlockedPanel roleKey={role.key} /> : children}
        </main>
        <div className="fixed right-4 top-20 z-40">
          {prototypeControlsOpen ? (
            <div className="w-[min(280px,calc(100vw_-_32px))] rounded-ui border border-line bg-white p-3 shadow-lift">
              <div className="mb-3 flex items-center justify-between gap-3">
                <strong className="text-sm">场景预览</strong>
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
                    aria-label="预览身份"
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
                  className="min-h-10 rounded-ui border border-line bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setPrototypeControlsOpen(false);
                    setAnnotationPanelOpen(true);
                  }}
                  type="button"
                >
                  页面标注{annotations.length ? ` (${annotations.length})` : ""}
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
              场景预览
            </button>
          )}
        </div>
        <SchoolApplyModal open={schoolApplyOpen} onClose={() => setSchoolApplyOpen(false)} />
        <AccessPromptModal prompt={accessPrompt} onClose={() => setAccessPrompt(null)} />
        <AnnotationPanel annotations={annotations} open={annotationPanelOpen} onClose={() => setAnnotationPanelOpen(false)} />
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
  if (path === "#/exams") return hash.startsWith("#/exams") || hash.startsWith("#/exam-") || hash.startsWith("#/my-exams") || hash.startsWith("#/papers") || hash.startsWith("#/paper-") || hash.startsWith("#/wrong");
  if (path === "#/learning") return hash.startsWith("#/learning") || hash.startsWith("#/class") || hash.startsWith("#/course-study") || hash.startsWith("#/course-lesson") || hash.startsWith("#/course-material") || hash.startsWith("#/qa") || hash.startsWith("#/learning-record");
  if (path === "#/profile") return hash.startsWith("#/profile");
  if (path === "#/teacher") return hash.startsWith("#/teacher");
  if (path === "#/admin") return hash.startsWith("#/admin");
  return hash.startsWith(path);
}

function isProtectedStudentRoute(href = "") {
  const path = href.split("?")[0];
  if (path === "#/virtual-training") return true;
  if (path === "#/papers" || path.startsWith("#/paper-")) return true;
  if (path === "#/exams" || path.startsWith("#/exam-") || path === "#/my-exams") return true;
  return path === "#/learning"
    || path.startsWith("#/class")
    || path.startsWith("#/course-study")
    || path.startsWith("#/course-lesson")
    || path.startsWith("#/course-material")
    || path.startsWith("#/paper-practice")
    || path.startsWith("#/qa")
    || path.startsWith("#/learning-record")
    || path.startsWith("#/wrong");
}

function getAccessPromptCopy(roleKey) {
  if (roleKey === "visitor") {
    return {
      title: "请先登录/注册",
      desc: "登录并完成入校认证后，可使用学习中心、考试中心和虚拟实训。",
      action: <Button href="#/login">登录/注册</Button>,
    };
  }

  if (roleKey === "teacher") {
    return {
      title: "教师账号未加入学生班级",
      desc: "教师不能使用学生课程、考试和虚拟实训功能，请进入教师端处理教学内容。",
      action: <Button href="#/teacher">进入教师端</Button>,
    };
  }

  return {
    title: "当前账号尚未加入学校",
    desc: roleKey === "rejected"
      ? "入校认证未通过，可在个人中心查看原因并再次申请入校。"
      : "入校认证审核中，认证通过后可使用学习中心、考试中心和虚拟实训。",
    action: <Button href="#/profile">进入个人中心</Button>,
  };
}

function AccessPromptModal({ prompt, onClose }) {
  return (
    <Modal open={Boolean(prompt)} title={prompt?.title} onClose={onClose}>
      <div onClickCapture={(event) => {
        if (event.target.closest?.("a,button")) onClose();
      }}>
        <p className="m-0 leading-7 text-muted">{prompt?.desc}</p>
        <Meta>{prompt?.action}</Meta>
      </div>
    </Modal>
  );
}

function AccessBlockedPanel({ roleKey }) {
  const copy = getAccessPromptCopy(roleKey);
  const isTeacher = roleKey === "teacher";
  return (
    <Card className="mx-auto max-w-2xl">
      <Tag tone={roleKey === "visitor" ? "blue" : "amber"}>
        {roleKey === "visitor" ? "未登录" : isTeacher ? "教师身份" : "未加入学校"}
      </Tag>
      <h1 className="mb-0 mt-4 text-2xl">{copy.title}</h1>
      <p className="mb-0 mt-3 leading-7 text-muted">{copy.desc}</p>
      <Meta>{copy.action}<Button href="#/" tone="secondary">返回首页</Button></Meta>
    </Card>
  );
}

export function PageHeader({ title, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="m-0 flex items-center gap-3 text-[26px] font-semibold tracking-normal text-slate-950">
          <span className="h-6 w-1 rounded-full bg-blue-600" />
          {title}
        </h1>
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function PrototypeNote() {
  return null;
}

export function DesignAnnotation({ content, title, type = "设计" }) {
  const context = useContext(PrototypeRoleContext);
  const id = useId();

  useEffect(() => {
    if (!context?.registerAnnotation || !title || !content) return undefined;
    context.registerAnnotation({ id, title, type, content });
    return () => context.unregisterAnnotation(id);
  }, [content, context?.registerAnnotation, context?.unregisterAnnotation, id, title, type]);

  return null;
}

function AnnotationPanel({ annotations, onClose, open }) {
  if (!open) return null;

  return (
    <aside className="fixed bottom-4 right-4 top-20 z-50 flex w-[min(360px,calc(100vw_-_32px))] flex-col overflow-hidden rounded-ui border border-slate-200 bg-white shadow-lift" aria-label="页面标注浮层">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <strong className="block text-sm text-slate-950">页面标注</strong>
          <span className="mt-1 block text-xs text-muted">{annotations.length} 条</span>
        </div>
        <button className="rounded-ui border border-line bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={onClose} type="button">关闭</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {annotations.length ? (
          <div className="grid gap-3">
            {annotations.map((annotation, index) => (
              <section className="rounded-ui border border-slate-200 bg-slate-50 p-4" key={annotation.id}>
                <div className="flex items-start justify-between gap-3">
                  <strong className="text-sm text-slate-950">{index + 1}. {annotation.title}</strong>
                  <Tag tone="blue">{annotation.type}</Tag>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-700">{annotation.content}</div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid h-full min-h-40 place-items-center text-sm text-muted">当前页面暂无标注</div>
        )}
      </div>
    </aside>
  );
}

export function Card({ children, className = "" }) {
  return <section className={`rounded-ui border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.045)] ${className}`}>{children}</section>;
}

export function Button({ children, className = "", disabled = false, href, tone = "primary", onClick, type = "button" }) {
  const cls = {
    primary: "border-blue-600 bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.16)] hover:bg-blue-700",
    secondary: "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
    ghost: "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100",
    warning: "border-amber-600 bg-amber-600 text-white shadow-[0_8px_18px_rgba(217,119,6,0.14)] hover:bg-amber-700",
  }[tone];
  const buttonClassName = `inline-flex h-10 min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-ui border px-4 text-sm font-medium leading-none transition focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-45 ${cls} ${className}`;
  if (href) return <a className={buttonClassName} href={href} onClick={onClick}>{children}</a>;
  return <button className={buttonClassName} disabled={disabled} onClick={onClick} type={type}>{children}</button>;
}

export function Tag({ children, className = "", tone = "gray" }) {
  const cls = {
    gray: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    red: "border-red-100 bg-red-50 text-red-700",
    cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
  }[tone];
  return <span className={`inline-flex h-7 min-h-7 items-center justify-center whitespace-nowrap rounded-full border px-3 text-xs font-medium leading-none ${cls} ${className}`}>{children}</span>;
}

export function Meta({ children, className = "" }) {
  return <div className={`mt-4 flex flex-wrap items-center gap-2 ${className}`}>{children}</div>;
}

export function ListPageFrame({ children, className = "" }) {
  return <div className={`-mx-5 bg-wash md:-mx-0 ${className}`}>{children}</div>;
}

export function FilterPanel({ children, className = "" }) {
  return <section className={`bg-white px-5 py-8 md:px-8 ${className}`}>{children}</section>;
}

export function FilterTagRow({ label, children, className = "" }) {
  return (
    <div className={`flex min-h-12 flex-wrap items-center gap-4 text-base ${className}`}>
      <span className="flex h-10 w-20 shrink-0 items-center font-medium leading-none text-ink">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function FilterChip({ children, active = true, className = "" }) {
  return (
    <span
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-5 text-base font-medium ${
        active ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
      } whitespace-nowrap leading-none ${className}`}
    >
      {children}
    </span>
  );
}

export function FilterButtonGroup({ label, options, value, onChange, labelClassName = "", optionClassName = "" }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className={`font-semibold text-slate-800 ${labelClassName}`}>{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const item = typeof option === "string" ? { label: option, value: option } : option;
          const active = value === item.value;
          return (
            <button
              className={`min-h-9 rounded-ui border px-4 font-medium transition ${
                active ? "border-blue-600 bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.14)]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              } ${optionClassName}`}
              key={item.value}
              onClick={() => onChange(item.value)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SegmentedTabs({ tabs, active, onChange, className = "" }) {
  return (
    <div className={`mb-5 flex gap-2 overflow-x-auto rounded-ui border border-slate-200 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.035)] ${className}`}>
      {tabs.map((tab) => (
        <button
          className={`min-h-10 whitespace-nowrap rounded-ui px-5 text-sm font-medium transition ${
            active === tab.key ? "bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.14)]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
          key={tab.key}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function ListDivider({ className = "" }) {
  return <div className={`h-6 bg-wash ${className}`} />;
}

export function ListToolbar({ left, right, children, className = "" }) {
  return (
    <section className={`flex flex-col gap-4 bg-white px-4 py-8 md:flex-row md:items-center md:justify-between ${className}`}>
      <div className="flex flex-wrap items-center gap-3">{left}</div>
      <div className="flex flex-wrap items-center justify-end gap-3">{right || children}</div>
    </section>
  );
}

export function SelectControl({ value, onChange, options = [], className = "", "aria-label": ariaLabel = "请选择" }) {
  return (
    <select
      aria-label={ariaLabel}
      className={`h-11 min-w-36 rounded border border-line bg-white px-4 text-base text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      onChange={onChange}
      value={value}
    >
      {options.map((option) => {
        const item = typeof option === "string" ? { label: option, value: option } : option;
        return <option key={item.value} value={item.value}>{item.label}</option>;
      })}
    </select>
  );
}

export function TextControl({ value, onChange, placeholder = "", className = "", type = "text", "aria-label": ariaLabel = placeholder || "请输入" }) {
  return (
    <input
      aria-label={ariaLabel}
      className={`h-11 min-w-0 rounded border border-line bg-white px-4 text-base text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

export function SearchControl({ value, onChange, onSearch, placeholder = "请输入关键词", buttonText = "查询", className = "" }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <TextControl className="w-[min(360px,58vw)]" onChange={onChange} placeholder={placeholder} value={value} />
      <button
        className="inline-flex h-11 min-w-28 items-center justify-center rounded bg-blue-600 px-5 text-base font-medium text-white hover:bg-blue-700"
        onClick={onSearch}
        type="button"
      >
        {buttonText}
      </button>
    </div>
  );
}

export function AdminDataTable({ columns, rows, rowKey, emptyText = "暂无数据", className = "", gridTemplateColumns }) {
  const gridStyle = { gridTemplateColumns: gridTemplateColumns || columns.map((column) => column.width || "minmax(0, 1fr)").join(" ") };

  return (
    <section className={`overflow-hidden rounded-ui border border-line bg-white ${className}`}>
      <div className="hidden min-h-14 items-center gap-4 bg-slate-50 px-6 text-base font-medium leading-none text-slate-700 md:grid" style={gridStyle}>
        {columns.map((column) => (
          <div key={column.key} className={`${getCellAlignClass(column.align)} ${column.headerClassName || ""}`}>{column.title}</div>
        ))}
      </div>
      {rows.length ? rows.map((row, index) => (
        <div
          key={rowKey ? rowKey(row, index) : row.id || row.title || index}
          className="grid min-h-[72px] gap-4 border-t border-line px-6 py-[18px] text-base leading-6 text-ink md:items-center"
          style={gridStyle}
        >
          {columns.map((column) => (
            <div key={column.key} className={`${getCellAlignClass(column.align)} ${column.className || ""}`}>
              {column.render ? column.render(row, index) : row[column.key]}
            </div>
          ))}
        </div>
      )) : (
        <div className="border-t border-line px-6 py-10 text-center text-muted">{emptyText}</div>
      )}
    </section>
  );
}

export function AdminPagination({ total, page, pageSize = 20, onPageChange, className = "" }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const buttonClass = "inline-flex h-10 min-w-10 items-center justify-center rounded border border-line bg-white px-3 text-base text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className={`flex flex-wrap items-center justify-center gap-3 bg-wash px-4 py-8 text-base text-ink ${className}`}>
      <span>共 {total} 条</span>
      <button className={buttonClass} disabled={currentPage <= 1} onClick={() => onPageChange?.(Math.max(1, currentPage - 1))} type="button">‹</button>
      <button className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-blue-600 bg-blue-600 px-3 text-base font-medium text-white" type="button">{currentPage}</button>
      <button className={buttonClass} disabled={currentPage >= totalPages} onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))} type="button">›</button>
      <span>前往</span>
      <input
        aria-label="分页页码"
        className="h-10 w-20 rounded border border-line bg-white px-3 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        onChange={(event) => {
          const nextPage = Number(event.target.value);
          if (Number.isFinite(nextPage) && nextPage >= 1 && nextPage <= totalPages) onPageChange?.(nextPage);
        }}
        type="number"
        value={currentPage}
      />
      <span>页</span>
    </section>
  );
}

function getCellAlignClass(align = "center") {
  if (align === "left") return "flex min-w-0 items-center justify-start text-left";
  if (align === "right") return "flex min-w-0 items-center justify-end text-right";
  return "flex min-w-0 items-center justify-center text-center";
}

export function DataTable({ columns, rows, renderRow, gridTemplateColumns }) {
  const gridStyle = { gridTemplateColumns: gridTemplateColumns || `repeat(${columns.length}, minmax(0, 1fr))` };

  return (
    <div className="overflow-x-auto rounded-ui border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.035)]">
      <div className="hidden min-h-12 items-center gap-4 border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-semibold uppercase leading-none text-slate-500 md:grid [&>*]:self-center" style={gridStyle}>
        {columns.map((column) => <span className="flex min-w-0 items-center" key={column}>{column}</span>)}
      </div>
      {rows.map((row, index) => (
        <div key={row.id || row.title || index} className="grid min-h-[68px] gap-3 border-b border-slate-100 px-4 py-4 leading-6 transition last:border-b-0 hover:bg-blue-50/30 md:items-center md:[&>*]:self-center [&>*]:min-w-0" style={gridStyle}>
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
  const pageButtonClass = "inline-flex min-h-10 items-center justify-center rounded-ui border border-slate-200 bg-white px-4 py-2 text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Card className="mt-4 py-4">
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
  return (
    <Modal open={open} title="再次申请入校" onClose={onClose}>
      <div className="grid gap-5 text-sm">
        <div className="rounded-ui border border-blue-100 bg-blue-50 p-4">
          <strong className="text-blue-700">重新提交认证信息</strong>
          <p className="mb-0 mt-2 leading-6 text-muted">被拒绝后可在个人中心再次申请入校；审核中不可重复提交。</p>
        </div>

        <ApplySection title="入校信息">
          <div className="grid gap-4 md:grid-cols-2">
            <ApplyFormField label="申请的学校">
              <select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue="">
                <option value="" disabled>请选择申请的学校</option>
                {platformSchools.map((school) => <option key={school}>{school}</option>)}
              </select>
            </ApplyFormField>
            <ApplyFormField label="目标专业">
              <select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue="">
                <option value="" disabled>请选择目标专业</option>
                {professionalCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </ApplyFormField>
            <ApplyFormField className="md:col-span-2" label="申请说明">
              <textarea className="min-h-24 rounded-ui border border-line p-3" placeholder="可补充说明学校、专业选择或被拒后重新提交的原因" />
            </ApplyFormField>
          </div>
        </ApplySection>

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button tone="secondary" onClick={onClose}>取消</Button>
          <Button onClick={onClose}>提交申请</Button>
        </div>
      </div>
    </Modal>
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

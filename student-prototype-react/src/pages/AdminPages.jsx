import { useMemo, useState } from "react";
import { categories, news, recommendedCourses } from "../data/mockData";
import { Button, Card, DataTable, Meta, Modal, PageHeader, Stat, Tag } from "../components/ui";

const newsTypes = ["全部", "政策解读", "考试通知", "平台公告", "备考指南"];
const publishStatuses = ["全部", "已发布", "草稿", "已下架"];
const courseShelfStatuses = ["全部", "上架", "下架"];
const courseSubjectOptions = ["全部", "语文", "数学", "英语", ...categories.map((item) => item.name)];

const adminNews = news.map((item, index) => ({
  ...item,
  status: index === 3 ? "草稿" : "已发布",
}));

const courseLibrary = recommendedCourses.map((course, index) => ({
  ...course,
  id: `A${String(100861 + index).padStart(6, "0")}`,
  category: getCourseCategory(course),
  courseType: getCourseType(course.subject),
  order: 999 - index,
  status: index < 4 ? "推荐中" : "未推荐",
  shelfStatus: index < 10 ? "上架" : "下架",
  updatedAt: `2025-12-${String(28 - (index % 6)).padStart(2, "0")} 11:47:34`,
  updatedBy: course.creator,
}));

export function AdminDashboardPage() {
  return (
    <AdminShell>
      <PageHeader title="运营后台" />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="已发布资讯" value={adminNews.filter((item) => item.status === "已发布").length} />
        <Stat label="草稿资讯" value={adminNews.filter((item) => item.status === "草稿").length} />
        <Stat label="推荐课程" value={courseLibrary.filter((item) => item.status === "推荐中").length} />
        <Stat label="课程库课程" value={courseLibrary.length} />
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="m-0 text-lg">平台资讯管理</h2>
          <p className="mt-3 leading-7 text-muted">维护首页资讯、资讯中心列表和发布状态。</p>
          <Meta>
            <Button href="#/admin/news">进入管理</Button>
            <Tag tone="blue">资讯发布</Tag>
          </Meta>
        </Card>
        <Card>
          <h2 className="m-0 text-lg">首页推荐课程管理</h2>
          <p className="mt-3 leading-7 text-muted">从课程库选择课程，维护首页推荐展示和排序。</p>
          <Meta>
            <Button href="#/admin/recommend-courses">进入管理</Button>
            <Tag tone="green">从课程库选取</Tag>
          </Meta>
        </Card>
      </div>
    </AdminShell>
  );
}

export function AdminNewsPage() {
  const [type, setType] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [action, setAction] = useState(null);

  const rows = useMemo(() => {
    return adminNews.filter((item) => {
      const matchType = type === "全部" || item.type === type;
      const matchStatus = status === "全部" || item.status === status;
      const text = `${item.title}${item.summary}`;
      const matchKeyword = !keyword.trim() || text.includes(keyword.trim());
      return matchType && matchStatus && matchKeyword;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [keyword, status, type]);

  return (
    <AdminShell>
      <PageHeader title="平台资讯管理" action={<Button href="#/admin/news/new">新增资讯</Button>} />
      <Card className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-[180px_160px_1fr]">
          <SelectFilter label="资讯类型" options={newsTypes} value={type} onChange={setType} />
          <SelectFilter label="状态" options={publishStatuses} value={status} onChange={setStatus} />
          <label className="grid gap-2 text-sm">
            关键词
            <input className="min-h-10 rounded-ui border border-line px-3" placeholder="搜索标题或摘要" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </label>
        </div>
      </Card>
      <DataTable
        columns={["标题", "类型", "发布时间", "状态", "操作"]}
        gridTemplateColumns="minmax(260px,1.8fr) 110px 120px 90px 260px"
        rows={rows}
        renderRow={(item) => (
          <>
            <div>
              <strong>{item.title}</strong>
              <p className="mb-0 mt-1 text-xs leading-5 text-muted">{item.summary}</p>
            </div>
            <Tag tone="cyan">{item.type}</Tag>
            <span>{item.date}</span>
            <Tag tone={item.status === "已发布" ? "green" : item.status === "草稿" ? "amber" : "gray"}>{item.status}</Tag>
            <div className="flex flex-wrap justify-end gap-2">
              <Button href={`#/admin/news/edit?id=${item.id}`} tone="ghost">编辑</Button>
              <Button href={`#/admin/news/preview?id=${item.id}`} tone="secondary">预览</Button>
              <Button tone="secondary" onClick={() => setAction({
                title: item.status === "已发布" ? "确认下架资讯" : "确认发布资讯",
                body: item.status === "已发布" ? "下架后，学生端首页和资讯中心将不再展示该资讯。" : "发布后，学生端首页和资讯中心将按发布时间倒序展示该资讯。",
                confirm: item.status === "已发布" ? "确认下架" : "确认发布",
              })}>{item.status === "已发布" ? "下架" : "发布"}</Button>
              <Button tone="secondary" onClick={() => setAction({
                title: "确认删除资讯",
                body: "删除后该资讯将从后台列表移除，学生端也不会继续展示。",
                confirm: "确认删除",
              })}>删除</Button>
            </div>
          </>
        )}
      />
      <AdminActionModal action={action} onClose={() => setAction(null)} />
    </AdminShell>
  );
}

export function AdminNewsCreatePage() {
  return (
    <AdminShell>
      <PageHeader title="新增资讯" action={<Button href="#/admin/news" tone="secondary">返回列表</Button>} />
      <Card>
        <NewsEditor />
      </Card>
    </AdminShell>
  );
}

export function AdminNewsEditPage() {
  const item = getAdminNewsFromHash();
  return (
    <AdminShell>
      <PageHeader title="编辑资讯" action={<Button href="#/admin/news" tone="secondary">返回列表</Button>} />
      <Card>
        <NewsEditor item={item} />
      </Card>
    </AdminShell>
  );
}

export function AdminNewsPreviewPage() {
  const item = getAdminNewsFromHash();
  return (
    <AdminShell>
      <PageHeader title="资讯预览" action={<Button href="#/admin/news" tone="secondary">返回列表</Button>} />
      <Card>
        <Meta><Tag tone="cyan">{item.type}</Tag><Tag>{item.date}</Tag><Tag tone={item.status === "已发布" ? "green" : "amber"}>{item.status}</Tag></Meta>
        <h1 className="mb-3 mt-5 text-2xl">{item.title}</h1>
        <p className="leading-7 text-muted">{item.summary}</p>
        <article className="mt-6 rounded-ui border border-line bg-slate-50 p-5 leading-8 text-slate-700">
          {item.content}
        </article>
      </Card>
    </AdminShell>
  );
}

function getAdminNewsFromHash() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  return adminNews.find((item) => item.id === params.get("id")) || adminNews[0];
}

export function AdminRecommendCoursesPage() {
  const [subject, setSubject] = useState("全部");
  const [shelfStatus, setShelfStatus] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [sortCourse, setSortCourse] = useState(null);

  const rows = useMemo(() => {
    return courseLibrary.filter((item) => item.status === "推荐中").filter((item) => matchCourseFilters(item, { subject, shelfStatus, keyword }));
  }, [keyword, shelfStatus, subject]);

  return (
    <AdminShell>
      <PageHeader title="首页推荐课程管理" action={<Button onClick={() => setPickerOpen(true)}>从课程库添加</Button>} />
      <Card className="mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-[200px_160px_1fr]">
          <SelectFilter label="所属分类/科目" options={courseSubjectOptions} value={subject} onChange={setSubject} />
          <SelectFilter label="上架状态" options={courseShelfStatuses} value={shelfStatus} onChange={setShelfStatus} />
          <label className="grid gap-2 text-sm">
            关键词
            <input className="min-h-10 rounded-ui border border-line px-3" placeholder="搜索课程名称、课程ID、创建人" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </label>
        </div>
      </Card>
      <DataTable
        columns={["课程ID", "课程信息", "所属分类/科目", "排序", "推荐状态", "创建人", "更新时间", "更新人", "操作"]}
        gridTemplateColumns="92px minmax(230px,1.5fr) 130px 70px 90px 100px 150px 100px 190px"
        rows={rows}
        renderRow={(course) => (
          <>
            <span>{course.id}</span>
            <CourseInfo course={course} />
            <Tag tone={course.category === "文化课" ? "cyan" : "blue"}>{getCourseSubjectLabel(course)}</Tag>
            <strong>{course.order}</strong>
            <Tag tone={course.status === "推荐中" ? "green" : "gray"}>{course.status}</Tag>
            <span>{course.creator}</span>
            <span>{course.updatedAt}</span>
            <span>{course.updatedBy}</span>
            <div className="flex flex-wrap justify-end gap-2">
              <Button tone="ghost" onClick={() => setAction({
                title: "确认下架推荐课程",
                body: "下架后，该课程将不再出现在学生端首页推荐课程区域，课程库中的课程本身不受影响。",
                confirm: "确认下架",
              })}>下架</Button>
              <Button tone="secondary" onClick={() => setSortCourse(course)}>调整排序</Button>
              <Button tone="secondary" onClick={() => setAction({
                title: "确认移除推荐",
                body: "移除后，该课程仅从首页推荐列表移除，不会删除课程库中的课程。",
                confirm: "确认移除",
              })}>移除</Button>
            </div>
          </>
        )}
      />
      <CoursePickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
      <SortCourseModal course={sortCourse} onClose={() => setSortCourse(null)} />
      <AdminActionModal action={action} onClose={() => setAction(null)} />
    </AdminShell>
  );
}

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-wash">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-[68px] w-[calc(100%_-_40px)] max-w-[1280px] items-center justify-between gap-4">
          <a className="text-lg font-semibold text-ink" href="#/admin">平台运营后台</a>
          <nav className="flex gap-2">
            <AdminNavLink href="#/admin/news" label="资讯管理" />
            <AdminNavLink href="#/admin/recommend-courses" label="推荐课程" />
            <Button href="#/" tone="secondary">返回学生端</Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-[calc(100%_-_40px)] max-w-[1280px] py-8">{children}</main>
    </div>
  );
}

function AdminNavLink({ href, label }) {
  const current = window.location.hash.split("?")[0];
  const active = current === href || (href !== "#/admin" && current.startsWith(`${href}/`));
  return (
    <a className={`rounded-ui px-4 py-2 ${active ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`} href={href}>
      {label}
    </a>
  );
}

function SelectFilter({ label, options, value, onChange }) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <select className="min-h-10 rounded-ui border border-line bg-white px-3" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function NewsEditor({ item }) {
  const [notice, setNotice] = useState(null);

  return (
    <>
      <div className="grid gap-4 text-sm">
        <label className="grid gap-2">标题<input className="min-h-10 rounded-ui border border-line px-3" defaultValue={item?.title || ""} /></label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">资讯类型<select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue={item?.type || "平台公告"}>{newsTypes.filter((type) => type !== "全部").map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="grid gap-2">发布时间<input className="min-h-10 rounded-ui border border-line px-3" defaultValue={item?.date || "2026-05-11"} /></label>
          <label className="grid gap-2">状态<select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue={item?.status || "草稿"}>{publishStatuses.filter((option) => option !== "全部").map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
        <label className="grid gap-2">摘要<textarea className="min-h-20 rounded-ui border border-line p-3" defaultValue={item?.summary || ""} /></label>
        <label className="grid gap-2">正文内容<textarea className="min-h-44 rounded-ui border border-line p-3" defaultValue={item?.content || ""} /></label>
        <Meta>
          <Button onClick={() => setNotice({
            title: "保存成功",
            body: "资讯内容已保存，可返回列表查看。",
          })}>保存</Button>
          <Button tone="secondary" onClick={() => setNotice({
            title: "草稿已保存",
            body: "资讯已保存为草稿，暂不会展示在学生端。",
          })}>保存草稿</Button>
        </Meta>
      </div>
      <AdminActionModal action={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function CoursePickerModal({ open, onClose }) {
  const [subject, setSubject] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const pageSize = 5;
  const rows = courseLibrary
    .filter((item) => item.status !== "推荐中" && item.shelfStatus === "上架")
    .filter((item) => matchCourseFilters(item, { subject, shelfStatus: "上架", keyword }));
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const currentRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Modal className="w-[min(1080px,100%)]" open={open} title="从课程库选择课程" onClose={onClose}>
      <div className="grid gap-5 text-sm">
        <Card className="p-4">
          <div className="grid gap-3 md:grid-cols-[220px_1fr]">
            <SelectFilter label="所属分类/科目" options={courseSubjectOptions} value={subject} onChange={(value) => {
              setSubject(value);
              setPage(1);
            }} />
            <label className="grid gap-2">
              关键词
              <input
                className="min-h-10 rounded-ui border border-line px-3"
                placeholder="搜索课程名称、课程ID、创建人"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>
        </Card>
        <DataTable
          columns={["课程ID", "课程信息", "所属分类/科目", "创建人", "更新时间", "操作"]}
          gridTemplateColumns="92px minmax(260px,1.5fr) 130px 100px 150px 90px"
          rows={currentRows}
          renderRow={(course) => (
            <>
              <span>{course.id}</span>
              <CourseInfo course={course} />
              <Tag>{getCourseSubjectLabel(course)}</Tag>
              <span>{course.creator}</span>
              <span>{course.updatedAt}</span>
              <Button onClick={() => setSelectedCourse(course)}>选择</Button>
            </>
          )}
        />
        {selectedCourse ? (
          <Card className="border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="m-0 text-base">已选择：{selectedCourse.title}</h3>
                <p className="mb-0 mt-2 text-sm text-muted">确认后，该课程会加入首页推荐课程列表，默认按当前排序规则展示。</p>
              </div>
              <Meta>
                <Button tone="secondary" onClick={() => setSelectedCourse(null)}>重新选择</Button>
                <Button onClick={onClose}>确认添加</Button>
              </Meta>
            </div>
          </Card>
        ) : null}
        <div className="flex items-center justify-between gap-4 rounded-ui border border-line bg-white p-4">
          <span className="text-sm text-muted">第 {currentPage} / {totalPages} 页，共 {rows.length} 门上架课程</span>
          <div className="flex gap-2">
            <Button tone="secondary" onClick={() => setPage((value) => Math.max(1, value - 1))}>上一页</Button>
            <Button tone="secondary" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>下一页</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CourseInfo({ course }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-16 shrink-0 place-items-center rounded-ui bg-slate-100 text-xs text-muted">课程图</div>
      <div>
        <strong>{course.title}</strong>
        <p className="mb-0 mt-1 text-xs text-muted">{course.lessonCount} 课时 · {course.courseType}</p>
      </div>
    </div>
  );
}

function SortCourseModal({ course, onClose }) {
  if (!course) return null;
  return (
    <Modal open={!!course} title="调整推荐排序" onClose={onClose}>
      <div className="grid gap-4 text-sm">
        <div className="rounded-ui border border-line bg-slate-50 p-4">
          <strong>{course.title}</strong>
          <p className="mb-0 mt-2 text-muted">当前排序值：{course.order}</p>
        </div>
        <label className="grid gap-2">
          新排序值
          <input className="min-h-10 rounded-ui border border-line px-3" defaultValue={course.order} />
        </label>
        <p className="m-0 text-sm text-muted">数值越大，首页推荐课程越靠前。</p>
        <Meta><Button onClick={onClose}>保存排序</Button><Button tone="secondary" onClick={onClose}>取消</Button></Meta>
      </div>
    </Modal>
  );
}

function AdminActionModal({ action, onClose }) {
  if (!action) return null;
  return (
    <Modal open={!!action} title={action.title} onClose={onClose}>
      <p className="m-0 leading-7 text-muted">{action.body}</p>
      <Meta>
        <Button onClick={onClose}>{action.confirm || "知道了"}</Button>
        {action.confirm ? <Button tone="secondary" onClick={onClose}>取消</Button> : <Button href="#/admin/news" tone="secondary">返回资讯列表</Button>}
      </Meta>
    </Modal>
  );
}

function matchCourseFilters(course, filters) {
  const matchSubject = filters.subject === "全部" || getCourseSubjectLabel(course) === filters.subject;
  const matchShelfStatus = filters.shelfStatus === "全部" || course.shelfStatus === filters.shelfStatus;
  const text = `${course.title}${course.id}${course.creator}`;
  const matchKeyword = !filters.keyword.trim() || text.includes(filters.keyword.trim());
  return matchSubject && matchShelfStatus && matchKeyword;
}

function getCourseCategory(course) {
  if (["语文", "数学", "英语"].includes(course.subject)) return "文化课";
  if (course.subject.includes("信息") || course.subject.includes("计算机") || course.subject.includes("数据库") || course.subject.includes("专业")) return "电子与信息类";
  return "文化课";
}

function getCourseType(subject) {
  return ["语文", "数学", "英语"].includes(subject) ? "文化课" : "专业课";
}

function getCourseSubjectLabel(course) {
  return course.category === "文化课" ? course.subject : course.category;
}

import { useMemo, useState } from "react";
import {
  categories,
  classCourses,
  classExams,
  courseCatalog,
  courseMaterials,
  learningRecords,
  papers,
  qaRecords,
} from "../data/mockData";
import {
  Button,
  Card,
  DataTable,
  FilterButtonGroup,
  Meta,
  Modal,
  PageHeader,
  Pagination,
  PrototypeNote,
  SegmentedTabs,
  Stat,
  Tag,
  usePrototypeRole,
} from "../components/ui";

const teacherNavItems = [
  { label: "教学资源", href: "#/teacher", key: "course-resources", group: "资源" },
  { label: "题库资源", href: "#/teacher/question-bank", key: "question-bank", group: "资源" },
  { label: "组课管理", href: "#/teacher/course-builder", key: "course-builder", group: "内容" },
  { label: "我的课程", href: "#/teacher/courses", key: "courses", group: "内容" },
  { label: "试卷管理", href: "#/teacher/papers", key: "papers", group: "内容" },
  { label: "我的班级", href: "#/teacher/classes", key: "classes", group: "班级" },
];

const teacherClassSubItems = [
  { label: "班级概览", href: "#/teacher/classes", key: "overview" },
  { label: "班级派课", href: "#/teacher/assign-course", key: "assign-course" },
  { label: "班级作业", href: "#/teacher/assignments", key: "assignments" },
  { label: "学生管理", href: "#/teacher/students", key: "students" },
  { label: "答疑管理", href: "#/teacher/qa", key: "qa" },
];

const resourceRows = [
  { title: "函数概念与表示微课", resourceType: "微课", major: "数学", resourceLibrary: "职教高考数学", knowledgePath: ["函数", "函数概念", "函数表示", "分段函数"], updatedAt: "2026-02-18 10:30" },
  { title: "函数图像与性质课件", resourceType: "PPT", major: "数学", resourceLibrary: "职教高考数学", knowledgePath: ["函数", "函数性质", "函数图像", "图像变换"], updatedAt: "2026-02-17 15:20" },
  { title: "E-R 模型入门视频", resourceType: "慕课", major: "电子与信息类", resourceLibrary: "计算机应用基础", knowledgePath: ["数据库", "数据模型", "概念模型", "E-R 模型"], updatedAt: "2026-02-16 09:40" },
  { title: "SQL 条件查询讲义", resourceType: "PDF", major: "电子与信息类", resourceLibrary: "计算机应用基础", knowledgePath: ["数据库", "关系数据库", "SQL 查询", "条件查询"], updatedAt: "2026-02-15 14:10" },
  { title: "英语阅读定位训练", resourceType: "音频", major: "英语", resourceLibrary: "职教高考英语", knowledgePath: ["阅读理解", "信息定位", "细节理解", "关键词定位"], updatedAt: "2026-02-14 16:35" },
  { title: "髋骨结构图文", resourceType: "图文", major: "医药卫生类", resourceLibrary: "人体解剖学基础", knowledgePath: ["运动系统", "骨学", "下肢骨", "髋骨结构"], updatedAt: "2026-02-13 11:25" },
];

const questionBankRows = [
  { id: "QB0001", title: "函数值计算", questionStem: "已知函数 f(x)=2x+1，求 f(3) 的值。", questionType: "单选题", difficulty: "容易", major: "数学", resourceLibrary: "职教高考数学", knowledgePath: ["函数", "函数概念", "函数表示", "函数求值"], answer: "7", analysis: "将 x=3 代入函数表达式计算。", updatedAt: "2026-02-18 09:20" },
  { id: "QB0002", title: "一次函数图像判断", questionStem: "一次函数 y=kx+b 中 k>0 时，图像具有什么变化趋势？", questionType: "单选题", difficulty: "较易", major: "数学", resourceLibrary: "职教高考数学", knowledgePath: ["函数", "函数性质", "一次函数", "单调性"], answer: "随 x 增大而增大", analysis: "k>0 时一次函数单调递增。", updatedAt: "2026-02-17 13:50" },
  { id: "QB0003", title: "E-R 模型关系判断", questionStem: "学生与课程之间的选课联系通常属于哪种关系？", questionType: "判断题", difficulty: "适中", major: "电子与信息类", resourceLibrary: "计算机应用基础", knowledgePath: ["数据库", "数据模型", "概念模型", "E-R 模型"], answer: "多对多", analysis: "一个学生可选多门课程，一门课程也可被多名学生选择。", updatedAt: "2026-02-16 10:15" },
  { id: "QB0004", title: "SQL 查询条件", questionStem: "SQL 查询语句中，用于筛选记录的条件子句关键字是____。", questionType: "填空题", difficulty: "较易", major: "电子与信息类", resourceLibrary: "计算机应用基础", knowledgePath: ["数据库", "关系数据库", "SQL 查询", "条件查询"], answer: "WHERE", analysis: "WHERE 子句用于设置记录筛选条件。", updatedAt: "2026-02-15 16:40" },
  { id: "QB0005", title: "髋骨组成", questionStem: "请简述髋骨由哪三部分组成。", questionType: "简答题", difficulty: "较难", major: "医药卫生类", resourceLibrary: "人体解剖学基础", knowledgePath: ["运动系统", "骨学", "下肢骨", "髋骨结构"], answer: "髂骨、坐骨和耻骨", analysis: "三部分在髋臼处汇合。", updatedAt: "2026-02-14 08:55" },
  { id: "QB0006", title: "阅读细节定位", questionStem: "阅读材料后，找出作者说明事件发生时间的语句。", questionType: "综合题", difficulty: "困难", major: "英语", resourceLibrary: "职教高考英语", knowledgePath: ["阅读理解", "信息定位", "细节理解", "关键词定位"], answer: "根据材料作答", analysis: "先定位时间标志词，再核对上下文。", updatedAt: "2026-02-13 17:10" },
];

const teacherClasses = [
  {
    title: "高三计算机冲刺班",
    category: "电子与信息类",
    course: "数学基础强化 / 数据库基础",
    students: 42,
    teacherRole: "任课教师",
    status: "教学中",
    statusTone: "green",
  },
  {
    title: "高三英语提升班",
    category: "文化课",
    course: "英语阅读提分",
    students: 36,
    teacherRole: "任课教师",
    status: "教学中",
    statusTone: "green",
  },
  {
    title: "语文应用写作班",
    category: "文化课",
    course: "语文应用文写作",
    students: 28,
    teacherRole: "班主任",
    status: "教学中",
    statusTone: "green",
  },
];

const teacherStudents = [
  { id: "student-001", title: "张同学", phone: "138****9001", className: "高三计算机冲刺班", category: "电子与信息类", course: "数学基础强化", progress: "62%", assignment: "未提交", qa: "待回复", lastStudy: "今天 14:20" },
  { id: "student-002", title: "李同学", phone: "138****9002", className: "高三计算机冲刺班", category: "电子与信息类", course: "数据库基础", progress: "48%", assignment: "已提交", qa: "已回复", lastStudy: "昨天 19:40" },
  { id: "student-003", title: "王同学", phone: "138****9003", className: "高三英语提升班", category: "文化课", course: "英语阅读提分", progress: "100%", assignment: "已出分", qa: "无", lastStudy: "04-24 20:10" },
  { id: "student-004", title: "赵同学", phone: "138****9004", className: "高三计算机冲刺班", category: "电子与信息类", course: "计算机网络基础", progress: "33%", assignment: "缺交", qa: "待补充", lastStudy: "04-23 18:30" },
  { id: "student-005", title: "陈同学", phone: "138****9005", className: "语文应用写作班", category: "文化课", course: "语文应用文写作", progress: "20%", assignment: "已提交", qa: "已回复", lastStudy: "04-22 16:15" },
];

const teacherClassesStorageKey = "prototype.school-demo.teacher-wang.classes.v1";
const teacherStudentsStorageKey = "prototype.school-demo.teacher-wang.students.v1";

function readPrototypeCollection(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writePrototypeCollection(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getTeacherClasses() {
  return readPrototypeCollection(teacherClassesStorageKey, teacherClasses);
}

function getTeacherStudents() {
  return readPrototypeCollection(teacherStudentsStorageKey, teacherStudents);
}

const teacherAssignments = classExams.map((item, index) => ({
  ...item,
  id: `assignment-${index + 1}`,
  className: index % 2 === 0 ? "高三计算机冲刺班" : "高三英语提升班",
  paper: item.title.replace(/[《》]/g, ""),
  passScore: 60,
  endAt: item.endAt || "2026-02-20 18:00:00",
  submittedCount: [18, 0, 42, 31, 39][index] || 0,
  missingCount: [24, 36, 0, 5, 3][index] || 0,
  gradingStatus: item.status === "已结束" ? (item.submitted ? "待批阅" : "无需批阅") : "未到批阅",
}));

const gradingRows = [
  { title: "张同学", objective: 62, subjective: "待批阅", status: "已提交", statusTone: "amber", submittedAt: "2026-02-12 13:40" },
  { title: "李同学", objective: 70, subjective: 18, status: "已出分", statusTone: "green", submittedAt: "2026-02-12 13:22" },
  { title: "赵同学", objective: 58, subjective: "待批阅", status: "已提交", statusTone: "amber", submittedAt: "2026-02-12 14:02" },
  { title: "陈同学", objective: "-", subjective: "-", status: "缺交", statusTone: "red", submittedAt: "-" },
];

const courseOwnerRows = classCourses.map((course, index) => ({
  ...course,
  source: index % 2 === 0 ? "本校课程" : "平台课程",
  publishedStatus: index % 3 === 0 ? "下架" : "上架",
  major: course.category === "文化课" ? course.subject : "电子与信息类",
  updatedAt: `2026-02-${String(18 - index).padStart(2, "0")} 10:30`,
}));

const teacherModuleMeta = {
  "course-resources": { metric: `${resourceRows.length} 项`, status: "只读", tone: "blue", accent: "bg-blue-600" },
  "question-bank": { metric: `${questionBankRows.length} 题`, status: "只读", tone: "cyan", accent: "bg-cyan-600" },
  "course-builder": { metric: "目录/课件/试卷", status: "组建课程", tone: "green", accent: "bg-emerald-600" },
  courses: { metric: `${courseOwnerRows.length} 门`, status: "含课程编辑", tone: "green", accent: "bg-emerald-600" },
  papers: { metric: `${papers.filter((paper) => paper.unlocked).length} 套`, status: "可组卷", tone: "blue", accent: "bg-cyan-600" },
  classes: { metric: `${teacherClasses.length} 个`, status: "含派课/作业/学情", tone: "green", accent: "bg-teal-600" },
};

function TeacherFrame({ active, subActive, title, desc, action, children, note }) {
  const { roleKey, setRoleKey } = usePrototypeRole();

  if (roleKey !== "teacher") {
    return (
      <>
        <PageHeader title="教师端" desc="教师端仅面向教师身份开放，用于处理课程资源、题库资源、课程、试卷和班级教学。" />
        <Card>
          <h2 className="m-0 text-xl">当前不是教师身份</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">请切换到教师身份后查看教师端前台页面。教师账号不进入学生学习、考试和虚拟实训流程。</p>
          <Meta><Button onClick={() => setRoleKey("teacher")}>切换为教师身份</Button></Meta>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} desc={desc} action={action} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <TeacherSideNav active={active} subActive={subActive || "overview"} />
        <div>
          {note ? <PrototypeNote className="mb-5">{note}</PrototypeNote> : null}
          {children}
        </div>
      </div>
    </>
  );
}

function TeacherSideNav({ active, subActive }) {
  const groups = ["资源", "内容", "班级"].map((group) => ({
    title: group,
    items: teacherNavItems.filter((item) => item.group === group),
  }));

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card className="!p-4">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-medium text-slate-500">当前账号</span>
          <div className="mt-1 flex items-center justify-between gap-3">
            <strong className="text-base text-slate-950">王老师</strong>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">教师</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-ui bg-slate-50 px-3 py-2">
              <span className="block text-slate-500">负责班级</span>
              <strong className="mt-1 block text-slate-900">{getTeacherClasses().length}</strong>
            </div>
            <div className="rounded-ui bg-slate-50 px-3 py-2">
              <span className="block text-slate-500">待处理</span>
              <strong className="mt-1 block text-slate-900">{qaRecords.filter((item) => item.status !== "已回复").length + gradingRows.filter((item) => item.status === "已提交").length}</strong>
            </div>
          </div>
        </div>
        <nav className="mt-4 grid gap-5">
          {groups.map((group) => (
            <div key={group.title}>
              <span className="mb-2 block px-2 text-xs font-semibold text-slate-400">{group.title}</span>
              <div className="grid gap-1">
                {group.items.map((item) => {
                  const meta = getModuleMeta(item.key);

                  return (
                    <div key={item.key}>
                      <a
                        className={`inline-flex min-h-9 w-full items-center justify-between rounded-ui px-3 text-sm font-medium transition ${
                          active === item.key ? "bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.14)]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                        href={item.href}
                      >
                        <span>{item.label}</span>
                        {meta.metric !== "-" ? <span className={`text-xs ${active === item.key ? "text-white/80" : "text-slate-400"}`}>{meta.metric}</span> : null}
                      </a>
                      {item.key === "classes" ? (
                        <div className="ml-3 mt-1 grid gap-1 border-l border-slate-200 pl-3">
                          {teacherClassSubItems.map((subItem) => (
                            <a
                              className={`rounded-ui px-3 py-2 text-sm transition ${
                                active === "classes" && subActive === subItem.key ? "bg-blue-50 font-medium text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                              }`}
                              href={subItem.href}
                              key={subItem.key}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </Card>
    </aside>
  );
}

function SectionTitle({ title, desc, action }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h2 className="m-0 flex items-center gap-2 text-xl text-slate-950">
          <span className="h-5 w-1 rounded-full bg-blue-600" />
          {title}
        </h2>
        {desc ? <p className="mb-0 mt-2 text-sm leading-6 text-muted">{desc}</p> : null}
      </div>
      {action}
    </div>
  );
}

function FormField({ label, children, className = "" }) {
  return (
    <label className={`grid gap-2 text-sm text-slate-700 ${className}`}>
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ placeholder, defaultValue = "", type = "text", ...props }) {
  const valueProps = props.value === undefined ? { defaultValue } : {};
  return <input className="min-h-10 rounded-ui border border-slate-200 px-3" placeholder={placeholder} type={type} {...valueProps} {...props} />;
}

function SelectInput({ options, defaultValue, ...props }) {
  const valueProps = props.value === undefined ? { defaultValue: defaultValue || options[0] } : {};
  return (
    <select className="min-h-10 rounded-ui border border-slate-200 bg-white px-3" {...valueProps} {...props}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function CascadingResourceFilters({ rows, value, onChange }) {
  const getOptions = (fieldRows, selector) => ["全部", ...Array.from(new Set(fieldRows.map(selector).filter(Boolean)))];
  const majorRows = value.major === "全部" ? rows : rows.filter((item) => item.major === value.major);
  const libraryRows = value.resourceLibrary === "全部" ? majorRows : majorRows.filter((item) => item.resourceLibrary === value.resourceLibrary);

  function rowsForKnowledgeLevel(level) {
    return libraryRows.filter((item) => value.knowledgePath.slice(0, level).every((selected, index) => (
      selected === "全部" || item.knowledgePath[index] === selected
    )));
  }

  function setMajor(major) {
    onChange({ major, resourceLibrary: "全部", knowledgePath: ["全部", "全部", "全部", "全部"] });
  }

  function setLibrary(resourceLibrary) {
    onChange({ ...value, resourceLibrary, knowledgePath: ["全部", "全部", "全部", "全部"] });
  }

  function setKnowledge(level, selected) {
    const knowledgePath = value.knowledgePath.map((item, index) => (
      index === level ? selected : index > level ? "全部" : item
    ));
    onChange({ ...value, knowledgePath });
  }

  return (
    <>
      <FormField label="科目/专业">
        <SelectInput options={getOptions(rows, (item) => item.major)} value={value.major} onChange={(event) => setMajor(event.target.value)} />
      </FormField>
      <FormField label="资源库">
        <SelectInput disabled={value.major === "全部"} options={getOptions(majorRows, (item) => item.resourceLibrary)} value={value.resourceLibrary} onChange={(event) => setLibrary(event.target.value)} />
      </FormField>
      {[0, 1, 2, 3].map((level) => (
        <FormField label={`${["一", "二", "三", "四"][level]}级知识点`} key={level}>
          <SelectInput
            disabled={value.resourceLibrary === "全部" || (level > 0 && value.knowledgePath[level - 1] === "全部")}
            options={getOptions(rowsForKnowledgeLevel(level), (item) => item.knowledgePath[level])}
            value={value.knowledgePath[level]}
            onChange={(event) => setKnowledge(level, event.target.value)}
          />
        </FormField>
      ))}
    </>
  );
}

function matchesResourceHierarchy(item, filters) {
  return (filters.major === "全部" || item.major === filters.major)
    && (filters.resourceLibrary === "全部" || item.resourceLibrary === filters.resourceLibrary)
    && filters.knowledgePath.every((selected, index) => selected === "全部" || item.knowledgePath[index] === selected);
}

function TeacherActionModal({ action, onClose }) {
  if (!action) return null;

  return (
    <Modal open={Boolean(action)} title={action.title} onClose={onClose} className={action.className || "w-[min(760px,100%)]"}>
      {action.body}
      <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
        <Button tone="secondary" onClick={onClose}>取消</Button>
        <Button onClick={onClose}>{action.confirm || "确认"}</Button>
      </div>
    </Modal>
  );
}

function statusTone(status) {
  if (["已回复", "已出分", "已提交", "教学中", "可引用"].includes(status)) return "green";
  if (["可组题"].includes(status)) return "blue";
  if (["待回复", "待补充", "未提交", "待批阅", "进行中"].includes(status)) return "amber";
  if (["缺交", "缺考"].includes(status)) return "red";
  return "gray";
}

export function TeacherResourcesPage() {
  const [resourceType, setResourceType] = useState("全部");
  const [hierarchy, setHierarchy] = useState({ major: "全部", resourceLibrary: "全部", knowledgePath: ["全部", "全部", "全部", "全部"] });
  const [keyword, setKeyword] = useState("");
  const [preview, setPreview] = useState(null);

  const rows = useMemo(() => resourceRows.filter((item) => (
    matchesResourceHierarchy(item, hierarchy)
      && (resourceType === "全部" || item.resourceType === resourceType)
      && (!keyword.trim() || item.title.includes(keyword.trim()))
  )), [hierarchy, keyword, resourceType]);

  return (
    <TeacherFrame
      active="course-resources"
      title="教学资源库"
      desc="查看学校已获授权的教学资源，资源按科目/专业、资源库和四级知识点组织。"
      note="本页只提供查看和预览。资源归属关系固定为：科目/专业 → 资源库 → 四级知识点。"
    >
      <Card className="mb-5 !p-4">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <strong className="text-slate-950">筛选教学资源</strong>
            <Tag tone="blue">当前 {rows.length} 项</Tag>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CascadingResourceFilters rows={resourceRows} value={hierarchy} onChange={setHierarchy} />
            <FormField label="资源类型"><SelectInput options={["全部", "微课", "慕课", "音频", "PPT", "PDF", "图文"]} value={resourceType} onChange={(event) => setResourceType(event.target.value)} /></FormField>
            <FormField label="名称"><TextInput placeholder="请输入资源名称或关键字" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
          </div>
        </div>
      </Card>

      <DataTable
        columns={["素材名称", "素材类型", "科目/专业", "资源库", "知识点路径", "更新时间", "操作"]}
        gridTemplateColumns="minmax(210px,1.35fr) 90px 120px 150px minmax(260px,1.7fr) 150px 90px"
        rows={rows}
        renderRow={(item) => (
          <>
            <strong>{item.title}</strong>
            <Tag>{item.resourceType}</Tag>
            <span>{item.major}</span>
            <span>{item.resourceLibrary}</span>
            <span>{item.knowledgePath.join(" → ")}</span>
            <span>{item.updatedAt}</span>
            <Button tone="ghost" onClick={() => setPreview(item)}>预览</Button>
          </>
        )}
      />

      <Modal open={Boolean(preview)} title="资源预览" onClose={() => setPreview(null)}>
        {preview ? (
          <div className="grid gap-4">
            <Meta className="mt-0"><Tag tone="blue">{preview.resourceType}</Tag><Tag>{preview.major}</Tag><Tag>{preview.resourceLibrary}</Tag></Meta>
            <h3 className="m-0">{preview.title}</h3>
            <p className="m-0 rounded-ui border border-line bg-slate-50 p-4 leading-7">知识点路径：{preview.knowledgePath.join(" → ")}</p>
          </div>
        ) : null}
      </Modal>
    </TeacherFrame>
  );
}

export function TeacherQuestionBankPage() {
  const [questionType, setQuestionType] = useState("全部");
  const [difficulty, setDifficulty] = useState("全部");
  const [hierarchy, setHierarchy] = useState({ major: "全部", resourceLibrary: "全部", knowledgePath: ["全部", "全部", "全部", "全部"] });
  const [keyword, setKeyword] = useState("");
  const [preview, setPreview] = useState(null);
  const questionRows = questionBankRows.filter((item) => {
    const text = `${item.id}${item.title}${item.questionStem}`;
    return matchesResourceHierarchy(item, hierarchy)
      && (questionType === "全部" || item.questionType === questionType)
      && (difficulty === "全部" || item.difficulty === difficulty)
      && (!keyword.trim() || text.includes(keyword.trim()));
  });

  return (
    <TeacherFrame
      active="question-bank"
      title="题库"
      desc="查看学校已获授权的题目，题目与教学资源使用同一套专业、资源库和四级知识点目录。"
      note="本页只提供查看和预览。题目归属关系固定为：科目/专业 → 资源库 → 四级知识点。"
    >
      <Card className="mb-5 !p-4">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <strong className="text-slate-950">筛选题目</strong>
            <Tag tone="cyan">当前 {questionRows.length} 题</Tag>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CascadingResourceFilters rows={questionBankRows} value={hierarchy} onChange={setHierarchy} />
            <FormField label="题目类型"><SelectInput options={["全部", "单选题", "多选题", "判断题", "填空题", "简答题", "综合题"]} value={questionType} onChange={(event) => setQuestionType(event.target.value)} /></FormField>
            <FormField label="难度"><SelectInput options={["全部", "容易", "较易", "适中", "较难", "困难"]} value={difficulty} onChange={(event) => setDifficulty(event.target.value)} /></FormField>
            <FormField label="名称"><TextInput placeholder="请输入题干或题目 ID" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
          </div>
        </div>
      </Card>

      <DataTable
        columns={["题目 ID", "题干", "题型", "科目/专业", "知识点路径", "更新时间", "操作"]}
        gridTemplateColumns="90px minmax(260px,1.55fr) 90px 110px minmax(260px,1.55fr) 145px 90px"
        rows={questionRows}
        renderRow={(item) => (
          <>
            <strong>{item.id}</strong>
            <span>{item.questionStem}</span>
            <Tag>{item.questionType}</Tag>
            <span>{item.major}</span>
            <span>{item.knowledgePath.join(" → ")}</span>
            <span>{item.updatedAt}</span>
            <Button tone="ghost" onClick={() => setPreview(item)}>预览</Button>
          </>
        )}
      />

      <Modal open={Boolean(preview)} title="题库预览" onClose={() => setPreview(null)}>
        {preview ? (
          <div className="grid gap-4">
            <Meta className="mt-0"><Tag tone="cyan">{preview.questionType}</Tag><Tag>{preview.difficulty}</Tag><Tag>{preview.major}</Tag></Meta>
            <h3 className="m-0">{preview.id} · {preview.title}</h3>
            <p className="m-0 rounded-ui border border-line bg-slate-50 p-4 leading-7">{preview.questionStem}</p>
            <p className="m-0 text-sm leading-6 text-muted">正确答案：{preview.answer}</p>
            <p className="m-0 text-sm leading-6 text-muted">题目解析：{preview.analysis}</p>
            <p className="m-0 text-sm leading-6 text-muted">知识点路径：{preview.knowledgePath.join(" → ")}</p>
          </div>
        ) : null}
      </Modal>
    </TeacherFrame>
  );
}

export function TeacherCourseBuilderPage() {
  const [tab, setTab] = useState("catalog");
  const [action, setAction] = useState(null);

  return (
    <TeacherFrame
      active="course-builder"
      title="组课管理"
      desc="从课程资源和题库资源中组织校本课程，维护课程基础信息、目录、课件、练习和课程试卷。"
      action={<><Button href="#/teacher/courses" tone="secondary">返回我的课程</Button><Button onClick={() => setAction({ title: "保存课程草稿", body: "课程草稿会保留当前目录、课件和练习配置，发布前学生不可见。" })}>保存草稿</Button></>}
      note="组课管理负责维护课程基础信息、目录、课件、练习和课程试卷；平台官方课程不可直接改写，教师可引用或复制为校本课程后再派发给班级。"
    >
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "base", label: "基础信息" },
          { key: "catalog", label: "课程目录" },
          { key: "materials", label: "课件资料" },
          { key: "papers", label: "课程试卷" },
        ]}
      />
      {tab === "base" ? <CourseBaseForm /> : null}
      {tab === "catalog" ? <CourseCatalogEditor onAction={setAction} /> : null}
      {tab === "materials" ? <CourseMaterialEditor onAction={setAction} /> : null}
      {tab === "papers" ? <CoursePaperEditor onAction={setAction} /> : null}
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

function CourseBaseForm() {
  return (
    <Card>
      <SectionTitle title="课程基础信息" />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="选择专业"><SelectInput defaultValue="数学" options={["语文", "数学", "英语", ...categories.map((item) => item.name)]} /></FormField>
        <FormField label="课程名称"><TextInput defaultValue="数学基础强化" placeholder="请输入课程名称" /></FormField>
        <FormField className="md:col-span-2" label="课程封面">
          <input accept="image/*" className="min-h-10 rounded-ui border border-line bg-white px-3 py-2" type="file" />
        </FormField>
        <FormField className="md:col-span-2" label="课程简介">
          <textarea className="min-h-28 rounded-ui border border-line p-3" defaultValue="围绕职教高考数学基础模块，按函数、数列、几何三个单元组织讲解、资料和练习。" />
        </FormField>
      </div>
    </Card>
  );
}

function CourseCatalogEditor({ onAction }) {
  return (
    <Card>
      <SectionTitle
        title="课程目录"
        action={<Button onClick={() => onAction({ title: "新增课时", body: <LessonForm />, confirm: "保存课时" })}>新增课时</Button>}
      />
      <div className="grid gap-4">
        {courseCatalog.map((chapter) => (
          <section className="rounded-ui border border-line p-4" key={chapter.title}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="m-0 text-lg">{chapter.title}</h3>
              <Button tone="secondary" onClick={() => onAction({ title: "编辑章节", body: <FormField label="章节名称"><TextInput defaultValue={chapter.title} /></FormField> })}>编辑章节</Button>
            </div>
            <div className="grid gap-3">
              {chapter.lessons.map((lesson) => (
                <div className="grid gap-3 rounded-ui border border-line bg-slate-50 p-4 md:grid-cols-[1fr_96px_90px_150px] md:items-center" key={lesson.title}>
                  <div>
                    <strong>{lesson.title}</strong>
                    <p className="mb-0 mt-1 text-sm text-muted">{lesson.duration}</p>
                  </div>
                  <Tag tone="blue">{lesson.type}</Tag>
                  <Tag tone={lesson.statusTone}>{lesson.status}</Tag>
                  <Meta className="mt-0 justify-end"><Button tone="ghost" onClick={() => onAction({ title: "维护课时", body: <LessonForm lesson={lesson} />, confirm: "保存" })}>维护</Button></Meta>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}

function LessonForm({ lesson }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField label="课时名称"><TextInput defaultValue={lesson?.title || ""} placeholder="请输入课时名称" /></FormField>
      <FormField label="课时类型"><SelectInput defaultValue={lesson?.type || "微课"} options={["微课", "慕课", "音频", "PDF", "PPT", "富文本", "练习"]} /></FormField>
      <FormField label="学习时长"><TextInput defaultValue={lesson?.duration || ""} placeholder="如 12 分钟" /></FormField>
      <FormField label="课时状态"><SelectInput defaultValue={lesson?.status || "未开始"} options={["草稿", "未开始", "进行中", "已完成"]} /></FormField>
      <FormField className="md:col-span-2" label="绑定资源">
        <textarea className="min-h-24 rounded-ui border border-line p-3" placeholder="从课程资源选择视频、课件或富文本内容；练习题目从题库资源选择" />
      </FormField>
    </div>
  );
}

function CourseMaterialEditor({ onAction }) {
  return (
    <Card>
      <SectionTitle title="课件资料" action={<Button onClick={() => onAction({ title: "添加课件", body: <MaterialForm />, confirm: "添加" })}>添加课件</Button>} />
      <DataTable
        columns={["课件名称", "类型", "大小", "展示位置", "操作"]}
        gridTemplateColumns="minmax(260px,1.5fr) 90px 100px 140px 170px"
        rows={courseMaterials}
        renderRow={(item) => (
          <>
            <strong>{item.title}</strong>
            <Tag tone="blue">{item.type}</Tag>
            <span>{item.size}</span>
            <span>课程详情/课时</span>
            <Meta className="mt-0 justify-end"><Button tone="ghost" onClick={() => onAction({ title: "预览课件", body: `${item.title} · ${item.type} · ${item.size}` })}>预览</Button><Button tone="secondary">移除</Button></Meta>
          </>
        )}
      />
    </Card>
  );
}

function MaterialForm() {
  return (
    <div className="grid gap-4">
      <FormField label="课件来源"><SelectInput options={["从资源库选择", "本地上传"]} /></FormField>
      <FormField label="课件名称"><TextInput placeholder="请输入课件名称" /></FormField>
      <FormField label="课件说明"><textarea className="min-h-24 rounded-ui border border-line p-3" placeholder="说明课件用途或关联课时" /></FormField>
    </div>
  );
}

function CoursePaperEditor({ onAction }) {
  return (
    <Card>
      <SectionTitle title="课程试卷" action={<Button onClick={() => onAction({ title: "选择课程试卷", body: <PaperPicker />, confirm: "绑定试卷" })}>绑定试卷</Button>} />
      <DataTable
        columns={["试卷", "类型", "题量", "总分", "用途", "操作"]}
        gridTemplateColumns="minmax(240px,1.5fr) 110px 90px 90px 140px 140px"
        rows={papers.filter((paper) => paper.unlocked).slice(0, 5)}
        renderRow={(paper) => (
          <>
            <strong>{paper.title}</strong>
            <span>{paper.subject}</span>
            <span>{paper.questionCount} 题</span>
            <span>{paper.totalScore} 分</span>
            <Tag tone={paper.source === "本校" ? "green" : "blue"}>{paper.source === "本校" ? "本校试卷" : "平台试卷"}</Tag>
            <Button tone="secondary" onClick={() => onAction({ title: "试卷预览", body: `${paper.title}：${paper.questionCount} 题，${paper.totalScore} 分，${paper.duration} 分钟。` })}>预览</Button>
          </>
        )}
      />
    </Card>
  );
}

function PaperPicker({ major = "全部" }) {
  const rows = papers.filter((paper) => paper.unlocked && (
    major === "全部" || (paper.category === "文化课" ? paper.subject : paper.category) === major
  ));

  return (
    <div className="grid gap-3">
      {rows.slice(0, 4).map((paper) => (
        <label className="flex items-start gap-3 rounded-ui border border-line p-3" key={paper.title}>
          <input className="mt-1" name="paper" type="radio" />
          <span>
            <strong>{paper.title}</strong>
            <span className="mt-1 block text-sm text-muted">{paper.subject} · {paper.questionCount} 题 · {paper.totalScore} 分</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function TeacherCoursesPage() {
  const [keyword, setKeyword] = useState("");
  const [publishedStatus, setPublishedStatus] = useState("全部");
  const [major, setMajor] = useState("全部");
  const [action, setAction] = useState(null);
  const majorOptions = ["全部", ...Array.from(new Set(courseOwnerRows.map((course) => course.major)))];
  const rows = courseOwnerRows.filter((course) => (
    (!keyword.trim() || course.title.includes(keyword.trim()))
    && (publishedStatus === "全部" || course.publishedStatus === publishedStatus)
    && (major === "全部" || course.major === major)
  ));

  return (
    <TeacherFrame active="courses" title="我的课程" desc="查看自己创建或负责的课程，并进入组课管理维护目录、课件、练习和课程试卷。" action={<Button href="#/teacher/course-builder">新建课程</Button>}>
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="科目/专业"><SelectInput options={majorOptions} value={major} onChange={(event) => setMajor(event.target.value)} /></FormField>
          <FormField label="课程上架状态"><SelectInput options={["全部", "上架", "下架"]} value={publishedStatus} onChange={(event) => setPublishedStatus(event.target.value)} /></FormField>
          <FormField label="课程名称"><TextInput placeholder="请输入课程名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
        </div>
      </Card>
      <DataTable
        columns={["课程封面", "课程名称", "所属专业", "课程来源", "上架状态", "更新时间", "操作"]}
        gridTemplateColumns="100px minmax(180px,1.2fr) 120px 100px 90px 150px minmax(360px,2fr)"
        rows={rows}
        renderRow={(course) => (
          <>
            <span className="block h-14 w-20 rounded-ui" style={{ background: course.coverTone }} />
            <strong>{course.title}</strong>
            <span>{course.major}</span>
            <Tag tone={course.source === "本校课程" ? "blue" : "gray"}>{course.source}</Tag>
            <Tag tone={course.publishedStatus === "上架" ? "green" : "gray"}>{course.publishedStatus}</Tag>
            <span>{course.updatedAt}</span>
            {course.source === "本校课程" ? (
              <Meta className="mt-0 justify-end">
                <Button href="#/teacher/course-builder" tone="ghost">课时管理</Button>
                <Button href="#/teacher/course-builder" tone="secondary">课件管理</Button>
                <Button href="#/teacher/course-builder" tone="secondary">试卷管理</Button>
                <Button href="#/teacher/course-builder" tone="secondary">信息编辑</Button>
                <Button disabled={course.publishedStatus === "上架"} tone="secondary" onClick={() => setAction({ title: "删除课程", body: `确认删除《${course.title}》？上架课程不可删除。` })}>删除</Button>
              </Meta>
            ) : <span className="text-sm text-muted">仅可查看</span>}
          </>
        )}
      />
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

export function TeacherPapersPage() {
  const [keyword, setKeyword] = useState("");
  const [paperStatus, setPaperStatus] = useState("全部");
  const [major, setMajor] = useState("全部");
  const [paperCategory, setPaperCategory] = useState("全部");
  const [action, setAction] = useState(null);
  const availablePapers = papers.filter((paper) => paper.unlocked).map((paper, index) => ({
    ...paper,
    paperCategory: paper.type,
    paperSource: paper.source === "本校" ? "本校试卷" : "平台试卷",
    paperStatus: index % 3 === 0 ? "下架" : "上架",
    major: paper.category === "文化课" ? paper.subject : paper.category,
  }));
  const rows = availablePapers.filter((paper) => (
    (!keyword.trim() || paper.title.includes(keyword.trim()))
    && (paperStatus === "全部" || paper.paperStatus === paperStatus)
    && (major === "全部" || paper.major === major)
    && (paperCategory === "全部" || paper.paperCategory === paperCategory)
  ));
  const majorOptions = ["全部", ...Array.from(new Set(availablePapers.map((paper) => paper.major)))];
  const categoryOptions = ["全部", ...Array.from(new Set(availablePapers.map((paper) => paper.paperCategory)))];

  return (
    <TeacherFrame
      active="papers"
      title="试卷管理"
      desc="查看平台试卷和本校试卷，本校教师创建的试卷按科目/专业归属。"
      action={<Button onClick={() => setAction({ title: "新建试卷", body: <PaperEditor />, confirm: "保存试卷" })}>新建试卷</Button>}
      note="课程与试卷直接绑定科目/专业，不绑定资源库；只有选题时才进入题库的资源库与知识点目录。"
    >
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField label="科目/专业"><SelectInput options={majorOptions} value={major} onChange={(event) => setMajor(event.target.value)} /></FormField>
          <FormField label="上架状态"><SelectInput options={["全部", "上架", "下架"]} value={paperStatus} onChange={(event) => setPaperStatus(event.target.value)} /></FormField>
          <FormField label="试卷分类"><SelectInput options={categoryOptions} value={paperCategory} onChange={(event) => setPaperCategory(event.target.value)} /></FormField>
          <FormField label="试卷名称"><TextInput placeholder="请输入试卷名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
        </div>
      </Card>
      <DataTable
        columns={["试卷名称", "试卷来源", "所属专业", "总题数", "总分", "上架状态", "操作"]}
        gridTemplateColumns="minmax(210px,1.4fr) 100px 120px 80px 70px 90px minmax(360px,2fr)"
        rows={rows}
        renderRow={(paper) => (
          <>
            <strong>{paper.title}</strong>
            <span>{paper.paperSource}</span>
            <span>{paper.major}</span>
            <span>{paper.questionCount}</span>
            <span>{paper.totalScore}</span>
            <Tag tone={paper.paperStatus === "上架" ? "green" : "gray"}>{paper.paperStatus}</Tag>
            <Meta className="mt-0 justify-end">
              <Button tone="ghost" onClick={() => setAction({ title: "试卷预览", body: `${paper.title}：${paper.questionCount} 题，${paper.totalScore} 分。` })}>预览</Button>
              {paper.paperSource === "本校试卷" ? <Button tone="secondary" onClick={() => setAction({ title: "随机组卷", body: "按题库、知识点、题型和难度设置抽题规则。" })}>随机组卷</Button> : null}
              {paper.paperSource === "本校试卷" ? <Button tone="secondary" onClick={() => setAction({ title: "试题管理", body: "管理试卷中已经选择的题目。" })}>试题管理</Button> : null}
              {paper.paperSource === "本校试卷" ? <Button tone="secondary" onClick={() => setAction({ title: "编辑试卷", body: <PaperEditor paper={paper} />, confirm: "保存" })}>编辑</Button> : null}
              {paper.paperSource === "本校试卷" ? <Button disabled={paper.paperStatus === "上架"} tone="secondary" onClick={() => setAction({ title: "删除试卷", body: `确认删除《${paper.title}》？上架试卷不可删除。` })}>删除</Button> : null}
            </Meta>
          </>
        )}
      />
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

function PaperEditor({ paper }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField label="选择专业"><SelectInput defaultValue={paper?.major || "数学"} options={["语文", "数学", "英语", ...categories.map((item) => item.name)]} /></FormField>
      <FormField label="试卷名称"><TextInput defaultValue={paper?.title || ""} placeholder="请输入试卷名称" /></FormField>
      <FormField label="试卷分类"><SelectInput defaultValue={paper?.type || "一轮复习"} options={["一轮复习", "二轮复习", "三轮冲刺"]} /></FormField>
      <FormField label="试卷年份"><SelectInput defaultValue={paper?.year || "2025"} options={["2026", "2025", "2024", "2023"]} /></FormField>
      <FormField className="md:col-span-2" label="试卷描述">
        <textarea className="min-h-20 rounded-ui border border-line p-3" placeholder="请输入试卷描述" />
      </FormField>
    </div>
  );
}

export function TeacherClassesPage() {
  const [classes, setClasses] = useState(getTeacherClasses);
  const [students] = useState(getTeacherStudents);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: "", category: "电子与信息类" });
  const rows = classes.map((item) => ({
    ...item,
    students: students.filter((student) => student.className === item.title).length,
  }));

  function createClass() {
    const title = draft.title.trim();
    if (!title) {
      setError("请输入班级名称。");
      return;
    }
    if (classes.some((item) => item.title === title)) {
      setError("班级名称已存在，请更换名称。");
      return;
    }

    const nextClasses = [...classes, {
      title,
      category: draft.category,
      course: "暂未派课",
      students: 0,
      teacherRole: "本人创建",
      status: "教学中",
      statusTone: "green",
    }];
    setClasses(nextClasses);
    writePrototypeCollection(teacherClassesStorageKey, nextClasses);
    setDraft({ title: "", category: "电子与信息类" });
    setError("");
    setModalOpen(false);
  }

  return (
    <TeacherFrame
      active="classes"
      subActive="overview"
      title="我的班级"
      desc="创建并维护当前教师负责的班级，再从班级维度进入学生分配、派课、作业、学情和答疑。"
      action={<Button onClick={() => { setError(""); setModalOpen(true); }}>新建班级</Button>}
    >
      <section className="mb-5 grid gap-4 md:grid-cols-4">
        {teacherClassSubItems.filter((item) => item.key !== "overview").map((item) => (
          <Card className="flex min-h-[132px] flex-col justify-between gap-4 !p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]" key={item.key}>
            <div>
              <Tag tone={getClassSubTone(item.key)}>{item.label}</Tag>
            </div>
            <Button href={item.href} tone="secondary">进入</Button>
          </Card>
        ))}
      </section>
      <DataTable
        columns={["班级", "专业", "已派课程", "学生", "本人关系", "状态", "操作"]}
        gridTemplateColumns="minmax(180px,1.4fr) 120px minmax(200px,1.4fr) 80px 100px 90px 250px"
        rows={rows}
        renderRow={(item) => (
          <>
            <strong>{item.title}</strong>
            <span>{item.category}</span>
            <span>{item.course}</span>
            <span>{item.students} 人</span>
            <span>{item.teacherRole}</span>
            <Tag tone={item.statusTone}>{item.status}</Tag>
            <Meta className="mt-0 justify-end"><Button href={`#/teacher/students?class=${encodeURIComponent(item.title)}`} tone="ghost">管理学生</Button><Button href="#/teacher/assign-course" tone="secondary">派课</Button><Button href="#/teacher/qa" tone="secondary">答疑</Button></Meta>
          </>
        )}
      />
      <PrototypeNote className="mt-5">一期为规避后台“谁创建归属谁”的权限限制，仅迁移新建班级和学生分配。班级冻结、解散及教师角色授权仍由学校后台处理。</PrototypeNote>
      <Modal open={modalOpen} title="新建班级" onClose={() => setModalOpen(false)}>
        <div className="grid gap-4">
          <FormField label="班级名称">
            <TextInput placeholder="例如：高三计算机冲刺 2 班" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
          </FormField>
          <FormField label="专业/科目">
            <SelectInput options={["电子与信息类", "文化课", "医药卫生类", "财经商贸类"]} value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} />
          </FormField>
        </div>
        {error ? <p className="mb-0 mt-4 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          <Button tone="secondary" onClick={() => setModalOpen(false)}>取消</Button>
          <Button onClick={createClass}>确认新建</Button>
        </div>
      </Modal>
    </TeacherFrame>
  );
}

export function TeacherAssignCoursePage() {
  const [classes] = useState(getTeacherClasses);
  const [className, setClassName] = useState(() => getTeacherClasses()[0]?.title || "");
  const [subject, setSubject] = useState("全部");
  const [action, setAction] = useState(null);
  const rows = courseOwnerRows.filter((course) => (
    course.publishedStatus === "上架" && (subject === "全部" || course.major === subject)
  ));

  return (
    <TeacherFrame active="classes" subActive="assign-course" title="班级派课" desc="为负责班级选择课程并派发，派发后学生可在学习中心看到课程。">
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-end">
          <FormField label="选择班级"><select className="min-h-10 rounded-ui border border-line bg-white px-3" value={className} onChange={(event) => setClassName(event.target.value)}>{classes.map((item) => <option key={item.title}>{item.title}</option>)}</select></FormField>
          <FilterButtonGroup label="课程范围" options={["全部", "语文", "数学", "英语", "电子与信息类"]} value={subject} onChange={setSubject} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((course) => (
          <Card key={course.title}>
            <Meta className="mt-0"><Tag tone="green">{course.publishedStatus}</Tag><Tag>{course.major}</Tag><Tag tone="blue">{course.source}</Tag></Meta>
            <h2 className="mb-0 mt-4 text-xl">{course.title}</h2>
            <p className="mb-0 mt-3 leading-7 text-muted">{course.lessonCount} 个课时 · 当前课时：{course.currentLesson} · 发布人 {course.publisher}</p>
            <Meta><Button onClick={() => setAction({ title: "确认派课", body: `将《${course.title}》派发给 ${className}。学生将在学习中心看到该课程，历史学习记录不受影响。`, confirm: "确认派课" })}>派发给班级</Button><Button tone="secondary" onClick={() => setAction({ title: "取消派课", body: `取消 ${className} 的《${course.title}》派课后，学生不能继续学习该课程，但历史学习记录保留。`, confirm: "确认取消" })}>取消派课</Button></Meta>
          </Card>
        ))}
      </div>
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

export function TeacherAssignmentsPage() {
  const [status, setStatus] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [action, setAction] = useState(null);
  const rows = teacherAssignments.filter((item) => (
    (status === "全部" || item.status === status)
    && (!keyword.trim() || item.title.includes(keyword.trim()))
  ));

  return (
    <TeacherFrame active="classes" subActive="assignments" title="班级作业" desc="管理教师布置给班级的非正式测评任务，学生入口在学习中心/作业。" action={<Button href="#/teacher/assignment-edit">新建作业</Button>}>
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="作业名称"><TextInput placeholder="请输入作业名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
          <FormField label="作业状态"><SelectInput options={["全部", "未开始", "进行中", "已结束"]} value={status} onChange={(event) => setStatus(event.target.value)} /></FormField>
        </div>
      </Card>
      <DataTable
        columns={["作业名称", "绑定试卷", "满分/及格分", "开始/结束时间", "状态", "提交", "批阅", "操作"]}
        gridTemplateColumns="minmax(190px,1.3fr) minmax(170px,1.2fr) 110px minmax(220px,1.4fr) 90px 110px 100px 250px"
        rows={rows}
        renderRow={(item) => (
          <>
            <strong>{item.title}</strong>
            <span>{item.paper}</span>
            <span>{item.totalScore} / {item.passScore}</span>
            <span>{item.startAt}<br />{item.endAt}</span>
            <Tag tone={item.statusTone}>{item.status}</Tag>
            <span>{item.submittedCount} 已交 / {item.missingCount} 未交</span>
            <Tag tone={statusTone(item.gradingStatus)}>{item.gradingStatus}</Tag>
            <Meta className="mt-0 justify-end"><Button href="#/teacher/assignment-edit" tone="ghost">编辑</Button><Button href="#/teacher/grading" tone="secondary">批阅</Button><Button href="#/teacher/assignment-stats" tone="secondary">统计</Button><Button tone="secondary" onClick={() => setAction({ title: "删除班级作业", body: "删除后学生端学习中心不再展示该作业；已提交记录建议后端保留审计记录。", confirm: "确认删除" })}>删除</Button></Meta>
          </>
        )}
      />
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

export function TeacherAssignmentEditorPage() {
  const [action, setAction] = useState(null);
  const [major, setMajor] = useState("电子与信息类");

  return (
    <TeacherFrame
      active="classes"
      subActive="assignments"
      title="新建班级作业"
      desc="为当前班级设置作业名称、专业、关联试卷和开始结束时间。"
      action={<Button href="#/teacher/assignments" tone="secondary">返回作业列表</Button>}
    >
      <Card>
        <div className="mb-5 rounded-ui border border-line bg-slate-50 p-4 text-sm">
          当前班级：<strong>高三计算机冲刺班</strong> · 班级专业：<strong>电子与信息类</strong>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="作业名称"><TextInput defaultValue="《数学基础知识》阶段作业（二）" /></FormField>
          <FormField label="选择专业"><SelectInput value={major} options={["语文", "数学", "英语", "电子与信息类"]} onChange={(event) => setMajor(event.target.value)} /></FormField>
          <FormField label="开始时间"><TextInput defaultValue="2026-02-20 12:00:00" type="text" /></FormField>
          <FormField label="结束时间"><TextInput defaultValue="2026-02-20 18:00:00" type="text" /></FormField>
          <FormField className="md:col-span-2" label="选择作业试卷">
            <div className="rounded-ui border border-line p-4">
              <PaperPicker major={major} />
            </div>
          </FormField>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          <Button href="#/teacher/assignments" tone="secondary">取消</Button>
          <Button onClick={() => setAction({ title: "保存班级作业", body: "保存后作业进入班级作业列表；未开始前可继续编辑，开始后锁定班级、试卷和时长。", confirm: "保存" })}>保存作业</Button>
        </div>
      </Card>
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

export function TeacherGradingPage() {
  const [activeStudent, setActiveStudent] = useState(gradingRows[0]);
  const [action, setAction] = useState(null);

  return (
    <TeacherFrame active="classes" subActive="assignments" title="作业批阅" desc="批阅主观题和综合题中的主观子题；客观题自动评分且不可人工改分。" action={<Button href="#/teacher/assignments" tone="secondary">返回作业列表</Button>}>
      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <Card>
          <SectionTitle title="提交列表" />
          <DataTable
            columns={["学生", "客观题", "主观题", "状态", "提交时间", "操作"]}
            gridTemplateColumns="110px 90px 110px 90px 150px 120px"
            rows={gradingRows}
            renderRow={(row) => (
              <>
                <strong>{row.title}</strong>
                <span>{row.objective}</span>
                <span>{row.subjective}</span>
                <Tag tone={row.statusTone}>{row.status}</Tag>
                <span>{row.submittedAt}</span>
                <Button tone="ghost" onClick={() => setActiveStudent(row)}>批阅</Button>
              </>
            )}
          />
        </Card>
        <Card>
          <SectionTitle title="主观题批阅" desc={activeStudent ? `${activeStudent.title} · 综合题第 2 问` : ""} />
          <div className="rounded-ui border border-line bg-slate-50 p-4 leading-7">
            请简述 TCP 与 UDP 在连接方式和可靠性上的差异，并结合应用场景举例。
          </div>
          <FormField className="mt-4" label="学生答案">
            <textarea className="min-h-28 rounded-ui border border-line p-3" defaultValue="TCP 面向连接，比较可靠，UDP 不建立连接，适合实时性要求高的场景。" />
          </FormField>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="主观题得分"><TextInput defaultValue="18" /></FormField>
            <FormField label="批阅状态"><SelectInput defaultValue="已批阅" options={["待批阅", "已批阅", "需复核"]} /></FormField>
          </div>
          <FormField className="mt-4" label="评语">
            <textarea className="min-h-24 rounded-ui border border-line p-3" defaultValue="核心区别正确，建议补充 TCP 重传和 UDP 低延迟场景。" />
          </FormField>
          <Meta><Button onClick={() => setAction({ title: "保存批阅结果", body: "保存后该学生主观题得分进入作业总分，学生可在作业解析中查看评语。", confirm: "保存" })}>保存批阅</Button><Button tone="secondary">下一份</Button></Meta>
        </Card>
      </section>
      <TeacherActionModal action={action} onClose={() => setAction(null)} />
    </TeacherFrame>
  );
}

export function TeacherAssignmentStatsPage() {
  return (
    <TeacherFrame active="classes" subActive="assignments" title="班级作业统计" desc="围绕单次班级作业查看提交、缺交、成绩和批阅状态，不做跨模块经营看板。" action={<Button href="#/teacher/assignments" tone="secondary">返回作业列表</Button>}>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="作业" value="阶段作业" />
        <Stat label="已提交" value="39" />
        <Stat label="待批阅" value="3" />
        <Stat label="缺交" value="3" />
      </div>
      <Card className="mt-5">
        <SectionTitle title="学生作业结果" />
        <DataTable
          columns={["学生", "客观题", "主观题", "总分", "状态", "操作"]}
          gridTemplateColumns="120px 100px 100px 100px 100px 140px"
          rows={gradingRows}
          renderRow={(row) => (
            <>
              <strong>{row.title}</strong>
              <span>{row.objective}</span>
              <span>{row.subjective}</span>
              <strong>{Number(row.objective) && Number(row.subjective) ? Number(row.objective) + Number(row.subjective) : "-"}</strong>
              <Tag tone={row.statusTone}>{row.status}</Tag>
              <Button href="#/teacher/grading" tone="secondary">查看批阅</Button>
            </>
          )}
        />
      </Card>
    </TeacherFrame>
  );
}

export function TeacherStudentsPage() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const [classes] = useState(getTeacherClasses);
  const [students, setStudents] = useState(getTeacherStudents);
  const requestedClass = params.get("class");
  const requestedClassIsValid = requestedClass && classes.some((item) => item.title === requestedClass);
  const initialStudentClass = requestedClassIsValid ? requestedClass : classes[0]?.title || "未分班";
  const [className, setClassName] = useState(requestedClassIsValid ? requestedClass : "全部");
  const [keyword, setKeyword] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [targetClass, setTargetClass] = useState(() => getTeacherClasses()[0]?.title || "");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: "", phone: "", className: initialStudentClass });
  const rows = students.filter((item) => {
    const matchClass = className === "全部" || item.className === className;
    const text = `${item.title}${item.phone}${item.course}`;
    return matchClass && (!keyword.trim() || text.includes(keyword.trim()));
  });

  function updateStudents(nextStudents) {
    setStudents(nextStudents);
    writePrototypeCollection(teacherStudentsStorageKey, nextStudents);
  }

  function assignStudent(studentId, nextClassName) {
    const selectedClass = classes.find((item) => item.title === nextClassName);
    updateStudents(students.map((item) => item.id === studentId ? {
      ...item,
      className: nextClassName,
      category: selectedClass?.category || "待分配",
    } : item));
  }

  function assignSelectedStudents() {
    if (!selectedStudentIds.length || !targetClass) return;
    const selectedClass = classes.find((item) => item.title === targetClass);
    updateStudents(students.map((item) => selectedStudentIds.includes(item.id) ? {
      ...item,
      className: targetClass,
      category: selectedClass?.category || item.category,
    } : item));
    setSelectedStudentIds([]);
  }

  function createStudent() {
    const title = draft.title.trim();
    const phone = draft.phone.trim();
    if (!title || !phone) {
      setError("请输入学生姓名和手机号。");
      return;
    }
    if (students.some((item) => item.phone === phone)) {
      setError("该手机号对应的学生已存在，请勿重复添加。");
      return;
    }
    const selectedClass = classes.find((item) => item.title === draft.className);
    const nextStudents = [...students, {
      id: `student-${Date.now()}`,
      title,
      phone,
      className: draft.className,
      category: selectedClass?.category || "待分配",
      course: "暂未派课",
      progress: "0%",
      assignment: "无",
      qa: "无",
      lastStudy: "暂无记录",
    }];
    updateStudents(nextStudents);
    setDraft({ title: "", phone: "", className: initialStudentClass });
    setError("");
    setModalOpen(false);
  }

  function toggleStudent(studentId) {
    setSelectedStudentIds((current) => current.includes(studentId)
      ? current.filter((id) => id !== studentId)
      : [...current, studentId]);
  }

  return (
    <TeacherFrame
      active="classes"
      subActive="students"
      title="学生管理"
      desc="添加学生、调整所属班级，并查看课程学习、作业、答疑和最近学习记录。"
      action={<Button onClick={() => { setError(""); setModalOpen(true); }}>添加学生</Button>}
    >
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <FormField label="班级"><select className="min-h-10 rounded-ui border border-line bg-white px-3" value={className} onChange={(event) => setClassName(event.target.value)}><option>全部</option><option>未分班</option>{classes.map((item) => <option key={item.title}>{item.title}</option>)}</select></FormField>
          <FormField label="关键词"><input className="min-h-10 rounded-ui border border-line px-3" placeholder="搜索学生姓名、手机号或课程" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></FormField>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
          <FormField label={`批量分班（已选 ${selectedStudentIds.length} 人）`}>
            <SelectInput options={classes.map((item) => item.title)} value={targetClass} onChange={(event) => setTargetClass(event.target.value)} />
          </FormField>
          <Button disabled={!selectedStudentIds.length || !targetClass} onClick={assignSelectedStudents}>分配到班级</Button>
        </div>
      </Card>
      <DataTable
        columns={["选择/学生", "所属班级", "当前课程", "学习进度", "作业状态", "答疑", "最近学习", "操作"]}
        gridTemplateColumns="150px minmax(180px,1.2fr) minmax(140px,1fr) 90px 90px 80px 110px 110px"
        rows={rows}
        renderRow={(item) => (
          <>
            <label className="flex items-start gap-3"><input checked={selectedStudentIds.includes(item.id)} className="mt-1 h-4 w-4" onChange={() => toggleStudent(item.id)} type="checkbox" /><span><strong>{item.title}</strong><span className="mt-1 block text-xs text-muted">{item.phone}</span></span></label>
            <SelectInput options={["未分班", ...classes.map((entry) => entry.title)]} value={item.className} onChange={(event) => assignStudent(item.id, event.target.value)} />
            <span>{item.course}</span>
            <span>{item.progress}</span>
            <Tag tone={statusTone(item.assignment)}>{item.assignment}</Tag>
            <Tag tone={statusTone(item.qa)}>{item.qa}</Tag>
            <span>{item.lastStudy}</span>
            <Button href={`#/teacher/student-detail?id=${encodeURIComponent(item.id)}`} tone="ghost">查看详情</Button>
          </>
        )}
      />
      <PrototypeNote className="mt-5">学生信息新增和分班已迁移到教师端；学生账号审核、停用、跨校转移等仍保留在学校后台。</PrototypeNote>
      <Modal open={modalOpen} title="添加学生" onClose={() => setModalOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="学生姓名"><TextInput placeholder="请输入学生姓名" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></FormField>
          <FormField label="手机号"><TextInput placeholder="请输入手机号" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /></FormField>
          <FormField className="md:col-span-2" label="所属班级"><SelectInput options={["未分班", ...classes.map((item) => item.title)]} value={draft.className} onChange={(event) => setDraft((current) => ({ ...current, className: event.target.value }))} /></FormField>
        </div>
        {error ? <p className="mb-0 mt-4 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          <Button tone="secondary" onClick={() => setModalOpen(false)}>取消</Button>
          <Button onClick={createStudent}>确认添加</Button>
        </div>
      </Modal>
    </TeacherFrame>
  );
}

export function TeacherStudentDetailPage() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const students = getTeacherStudents();
  const student = students.find((item) => item.id === params.get("id") || item.title === params.get("name")) || students[0];

  return (
    <TeacherFrame active="classes" subActive="students" title="学生详情" desc="查看学生基础信息、在学课程、课时学习记录和作业结果。" action={<Button href="#/teacher/students" tone="secondary">返回学情列表</Button>}>
      <section className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <Card>
          <Meta className="mt-0"><Tag tone="blue">{student.category}</Tag><Tag>{student.className}</Tag></Meta>
          <h2 className="mb-0 mt-4 text-2xl">{student.title}</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">{student.phone}</p>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted">当前课程</span><strong>{student.course}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-muted">学习进度</span><strong>{student.progress}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-muted">作业状态</span><strong>{student.assignment}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-muted">答疑状态</span><strong>{student.qa}</strong></div>
          </div>
        </Card>
        <div className="grid gap-5">
          <Card>
            <SectionTitle title="在学课程" />
            <DataTable
              columns={["课程", "课时", "当前课时", "进度", "状态"]}
              gridTemplateColumns="minmax(180px,1.4fr) 80px minmax(180px,1fr) 90px 90px"
              rows={classCourses.slice(0, 4)}
              renderRow={(course) => (
                <>
                  <strong>{course.title}</strong>
                  <span>{course.lessonCount}</span>
                  <span>{course.currentLesson}</span>
                  <span>{course.progress}</span>
                  <Tag tone={course.statusTone}>{course.status}</Tag>
                </>
              )}
            />
          </Card>
          <Card>
            <SectionTitle title="课时学习记录" />
            <div className="grid gap-3">
              {learningRecords.map((record) => (
                <div className="rounded-ui border border-line p-4" key={record.time}>
                  <Meta className="mt-0"><Tag tone="blue">{record.time}</Tag><Tag tone="green">{record.status}</Tag></Meta>
                  <strong className="mt-3 block">{record.title}</strong>
                  <p className="mb-0 mt-2 text-sm leading-6 text-muted">{record.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </TeacherFrame>
  );
}

export function TeacherQAPage() {
  const [status, setStatus] = useState("全部");
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const rows = qaRecords.map((item, index) => ({
    ...item,
    studentName: teacherStudents[index % teacherStudents.length].title,
    phone: teacherStudents[index % teacherStudents.length].phone,
  })).filter((item) => (
    (status === "全部" || item.status === status)
    && (!studentName.trim() || item.studentName.includes(studentName.trim()))
    && (!phone.trim() || item.phone.includes(phone.trim()))
  ));
  const currentRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <TeacherFrame active="classes" subActive="qa" title="答疑管理" desc="处理学生从课程详情和课时播放页发起的一对一留言式答疑。">
      <Card className="mb-5 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="学生姓名"><TextInput placeholder="请输入学生姓名" value={studentName} onChange={(event) => { setStudentName(event.target.value); setPage(1); }} /></FormField>
          <FormField label="学生手机号"><TextInput placeholder="请输入学生手机号" value={phone} onChange={(event) => { setPhone(event.target.value); setPage(1); }} /></FormField>
          <FormField label="回复状态"><SelectInput options={["全部", "待回复", "待补充", "已回复"]} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} /></FormField>
        </div>
      </Card>
      <DataTable
        columns={["问题", "课程/课时", "学生", "状态", "更新时间", "操作"]}
        gridTemplateColumns="minmax(260px,1.7fr) minmax(180px,1fr) 100px 90px 150px 130px"
        rows={currentRows}
        renderRow={(item) => (
          <>
            <div><strong>{item.course} / {item.lesson}</strong><p className="mb-0 mt-1 text-xs leading-5 text-muted">{item.question}</p></div>
            <span>{item.course} / {item.lesson}</span>
            <span>{item.studentName}</span>
            <Tag tone={item.statusTone}>{item.status}</Tag>
            <span>{item.updatedAt}</span>
            <Button tone="ghost" onClick={() => setActive(item)}>回复</Button>
          </>
        )}
      />
      <Pagination
        label="答疑列表"
        page={Math.min(page, Math.max(1, Math.ceil(rows.length / pageSize)))}
        pageSize={pageSize}
        total={rows.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        pageSizeOptions={[10, 20, 30]}
      />
      <Modal open={Boolean(active)} title="答疑回复" onClose={() => setActive(null)}>
        {active ? (
          <div className="grid gap-4">
            <Meta className="mt-0"><Tag tone={active.statusTone}>{active.status}</Tag><Tag>{active.course}</Tag><Tag>{active.lesson}</Tag></Meta>
            <div className="rounded-ui border border-line bg-slate-50 p-4">
              <strong>学生提问</strong>
              <p className="mb-0 mt-2 leading-7">{active.question}</p>
            </div>
            {active.reply ? (
              <div className="rounded-ui border border-green-100 bg-green-50 p-4">
                <strong className="text-green-700">已有回复</strong>
                <p className="mb-0 mt-2 leading-7">{active.reply}</p>
              </div>
            ) : null}
            {active.followUp ? (
              <div className="rounded-ui border border-amber-100 bg-amber-50 p-4">
                <strong className="text-amber-700">待学生补充</strong>
                <p className="mb-0 mt-2 leading-7">{active.followUp}</p>
              </div>
            ) : null}
            <FormField label="老师回复">
              <textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="输入回复内容，支持继续追问或要求学生补充说明" defaultValue={active.reply || ""} />
            </FormField>
            <div className="flex justify-end gap-2 border-t border-line pt-4">
              <Button tone="secondary" onClick={() => setActive(null)}>取消</Button>
              <Button onClick={() => setActive(null)}>提交回复</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </TeacherFrame>
  );
}

function getModuleMeta(key) {
  if (key === "classes") return { ...teacherModuleMeta.classes, metric: `${getTeacherClasses().length} 个` };
  return teacherModuleMeta[key] || { metric: "-", status: "可进入", tone: "gray", accent: "bg-slate-300" };
}

function getClassSubTone(key) {
  return {
    "assign-course": "cyan",
    assignments: "amber",
    students: "blue",
    qa: "green",
  }[key] || "gray";
}

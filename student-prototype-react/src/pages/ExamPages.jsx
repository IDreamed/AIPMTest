import { useEffect, useState } from "react";
import { categories, cultureSubjects, exams } from "../data/mockData";
import { Button, Card, DataTable, Meta, Modal, PageHeader, Pagination, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

const examQuestionGroups = [
  {
    title: "一、单选题",
    desc: "每题只有一个正确答案",
    questions: Array.from({ length: 20 }, (_, index) => ({
      key: `exam-single-${index + 1}`,
      label: String(index + 1),
      status: index < 14 ? "answered" : "unanswered",
      marked: index === 7,
    })),
  },
  {
    title: "二、多选题",
    desc: "少选、多选均不得分",
    questions: Array.from({ length: 15 }, (_, index) => ({
      key: `exam-multi-${index + 21}`,
      label: String(index + 21),
      status: index < 9 ? "answered" : "unanswered",
      marked: index === 4,
    })),
  },
  {
    title: "三、判断题",
    desc: "判断正误",
    questions: Array.from({ length: 15 }, (_, index) => ({
      key: `exam-judge-${index + 36}`,
      label: String(index + 36),
      status: index < 11 ? "answered" : "unanswered",
      marked: false,
    })),
  },
  {
    title: "四、填空题",
    desc: "按空作答",
    questions: Array.from({ length: 10 }, (_, index) => ({
      key: `exam-blank-${index + 51}`,
      label: String(index + 51),
      status: index < 5 ? "answered" : "unanswered",
      marked: index === 2,
    })),
  },
  {
    title: "五、简答题",
    desc: "简答题提交后进入评分流程",
    questions: Array.from({ length: 5 }, (_, index) => ({
      key: `exam-short-${index + 61}`,
      label: String(index + 61),
      status: index < 2 ? "answered" : "unanswered",
      marked: false,
    })),
  },
  {
    title: "六、综合题",
    desc: "每道综合题包含多个常规题型子题",
    questions: [
      { key: "exam-case-66-1", label: "66.1", parent: "66", questionType: "单选题", status: "answered", marked: true },
      { key: "exam-case-66-2", label: "66.2", parent: "66", questionType: "填空题", status: "answered", marked: false },
      { key: "exam-case-66-3", label: "66.3", parent: "66", questionType: "简答题", status: "unanswered", marked: false },
      { key: "exam-case-67-1", label: "67.1", parent: "67", questionType: "多选题", status: "answered", marked: false },
      { key: "exam-case-67-2", label: "67.2", parent: "67", questionType: "判断题", status: "unanswered", marked: true },
      { key: "exam-case-68-1", label: "68.1", parent: "68", questionType: "单选题", status: "unanswered", marked: false },
      { key: "exam-case-68-2", label: "68.2", parent: "68", questionType: "填空题", status: "unanswered", marked: false },
      { key: "exam-case-68-3", label: "68.3", parent: "68", questionType: "简答题", status: "unanswered", marked: false },
    ],
  },
];

const examQuestionStatusStyles = {
  unanswered: "border-line bg-white text-slate-700",
  answered: "border-blue-600 bg-blue-600 text-white",
  correct: "border-green-600 bg-green-600 text-white",
  wrong: "border-red-600 bg-red-600 text-white",
  scored: "border-violet-600 bg-violet-600 text-white",
};

const examRankRows = [
  { rank: 1, name: "李同学", school: "示范中职学校", score: 296, objective: 176, subjective: 120, status: "已出分" },
  { rank: 2, name: "王同学", school: "东方职业学校", score: 291, objective: 171, subjective: 120, status: "已出分" },
  { rank: 3, name: "赵同学", school: "南湖中职学校", score: 289, objective: 169, subjective: 120, status: "已出分" },
  { rank: 4, name: "陈同学", school: "示范中职学校", score: 288, objective: 170, subjective: 118, status: "已出分" },
  { rank: 12, name: "我", school: "示范中职学校", score: 286, objective: 168, subjective: 118, status: "我的成绩" },
  { rank: 18, name: "周同学", school: "东方职业学校", score: 279, objective: 164, subjective: 115, status: "已出分" },
];

const schoolRankRows = [
  { rank: 1, school: "示范中职学校", students: 126, average: 248, topScore: 296, status: "已统计" },
  { rank: 2, school: "东方职业学校", students: 98, average: 241, topScore: 291, status: "已统计" },
  { rank: 3, school: "南湖中职学校", students: 84, average: 236, topScore: 289, status: "已统计" },
];

const examAnalysisQuestions = [
  {
    title: "在数据库设计中，用于描述实体之间关系的模型通常称为？",
    myAnswer: "A. E-R 模型",
    correctAnswer: "A. E-R 模型",
    result: "正确",
    tone: "green",
    score: "4 / 4",
    analysis: "E-R 模型用于描述实体、属性以及实体之间的联系，是数据库概念结构设计中的常用模型。",
  },
  {
    title: "下列哪些属于数据库设计中的核心对象？",
    myAnswer: "A、B",
    correctAnswer: "A、B、C",
    result: "错误",
    tone: "red",
    score: "0 / 6",
    marked: true,
    analysis: "数据库设计需要同时关注实体、属性和联系，选项 C 也属于核心对象。",
  },
  {
    title: "说明关系模型中主键的作用。",
    myAnswer: "主键用于唯一标识一条记录。",
    correctAnswer: "主键用于唯一标识关系表中的一条记录，并可用于建立表之间的关联。",
    result: "已评分",
    tone: "blue",
    score: "8 / 10",
    analysis: "答案说明了唯一标识作用，但还可以补充主键在表间关联和约束完整性中的作用。",
  },
];

function getAllExamQuestions(groups = examQuestionGroups) {
  return groups.flatMap((group) => group.questions.map((question) => ({ ...question, groupTitle: group.title })));
}

function getExamQuestionType(question) {
  if (question.questionType) return question.questionType;
  if (question.groupTitle.includes("单选题")) return "单选题";
  if (question.groupTitle.includes("多选题")) return "多选题";
  if (question.groupTitle.includes("判断题")) return "判断题";
  if (question.groupTitle.includes("填空题")) return "填空题";
  if (question.groupTitle.includes("简答题")) return "简答题";
  return "单选题";
}

function ExamQuestionNumber({ number, status = "unanswered", marked = false, active = false, onClick }) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={`relative grid min-h-9 place-items-center rounded-ui border px-1 text-xs ${examQuestionStatusStyles[status]} ${marked ? "ring-2 ring-amber-300" : ""} ${active ? "outline outline-2 outline-offset-2 outline-slate-900" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {number}
      {marked ? <i className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-500" /> : null}
    </Component>
  );
}

function ExamQuestionNavigator({ groups = examQuestionGroups, activeKey, onSelect }) {
  return (
    <div className="mt-4 grid max-h-[460px] gap-4 overflow-y-auto pr-1">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-2">
            <strong className="block text-sm">{group.title}</strong>
            <span className="text-xs text-muted">{group.desc}</span>
          </div>
          {group.title.includes("综合题") ? (
            <div className="grid gap-3">
              {Object.values(group.questions.reduce((collection, question) => {
                const key = question.parent || question.label;
                collection[key] = [...(collection[key] || []), question];
                return collection;
              }, {})).map((questions) => (
                <div className="grid grid-cols-5 gap-2" key={questions[0].parent || questions[0].key}>
                  {questions.map((question) => (
                    <ExamQuestionNumber
                      active={activeKey === question.key}
                      key={question.key}
                      marked={question.marked}
                      number={question.label}
                      onClick={onSelect ? () => onSelect(question) : undefined}
                      status={question.status}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {group.questions.map((question) => (
                <ExamQuestionNumber
                  active={activeKey === question.key}
                  key={question.key}
                  marked={question.marked}
                  number={question.label}
                  onClick={onSelect ? () => onSelect(question) : undefined}
                  status={question.status}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function ExamQuestionStatusLegend({ mode = "analysis" }) {
  const items = mode === "answer"
    ? [
      ["unanswered", "未答题"],
      ["answered", "已答题"],
    ]
    : [
      ["unanswered", "未答题"],
      ["answered", "已答题"],
      ["correct", "题目正确"],
      ["wrong", "题目错误"],
      ["scored", "已评分"],
    ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
      {items.map(([status, label]) => (
        <span className="flex items-center gap-2" key={status}>
          <i className={`h-4 w-4 rounded border ${examQuestionStatusStyles[status]}`} />
          {label}
        </span>
      ))}
      <span className="flex items-center gap-2">
        <i className="relative h-4 w-4 rounded border border-line bg-white ring-2 ring-amber-300">
          <i className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500" />
        </i>
        已标记
      </span>
    </div>
  );
}

function ExamAnswerInput({ questionType }) {
  if (questionType === "多选题") {
    return (
      <div className="mt-5 grid gap-3">
        {["A. 实体", "B. 属性", "C. 联系", "D. 编译"].map((item) => (
          <label key={item} className="flex gap-3 rounded-ui border border-line p-4"><input type="checkbox" />{item}</label>
        ))}
      </div>
    );
  }

  if (questionType === "判断题") {
    return (
      <div className="mt-5 grid gap-3">
        {["正确", "错误"].map((item) => (
          <label key={item} className="flex gap-3 rounded-ui border border-line p-4"><input type="radio" name="exam-judge" />{item}</label>
        ))}
      </div>
    );
  }

  if (questionType === "填空题") {
    return <input className="mt-5 min-h-12 w-full rounded-ui border border-line px-4" placeholder="请输入答案" />;
  }

  if (questionType === "简答题") {
    return <textarea className="mt-5 min-h-[150px] w-full rounded-ui border border-line p-4" placeholder="请输入作答内容" />;
  }

  return (
    <div className="mt-5 grid gap-3">
      {["A. E-R 模型", "B. 线性模型", "C. 物理模型", "D. 编译模型"].map((item) => (
        <label key={item} className="flex gap-3 rounded-ui border border-line p-4"><input type="radio" name="exam-single" />{item}</label>
      ))}
    </div>
  );
}

export function ExamCenterPage() {
  const { roleKey } = usePrototypeRole();
  const subjectTypes = ["文化课", "专业课"];
  const examScopes = ["全部考试", "我的考试"];
  const examTypes = ["全部考试", "公开考试", "学校联考"];
  const examStatuses = ["全部状态", "未开始", "进行中", "评审中", "已公示"];
  const defaultCategory = categories.find((category) => category.unlocked)?.name || categories[0].name;
  const [selectedSubjectType, setSelectedSubjectType] = useState("文化课");
  const [selectedCultureSubject, setSelectedCultureSubject] = useState(cultureSubjects[0].name);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCultureSubjects, setShowAllCultureSubjects] = useState(false);
  const [selectedScope, setSelectedScope] = useState("全部考试");
  const [selectedType, setSelectedType] = useState("全部考试");
  const [selectedStatus, setSelectedStatus] = useState("全部状态");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const isProfessional = selectedSubjectType === "专业课";
  const isStudent = roleKey === "student";
  const availableCategories = isStudent ? categories.filter((category) => category.unlocked) : categories;
  const sortedCategories = [...availableCategories].sort((a, b) => b.papers - a.papers);
  const visibleCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 6);
  const sortedCultureSubjects = [...cultureSubjects].sort((a, b) => b.exams - a.exams);
  const visibleCultureSubjects = showAllCultureSubjects ? sortedCultureSubjects : sortedCultureSubjects.slice(0, 6);
  const filteredExams = exams.filter((exam) => {
    const subjectMatched = isProfessional
      ? exam.subject === "专业课" && exam.category === selectedCategory
      : exam.subject === selectedCultureSubject;
    const scopeMatched = selectedScope === "全部考试" || (
      roleKey !== "visitor" &&
      hasExamPermission(exam, roleKey) &&
      (roleKey === "student" || exam.type === "公开考试")
    );
    const typeMatched = selectedType === "全部考试" || exam.type === selectedType;
    const statusMatched = selectedStatus === "全部状态" || exam.status === selectedStatus;
    const keywordMatched = !keyword.trim() || exam.title.includes(keyword.trim());
    return subjectMatched && scopeMatched && typeMatched && statusMatched && keywordMatched;
  });
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedExams = filteredExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const emptyTitle = selectedScope === "我的考试"
    ? roleKey === "visitor"
      ? "登录后查看我的考试"
      : "暂无我的考试"
    : "暂无符合条件的考试";
  const emptyDesc = selectedScope === "我的考试"
    ? roleKey === "visitor"
      ? "游客可以浏览考试活动，但需要登录或注册后查看自己的公开考试和考试记录。"
      : isStudent
        ? "当前筛选条件下暂无公开考试或当前班级授权的学校联考。"
        : "当前筛选条件下暂无与你相关的公开考试记录。"
    : "请调整考试类型、状态、科目或关键词后再查看。";

  useEffect(() => {
    if (isProfessional && !availableCategories.some((category) => category.name === selectedCategory) && availableCategories[0]) {
      setSelectedCategory(availableCategories[0].name);
    }
  }, [availableCategories, isProfessional, selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [roleKey, selectedSubjectType, selectedCultureSubject, selectedCategory, selectedScope, selectedType, selectedStatus, keyword, pageSize]);

  return (
    <>
      <PageHeader title="考试中心" desc="公开考试与学校联考统一展示，包含未开始、进行中、评审中和已公示考试；排行和成绩归属于具体考试。" />
      <PrototypeNote className="mb-5">
        不做报名流程；有权限且考试进行中即可进入考试。交卷才算参加考试，未交卷不生成成绩、答题记录或排行。
      </PrototypeNote>
      <div className="mb-5 flex gap-2 overflow-x-auto rounded-ui border border-line bg-white p-2">
        {subjectTypes.map((subjectType) => (
          <button
            className={`min-h-10 rounded-ui px-5 ${selectedSubjectType === subjectType ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            key={subjectType}
            onClick={() => setSelectedSubjectType(subjectType)}
            type="button"
          >
            {subjectType}
          </button>
        ))}
      </div>

      {isProfessional ? (
        <Card className="mb-5">
          <div className="grid gap-4">
            <div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 text-xl font-semibold">专业大类</h2>
                  <Tag tone="blue">{availableCategories.length} 个大类</Tag>
                </div>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">选择专业大类后查看对应专业课考试，资源概览只展示各大类配置数量。</p>
              </div>
            </div>

            <div className="rounded-ui border border-line bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <strong>专业大类资源概览</strong>
                {sortedCategories.length > 6 ? (
                  <Button tone="secondary" onClick={() => setShowAllCategories((value) => !value)}>
                    {showAllCategories ? "收起" : "展开全部"}
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((category) => (
                  <button
                    className={`flex items-center justify-between gap-3 rounded-ui border bg-white px-3 py-3 text-left transition ${
                      selectedCategory === category.name ? "border-blue-600 text-blue-700" : "border-line hover:bg-slate-50"
                    }`}
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    type="button"
                  >
                    <span className="truncate">{category.name}</span>
                    <strong className="shrink-0 text-sm">{category.papers} 项</strong>
                  </button>
                ))}
              </div>
            </div>

            <PrototypeNote>
              专业大类为后台动态配置；考试中心与试卷中心保持同一套专业课筛选交互。
            </PrototypeNote>
          </div>
        </Card>
      ) : (
        <Card className="mb-5">
          <div className="grid gap-4">
            <div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 text-xl font-semibold">文化课科目</h2>
                  <Tag tone="blue">{cultureSubjects.length} 个科目</Tag>
                </div>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">选择文化课科目后查看对应考试，资源概览只展示各科目配置数量。</p>
              </div>
            </div>

            <div className="rounded-ui border border-line bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <strong>文化课资源概览</strong>
                {sortedCultureSubjects.length > 6 ? (
                  <Button tone="secondary" onClick={() => setShowAllCultureSubjects((value) => !value)}>
                    {showAllCultureSubjects ? "收起" : "展开全部"}
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCultureSubjects.map((subject) => (
                  <button
                    className={`flex items-center justify-between gap-3 rounded-ui border bg-white px-3 py-3 text-left transition ${
                      selectedCultureSubject === subject.name ? "border-blue-600 text-blue-700" : "border-line hover:bg-slate-50"
                    }`}
                    key={subject.name}
                    onClick={() => setSelectedCultureSubject(subject.name)}
                    type="button"
                  >
                    <span className="truncate">{subject.name}</span>
                    <strong className="shrink-0 text-sm">{subject.exams} 项</strong>
                  </button>
                ))}
              </div>
            </div>

            <PrototypeNote>
              文化课科目由后台动态配置；考试中心与试卷中心保持同一套二级筛选交互。
            </PrototypeNote>
          </div>
        </Card>
      )}

      <div className="mb-5 flex flex-wrap gap-3 rounded-ui border border-line bg-white p-4">
        <div className="flex gap-2 rounded-ui bg-slate-50 p-1">
          {examScopes.map((scope) => (
            <button
              className={`min-h-10 rounded-ui px-4 ${selectedScope === scope ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-white"}`}
              key={scope}
              onClick={() => setSelectedScope(scope)}
              type="button"
            >
              {scope}
            </button>
          ))}
        </div>
        <select className="min-h-10 rounded-ui border border-line px-3" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          {examTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="min-h-10 rounded-ui border border-line px-3" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
          {examStatuses.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="min-h-10 rounded-ui border border-line px-3" placeholder="搜索考试名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <PrototypeNote>
          “我的考试”只展示当前身份相关的考试；注册用户可查看自己的公开考试，班级学生可查看公开考试和当前班级授权的学校联考。
        </PrototypeNote>
      </div>
      {filteredExams.length ? (
        <>
          <DataTable
            columns={["考试", "考试类型", "科目/大类", "考试时间", "参加状态", "操作"]}
            gridTemplateColumns="minmax(260px,2fr) 110px 120px 170px 120px 170px"
            rows={paginatedExams}
            renderRow={(exam) => (
              <>
                <div><strong>{exam.title}</strong><p className="mt-1 text-xs text-muted">{exam.summary}</p></div>
                <Tag tone={exam.type === "学校联考" ? "blue" : "cyan"}>{exam.type}</Tag>
                <span>{exam.subject === "专业课" ? exam.category : exam.subject}</span>
                <span>
                  <strong className="block text-sm">{exam.startAt || exam.time}</strong>
                  <span className="mt-1 block text-xs text-muted">至 {exam.endAt || exam.time}</span>
                </span>
                <ExamParticipation exam={exam} roleKey={roleKey} />
                <ExamAction exam={exam} roleKey={roleKey} />
              </>
            )}
          />
          <Pagination
            label="考试列表"
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            page={currentPage}
            pageSize={pageSize}
            total={filteredExams.length}
          />
        </>
      ) : (
        <Card>
          <h3 className="m-0">{emptyTitle}</h3>
          <p className="mb-0 mt-3 leading-7 text-muted">{emptyDesc}</p>
          {selectedScope === "我的考试" && roleKey === "visitor" ? <Meta><Button href="#/login">登录/注册</Button></Meta> : null}
        </Card>
      )}
    </>
  );
}

function hasExamPermission(exam, roleKey) {
  if (exam.permission === "registered") return roleKey !== "visitor";
  if (exam.permission === "student") return roleKey === "student";
  return false;
}

function getExamParticipation(exam, roleKey) {
  const statusTone = {
    无权限: "gray",
    待开始: "amber",
    未开始: "amber",
    可参加: "green",
    已交卷: "green",
    已出分: "green",
    未参加: "gray",
  };

  if (!hasExamPermission(exam, roleKey)) return { label: "无权限", tone: "gray" };
  if (exam.status === "未开始") return { label: "待开始", tone: "amber" };
  if (exam.status === "进行中") return { label: "可参加", tone: "green" };
  if (exam.status === "已公示" && exam.submitted) return { label: "已出分", tone: "green" };
  if (exam.status === "已公示" && !exam.submitted) return { label: "未参加", tone: "gray" };
  if (exam.status === "评审中" && exam.submitted) return { label: "已交卷", tone: "green" };
  if (exam.status === "评审中" && !exam.submitted) return { label: "未参加", tone: "gray" };
  const configuredStatus = exam.participationStatus?.[roleKey];
  if (configuredStatus) return { label: configuredStatus, tone: statusTone[configuredStatus] || "gray" };
  if (exam.submitted) return { label: "已交卷", tone: "green" };
  return { label: "未参加", tone: "gray" };
}

function getExamResultSummary(exam, participation, canSeeResult) {
  if (canSeeResult) {
    return {
      title: "已生成成绩与排行摘要",
      desc: "已生成本场考试成绩、答题记录和排行摘要；完整排行进入独立排行页面查看。",
      analysisAction: <Button href={`#/exam-analysis?id=${exam.id}`} tone="ghost">查看成绩与解析</Button>,
      rankAction: exam.rankEnabled ? <Button href={`#/exam-rank?id=${exam.id}`} tone="secondary">查看完整排行</Button> : <Tag tone="gray">未开启排行</Tag>,
    };
  }

  if (exam.status === "评审中" && participation.label === "已交卷") {
    return {
      title: "已交卷，成绩评审中",
      desc: "成绩公示前暂不可查看成绩、排行和题目解析。",
      analysisAction: <Tag tone="amber">等待成绩公示</Tag>,
      rankAction: exam.rankEnabled ? <Tag tone="gray">排行未公示</Tag> : <Tag tone="gray">未开启排行</Tag>,
    };
  }

  if (participation.label === "未参加") {
    return {
      title: "未参加，不生成成绩",
      desc: "未参加或未交卷不会生成成绩、答题记录、题目解析或排行。",
      analysisAction: <Tag tone="gray">暂无解析</Tag>,
      rankAction: <Tag tone="gray">暂无排行</Tag>,
    };
  }

  if (participation.label === "可参加") {
    return {
      title: "考试进行中，交卷后生成记录",
      desc: "进入考试并完成交卷后，系统才会生成本场考试记录。",
      analysisAction: <Tag tone="gray">交卷后查看</Tag>,
      rankAction: <Tag tone="gray">暂未公示</Tag>,
    };
  }

  if (participation.label === "待开始") {
    return {
      title: "考试未开始，暂无成绩",
      desc: "考试开始并完成交卷后，才会进入评审和成绩公示流程。",
      analysisAction: <Tag tone="gray">暂无解析</Tag>,
      rankAction: <Tag tone="gray">暂无排行</Tag>,
    };
  }

  return {
    title: "暂无成绩",
    desc: "当前状态下暂不展示成绩、答题记录或排行。",
    analysisAction: <Tag tone="gray">暂无解析</Tag>,
    rankAction: <Tag tone="gray">暂无排行</Tag>,
  };
}

function ExamParticipation({ exam, roleKey }) {
  const participation = getExamParticipation(exam, roleKey);
  return (
    <span>
      <Tag tone={exam.statusTone}>{exam.status}</Tag>
      <div className="mt-2"><Tag tone={participation.tone}>{participation.label}</Tag></div>
    </span>
  );
}

function ExamAction({ exam, roleKey }) {
  const permitted = hasExamPermission(exam, roleKey);
  const detailHref = `#/exam-detail?id=${exam.id}`;

  if (!permitted) {
    return <div className="flex justify-end whitespace-nowrap"><Button href={detailHref} tone="secondary">查看详情</Button></div>;
  }

  if (exam.status === "进行中") {
    return (
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <Button href={detailHref} tone="secondary">查看详情</Button>
        <Button href="#/exam-answer">进入考试</Button>
      </div>
    );
  }

  if (exam.status === "已公示" && exam.submitted) {
    return (
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <Button href={detailHref} tone="secondary">查看详情</Button>
        <Button href={`#/exam-analysis?id=${exam.id}`}>查看解析</Button>
      </div>
    );
  }

  return <div className="flex justify-end whitespace-nowrap"><Button href={detailHref} tone="secondary">查看详情</Button></div>;
}

function getExamPermissionCopy(exam, roleKey, permitted) {
  if (permitted) {
    if (exam.type === "学校联考") {
      return {
        title: "当前班级已获得本场学校联考权限",
        desc: "本场考试面向已授权学校和指定班级开放，当前身份可查看考试详情，并在考试进行中进入答题。",
        action: null,
      };
    }

    return {
      title: "当前身份可参加公开考试",
      desc: "公开考试面向注册用户和班级学生开放，考试进行中可直接进入答题。",
      action: null,
    };
  }

  if (roleKey === "visitor") {
    return {
      title: "游客暂无考试参加权限",
      desc: "请先登录或注册账号；公开考试登录后可参加，学校联考还需要加入授权班级。",
      action: <Button href="#/login">登录/注册</Button>,
    };
  }

  if (roleKey === "registered") {
    return {
      title: exam.type === "学校联考" ? "学校联考需要班级授权" : "当前考试暂不可参加",
      desc: exam.type === "学校联考" ? "注册用户可以浏览联考信息，但需要提交入校申请并加入授权班级后才能参加。" : "请确认考试开放范围或联系管理员处理权限。",
      action: <Button href="#/school-apply">申请入校</Button>,
    };
  }

  return {
    title: "当前班级暂无本场考试授权",
    desc: "学校联考由后台按学校、班级和专业大类授权；如需参加，请联系管理员确认授权范围。",
    action: <Button href="#/profile" tone="secondary">查看个人中心</Button>,
  };
}

export function ExamDetailPage() {
  const { roleKey } = usePrototypeRole();
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const exam = exams.find((item) => item.id === params.get("id")) || exams[1];
  const permitted = hasExamPermission(exam, roleKey);
  const participation = getExamParticipation(exam, roleKey);
  const canEnter = permitted && exam.status === "进行中";
  const canSeeResult = permitted && exam.status === "已公示" && exam.submitted;
  const isSchoolExam = exam.type === "学校联考";
  const permissionCopy = getExamPermissionCopy(exam, roleKey, permitted);
  const resultSummary = getExamResultSummary(exam, participation, canSeeResult);
  const examIntro = exam.intro || [
    isSchoolExam ? "本场学校联考面向已授权学校及指定班级开放。" : "本场公开考试面向注册用户开放。",
    "考试介绍由后台富文本配置，学生端按配置内容展示。",
  ];
  const timeStages = [
    { label: "开始时间", value: exam.startAt || exam.time, tone: "blue" },
    { label: "结束时间", value: exam.endAt || exam.time, tone: "amber" },
    { label: "成绩公示", value: exam.publishAt || "待后台公示", tone: "green" },
  ];

  return (
    <>
      <PageHeader
        title={exam.title}
        desc="展示考试基础信息、权限状态、成绩摘要、排行入口和考试规则。"
        action={canEnter ? <Button href="#/exam-answer">进入考试</Button> : null}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="考试类型" value={exam.type === "学校联考" ? "联考" : "公开"} />
        <Stat label="科目" value={exam.subject === "专业课" ? exam.category : exam.subject} />
        <Stat label="状态" value={exam.status} />
        <Stat label="参加状态" value={participation.label} />
      </div>

      <section className="mt-8">
        <PageHeader title="考试介绍" desc="考试介绍由后台富文本配置，学生端进入详情后优先了解考试内容、范围和说明。" />
        <Card className="leading-8 text-slate-700">
          <article className="min-h-[260px] max-h-[520px] overflow-y-auto pr-2">
            {examIntro.map((paragraph) => (
              <p className="mb-4 mt-0" key={paragraph}>{paragraph}</p>
            ))}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="grid min-h-[180px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-sm text-muted">
                富文本图片占位符
              </div>
              <div className="grid min-h-[180px] place-items-center rounded-ui bg-slate-900 text-sm text-white/70">
                富文本视频占位符
              </div>
            </div>
          </article>
          <PrototypeNote className="mt-4">如果后台考试介绍内容较长，当前区域内部滚动，避免把详情页其它核心信息挤到过深位置。</PrototypeNote>
        </Card>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <Card className={`border-l-4 ${permitted ? "border-l-green-600" : "border-l-amber-500"}`}>
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <Meta><Tag tone={permitted ? "green" : "amber"}>{permitted ? "有权限" : "无权限"}</Tag><Tag tone={participation.tone}>{participation.label}</Tag></Meta>
              <h2 className="mb-2 mt-4 text-lg">{permissionCopy.title}</h2>
              <p className="m-0 text-sm leading-6 text-muted">{permissionCopy.desc}</p>
            </div>
            {permissionCopy.action ? <div>{permissionCopy.action}</div> : null}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="m-0 text-lg">考试时间安排</h2>
            <Tag tone="blue">关键阶段</Tag>
          </div>
          <div className="grid gap-3">
            {timeStages.map((stage) => (
              <div className="flex items-center justify-between gap-4 rounded-ui bg-slate-50 px-3 py-3" key={stage.label}>
                <Tag tone={stage.tone}>{stage.label}</Tag>
                <strong className="text-sm text-slate-800">{stage.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-8">
        <PageHeader title="我的成绩" desc="成绩归属于单场考试，已交卷并出分后在详情页首屏展示。" />
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="得分/总分" value={canSeeResult ? `${exam.score} / 300` : "-"} />
          <Stat label="正确率" value={canSeeResult ? "82%" : "-"} />
          <Stat label="答题用时" value={canSeeResult ? "112 分钟" : "-"} />
          <Stat label="个人排名" value={canSeeResult && exam.rankEnabled ? "12" : "-"} />
        </div>
        <Card className="mt-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="m-0">{resultSummary.title}</h3>
              <p className="mb-0 mt-2 leading-7 text-muted">{resultSummary.desc}</p>
            </div>
            <Meta>
              {resultSummary.analysisAction}
              {resultSummary.rankAction}
            </Meta>
          </div>
        </Card>
      </section>
    </>
  );
}

export function ExamRankPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const exam = exams.find((item) => item.id === params.get("id")) || exams[3];
  const pagination = activeTab === "student"
    ? { total: 308, label: "考生排行" }
    : { total: 26, label: "学校排行" };
  const totalPages = Math.ceil(pagination.total / pageSize);

  return (
    <>
      <PageHeader title="考试排行" desc={`${exam.title} 的单场排行页面；后续可扩展学校排行、班级排行、分页和导出。`} action={<Button href={`#/exam-detail?id=${exam.id}`} tone="ghost">返回考试详情</Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="考试类型" value={exam.type} />
        <Stat label="科目/大类" value={exam.subject === "专业课" ? exam.category : exam.subject} />
        <Stat label="参考人数" value="308" />
        <Stat label="我的排名" value="12" />
      </div>
      <div className="my-5 flex gap-2 overflow-x-auto rounded-ui border border-line bg-white p-2">
        {[
          ["student", "考生排行"],
          ["school", "学校排行"],
        ].map(([key, label]) => (
          <button
            className={`min-h-10 rounded-ui px-5 ${activeTab === key ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            key={key}
            onClick={() => {
              setActiveTab(key);
              setPage(1);
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      {activeTab === "student" ? (
        <DataTable
          columns={["排名", "考生", "学校", "总分", "客观/主观", "状态"]}
          gridTemplateColumns="80px 120px minmax(180px,1.4fr) 90px 130px 100px"
          rows={examRankRows}
          renderRow={(row) => (
            <>
              <strong>{row.rank}</strong>
              <span>{row.name}</span>
              <span>{row.school}</span>
              <strong>{row.score}</strong>
              <span>{row.objective} / {row.subjective}</span>
              <Tag tone={row.status === "我的成绩" ? "blue" : "green"}>{row.status}</Tag>
            </>
          )}
        />
      ) : (
        <DataTable
          columns={["排名", "学校", "参考人数", "平均分", "最高分", "状态"]}
          gridTemplateColumns="80px minmax(220px,1.5fr) 100px 100px 100px 100px"
          rows={schoolRankRows}
          renderRow={(row) => (
            <>
              <strong>{row.rank}</strong>
              <span>{row.school}</span>
              <span>{row.students}</span>
              <strong>{row.average}</strong>
              <span>{row.topScore}</span>
              <Tag tone="blue">{row.status}</Tag>
            </>
          )}
        />
      )}
      <Card className="mt-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="m-0 text-sm text-muted">
            {pagination.label}：第 {page} / {totalPages} 页，共 {pagination.total} 条
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              每页
              <select
                className="min-h-10 rounded-ui border border-line bg-white px-3 text-slate-700"
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                value={pageSize}
              >
                {[20, 30, 50].map((size) => <option key={size} value={size}>{size} 条</option>)}
              </select>
            </label>
            <Button tone="secondary" onClick={() => setPage((value) => Math.max(1, value - 1))}>上一页</Button>
            <Button tone="secondary" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>下一页</Button>
          </div>
        </div>
      </Card>
      <PrototypeNote className="mt-5">排行独立成页，避免考试详情承载大量考生数据；后续可以在这里增加分页、学校筛选、班级筛选和排行维度切换。</PrototypeNote>
    </>
  );
}

export function ExamAnalysisPage() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const exam = exams.find((item) => item.id === params.get("id")) || exams[3];
  const analysisGroups = examQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question, index) => {
      const statuses = group.title.includes("简答题")
        ? ["scored", "answered", "unanswered"]
        : group.title.includes("综合题")
          ? ["correct", "wrong", "scored", "answered", "unanswered"]
          : ["correct", "wrong", "correct", "unanswered"];
      return { ...question, status: statuses[index % statuses.length] };
    }),
  }));
  const allQuestions = getAllExamQuestions(analysisGroups);
  const [activeKey, setActiveKey] = useState(allQuestions[0].key);
  const activeIndex = Math.max(0, allQuestions.findIndex((question) => question.key === activeKey));
  const activeQuestion = allQuestions[activeIndex] || allQuestions[0];
  const analysis = examAnalysisQuestions[activeIndex % examAnalysisQuestions.length];
  const isComposite = activeQuestion.groupTitle.includes("综合题");

  return (
    <>
      <PageHeader title="考试成绩与解析" desc={`${exam.title} 的成绩、作答结果和题目解析。`} action={<Button href={`#/exam-detail?id=${exam.id}`} tone="ghost">返回考试详情</Button>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="得分/总分" value={`${exam.score === "-" ? 286 : exam.score} / 300`} />
        <Stat label="正确率" value="82%" />
        <Stat label="答题用时" value="112 分钟" />
        <Stat label="个人排名" value={exam.rankEnabled ? "12" : "-"} />
      </div>

      <section className="mt-8">
        <PageHeader title="题目解析" />
        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <Card className="min-h-[520px]">
            <Meta>
              <Tag>{activeQuestion.groupTitle}</Tag>
              <Tag>第 {activeQuestion.label} 题</Tag>
              <Tag tone={analysis.tone}>{analysis.result}</Tag>
              <Tag>{analysis.score}</Tag>
              {activeQuestion.marked || analysis.marked ? <Tag tone="amber">已标记</Tag> : null}
            </Meta>
            <h3 className="mb-4 mt-5 text-xl">{isComposite ? "综合题材料：数据库应用场景分析" : analysis.title}</h3>
            {isComposite ? (
              <>
                <div className="mb-4 rounded-ui border border-line bg-slate-50 p-4 leading-8 text-slate-700">
                  某学校建设在线学习系统，需要管理学生、课程、考试和成绩数据。请结合材料完成下列子题。
                </div>
                <h4 className="mb-4 mt-0 text-base">子题 {activeQuestion.label}（{getExamQuestionType(activeQuestion)}）：根据材料完成本小题。</h4>
              </>
            ) : null}
            <div className="grid gap-3 rounded-ui bg-slate-50 p-4 text-sm leading-7 md:grid-cols-2">
              <div><strong>我的答案：</strong><span className="text-muted">{analysis.myAnswer}</span></div>
              <div><strong>参考答案：</strong><span className="text-muted">{analysis.correctAnswer}</span></div>
            </div>
            <section className="mt-6 rounded-ui border border-line p-5">
              <h4 className="m-0 text-base">题目解析</h4>
              <p className="mt-4 leading-8 text-slate-700">{analysis.analysis}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="grid min-h-[150px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-sm text-muted">
                  解析图片占位符
                </div>
                <div className="grid min-h-[150px] place-items-center rounded-ui bg-slate-900 text-sm text-white/70">
                  解析视频占位符
                </div>
              </div>
            </section>
            <Meta>
              <Button tone="secondary" onClick={() => setActiveKey(allQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
              <Button onClick={() => setActiveKey(allQuestions[Math.min(allQuestions.length - 1, activeIndex + 1)].key)}>下一题</Button>
            </Meta>
          </Card>
          <Card className="self-start md:sticky md:top-5">
            <h3>题号导航</h3>
            <p className="leading-7 text-muted">点击题号查看对应题目、答案与解析，题号颜色表示本题结果状态。</p>
            <ExamQuestionNavigator activeKey={activeKey} groups={analysisGroups} onSelect={(question) => setActiveKey(question.key)} />
            <ExamQuestionStatusLegend />
          </Card>
        </div>
      </section>
    </>
  );
}

export function ExamAnswerPage() {
  const [markedQuestions, setMarkedQuestions] = useState(["exam-single-8", "exam-multi-25"]);
  const [activeKey, setActiveKey] = useState("exam-single-8");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const isCurrentMarked = markedQuestions.includes(activeKey);
  const answerGroups = examQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question) => ({
      ...question,
      marked: markedQuestions.includes(question.key) || (question.key !== activeKey && question.marked),
    })),
  }));
  const answerQuestions = getAllExamQuestions(answerGroups);
  const activeQuestion = answerQuestions.find((question) => question.key === activeKey) || answerQuestions[0];
  const activeQuestionType = getExamQuestionType(activeQuestion);
  const activeIndex = Math.max(0, answerQuestions.findIndex((question) => question.key === activeKey));
  const activeIsComposite = activeQuestion.groupTitle.includes("综合题");

  return (
    <>
      <PageHeader title="考试答题页" desc="正式考试必须在本次考试时间内一次完成，不保存中途进度，交卷才算参加考试。" action={<Button tone="warning" onClick={() => setConfirmSubmit(true)}>交卷</Button>} />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[500px]">
          <Meta><Tag>{activeQuestion.groupTitle}</Tag><Tag>第 {activeQuestion.label} 题</Tag><Tag tone="red">剩余 01:12:36</Tag></Meta>
          {activeIsComposite ? (
            <section className="mt-5 rounded-ui border border-line bg-slate-50 p-5 leading-8 text-slate-700">
              <h2 className="m-0 mb-3 text-xl text-ink">综合题材料：数据库应用场景分析</h2>
              <p className="m-0">某学校建设在线学习系统，需要管理学生、课程、考试和成绩数据。请结合材料完成第 {activeQuestion.label} 小题。</p>
            </section>
          ) : null}
          <h2 className="mt-6 text-xl">
            {activeIsComposite ? `子题 ${activeQuestion.label}（${activeQuestionType}）：根据材料完成本小题。` : "在数据库设计中，用于描述实体之间关系的模型通常称为？"}
          </h2>
          <ExamAnswerInput questionType={activeQuestionType} />
          <Meta>
            <Button tone="secondary" onClick={() => setActiveKey(answerQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
            <Button onClick={() => setActiveKey(answerQuestions[Math.min(answerQuestions.length - 1, activeIndex + 1)].key)}>下一题</Button>
            <Button
              tone={isCurrentMarked ? "warning" : "ghost"}
              onClick={() => setMarkedQuestions((items) => (
                items.includes(activeKey) ? items.filter((item) => item !== activeKey) : [...items, activeKey]
              ))}
            >
              {isCurrentMarked ? "取消标记" : "标记本题"}
            </Button>
            <Button tone="warning" onClick={() => setConfirmSubmit(true)}>交卷</Button>
          </Meta>
        </Card>
        <Card>
          <h3>题号导航</h3>
          <p className="leading-7 text-muted">已答 41 题，未答 27 题，已标记 {markedQuestions.length} 题。</p>
          <ExamQuestionNavigator activeKey={activeKey} groups={answerGroups} onSelect={(question) => setActiveKey(question.key)} />
          <ExamQuestionStatusLegend mode="answer" />
          <PrototypeNote className="mt-4">正式考试不提供保存退出或继续考试；离开页面可能导致本次考试中断。</PrototypeNote>
        </Card>
      </div>
      <Modal open={confirmSubmit} title="确认交卷" onClose={() => setConfirmSubmit(false)}>
        <p className="m-0 leading-7 text-muted">交卷后将生成本场考试记录，不能继续修改答案。未作答题目将按空题提交。</p>
        <Meta><Button tone="secondary" onClick={() => setConfirmSubmit(false)}>继续检查</Button><Button href="#/exam-detail?id=school-stage" tone="warning">确认交卷</Button></Meta>
      </Modal>
    </>
  );
}

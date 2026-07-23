import { useEffect, useState } from "react";
import { categories, cultureSubjects, papers } from "../data/mockData";
import { Button, Card, DataTable, FilterButtonGroup, Meta, PageHeader, Pagination, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

const paperAnalysisQuestions = [
  {
    type: "单选题",
    title: "已知函数 f(x)=2x+1，则 f(3) 的值为多少？",
    myAnswer: "C. 7",
    correctAnswer: "C. 7",
    result: "正确",
    tone: "green",
    analysis: "将 x=3 代入 f(x)=2x+1，得到 f(3)=2×3+1=7。",
  },
  {
    type: "多选题",
    title: "下列属于一次函数图像特征的是？",
    myAnswer: "A、C",
    correctAnswer: "A、B、C",
    result: "需复习",
    tone: "amber",
    marked: true,
    analysis: "一次函数图像为直线，斜率决定倾斜方向，截距决定与 y 轴交点；判断时需要同时关注表达式与图像特征。",
  },
  {
    type: "判断题",
    title: "等差数列中，相邻两项的差恒定。",
    myAnswer: "正确",
    correctAnswer: "正确",
    result: "正确",
    tone: "green",
    marked: true,
    analysis: "等差数列的定义就是相邻两项差为同一个常数。",
  },
  {
    type: "简答题",
    title: "简述函数单调性的判断思路。",
    myAnswer: "根据图像上升或下降判断。",
    correctAnswer: "可结合定义、图像或导向题干条件判断函数在指定区间内随自变量增大而增减的趋势。",
    result: "已答题",
    tone: "blue",
    analysis: "答案已提交，老师完成评阅后将显示本题得分；评阅前可先对照参考答案和解析检查作答思路。",
  },
  {
    type: "简答题",
    title: "说明等差数列通项公式的使用场景。",
    myAnswer: "知道首项、公差和项数时可以求某一项。",
    correctAnswer: "当已知首项、公差和项数，或能由题干推出这些条件时，可使用通项公式求指定项或建立等量关系。",
    result: "已评分 8/10",
    tone: "blue",
    analysis: "该题已经完成主观题评分，得分表示答案要点基本完整，但表达仍可补充适用条件和公式结构。",
  },
];

const questionStatusStyles = {
  unanswered: "border-line bg-white text-slate-700",
  answered: "border-blue-600 bg-blue-600 text-white",
  correct: "border-green-600 bg-green-600 text-white",
  wrong: "border-red-600 bg-red-600 text-white",
  scored: "border-violet-600 bg-violet-600 text-white",
};

const questionStatusLabels = {
  unanswered: "未答",
  answered: "已答",
  correct: "正确",
  wrong: "错误",
  scored: "已评分",
};

const paperQuestionGroups = [
  {
    title: "一、单选题",
    desc: "每题只有一个正确答案",
    questions: Array.from({ length: 20 }, (_, index) => ({
      key: `single-${index + 1}`,
      label: String(index + 1),
      status: index < 12 ? "answered" : "unanswered",
      marked: index === 3 || index === 6,
    })),
  },
  {
    title: "二、多选题",
    desc: "少选、多选均不得分",
    questions: Array.from({ length: 15 }, (_, index) => ({
      key: `multi-${index + 21}`,
      label: String(index + 21),
      status: index < 8 ? "answered" : "unanswered",
      marked: index === 2,
    })),
  },
  {
    title: "三、判断题",
    desc: "判断正误",
    questions: Array.from({ length: 15 }, (_, index) => ({
      key: `judge-${index + 36}`,
      label: String(index + 36),
      status: index < 10 ? "answered" : "unanswered",
      marked: false,
    })),
  },
  {
    title: "四、填空题",
    desc: "按空作答",
    questions: Array.from({ length: 10 }, (_, index) => ({
      key: `blank-${index + 51}`,
      label: String(index + 51),
      status: index < 5 ? "answered" : "unanswered",
      marked: index === 4,
    })),
  },
  {
    title: "五、简答题",
    desc: "主观题提交后等待评分",
    questions: Array.from({ length: 5 }, (_, index) => ({
      key: `short-${index + 61}`,
      label: String(index + 61),
      status: index < 2 ? "answered" : "unanswered",
      marked: false,
    })),
  },
  {
    title: "六、综合题",
    desc: "每道综合题包含多个子题",
    questions: [
      { key: "case-66-1", label: "66.1", parent: "66", questionType: "单选题", status: "answered", marked: true },
      { key: "case-66-2", label: "66.2", parent: "66", questionType: "填空题", status: "answered", marked: false },
      { key: "case-66-3", label: "66.3", parent: "66", questionType: "简答题", status: "unanswered", marked: false },
      { key: "case-67-1", label: "67.1", parent: "67", questionType: "多选题", status: "answered", marked: false },
      { key: "case-67-2", label: "67.2", parent: "67", questionType: "判断题", status: "unanswered", marked: true },
      { key: "case-68-1", label: "68.1", parent: "68", questionType: "单选题", status: "unanswered", marked: false },
      { key: "case-68-2", label: "68.2", parent: "68", questionType: "填空题", status: "unanswered", marked: false },
      { key: "case-68-3", label: "68.3", parent: "68", questionType: "简答题", status: "unanswered", marked: false },
    ],
  },
];

function getAllPaperQuestions(groups = paperQuestionGroups) {
  return groups.flatMap((group) => group.questions.map((question) => ({ ...question, groupTitle: group.title })));
}

function getQuestionType(question) {
  if (question.questionType) return question.questionType;
  if (question.groupTitle.includes("单选题")) return "单选题";
  if (question.groupTitle.includes("多选题")) return "多选题";
  if (question.groupTitle.includes("判断题")) return "判断题";
  if (question.groupTitle.includes("填空题")) return "填空题";
  if (question.groupTitle.includes("简答题")) return "简答题";
  return "单选题";
}

function AnswerInput({ questionType }) {
  if (questionType === "多选题") {
    return (
      <div className="mt-5 grid gap-3">
        {["A. 函数图像为直线", "B. 斜率决定倾斜方向", "C. 截距影响与 y 轴交点", "D. 定义域一定为全体实数"].map((item) => (
          <label key={item} className="flex gap-3 rounded-ui border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"><input type="checkbox" />{item}</label>
        ))}
      </div>
    );
  }

  if (questionType === "判断题") {
    return (
      <div className="mt-5 grid gap-3">
        {["正确", "错误"].map((item) => (
          <label key={item} className="flex gap-3 rounded-ui border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"><input type="radio" name="judge" />{item}</label>
        ))}
      </div>
    );
  }

  if (questionType === "填空题") {
    return <input className="mt-5 min-h-12 w-full rounded-ui border border-slate-200 px-4" placeholder="请输入答案" />;
  }

  if (questionType === "简答题") {
    return <textarea className="mt-5 min-h-[150px] w-full rounded-ui border border-slate-200 p-4" placeholder="请输入作答内容" />;
  }

  return (
    <div className="mt-5 grid gap-3">
      {["A. 5", "B. 6", "C. 7", "D. 8"].map((item) => (
        <label key={item} className="flex gap-3 rounded-ui border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"><input type="radio" name="single" />{item}</label>
      ))}
    </div>
  );
}

function QuestionNumber({ number, status = "unanswered", marked = false, active = false, onClick }) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={`relative grid min-h-9 place-items-center rounded-ui border px-1 text-xs ${questionStatusStyles[status]} ${marked ? "ring-2 ring-amber-300" : ""} ${active ? "outline outline-2 outline-offset-2 outline-slate-900" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {number}
      {marked ? <i className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-500" /> : null}
    </Component>
  );
}

function PaperQuestionNavigator({ groups = paperQuestionGroups, activeKey, onSelect }) {
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
                    <QuestionNumber
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
                <QuestionNumber
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

function QuestionStatusLegend({ mode = "analysis" }) {
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
          <i className={`h-4 w-4 rounded border ${questionStatusStyles[status]}`} />
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

export function PaperCenterPage() {
  const { role, roleKey } = usePrototypeRole();
  const isStudent = roleKey === "student";
  const defaultCategory = categories.find((category) => category.unlocked)?.name || categories[0].name;
  const subjectTypes = ["文化课", "专业课"];
  const paperSources = ["全部", "官方", "本校"];
  const paperTypes = ["全部", "一轮复习", "二轮专题", "三轮冲刺", "模拟测试", "真题汇编"];
  const paperYears = ["全部年份", "2025", "2024", "2023"];
  const [selectedSubjectType, setSelectedSubjectType] = useState("专业课");
  const [selectedCultureSubject, setSelectedCultureSubject] = useState(cultureSubjects[0].name);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCultureSubjects, setShowAllCultureSubjects] = useState(false);
  const [selectedSource, setSelectedSource] = useState("全部");
  const [selectedType, setSelectedType] = useState("全部");
  const [selectedYear, setSelectedYear] = useState("全部年份");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const isProfessional = selectedSubjectType === "专业课";
  const availableCategories = isStudent ? categories.filter((category) => category.unlocked) : categories;
  const sortedCategories = [...availableCategories].sort((a, b) => b.papers - a.papers);
  const visibleCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 6);
  const sortedCultureSubjects = [...cultureSubjects].sort((a, b) => b.papers - a.papers);
  const visibleCultureSubjects = showAllCultureSubjects ? sortedCultureSubjects : sortedCultureSubjects.slice(0, 6);
  const filteredPapers = papers.filter((paper) => {
    const subjectMatched = isProfessional
      ? paper.subject === "专业课" && paper.category === selectedCategory
      : paper.subject === selectedCultureSubject;
    const sourceVisible = isStudent || paper.source === "官方";
    const sourceMatched = selectedSource === "全部" || paper.source === selectedSource;
    const typeMatched = selectedType === "全部" || paper.type === selectedType;
    const yearMatched = selectedYear === "全部年份" || paper.year === selectedYear;
    return sourceVisible && subjectMatched && sourceMatched && typeMatched && yearMatched;
  });
  const totalPages = Math.max(1, Math.ceil(filteredPapers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPapers = filteredPapers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageAction = roleKey === "visitor"
    ? <Button href="#/login" tone="ghost">登录/注册</Button>
    : roleKey === "registered"
      ? <Button href="#/profile" tone="ghost">查看认证</Button>
      : null;
  const statusTone = {
    未开始: "gray",
    进行中: "amber",
    已完成: "green",
  };

  useEffect(() => {
    const canSelectCategory = availableCategories.some((category) => category.name === selectedCategory);
    if (isProfessional && !canSelectCategory && availableCategories[0]) {
      setSelectedCategory(availableCategories[0].name);
    }
  }, [availableCategories, isProfessional, selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [roleKey, selectedSubjectType, selectedCultureSubject, selectedCategory, selectedSource, selectedType, selectedYear, pageSize]);

  return (
    <>
      <PageHeader title="试卷练习" action={pageAction} />
      <PrototypeNote>
        题库资源来自试卷库；学生可见范围由所在班级绑定的文化课科目和专业大类决定。试卷状态来自个人练习记录，不是试卷发布状态。
      </PrototypeNote>
      <Card className="mb-5 p-4">
        <div className="grid gap-4">
          <FilterButtonGroup label="类型" labelClassName="w-12" options={subjectTypes} value={selectedSubjectType} onChange={setSelectedSubjectType} />
          <div className="flex flex-wrap items-start gap-3 text-sm">
            <span className="w-12 pt-2 font-semibold">{isProfessional ? "专业" : "科目"}</span>
            <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(isProfessional ? visibleCategories : visibleCultureSubjects).map((item) => (
                <button
                  className={`flex min-h-10 items-center justify-between gap-3 rounded-ui border bg-white px-3 text-left transition ${
                    (isProfessional ? selectedCategory : selectedCultureSubject) === item.name ? "border-blue-600 text-blue-700" : "border-line hover:bg-slate-50"
                  }`}
                  key={item.name}
                  onClick={() => (isProfessional ? setSelectedCategory(item.name) : setSelectedCultureSubject(item.name))}
                  type="button"
                >
                  <span className="truncate">{item.name}</span>
                  <strong className="shrink-0 text-xs">{item.papers} 套</strong>
                </button>
              ))}
            </div>
            {isProfessional && sortedCategories.length > 6 ? (
              <Button tone="secondary" onClick={() => setShowAllCategories((value) => !value)}>
                {showAllCategories ? "收起" : "展开全部"}
              </Button>
            ) : null}
            {!isProfessional && sortedCultureSubjects.length > 6 ? (
              <Button tone="secondary" onClick={() => setShowAllCultureSubjects((value) => !value)}>
                {showAllCultureSubjects ? "收起" : "展开全部"}
              </Button>
            ) : null}
          </div>
          <PrototypeNote>
            学生先选择文化课或专业课，再按科目查看试卷；练习状态和可用权限在试卷列表中显示。
          </PrototypeNote>
        </div>
      </Card>

      <div className="my-5 grid gap-4 rounded-ui border border-line bg-white p-4">
        <FilterButtonGroup label="来源" labelClassName="w-12" options={paperSources} value={selectedSource} onChange={setSelectedSource} />
        <FilterButtonGroup label="分类" labelClassName="w-12" options={paperTypes} value={selectedType} onChange={setSelectedType} />
        <label className="flex flex-wrap items-center gap-3 text-sm">
          <span className="w-12 font-semibold">年份</span>
          <select className="min-h-10 rounded-ui border border-line px-3" value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
            {paperYears.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <PageHeader title={isProfessional ? `${selectedCategory}试卷` : `${selectedCultureSubject}试卷`} />
      <PrototypeNote>
        “已做次数、状态、得分、已用时间”来自当前学生的练习记录；试卷名称、分类、年份、时长、题数和总分来自试卷基础信息。
      </PrototypeNote>
      {filteredPapers.length ? (
        <>
          <DataTable
            columns={["试卷", "分类", "年份", "时长", "总题数", "总分", "已做次数", "状态/结果", "操作"]}
            gridTemplateColumns="minmax(220px,1.8fr) 92px 72px 82px 82px 72px 86px minmax(140px,1.1fr) 120px"
            rows={paginatedPapers}
            renderRow={(paper) => {
              const displayStatus = normalizePaperStatus(paper.studyStatus);
              return (
                <>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{paper.title}</strong>
                      <Tag tone={paper.source === "本校" ? "red" : "blue"}>{paper.source}</Tag>
                    </div>
                  </div>
                  <span>{paper.type}</span>
                  <span>{paper.year}</span>
                  <span>{paper.duration} 分钟</span>
                  <span>{paper.questionCount} 道</span>
                  <span>{paper.totalScore} 分</span>
                  <span>{paper.doneCount} 次</span>
                  <span>
                    {isStudent && paper.unlocked ? (
                      <>
                        <Tag tone={statusTone[displayStatus]}>{displayStatus}</Tag>
                        {displayStatus === "已完成" ? <p className="mt-2 text-xs text-muted">得分 {paper.score} 分</p> : null}
                        {displayStatus === "进行中" && paper.usedTime ? <p className="mt-2 text-xs text-muted">已用时间：{paper.usedTime}</p> : null}
                      </>
                    ) : (
                      <Tag tone="gray">-</Tag>
                    )}
                  </span>
                  {isStudent && paper.unlocked ? <PaperAction status={displayStatus} /> : <LockedPaperAction roleKey={roleKey} />}
                </>
              );
            }}
          />
          <Pagination
            label="试卷列表"
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            page={currentPage}
            pageSize={pageSize}
            total={filteredPapers.length}
          />
        </>
      ) : (
        <Card>
          <p className="mb-0 leading-7 text-muted">该分类下暂无可练习试卷，请选择其他科目或分类。</p>
        </Card>
      )}
    </>
  );
}

function LockedPaperAction({ roleKey }) {
  if (roleKey === "visitor") {
    return <PaperListButton href="#/login" tone="secondary">登录后练习</PaperListButton>;
  }

  if (roleKey === "registered") {
    return <PaperListButton href="#/profile" tone="secondary">查看认证</PaperListButton>;
  }

  return <Tag tone="gray">暂不可练习</Tag>;
}

function PaperAction({ status }) {
  if (status === "进行中") {
    return <PaperListButton href="#/paper-answer">继续练习</PaperListButton>;
  }

  if (status === "已完成") {
    return (
      <div className="grid w-full gap-2">
        <PaperListButton href="#/paper-analysis" tone="ghost">查看解析</PaperListButton>
        <PaperListButton href="#/paper-answer" tone="secondary">重新开始</PaperListButton>
      </div>
    );
  }

  return <PaperListButton href="#/paper-answer">开始练习</PaperListButton>;
}

function normalizePaperStatus(status) {
  if (status === "已结束") return "已完成";
  return status;
}

function PaperListButton({ children, href, tone = "primary" }) {
  const cls = {
    primary: "border-blue-600 bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.14)] hover:bg-blue-700",
    secondary: "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
    ghost: "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100",
  }[tone];

  return (
    <a className={`inline-flex min-h-9 w-full items-center justify-center rounded-ui border px-2 text-center text-xs font-medium transition ${cls}`} href={href}>
      {children}
    </a>
  );
}

function formatElapsedTime(seconds) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = seconds % 60;

  if (hour > 0) return `${hour}时${String(minute).padStart(2, "0")}分${String(second).padStart(2, "0")}秒`;
  return `${minute}分${String(second).padStart(2, "0")}秒`;
}

export function PaperAnswerPage() {
  const answerParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const isQuickPractice = answerParams.get("mode") === "quick";
  const quickPracticeSubject = answerParams.get("subject") || "当前科目";
  const [markedQuestions, setMarkedQuestions] = useState(["single-7"]);
  const [activeKey, setActiveKey] = useState("single-4");
  const [elapsedSeconds, setElapsedSeconds] = useState(34 * 60 + 40);
  const currentQuestionKey = activeKey;
  const isCurrentMarked = markedQuestions.includes(currentQuestionKey);
  const answerGroups = paperQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question) => {
      return { ...question, marked: markedQuestions.includes(question.key) || (question.key !== currentQuestionKey && question.marked) };
    }),
  }));
  const answerQuestions = getAllPaperQuestions(answerGroups);
  const activeQuestion = answerQuestions.find((question) => question.key === activeKey) || answerQuestions[0];
  const activeIndex = Math.max(0, answerQuestions.findIndex((question) => question.key === activeQuestion.key));
  const activeQuestionType = getQuestionType(activeQuestion);
  const activeIsComposite = activeQuestion.groupTitle.includes("综合题");
  const answeredCount = answerQuestions.filter((question) => question.status === "answered").length;
  const unansweredCount = answerQuestions.length - answeredCount;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <PageHeader
        title={isQuickPractice ? `${quickPracticeSubject}快速练习答题页` : "试卷练习答题页"}
        desc={isQuickPractice ? "系统从当前科目的可用题库中随机组卷，提交后可查看答题结果和解析。" : "练习过程中可以保存退出；完成后系统批改客观题并展示答案和解析。"}
        action={<Tag tone="blue">{isQuickPractice ? "快速练习" : "练习模式"}</Tag>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[420px]">
          <Meta><Tag>{activeQuestion.groupTitle}</Tag><Tag>第 {activeQuestion.label} 题</Tag><Tag tone="cyan">函数</Tag></Meta>
          {activeIsComposite ? (
            <section className="mt-5 rounded-ui border border-line bg-slate-50 p-5 leading-8 text-slate-700">
              <h2 className="m-0 mb-3 text-xl text-ink">综合题材料：函数应用与数据分析</h2>
              <p className="m-0">某校对学生数学基础模块进行阶段测评，收集了函数、数列和几何三个模块的练习数据。请结合材料完成第 {activeQuestion.label} 小题。</p>
            </section>
          ) : null}
          <h2 className="mt-6 text-xl">
            {activeIsComposite ? `子题 ${activeQuestion.label}（${activeQuestionType}）：根据材料完成本小题。` : "已知函数 f(x)=2x+1，则 f(3) 的值为多少？"}
          </h2>
          <AnswerInput questionType={activeQuestionType} />
          <Meta>
            <Button
              disabled={activeIndex <= 0}
              tone="secondary"
              onClick={() => setActiveKey(answerQuestions[Math.max(0, activeIndex - 1)].key)}
            >
              上一题
            </Button>
            <Button
              disabled={activeIndex >= answerQuestions.length - 1}
              onClick={() => setActiveKey(answerQuestions[Math.min(answerQuestions.length - 1, activeIndex + 1)].key)}
            >
              下一题
            </Button>
            <Button
              tone={isCurrentMarked ? "secondary" : "warning"}
              onClick={() => setMarkedQuestions((items) => (
                items.includes(currentQuestionKey)
                  ? items.filter((item) => item !== currentQuestionKey)
                  : [...items, currentQuestionKey]
              ))}
            >
              {isCurrentMarked ? "取消标记" : "标记本题"}
            </Button>
          </Meta>
        </Card>
        <Card>
          <h3>答题进度</h3>
          <div className="mt-4 grid gap-3 rounded-ui border border-line bg-slate-50 p-4">
            <div>
              <span className="block text-xs text-muted">本次已用时间</span>
              <strong className="mt-1 block text-2xl text-ink">{formatElapsedTime(elapsedSeconds)}</strong>
            </div>
            <p className="m-0 text-sm leading-6 text-muted">已答 {answeredCount} 题，未答 {unansweredCount} 题，已标记 {markedQuestions.length} 题。</p>
          </div>
          <PrototypeNote className="mt-3">未完成时可保存退出，下次从原进度继续；完成练习后可逐题查看答案和解析。</PrototypeNote>
          <PaperQuestionNavigator activeKey={activeKey} groups={answerGroups} onSelect={(question) => setActiveKey(question.key)} />
          <QuestionStatusLegend mode="answer" />
          <Meta><Button href="#/papers" tone="secondary">保存退出</Button><Button href="#/paper-analysis" tone="warning">完成练习</Button></Meta>
        </Card>
      </div>
    </>
  );
}

export function PaperAnalysisPage() {
  const analysisGroups = paperQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question, index) => {
      const statuses = group.title.includes("简答题")
        ? ["answered", "scored", "unanswered"]
        : group.title.includes("综合题")
          ? ["correct", "wrong", "answered", "scored", "unanswered"]
          : ["correct", "wrong", "correct", "unanswered"];
      return { ...question, status: statuses[index % statuses.length] };
    }),
  }));
  const allAnalysisQuestions = getAllPaperQuestions(analysisGroups);
  const [activeKey, setActiveKey] = useState(allAnalysisQuestions[0].key);
  const activeIndex = Math.max(0, allAnalysisQuestions.findIndex((question) => question.key === activeKey));
  const activeNavQuestion = allAnalysisQuestions[activeIndex] || allAnalysisQuestions[0];
  const currentQuestion = paperAnalysisQuestions[activeIndex % paperAnalysisQuestions.length];
  const isComposite = activeNavQuestion.groupTitle.includes("综合题");

  return (
    <>
      <PageHeader
        title="试卷解析"
        desc="提交练习后，可逐题查看本次作答、参考答案和解析。"
        action={<Button href="#/papers" tone="ghost">返回试卷练习</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="本次得分" value="82 / 100" />
        <Stat label="正确率" value="78%" />
        <Stat label="答题用时" value="42 分钟" />
        <Stat label="完成题量" value="45 / 45" />
      </div>

      <section className="mt-8">
        <PageHeader title="题目解析" />
        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <Card className="min-h-[520px]">
            <Meta>
              <Tag>{activeNavQuestion.groupTitle}</Tag>
              <Tag>第 {activeNavQuestion.label} 题</Tag>
              <Tag tone={currentQuestion.tone}>{currentQuestion.result}</Tag>
              {activeNavQuestion.marked || currentQuestion.marked ? <Tag tone="amber">已标记</Tag> : null}
            </Meta>
            <h3 className="mb-4 mt-5 text-xl">{isComposite ? "综合题材料：函数应用与数据分析" : currentQuestion.title}</h3>
            {isComposite ? (
              <>
                <div className="mb-4 rounded-ui border border-line bg-slate-50 p-4 leading-8 text-slate-700">
                  某校对学生数学基础模块进行阶段测评，收集了函数、数列和几何三个模块的练习数据。请结合材料完成下列子题。
                </div>
                <h4 className="mb-4 mt-0 text-base">子题 {activeNavQuestion.label}（{getQuestionType(activeNavQuestion)}）：根据材料完成本小题。</h4>
              </>
            ) : null}
            <div className="grid gap-3 rounded-ui bg-slate-50 p-4 text-sm leading-7 md:grid-cols-2">
              <div><strong>我的答案：</strong><span className="text-muted">{currentQuestion.myAnswer}</span></div>
              <div><strong>参考答案：</strong><span className="text-muted">{currentQuestion.correctAnswer}</span></div>
            </div>
            <section className="mt-6 rounded-ui border border-line p-5">
              <h4 className="m-0 text-base">题目解析</h4>
              <p className="mt-4 leading-8 text-slate-700">{currentQuestion.analysis}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="grid min-h-[150px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-sm text-muted">
                  题目解析配图
                </div>
                <div className="grid min-h-[150px] place-items-center rounded-ui bg-slate-900 text-sm text-white/70">
                  题目讲解视频
                </div>
              </div>
              <PrototypeNote className="mt-4">
                题目解析由出题老师提供，可能包含文字、图片、视频或外部资料链接。
              </PrototypeNote>
            </section>
            <Meta>
              <Button tone="secondary" onClick={() => setActiveKey(allAnalysisQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
              <Button onClick={() => setActiveKey(allAnalysisQuestions[Math.min(allAnalysisQuestions.length - 1, activeIndex + 1)].key)}>下一题</Button>
            </Meta>
          </Card>
          <Card className="self-start md:sticky md:top-5">
            <h3>题号导航</h3>
            <p className="leading-7 text-muted">正确 4 题，错误 2 题，已答待评 1 题，已评分 2 题。</p>
            <PaperQuestionNavigator activeKey={activeKey} groups={analysisGroups} onSelect={(question) => setActiveKey(question.key)} />
            <QuestionStatusLegend />
          </Card>
        </div>
      </section>

      <Meta><Button href="#/paper-answer" tone="secondary">重新练习</Button><Button href="#/papers">返回试卷练习</Button></Meta>
    </>
  );
}

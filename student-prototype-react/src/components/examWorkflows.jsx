import { Tag } from "./ui";

export const examQuestionGroups = [
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

export const examAnalysisQuestions = [
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

export const examQuestionStatusStyles = {
  unanswered: "border-line bg-white text-slate-700",
  answered: "border-blue-600 bg-blue-600 text-white",
  correct: "border-green-600 bg-green-600 text-white",
  wrong: "border-red-600 bg-red-600 text-white",
  scored: "border-violet-600 bg-violet-600 text-white",
};

export function getAllExamQuestions(groups = examQuestionGroups) {
  return groups.flatMap((group) => group.questions.map((question) => ({ ...question, groupTitle: group.title })));
}

export function getExamQuestionType(question) {
  if (question.questionType) return question.questionType;
  if (question.type) return question.type;
  if (question.groupTitle.includes("单选题")) return "单选题";
  if (question.groupTitle.includes("多选题")) return "多选题";
  if (question.groupTitle.includes("判断题")) return "判断题";
  if (question.groupTitle.includes("填空题")) return "填空题";
  if (question.groupTitle.includes("简答题")) return "简答题";
  return "单选题";
}

export function ExamQuestionNumber({ number, status = "unanswered", marked = false, active = false, onClick }) {
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

export function ExamQuestionNavigator({ groups = examQuestionGroups, activeKey, onSelect }) {
  return (
    <div className="mt-4 grid max-h-[460px] gap-4 overflow-y-auto pr-1">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-2">
            <strong className="block text-sm">{group.title}</strong>
            {group.desc ? <span className="text-xs text-muted">{group.desc}</span> : null}
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

export function ExamQuestionStatusLegend({ mode = "analysis" }) {
  const items = mode === "answer"
    ? [["unanswered", "未答题"], ["answered", "已答题"]]
    : [["unanswered", "未答题"], ["answered", "已答题"], ["correct", "题目正确"], ["wrong", "题目错误"], ["scored", "已评分"]];

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

export function ExamAnswerInput({ questionType }) {
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

export function normalizeQuestionGroups(groups, { prefix = "shared", answerCount = 0, markedIndexes = [] } = {}) {
  let cursor = 0;
  return groups.map((group) => ({
    ...group,
    desc: group.desc || "按题型分组作答",
    questions: group.questions.map((question) => {
      const globalIndex = cursor++;
      return {
        ...question,
        key: question.key || `${prefix}-${globalIndex + 1}`,
        questionType: question.questionType || question.type,
        status: question.status || (globalIndex < answerCount ? "answered" : "unanswered"),
        marked: Boolean(question.marked || markedIndexes.includes(globalIndex)),
      };
    }),
  }));
}

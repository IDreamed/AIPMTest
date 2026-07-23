import { Card, PageHeader, usePrototypeRole } from "./ui";
import { exams, papers, wrongQuestions } from "../data/mockData";

const examNavItems = [
  { key: "current", label: "当前考试", href: "#/exams", group: "考试", countKey: "current" },
  { key: "records", label: "考试记录", href: "#/my-exams", group: "考试", countKey: "records" },
  { key: "papers", label: "试卷练习", href: "#/papers", group: "练习", countKey: "papers" },
  { key: "wrong", label: "错题本", href: "#/wrong-book", group: "练习", countKey: "wrong" },
];

export function ExamSectionShell({ active, title, desc, action, children }) {
  return (
    <>
      <PageHeader title={title} desc={desc} action={action} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <ExamSideNav active={active} />
        <div>{children}</div>
      </div>
    </>
  );
}

function ExamSideNav({ active }) {
  const { roleKey } = usePrototypeRole();
  const examStats = getExamNavStats(roleKey);
  const groups = ["考试", "练习"].map((group) => ({
    title: group,
    items: examNavItems.filter((item) => item.group === group),
  }));

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card className="!p-3">
        <nav className="grid gap-5">
          {groups.map((group) => (
            <div key={group.title}>
              <span className="mb-2 block px-2 text-xs font-semibold text-slate-400">{group.title}</span>
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <a
                    className={`inline-flex min-h-9 w-full items-center justify-between rounded-ui px-3 text-sm font-medium transition ${
                      active === item.key ? "bg-blue-600 text-white shadow-[0_6px_14px_rgba(37,99,235,0.14)]" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                    href={item.href}
                    key={item.key}
                  >
                    <span>{item.label}</span>
                    <span className={`text-xs ${active === item.key ? "text-white/80" : "text-slate-400"}`}>{examStats[item.countKey]}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </Card>
    </aside>
  );
}

function getExamNavStats(roleKey) {
  const canSeeExam = roleKey === "student";
  const current = canSeeExam
    ? exams.filter((exam) => exam.type === "平台联考" && ["未开始", "进行中"].includes(exam.status) && !exam.submitted).length
    : 0;
  const records = canSeeExam
    ? exams.filter((exam) => exam.type === "平台联考" && (exam.submitted || ["评审中", "已公示"].includes(exam.status))).length
    : 0;
  const paperCount = canSeeExam ? papers.filter((paper) => paper.unlocked).length : 0;
  const wrongCount = canSeeExam ? wrongQuestions.length : 0;

  return {
    current,
    records,
    papers: paperCount,
    wrong: wrongCount,
  };
}

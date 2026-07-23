import { useState } from "react";
import { classes, exams } from "../data/mockData";
import { ExamSectionShell } from "../components/examLayout";
import { examAnalysisQuestions, examQuestionGroups, ExamAnswerInput, ExamQuestionNavigator, ExamQuestionStatusLegend, getAllExamQuestions, getExamQuestionType } from "../components/examWorkflows";
import { Button, Card, DataTable, FilterButtonGroup, Meta, Modal, PageHeader, PrototypeNote, SegmentedTabs, Stat, Tag, usePrototypeRole } from "../components/ui";

const PLATFORM_EXAM_TYPE = "平台联考";

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

export function ExamCenterPage() {
  const { roleKey } = usePrototypeRole();
  const currentExams = getCurrentExamRows(roleKey);

  return (
    <ExamSectionShell
      active="current"
      title="当前考试"
      desc="查看正在进行和即将开始的考试；已结束的考试可在考试记录中查询。"
    >
      <PrototypeNote>
        当前考试来自考试发布数据，并按学生班级权限过滤；仅显示未开始、进行中且学生尚未交卷的考试。参加状态由考试状态、权限和交卷记录共同计算。
      </PrototypeNote>
      <CurrentExamList exams={currentExams} roleKey={roleKey} />
      <PrototypeNote className="mt-5">
        当前考试按开始时间排列，正在进行的考试优先显示；已交卷和已结束的考试进入考试记录。
      </PrototypeNote>
    </ExamSectionShell>
  );
}

function getCurrentExamRows(roleKey) {
  return exams
    .filter((exam) => (
      exam.type === PLATFORM_EXAM_TYPE
      && ["未开始", "进行中"].includes(exam.status)
      && !exam.submitted
      && hasExamPermission(exam, roleKey)
    ))
    .sort(sortExamCenterRows);
}

function getRecordExamRows(roleKey) {
  return exams
    .filter((exam) => (
      exam.type === PLATFORM_EXAM_TYPE
      && hasExamPermission(exam, roleKey)
      && (exam.submitted || ["评审中", "已公示"].includes(exam.status))
    ))
    .sort((a, b) => String(a.startAt || a.time).localeCompare(String(b.startAt || b.time), "zh-Hans-CN"));
}

function getExamRecordStatus(exam) {
  if (!exam.submitted) return { label: "缺考", tone: "gray" };
  if (exam.status === "已公示") return { label: "已公示", tone: "green" };
  if (exam.status === "评审中") return { label: "评阅中", tone: "amber" };
  return { label: "已交卷", tone: "blue" };
}

function CurrentExamList({ exams: currentExams, roleKey }) {
  const activeExams = currentExams.filter((exam) => exam.status === "进行中");
  const waitingExams = currentExams.filter((exam) => exam.status === "未开始");

  if (!currentExams.length) {
    return (
      <Card>
        <h3 className="m-0">暂无当前考试</h3>
        <p className="mb-0 mt-3 leading-7 text-muted">现在没有未开始或进行中的可参加考试，可以去考试记录查看历史考试和成绩。</p>
        <Meta><Button href="#/my-exams" tone="secondary">查看考试记录</Button></Meta>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      {activeExams.length ? <ExamCardSection title="正在进行" exams={activeExams} roleKey={roleKey} /> : null}
      {waitingExams.length ? <ExamCardSection title="即将开始" exams={waitingExams} roleKey={roleKey} muted /> : null}
    </div>
  );
}
function ExamCardSection({ title, exams: rows, roleKey, muted = false }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="m-0 text-lg">{title}</h2>
      </div>
      <div className="grid gap-4">
        {rows.map((exam) => <ExamTaskCard exam={exam} key={exam.id} muted={muted} roleKey={roleKey} />)}
      </div>
    </section>
  );
}

function ExamTaskCard({ exam, roleKey, muted = false }) {
  const isActive = exam.status === "进行中" && !exam.submitted;
  const subject = exam.subject === "专业课" ? exam.category : exam.subject;

  return (
    <Card className={`grid gap-5 p-5 md:grid-cols-[1fr_220px] md:items-center ${
      isActive ? "border-blue-200 bg-blue-50/80 shadow-lift" : muted ? "bg-slate-50/80" : ""
    }`}>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Tag tone={isActive ? "green" : "amber"}>{exam.status}</Tag>
          <Tag tone="blue">{subject}</Tag>
          {exam.rankEnabled ? <Tag tone="gray">含排行</Tag> : null}
        </div>
        <h3 className="m-0 text-xl leading-snug">{getExamListTitle(exam)}</h3>
        <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
          <span>开始：{exam.startAt || exam.time}</span>
          <span>结束：{exam.endAt || exam.time}</span>
          <span>出分：{exam.publishAt || "待公布"}</span>
        </div>
      </div>
      <div className="grid gap-3 md:justify-items-end">
        <ExamAction exam={exam} roleKey={roleKey} />
        <span className="text-sm text-muted">{isActive ? "现在可以进入考试" : "到开始时间后开放"}</span>
      </div>
    </Card>
  );
}

function hasExamPermission(exam, roleKey) {
  return exam.type === PLATFORM_EXAM_TYPE && roleKey === "student";
}

function sortExamCenterRows(a, b) {
  const statusOrder = { 进行中: 0, 未开始: 1 };
  const statusDiff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
  if (statusDiff !== 0) return statusDiff;
  return String(b.startAt || b.time).localeCompare(String(a.startAt || a.time), "zh-Hans-CN");
}

function getExamListTitle(exam) {
  return exam.title.replace(/（[^）]*(未开始|进行中|评审中|已公示|已交卷|未参加|已出分)[^）]*）/g, "");
}

function getExamParticipation(exam, roleKey) {
  const statusTone = {
    暂不可参加: "gray",
    待开始: "amber",
    未开始: "amber",
    可参加: "green",
    已交卷: "green",
    已出分: "green",
    未参加: "gray",
  };

  if (!hasExamPermission(exam, roleKey)) return { label: "暂不可参加", tone: "gray" };
  if (exam.status === "未开始") return { label: "待开始", tone: "amber" };
  if (exam.status === "进行中") return { label: exam.submitted ? "已交卷" : "可参加", tone: "green" };
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
      desc: "本场成绩和答题记录已公布，可查看题目解析和完整排行。",
      analysisAction: <Button href={`#/exam-analysis?id=${exam.id}`} tone="ghost">查看成绩与解析</Button>,
      rankAction: exam.rankEnabled ? <Button href={`#/exam-rank?id=${exam.id}`} tone="secondary">查看完整排行</Button> : <Tag tone="gray">暂无排行</Tag>,
    };
  }

  if (exam.status === "评审中" && participation.label === "已交卷") {
    return {
      title: "已交卷，成绩评审中",
      desc: "成绩公示前暂不可查看成绩、排行和题目解析。",
      analysisAction: <Tag tone="amber">等待成绩公布</Tag>,
      rankAction: exam.rankEnabled ? <Tag tone="gray">排行待公布</Tag> : <Tag tone="gray">暂无排行</Tag>,
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
      rankAction: <Tag tone="gray">暂未公布</Tag>,
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
    desc: "本场考试尚未生成可查看的成绩或答题记录。",
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

  if (exam.status === "进行中" && !exam.submitted) {
    return (
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <Button href="#/exam-answer">开始考试</Button>
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
    return {
      title: `你可以参加本场${PLATFORM_EXAM_TYPE}`,
      desc: "本场考试面向当前班级学生开放，可先查看考试详情；考试开始后可进入答题。",
      action: null,
    };
  }

  if (roleKey === "visitor") {
    return {
      title: "登录后查看可参加考试",
      desc: `${PLATFORM_EXAM_TYPE}仅面向已入校并加入指定班级的学生开放，请先登录并完成入校认证。`,
      action: <Button href="#/login">登录/注册</Button>,
    };
  }

  if (roleKey === "registered") {
    return {
      title: "完成入校认证后参加考试",
      desc: `当前账号尚未加入学校，认证通过并加入班级后才能参加${PLATFORM_EXAM_TYPE}。`,
      action: <Button href="#/profile">查看认证</Button>,
    };
  }

  return {
    title: "你暂时不能参加本场考试",
    desc: "本场考试暂未面向你的班级开放。如需确认考试安排，请联系班主任或任课老师。",
    action: <Button href="#/profile" tone="secondary">查看个人中心</Button>,
  };
}

export function MyExamsPage() {
  const { roleKey } = usePrototypeRole();
  const currentMajor = classes[0]?.category || "专业课";
  const [statusFilter, setStatusFilter] = useState("全部");
  const [subjectFilter, setSubjectFilter] = useState("全部");
  const recordExams = getRecordExamRows(roleKey);
  const filteredRecords = recordExams.filter((exam) => {
    const statusMatched = statusFilter === "全部" || getExamRecordStatus(exam).label === statusFilter;
    const subjectMatched = subjectFilter === "全部"
      || (subjectFilter === currentMajor ? exam.subject === "专业课" && exam.category === currentMajor : exam.subject === subjectFilter);
    return statusMatched && subjectMatched;
  });
  if (roleKey !== "student") {
    return (
      <ExamSectionShell active="records" title="考试记录" desc="完成入校认证后查看当前考试、考试记录和成绩。">
        <Card>
          <h2 className="m-0 text-xl">完成入校认证后查看考试记录</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">{PLATFORM_EXAM_TYPE}仅面向已入校并加入指定班级的学生开放。</p>
          <Meta><Button href="#/profile">查看认证</Button><Button href="#/exams" tone="secondary">返回考试中心</Button></Meta>
        </Card>
      </ExamSectionShell>
    );
  }

  return (
    <ExamSectionShell
      active="records"
      title="考试记录"
      desc="考试记录展示已经结束的可参加考试，可查看成绩、缺考记录、答题解析和排行。"
    >
      <Card className="grid gap-4 p-4">
        <FilterButtonGroup
          label="科目"
          options={["全部", "语文", "数学", "英语", currentMajor]}
          value={subjectFilter}
          onChange={setSubjectFilter}
        />
        <FilterButtonGroup
          label="考试状态"
          options={["全部", "已交卷", "评阅中", "已公示", "缺考"]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </Card>
      <PrototypeNote>
        考试记录来自学生可参加的历史考试及交卷记录；“缺考”表示考试已结束但没有有效交卷记录，“评阅中”表示已交卷但成绩尚未公示。
      </PrototypeNote>
      <div className="mt-6">
        {filteredRecords.length ? (
          <div className="grid gap-4">
            {filteredRecords.map((exam) => {
              const participation = getExamParticipation(exam, roleKey);
              const canSeeScore = exam.status === "已公示" && exam.submitted;
              const recordStatus = getExamRecordStatus(exam);

              return (
                <Card className="grid gap-5 p-5 md:grid-cols-[1fr_240px] md:items-center" key={exam.id}>
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Tag tone={recordStatus.tone}>{recordStatus.label}</Tag>
                      <Tag tone="blue">{exam.subject === "专业课" ? exam.category : exam.subject}</Tag>
                      {exam.rankEnabled ? <Tag tone="gray">含排行</Tag> : null}
                    </div>
                    <h3 className="m-0 text-xl leading-snug">{getExamListTitle(exam)}</h3>
                    <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                      <span>开始：{exam.startAt || exam.time}</span>
                      <span>结束：{exam.endAt || exam.time}</span>
                      <span>{canSeeScore ? `成绩：${exam.score} 分` : `状态：${recordStatus.label}`}</span>
                    </div>
                  </div>
                  <ExamRecordActions exam={exam} participation={participation} canSeeScore={canSeeScore} recordStatus={recordStatus} />
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <h3 className="m-0">暂无考试记录</h3>
            <p className="mb-0 mt-3 leading-7 text-muted">当前筛选条件下没有历史考试。</p>
            <Meta><Button href="#/exams" tone="secondary">查看当前考试</Button></Meta>
          </Card>
        )}
      </div>
      <PrototypeNote className="mt-5">考试记录展示所有已结束的可参加考试，包括已交卷、评阅中、已公示和缺考。</PrototypeNote>
    </ExamSectionShell>
  );
}

function ExamRecordActions({ exam, participation, canSeeScore, recordStatus }) {
  if (recordStatus.label === "缺考") {
    return (
      <div className="flex flex-wrap gap-2 md:justify-end">
        <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      </div>
    );
  }

  if (exam.status === "进行中" && participation.label === "已交卷") {
    return (
      <div className="flex flex-wrap gap-2 md:justify-end">
        <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      </div>
    );
  }

  if (exam.status === "评审中" && participation.label === "已交卷") {
    return (
      <div className="flex flex-wrap gap-2 md:justify-end">
        <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      {canSeeScore ? <Button href={`#/exam-analysis?id=${exam.id}`}>查看成绩</Button> : null}
      {canSeeScore ? <Button href={`#/exam-analysis?id=${exam.id}`} tone="ghost">答题解析</Button> : null}
      {canSeeScore && exam.rankEnabled ? <Button href={`#/exam-rank?id=${exam.id}`} tone="ghost">排行</Button> : null}
    </div>
  );
}

export function ExamDetailPage() {
  const { roleKey } = usePrototypeRole();
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const mockExams = exams.filter((item) => item.type === PLATFORM_EXAM_TYPE);
  const exam = mockExams.find((item) => item.id === params.get("id")) || mockExams[0];
  const permitted = hasExamPermission(exam, roleKey);
  const participation = getExamParticipation(exam, roleKey);
  const canEnter = permitted && exam.status === "进行中" && !exam.submitted;
  const canSeeResult = permitted && exam.status === "已公示" && exam.submitted;
  const permissionCopy = getExamPermissionCopy(exam, roleKey, permitted);
  const resultSummary = getExamResultSummary(exam, participation, canSeeResult);
  const examIntro = exam.intro || [
    `本场${PLATFORM_EXAM_TYPE}面向已入校并加入指定班级的学生开放。`,
    "请认真阅读考试说明，了解考试范围、时间安排和作答要求。",
  ];
  const timeStages = [
    { label: "开始时间", value: exam.startAt || exam.time, tone: "blue" },
    { label: "结束时间", value: exam.endAt || exam.time, tone: "amber" },
    { label: "成绩公布", value: exam.publishAt || "待公布", tone: "green" },
  ];

  return (
    <>
      <PageHeader
        title={exam.title}
        desc="查看考试时间、参加要求、考试说明和个人成绩。"
        action={canEnter ? <Button href="#/exam-answer">开始考试</Button> : null}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="考试类型" value={exam.type} />
        <Stat label="专业" value={exam.category} />
        <Stat label="状态" value={exam.status} />
        <Stat label="参加状态" value={participation.label} />
      </div>
      <PrototypeNote>
        考试详情字段来自单场考试配置；参加状态建议由后端根据考试权限、时间状态和学生交卷记录统一返回。
      </PrototypeNote>

      <section className="mt-8">
        <PageHeader title="考试介绍" desc="参加考试前请确认考试范围、作答要求和注意事项。" />
        <Card className="leading-8 text-slate-700">
          <article className="min-h-[260px] max-h-[520px] overflow-y-auto pr-2">
            {examIntro.map((paragraph) => (
              <p className="mb-4 mt-0" key={paragraph}>{paragraph}</p>
            ))}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="grid min-h-[180px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-sm text-muted">
                考试说明配图
              </div>
              <div className="grid min-h-[180px] place-items-center rounded-ui bg-slate-900 text-sm text-white/70">
                考前说明视频
              </div>
            </div>
          </article>
          <PrototypeNote className="mt-4">考试说明较长时可在区域内滚动查看，时间安排和参加入口始终保留在下方。</PrototypeNote>
        </Card>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <Card className={`border-l-4 ${permitted ? "border-l-green-600" : "border-l-amber-500"}`}>
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <Meta><Tag tone={permitted ? "green" : "amber"}>{permitted ? "可参加" : "暂不可参加"}</Tag><Tag tone={participation.tone}>{participation.label}</Tag></Meta>
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
        <PageHeader title="我的成绩" desc="成绩公布后可查看得分、正确率、答题用时和个人排名。" />
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
  const mockExams = exams.filter((item) => item.type === PLATFORM_EXAM_TYPE);
  const exam = mockExams.find((item) => item.id === params.get("id")) || mockExams[0];
  const pagination = activeTab === "student"
    ? { total: 308, label: "考生排行" }
    : { total: 26, label: "学校排行" };
  const totalPages = Math.ceil(pagination.total / pageSize);

  return (
    <>
      <PageHeader title="考试排行" desc={`查看 ${exam.title} 的考生排行和学校排行。`} action={<Button href={`#/exam-detail?id=${exam.id}`} tone="ghost">返回考试详情</Button>} />
      <SegmentedTabs
        active={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setPage(1);
        }}
        tabs={[
          { key: "student", label: "考生排行" },
          { key: "school", label: "学校排行" },
        ]}
      />
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
            {pagination.label}：第 {page} / {totalPages} 页
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
      <PrototypeNote className="mt-5">排行仅在成绩公示后开放，学生可以切换查看考生排行和学校排行。</PrototypeNote>
    </>
  );
}

export function ExamAnalysisPage() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const mockExams = exams.filter((item) => item.type === PLATFORM_EXAM_TYPE);
  const exam = mockExams.find((item) => item.id === params.get("id")) || mockExams[0];
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
                  题目解析配图
                </div>
                <div className="grid min-h-[150px] place-items-center rounded-ui bg-slate-900 text-sm text-white/70">
                  题目讲解视频
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
            <ExamQuestionNavigator activeKey={activeKey} groups={analysisGroups} onSelect={(question) => setActiveKey(question.key)} />
            <ExamQuestionStatusLegend />
          </Card>
        </div>
      </section>
    </>
  );
}

export function ExamAnswerPage() {
  const [markedQuestions, setMarkedQuestions] = useState(["exam-multi-25"]);
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
              tone={isCurrentMarked ? "secondary" : "warning"}
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

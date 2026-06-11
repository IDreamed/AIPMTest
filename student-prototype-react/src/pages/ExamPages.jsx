import { useEffect, useState } from "react";
import { exams } from "../data/mockData";
import { examAnalysisQuestions, examQuestionGroups, ExamAnswerInput, ExamQuestionNavigator, ExamQuestionStatusLegend, getAllExamQuestions, getExamQuestionType } from "../components/examWorkflows";
import { Button, Card, DataTable, Meta, Modal, PageHeader, Pagination, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

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
  const subjectOptions = ["语文", "数学", "英语", "专业课"];
  const [selectedSubject, setSelectedSubject] = useState("专业课");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const filteredExams = exams.filter((exam) => {
    const subjectMatched = selectedSubject === "专业课" ? exam.subject === "专业课" : exam.subject === selectedSubject;
    return subjectMatched
      && exam.type === "模拟考试"
      && ["未开始", "进行中"].includes(exam.status)
      && !exam.submitted
      && hasExamPermission(exam, roleKey);
  }).sort(sortExamCenterRows);
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedExams = filteredExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const emptyTitle = "暂无可参加考试";
  const emptyDesc = "当前科目下没有未开始或正在进行的可参加考试；已参加过的考试请进入考试记录查看。";

  useEffect(() => {
    setPage(1);
  }, [roleKey, selectedSubject, pageSize]);

  return (
    <>
      <PageHeader
        title="考试中心"
        desc="考试中心只显示当前学生能参加的未开始或进行中考试。"
        action={<Button href="#/my-exams" tone="secondary">考试记录</Button>}
      />
      <PrototypeNote className="mb-5">
        已结束、评审中、已交卷或无权限考试不在考试中心主列表展示；学生已经参加过的考试统一进入考试记录。
      </PrototypeNote>
      <Card className="mb-5 p-4">
        <ExamFilterButtons label="科目" options={subjectOptions} value={selectedSubject} onChange={setSelectedSubject} />
      </Card>
      {filteredExams.length ? (
        <>
          <DataTable
            columns={["考试", "类型", "科目/专业大类", "考试时间", "考试状态", "操作"]}
            gridTemplateColumns="minmax(260px,2fr) 110px 120px 170px 120px 170px"
            rows={paginatedExams}
            renderRow={(exam) => (
              <>
                <div><strong>{getExamListTitle(exam)}</strong></div>
                <Tag tone="blue">{exam.type}</Tag>
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
          <Meta><Button href="#/my-exams" tone="secondary">查看考试记录</Button></Meta>
        </Card>
      )}
    </>
  );
}

function ExamFilterButtons({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="w-12 font-semibold">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            className={`min-h-10 rounded-ui border px-4 transition ${
              value === option ? "border-blue-600 bg-blue-50 text-blue-700" : "border-line bg-white hover:bg-slate-50"
            }`}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function hasExamPermission(exam, roleKey) {
  return exam.type === "模拟考试" && roleKey === "student";
}

function sortExamCenterRows(a, b) {
  const statusOrder = { 进行中: 0, 未开始: 1 };
  const statusDiff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
  if (statusDiff !== 0) return statusDiff;
  return String(a.startAt || a.time).localeCompare(String(b.startAt || b.time), "zh-Hans-CN");
}

function getExamListTitle(exam) {
  return exam.title.replace(/（[^）]*(未开始|进行中|评审中|已公示|已交卷|未参加|已出分)[^）]*）/g, "");
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

  if (exam.status === "进行中" && !exam.submitted) {
    return (
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <Button href={detailHref} tone="secondary">查看详情</Button>
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
      title: "当前班级已获得本场模拟考试权限",
      desc: "本场考试面向已入校并加入指定班级的学生开放，当前身份可查看考试详情，并在考试进行中进入答题。",
      action: null,
    };
  }

  if (roleKey === "visitor") {
    return {
      title: "游客暂无考试参加权限",
      desc: "模拟考试仅面向已入校并加入指定班级的学生开放，请先登录并完成入校认证。",
      action: <Button href="#/login">登录/注册</Button>,
    };
  }

  if (roleKey === "registered") {
    return {
      title: "模拟考试需要入校认证",
      desc: "当前账号尚未加入学校，认证通过并加入授权班级后才能参加模拟考试。",
      action: <Button href="#/profile">查看认证</Button>,
    };
  }

  return {
    title: "当前班级暂无本场考试授权",
    desc: "模拟考试由后台按学校、班级和专业大类授权；如需参加，请联系管理员确认授权范围。",
    action: <Button href="#/profile" tone="secondary">查看个人中心</Button>,
  };
}

export function MyExamsPage() {
  const { roleKey } = usePrototypeRole();
  const myExams = exams.filter((exam) => exam.type === "模拟考试" && hasExamPermission(exam, roleKey) && exam.submitted);
  const publishedCount = myExams.filter((exam) => exam.status === "已公示").length;
  const reviewingCount = myExams.filter((exam) => exam.status === "评审中" || exam.status === "进行中").length;

  if (roleKey !== "student") {
    return (
      <>
        <PageHeader title="考试记录" desc="考试记录展示学生已经参加过的考试。" />
        <Card>
          <h2 className="m-0 text-xl">完成入校认证后查看考试记录</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">模拟考试仅面向已入校并加入指定班级的学生开放。</p>
          <Meta><Button href="#/profile">查看认证</Button><Button href="#/exams" tone="secondary">返回考试中心</Button></Meta>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="考试记录"
        desc="展示学生参加过的所有考试记录，可查看成绩、答题解析和排行。"
        action={<Button href="#/exams" tone="secondary">返回考试中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="参加记录" value={myExams.length} />
        <Stat label="已出分" value={publishedCount} />
        <Stat label="待出分" value={reviewingCount} />
      </div>
      <div className="mt-6">
        {myExams.length ? (
          <DataTable
            columns={["考试", "科目", "考试时间", "考试状态", "成绩", "操作"]}
            gridTemplateColumns="minmax(240px,1.7fr) 110px 180px 120px 90px minmax(220px,1fr)"
            rows={myExams}
            renderRow={(exam) => {
              const participation = getExamParticipation(exam, roleKey);
              const canSeeScore = exam.status === "已公示" && exam.submitted;

              return (
                <>
                  <div>
                    <strong>{getExamListTitle(exam)}</strong>
                  </div>
                  <span>{exam.subject === "专业课" ? "专业课" : exam.subject}</span>
                  <span>
                    <strong className="block text-sm">{exam.startAt || exam.time}</strong>
                    <span className="mt-1 block text-xs text-muted">至 {exam.endAt || exam.time}</span>
                  </span>
                  <ExamParticipation exam={exam} roleKey={roleKey} />
                  <span>{canSeeScore ? exam.score : "-"}</span>
                  <ExamRecordActions exam={exam} participation={participation} canSeeScore={canSeeScore} />
                </>
              );
            }}
          />
        ) : (
          <Card>
            <h3 className="m-0">暂无考试记录</h3>
            <p className="mb-0 mt-3 leading-7 text-muted">当前暂无已参加的模拟考试。</p>
            <Meta><Button href="#/exams" tone="secondary">返回考试中心</Button></Meta>
          </Card>
        )}
      </div>
      <PrototypeNote className="mt-5">考试记录只展示学生已经参加并交卷的考试；列表状态和按钮沿用考试中心的考试状态与学生参加状态规则。</PrototypeNote>
    </>
  );
}

function ExamRecordActions({ exam, participation, canSeeScore }) {
  if (exam.status === "进行中" && participation.label === "已交卷") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      </div>
    );
  }

  if (exam.status === "评审中" && participation.label === "已交卷") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button href={`#/exam-detail?id=${exam.id}`} tone="secondary">查看详情</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
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
  const mockExams = exams.filter((item) => item.type === "模拟考试");
  const exam = mockExams.find((item) => item.id === params.get("id")) || mockExams[0];
  const permitted = hasExamPermission(exam, roleKey);
  const participation = getExamParticipation(exam, roleKey);
  const canEnter = permitted && exam.status === "进行中" && !exam.submitted;
  const canSeeResult = permitted && exam.status === "已公示" && exam.submitted;
  const permissionCopy = getExamPermissionCopy(exam, roleKey, permitted);
  const resultSummary = getExamResultSummary(exam, participation, canSeeResult);
  const examIntro = exam.intro || [
    "本场模拟考试面向已入校并加入指定班级的学生开放。",
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
        action={canEnter ? <Button href="#/exam-answer">开始考试</Button> : null}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="考试类型" value="模拟考试" />
        <Stat label="专业大类" value={exam.category} />
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
  const mockExams = exams.filter((item) => item.type === "模拟考试");
  const exam = mockExams.find((item) => item.id === params.get("id")) || mockExams[0];
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
  const mockExams = exams.filter((item) => item.type === "模拟考试");
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

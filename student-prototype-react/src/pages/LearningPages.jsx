import { useState } from "react";
import { classCourse, classCourses, classExams, classes, courseCatalog, courseMaterials, learningRecords, paperPracticeRecords, papers, qaRecords, wrongQuestions } from "../data/mockData";
import { ExamSectionShell } from "../components/examLayout";
import { ExamAnswerInput, ExamQuestionNavigator, ExamQuestionStatusLegend, getAllExamQuestions, getExamQuestionType, normalizeQuestionGroups } from "../components/examWorkflows";
import { Button, Card, DataTable, FilterButtonGroup, Meta, Modal, PageHeader, Pagination, PrototypeNote, SegmentedTabs, Stat, Tag, usePrototypeRole } from "../components/ui";

export function LearningCenterPage() {
  const { role, roleKey } = usePrototypeRole();

  if (roleKey === "visitor") {
    return (
      <>
        <PageHeader title="学习中心" desc="登录后查看学校和老师安排的课程。" />
        <Card>
          <div>
            <h2 className="mb-3 text-xl">登录后查看学习中心</h2>
            <p className="leading-8 text-muted">完成入校认证后，可以查看当前班级安排的课程。</p>
            <Meta>
              <Button href={role.href}>{role.cta}</Button>
            </Meta>
          </div>
        </Card>
      </>
    );
  }

  if (roleKey === "registered") {
    return (
      <>
        <PageHeader title="学习中心" desc="认证通过后查看学校和老师安排的课程。" />
        <Card>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-sm text-muted">当前身份</span>
              <h2 className="mb-2 mt-2 text-xl">注册用户</h2>
              <p className="m-0 text-muted">暂未加入学校，认证通过后可进入学习中心。</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button href="#/profile">查看认证</Button>
              <Tag tone="amber">未加入学校</Tag>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <LearningSectionShell active="courses" title="我的课程" desc="查看老师为本班安排的课程和个人学习进度。">
        <section className="mb-6 grid gap-4 lg:grid-cols-3">
          <TaskSummaryCard
            title="作业"
            desc="作业来自教师端班级作业，学生在学习中心完成。"
            tasks={classExams.filter((exam) => exam.status === "进行中" && exam.studentStatus !== "已交卷").map((exam) => ({
              title: exam.title,
              meta: exam.status,
              tone: exam.statusTone,
              tags: [exam.duration, `${exam.questionCount} 道`],
              detail: `开始时间：${exam.startAt}${exam.remainingTime ? ` · 剩余 ${exam.remainingTime}` : ""}`,
              href: "#/class-exam-answer",
              action: "开始作业",
            }))}
            href="#/class-exam"
            listAction="查看作业"
          />
          <TaskSummaryCard
            title="课程继续学习"
            desc="课程来自教师端班级派课，进度由课时学习记录驱动。"
            tasks={classCourses.filter((course) => course.status !== "已完成").map((course) => ({
              title: course.title,
              meta: normalizeLearningStatus(course.status),
              tone: getLearningStatusTone(course.status),
              tags: [course.subject || course.category],
              detail: `当前课时：${course.currentLesson} · 已学 ${course.learnedCount}/${course.lessonCount}`,
              href: "#/course-study",
              action: course.progress === "0%" ? "开始学习" : "继续学习",
            }))}
            href="#/class-courses"
            listAction="全部课程"
          />
          <TaskSummaryCard
            title="答疑与记录"
            desc="学生提问由教师端答疑管理承接；学习记录保留视频和音频课时进度。"
            tasks={qaRecords.filter((item) => item.status !== "已回复").map((item) => ({
              title: item.lesson ? `${item.course} / ${item.lesson}` : item.course,
              meta: item.status,
              tone: item.statusTone,
              tags: [item.course],
              detail: item.question,
              href: `#/qa-detail?id=${item.id}`,
              action: "查看答疑",
            }))}
            href="#/qa"
            listAction="我的答疑"
          />
        </section>
        <section>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classCourses.map((course, index) => {
              const status = normalizeLearningStatus(course.status);
              const actionText = course.progress === "0%" ? "开始学习" : course.progress === "100%" ? "复习课程" : "继续学习";
              const sourceTone = index % 2 === 0 ? "green" : "blue";
              const sourceText = index % 2 === 0 ? "本校" : "官方";

              return (
                <Card key={course.title} className="group flex h-full flex-col gap-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                  <div
                    className="relative min-h-[152px] overflow-hidden rounded-ui p-4 text-white"
                    style={{ background: course.coverTone }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,.08),rgba(15,23,42,.44))]" />
                    <div className="relative flex h-full min-h-[120px] flex-col justify-between gap-8">
                      <div className="flex items-center justify-between gap-3">
                        <Tag className="border-white/25 bg-white/15 text-white" tone={sourceTone}>{sourceText}</Tag>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">{course.lessonCount} 课时</span>
                      </div>
                      <strong className="max-w-[240px] text-xl leading-7">{course.title}</strong>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone={getLearningStatusTone(status)}>{status}</Tag>
                      <Tag>{course.subject || course.category}</Tag>
                    </div>
                    <h3 className="mb-2 mt-4 text-lg leading-7 text-slate-950">{course.currentLesson}</h3>
                    <p className="m-0 text-sm leading-6 text-muted">
                      发布人：{course.publisher}
                    </p>
                    <div className="mt-4 rounded-ui border border-slate-100 bg-slate-50 p-3">
                      <div className="mb-2 flex justify-between text-sm text-muted">
                        <span>学习进度</span>
                        <strong className="text-slate-900">{course.progress}</strong>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <span className="block h-full rounded-full bg-blue-600" style={{ width: course.progress }} />
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="text-sm text-muted">已学 {course.learnedCount}/{course.lessonCount}</span>
                      <Button className="w-[112px]" href="#/course-study">{actionText}</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <PrototypeNote>
            我的课程来自当前学生所在班级的课程分配；发布人和课时数来自课程信息，已学课时与学习进度来自学生课时学习记录。
          </PrototypeNote>
        </section>
      </LearningSectionShell>
    </>
  );
}

function LearningSectionShell({ active, children, desc, title }) {
  return (
    <>
      <PageHeader title={title} desc={desc} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <LearningCenterNav active={active} />
        <div>{children}</div>
      </div>
    </>
  );
}

function LearningCenterNav({ active }) {
  const currentIdentity = classes[0];

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card>
        <div className="grid place-items-center gap-3 rounded-ui border border-slate-100 bg-slate-50 px-4 py-5 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-2xl font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.18)]">张</div>
          <div>
            <strong className="block text-lg text-slate-950">张同学</strong>
            <span className="mt-1 block text-sm text-muted">{currentIdentity.school}</span>
            <span className="mt-1 block text-sm text-muted">{currentIdentity.name}</span>
          </div>
        </div>
        <nav className="mt-5 grid gap-2">
          <LearningNavItem active={active === "courses"} href="#/learning" label="我的课程" />
          <LearningNavItem active={active === "tests"} href="#/class-exam" label="作业" />
          <LearningNavItem active={active === "qa"} href="#/qa" label="我的答疑" />
          <LearningNavItem active={active === "records"} href="#/learning-record" label="学习记录" />
        </nav>
      </Card>
    </aside>
  );
}

function LearningNavItem({ active = false, href, label }) {
  return (
    <Button className="w-full justify-between" href={href} tone={active ? "primary" : "secondary"}>
      <span>{label}</span>
    </Button>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LearningRecordSummary({ note }) {
  return (
    <section className="mt-8">
      <PageHeader title="学习记录" desc="记录视频和音频课时的最近学习时间与完成进度。" action={<Button href="#/learning-record" tone="secondary">查看全部记录</Button>} />
      <div className="grid gap-3">
        {learningRecords.slice(0, 2).map((item) => (
          <Card key={`${item.title}-${item.time}`} className="grid gap-4 md:grid-cols-[120px_1fr] md:items-center">
            <time className="text-sm text-muted">{item.time}</time>
            <div>
              <strong>{item.title}</strong>
              <p className="mb-0 mt-2 leading-7 text-muted">{item.detail}</p>
              <Meta><Tag tone={item.status === "已完成" ? "green" : "cyan"}>{normalizeLearningStatus(item.status)}</Tag></Meta>
            </div>
          </Card>
        ))}
      </div>
      {note ? <PrototypeNote className="mt-4">{note}</PrototypeNote> : null}
    </section>
  );
}

function TaskSummaryCard({ title, desc, tasks, href, listAction }) {
  const latestTask = tasks[0];

  return (
    <Card className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="m-0 text-lg">{title}</h3>
          <Tag tone="blue">{tasks.length} 项</Tag>
        </div>
        <PrototypeNote className="mt-2">{desc}</PrototypeNote>
        {latestTask ? (
          <div className="mt-4 rounded-ui border border-line bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={latestTask.tone}>{latestTask.meta}</Tag>
              {latestTask.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
            <strong className="mt-3 block">{latestTask.title}</strong>
            {latestTask.detail ? <p className="mb-0 mt-1 text-sm leading-6 text-muted">{latestTask.detail}</p> : null}
          </div>
        ) : (
          <p className="mb-0 mt-4 text-sm text-muted">今天没有待完成的学习任务</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {latestTask ? <Button href={latestTask.href}>{latestTask.action}</Button> : null}
        <Button href={href} tone="secondary">{listAction}</Button>
      </div>
    </Card>
  );
}

function TaskGroup({ title, desc, tasks, footer }) {
  return (
    <Card>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h3 className="m-0 text-lg">{title}</h3>
          <PrototypeNote className="mt-2">{desc}</PrototypeNote>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {footer}
          <Tag tone="blue">{tasks.length} 项</Tag>
        </div>
      </div>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskRow key={task.title} task={task} />
        ))}
      </div>
    </Card>
  );
}

function TaskRow({ task }) {
  return (
    <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-[1fr_120px] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{task.title}</strong>
          <Tag tone={task.tone}>{task.meta}</Tag>
          {task.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
        {task.detail ? <p className="mb-0 mt-1 leading-6 text-muted">{task.detail}</p> : null}
      </div>
      <Button href={task.href} tone={task.tone === "gray" ? "secondary" : "primary"}>{task.action}</Button>
    </div>
  );
}

function normalizeLearningStatus(status) {
  if (status === "已结束") return "已完成";
  return status;
}

function getLearningStatusTone(status) {
  const normalizedStatus = normalizeLearningStatus(status);
  if (normalizedStatus === "已完成") return "green";
  if (normalizedStatus === "进行中") return "cyan";
  return "gray";
}

function hasQaReply(item) {
  return Boolean(item.reply || item.followUp);
}

function getQaMessages(item) {
  const messages = [
    {
      time: item.createdAt,
      sender: "我",
      info: item.question,
      tone: "gray",
    },
  ];

  if (item.reply) {
    messages.push({
      time: item.updatedAt,
      sender: item.teacher,
      info: item.reply,
      tone: "blue",
    });
  }

  if (item.followUp) {
    messages.push({
      time: item.updatedAt,
      sender: item.teacher,
      info: item.followUp,
      tone: "amber",
    });
  }

  return messages;
}

export function ClassDetailPage() {
  return (
    <>
      <PageHeader title="班级档案" desc="查看所在学校、班级、专业和整体学习进度。" action={<Button href="#/learning" tone="secondary">返回学习中心</Button>} />
      <Card className="mb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <Tag tone="green">当前学校班级</Tag>
            <h2 className="mb-2 mt-4 text-xl">{classes[0].school}</h2>
            <p className="leading-7 text-muted">{classes[0].name} · {classes[0].category}</p>
            <Meta><Tag>班级学生</Tag><Tag>学习进度 {classes[0].progress}</Tag></Meta>
          </div>
        </div>
      </Card>
    </>
  );
}

export function ClassCoursesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const currentCourses = paginateRows(classCourses, page, pageSize);

  return (
    <>
      <PageHeader
        title="班级课程"
        desc="查看老师为本班安排的课程和个人学习进度。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {currentCourses.map((course) => {
          const actionText = course.progress === "0%" ? "开始学习" : course.progress === "100%" ? "复习课程" : "继续学习";
          const courseStatus = normalizeLearningStatus(course.status);

          return (
            <Card key={course.title} className="transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <div
                  className="relative grid min-h-[128px] place-items-end overflow-hidden rounded-ui p-4 text-white"
                  style={{ background: course.coverTone }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,.12),rgba(15,23,42,.48))]" />
                  <strong className="relative text-lg leading-7">{course.title}</strong>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={getLearningStatusTone(courseStatus)}>{courseStatus}</Tag>
                    <Tag>{course.category}</Tag>
                  </div>
                  <h3 className="mb-2 mt-4 text-lg">{course.currentLesson}</h3>
                  <p className="m-0 leading-7 text-muted">
                    {course.subject} · {course.lessonCount} 课时
                  </p>
                  <p className="m-0 mt-1 leading-7 text-muted">
                    发布人：{course.publisher}
                  </p>
                  <div className="mt-4 rounded-ui border border-slate-100 bg-slate-50 p-3">
                    <div className="mb-2 flex justify-between text-sm text-muted">
                      <span>学习进度</span>
                      <strong className="text-slate-900">{course.progress}</strong>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-blue-600" style={{ width: course.progress }} />
                    </div>
                  </div>
                  <Meta>
                    <Button href="#/course-study">{actionText}</Button>
                  </Meta>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <PrototypeNote>
        班级课程来自班级与课程的关联关系；进度按学生已完成课时数除以课程总课时数计算，具体完成规则见课时学习页。
      </PrototypeNote>
      <Pagination
        label="班级课程"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[4, 8, 12]}
        total={classCourses.length}
      />
      <PrototypeNote className="mt-5">
        班级课程只显示学校为当前班级安排的正式课程，不包含首页推荐的试看课程。
      </PrototypeNote>
    </>
  );
}

export function ClassExamPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const orderedExams = [...classExams].sort((a, b) => {
    if (a.status === "进行中" && b.status !== "进行中") return -1;
    if (a.status !== "进行中" && b.status === "进行中") return 1;
    return String(b.startAt).localeCompare(String(a.startAt), "zh-Hans-CN");
  });
  const currentExams = paginateRows(orderedExams, page, pageSize);

  return (
    <LearningSectionShell active="tests" title="作业" desc="查看老师为本班安排的作业、完成状态和成绩。">
      <div className="grid gap-4">
        {currentExams.map((exam) => (
          <Card key={exam.title} className="grid gap-5 md:grid-cols-[1fr_260px] md:items-center">
            <div>
              <h2 className="m-0 text-xl">{exam.title}</h2>
              <div className="mt-5 grid gap-4 text-muted md:grid-cols-3">
                <span>推荐时长：{exam.duration}</span>
                <span>总题数：{exam.questionCount}道</span>
                <span>试卷总分：{exam.totalScore}分</span>
              </div>
            </div>
            <div className="grid gap-3 md:justify-items-end">
              <ClassExamAction exam={exam} />
              <div className="grid gap-2 text-sm md:text-right">
                <span>开始时间：{exam.startAt}</span>
                <span>结束时间：{exam.endAt}</span>
                {exam.remainingTime ? <span>剩余时间：{exam.remainingTime}</span> : null}
                <span className="flex flex-wrap gap-2 md:justify-end">
                  <Tag tone={exam.statusTone}>{exam.status}</Tag>
                  {exam.studentStatus !== "未开始" ? <Tag tone={exam.studentStatusTone}>{exam.studentStatus}</Tag> : null}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <PrototypeNote>
        作业来自老师对当前班级发布的安排；学生状态由提交记录返回，作业状态由开始时间和结束时间计算。
      </PrototypeNote>
      <Pagination
        label="作业"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        page={page}
        pageSize={pageSize}
        pageSizeOptions={[4, 8, 12]}
        total={classExams.length}
      />
      <PrototypeNote className="mt-5">
        作业采用统一答题和解析界面，列表只展示学生作答前需要了解的关键信息。
      </PrototypeNote>
    </LearningSectionShell>
  );
}

function ClassExamAction({ exam }) {
  const action = getClassExamActionConfig(exam);
  const actionClassName = "grid min-w-[112px] gap-2 [&>a]:w-full";

  return <div className={actionClassName}><Button href={action.href} tone={action.tone}>{action.label}</Button></div>;
}

function getClassExamActionConfig(exam) {
  if (exam.submitted && exam.studentStatus !== "缺考") {
    return { label: "查看解析", href: "#/class-exam-analysis", tone: "primary" };
  }

  if (exam.status === "进行中" && exam.studentStatus !== "已交卷") {
    return { label: "开始作业", href: "#/class-exam-answer", tone: "primary" };
  }

  if (exam.status === "进行中" && exam.studentStatus === "已交卷") {
    return { label: "查看记录", href: "#/class-exam-detail", tone: "secondary" };
  }

  if (exam.status === "已结束" && exam.studentStatus === "已出分") {
    return { label: "查看解析", href: "#/class-exam-analysis", tone: "primary" };
  }

  if (exam.status === "已结束" && exam.studentStatus === "已交卷") {
    return { label: "等待出分", href: "#/class-exam-detail", tone: "secondary" };
  }

  if (exam.status === "已结束" && exam.studentStatus === "缺考") {
    return { label: "查看安排", href: "#/class-exam-detail", tone: "secondary" };
  }

  return { label: "查看安排", href: "#/class-exam-detail", tone: "secondary" };
}

export function ClassExamDetailPage() {
  const exam = classExams[0];

  return (
    <>
      <PageHeader
        title="作业安排"
        desc="查看作业时间、题量、分值和完成状态。"
        action={<Button href="#/class-exam" tone="secondary">返回作业</Button>}
      />
      <Card>
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
                  <Tag tone={exam.statusTone}>{exam.status}</Tag>
                  {exam.studentStatus !== "未开始" ? <Tag tone={exam.studentStatusTone}>{exam.studentStatus}</Tag> : null}
            </div>
            <h2 className="mb-0 mt-4 text-2xl">{exam.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Stat label="时长" value={exam.duration} />
              <Stat label="总题数" value={`${exam.questionCount}道`} />
              <Stat label="试卷总分" value={`${exam.totalScore}分`} />
            </div>
            <div className="mt-6 grid gap-3 rounded-ui bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              <span>开始时间：{exam.startAt}</span>
              <span>剩余时间：{exam.remainingTime || "-"}</span>
              <span>结果发布：{exam.publishAt}</span>
            </div>
          </div>
          <div className="grid gap-3">
            <ClassExamAction exam={exam} />
            <Button href="#/qa-detail" tone="ghost">向老师提问</Button>
          </div>
        </div>
      </Card>
      <PrototypeNote className="mt-5">
        学生可在作业开始前确认时间和要求；作业开放后从本页进入答题。
      </PrototypeNote>
    </>
  );
}

const classExamQuestionGroups = normalizeQuestionGroups([
  { title: "一、单选题", desc: "每题只有一个正确答案", questions: [{ label: "1", type: "单选题" }, { label: "2", type: "单选题" }, { label: "3", type: "单选题" }, { label: "4", type: "单选题" }] },
  { title: "二、多选题", desc: "少选、多选均不得分", questions: [{ label: "5", type: "多选题" }, { label: "6", type: "多选题" }, { label: "7", type: "多选题" }] },
  { title: "三、判断题", desc: "判断正误", questions: [{ label: "8", type: "判断题" }, { label: "9", type: "判断题" }, { label: "10", type: "判断题" }] },
  { title: "四、填空题", desc: "按空作答", questions: [{ label: "11", type: "填空题" }, { label: "12", type: "填空题" }, { label: "13", type: "填空题" }] },
  { title: "五、简答题", desc: "简答题提交后进入评分流程", questions: [{ label: "14", type: "简答题" }, { label: "15", type: "简答题" }] },
  { title: "六、综合题", desc: "每道综合题包含多个常规题型子题", questions: [{ label: "16.1", parent: "16", type: "单选题" }, { label: "16.2", parent: "16", type: "填空题" }, { label: "16.3", parent: "16", type: "简答题" }] },
], { prefix: "class-exam", answerCount: 8, markedIndexes: [11] });

const classExamQuestions = getAllExamQuestions(classExamQuestionGroups);
const paperPracticeColumns = ["试卷名称", "科目", "题目数量", "时长", "总分", "状态", "操作"];
const paperPracticeGridTemplate = "minmax(240px,1.8fr) 100px 90px 90px 80px 110px 120px";

function PaperPracticeRow({ paper }) {
  const status = normalizePaperPracticeStatus(paper.studyStatus);
  const actionText = status === "已完成" ? "查看解析" : status === "进行中" ? "继续练习" : "开始练习";
  const actionHref = status === "已完成" ? "#/paper-analysis" : "#/paper-answer";

  return (
    <>
      <div>
        <a className="font-semibold text-ink hover:text-blue-600" href={actionHref}>{paper.title}</a>
        <p className="mb-0 mt-1 text-xs text-muted">{paper.source} · {paper.type}</p>
      </div>
      <span>{paper.subject === "专业课" ? "专业课" : paper.subject}</span>
      <span>{paper.questionCount} 道</span>
      <span>{paper.duration} 分钟</span>
      <span>{paper.totalScore} 分</span>
      <Tag tone={getLearningStatusTone(status)}>{status}</Tag>
      <Button href={actionHref} tone={status === "已完成" ? "ghost" : "secondary"}>{actionText}</Button>
    </>
  );
}

function normalizePaperPracticeStatus(status) {
  return normalizeLearningStatus(status);
}

function parsePracticeDuration(duration) {
  if (!duration || duration === "-") return 0;
  const hour = Number(duration.match(/(\d+)时/)?.[1] || 0);
  const minute = Number(duration.match(/(\d+)分/)?.[1] || 0);
  const second = Number(duration.match(/(\d+)秒/)?.[1] || 0);
  return hour * 3600 + minute * 60 + second;
}

function formatPracticeDuration(totalSeconds) {
  if (!totalSeconds) return "-";
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor((totalSeconds % 3600) / 60);
  const second = totalSeconds % 60;

  if (hour > 0) return `${hour}小时${minute}分钟`;
  if (second > 0) return `${minute}分${String(second).padStart(2, "0")}秒`;
  return `${minute}分钟`;
}

export function PaperPracticePage() {
  const currentMajor = classes[0]?.category || "专业课";
  const subjectOptions = ["语文", "数学", "英语", currentMajor];
  const [selectedSubject, setSelectedSubject] = useState(currentMajor);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredPapers = papers.filter((paper) => (
    selectedSubject === currentMajor
      ? paper.subject === "专业课" && paper.category === currentMajor && paper.unlocked
      : paper.subject === selectedSubject
  ));
  const currentPapers = paginateRows(filteredPapers, page, pageSize);

  function changeSubject(value) {
    setPage(1);
    setSelectedSubject(value);
  }

  return (
    <ExamSectionShell active="papers" title="试卷练习" desc={`按语文、数学、英语和当前专业 ${currentMajor} 选择试卷进行练习。`}>
      <Card className="mb-5 p-4">
        <FilterButtonGroup label="科目" labelClassName="w-12" options={subjectOptions} value={selectedSubject} onChange={changeSubject} />
      </Card>
      <div>
        <DataTable
          columns={paperPracticeColumns}
          gridTemplateColumns={paperPracticeGridTemplate}
          rows={currentPapers}
          renderRow={(paper) => <PaperPracticeRow paper={paper} />}
        />
        <Pagination
          label="试卷练习"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 30]}
          total={filteredPapers.length}
        />
      </div>
      <PrototypeNote className="mt-5">
        试卷练习归入考试中心，用于学生自主刷题和查看练习解析；正式考试仍从“当前考试”进入。
      </PrototypeNote>
    </ExamSectionShell>
  );
}

export function ClassExamAnswerPage() {
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [activeKey, setActiveKey] = useState(classExamQuestions[0].key);
  const [markedQuestions, setMarkedQuestions] = useState(() => [classExamQuestions[11]?.key].filter(Boolean));
  const answerGroups = classExamQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question) => ({
      ...question,
      marked: markedQuestions.includes(question.key) || (question.key !== activeKey && question.marked),
    })),
  }));
  const answerQuestions = getAllExamQuestions(answerGroups);
  const activeIndex = Math.max(0, answerQuestions.findIndex((question) => question.key === activeKey));
  const activeQuestion = answerQuestions[activeIndex] || answerQuestions[0];
  const activeQuestionType = getExamQuestionType(activeQuestion);
  const activeIsComposite = activeQuestion.groupTitle.includes("综合题");
  const isCurrentMarked = markedQuestions.includes(activeKey);

  return (
    <>
      <PageHeader
        title="函数与数列阶段作业"
        desc="请在规定时间内完成作答；可通过题号导航切换题目并标记待检查题目。"
        action={<Button tone="warning" onClick={() => setConfirmSubmit(true)}>提交作业</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[500px]">
          <Meta>
            <Tag>阶段作业</Tag>
            <Tag>{activeQuestion.groupTitle}</Tag>
            <Tag>{activeQuestionType}</Tag>
            <Tag>第 {activeQuestion.label} 题</Tag>
            <Tag tone="red">剩余 00:24:36</Tag>
          </Meta>
          {activeIsComposite ? (
            <section className="mt-5 rounded-ui border border-line bg-slate-50 p-5 leading-8 text-slate-700">
              <h2 className="m-0 mb-3 text-xl text-ink">综合题材料：函数应用情境</h2>
              <p className="m-0">某班级统计一次函数学习数据，请结合材料完成第 {activeQuestion.label} 小题。</p>
            </section>
          ) : null}
          <h2 className="mt-6 text-xl">
            {activeIsComposite ? `子题 ${activeQuestion.label}（${activeQuestionType}）：根据材料完成本小题。` : "函数 y=2x+1 的图像与 y 轴交点坐标是？"}
          </h2>
          <ExamAnswerInput questionType={activeQuestionType} />
          <Meta>
            <Button tone="secondary" onClick={() => setActiveKey(answerQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
            <Button onClick={() => setActiveKey(answerQuestions[Math.min(answerQuestions.length - 1, activeIndex + 1)].key)}>保存并下一题</Button>
            <Button
              tone={isCurrentMarked ? "secondary" : "warning"}
              onClick={() => setMarkedQuestions((items) => (
                items.includes(activeKey) ? items.filter((item) => item !== activeKey) : [...items, activeKey]
              ))}
            >
              {isCurrentMarked ? "取消标记" : "标记本题"}
            </Button>
            <Button tone="warning" onClick={() => setConfirmSubmit(true)}>提交作业</Button>
          </Meta>
        </Card>
        <Card>
          <h3>题号导航</h3>
          <ExamQuestionNavigator activeKey={activeKey} groups={answerGroups} onSelect={(question) => setActiveKey(question.key)} />
          <ExamQuestionStatusLegend mode="answer" />
          <PrototypeNote className="mt-4">作业由任课老师安排，提交后生成个人作业记录，不参与跨校排行。</PrototypeNote>
        </Card>
      </div>
      <Modal open={confirmSubmit} title="确认提交作业" onClose={() => setConfirmSubmit(false)}>
        <p className="m-0 leading-7 text-muted">提交后会生成本次作业记录，已完成题目进入解析和错题沉淀。</p>
        <Meta><Button tone="secondary" onClick={() => setConfirmSubmit(false)}>继续检查</Button><Button href="#/class-exam-analysis" tone="warning">确认提交</Button></Meta>
      </Modal>
    </>
  );
}

export function ClassExamAnalysisPage() {
  const analysisGroups = classExamQuestionGroups.map((group) => ({
    ...group,
    questions: group.questions.map((question, index) => ({
      ...question,
      status: index % 3 === 0 ? "wrong" : index % 3 === 1 ? "correct" : "scored",
    })),
  }));
  const analysisQuestions = getAllExamQuestions(analysisGroups);
  const [activeKey, setActiveKey] = useState(analysisQuestions[0].key);
  const activeIndex = Math.max(0, analysisQuestions.findIndex((question) => question.key === activeKey));
  const activeQuestion = analysisQuestions[activeIndex] || analysisQuestions[0];
  const activeQuestionType = getExamQuestionType(activeQuestion);
  const activeIsComposite = activeQuestion.groupTitle.includes("综合题");
  const isWrong = activeQuestion.status === "wrong";

  return (
    <>
      <PageHeader
        title="作业解析"
        desc="查看本次作业成绩、作答结果和题目解析。"
        action={<Button href="#/class-exam" tone="secondary">返回作业</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="得分/总分" value="86 / 100" />
        <Stat label="正确率" value="86%" />
        <Stat label="答题用时" value="24 分钟" />
        <Stat label="作业状态" value="已出分" />
      </div>

      <section className="mt-8">
        <PageHeader title="题目解析" />
        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <Card className="min-h-[500px]">
            <Meta>
              <Tag>{activeQuestion.groupTitle}</Tag>
              <Tag>{activeQuestionType}</Tag>
              <Tag>第 {activeQuestion.label} 题</Tag>
              <Tag tone={isWrong ? "red" : "green"}>{isWrong ? "错误" : "正确"}</Tag>
              <Tag>{isWrong ? "0 / 5 分" : "5 / 5 分"}</Tag>
            </Meta>
            {activeIsComposite ? (
              <section className="mt-5 rounded-ui border border-line bg-slate-50 p-5 leading-8 text-slate-700">
                <h2 className="m-0 mb-3 text-xl text-ink">综合题材料：函数应用情境</h2>
                <p className="m-0">某班级统计一次函数学习数据，请结合材料完成第 {activeQuestion.label} 小题。</p>
              </section>
            ) : null}
            <h2 className="mt-6 text-xl">
              {activeIsComposite ? `子题 ${activeQuestion.label}（${activeQuestionType}）：根据材料完成本小题。` : "函数 y=2x+1 的图像与 y 轴交点坐标是？"}
            </h2>
            <div className="mt-5 grid gap-3 rounded-ui bg-slate-50 p-4 text-sm leading-7 md:grid-cols-2">
              <div><strong>我的答案：</strong><span className="text-muted">{isWrong ? "C. (0, 2)" : "A. (0, 1)"}</span></div>
              <div><strong>参考答案：</strong><span className="text-muted">A. (0, 1)</span></div>
            </div>
            <section className="mt-6 rounded-ui border border-line p-5">
              <h3 className="m-0 text-base">题目解析</h3>
              <p className="mt-4 leading-8 text-slate-700">一次函数与 y 轴交点需要令 x=0，此时 y=2×0+1=1，所以交点坐标为 (0, 1)。</p>
              <div className="mt-4 grid min-h-[140px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-sm text-muted">
                题目解析配图或讲解视频
              </div>
            </section>
            <Meta>
              <Button tone="secondary" onClick={() => setActiveKey(analysisQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
              <Button onClick={() => setActiveKey(analysisQuestions[Math.min(analysisQuestions.length - 1, activeIndex + 1)].key)}>下一题</Button>
              <Button href="#/wrong-book" tone="ghost">加入错题本</Button>
            </Meta>
          </Card>
          <Card>
            <h3>题号导航</h3>
            <ExamQuestionNavigator activeKey={activeKey} groups={analysisGroups} onSelect={(question) => setActiveKey(question.key)} />
            <ExamQuestionStatusLegend />
          </Card>
        </div>
      </section>
    </>
  );
}

export function CourseStudyPage() {
  const [activeTab, setActiveTab] = useState("catalog");
  const tabs = [
    { key: "detail", label: "介绍" },
    { key: "catalog", label: "目录" },
    { key: "papers", label: "试卷" },
    { key: "materials", label: "课件" },
    { key: "qa", label: "答疑" },
  ];

  return (
    <>
      <PageHeader title={classCourse.title} />
      <PrototypeNote>
        课程详情来自课程基础信息及其目录、试卷、课件、答疑关联数据；各页签按课程 ID 查询对应子模块。
      </PrototypeNote>
      <Card className="mb-5">
        <div className="grid gap-5 md:grid-cols-[260px_1fr_160px] md:items-center">
          <div className="grid min-h-[150px] place-items-center rounded-ui bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] p-5 text-center text-white">
            <strong className="text-xl">{classCourse.title}</strong>
            <span className="mt-3 text-sm text-white/75">{classCourse.category}</span>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag>发布人：{classCourse.publisher}</Tag>
              <Tag tone="green">进度 {classCourse.progress}</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">{classCourse.currentLesson}</h2>
            <PrototypeNote className="mt-3">班级课程不展示价格；课程练习在“试卷”中查看，考试和作业从各自入口参加。</PrototypeNote>
          </div>
          <Button href="#/course-lesson">继续学习</Button>
        </div>
      </Card>

      <SegmentedTabs active={activeTab} onChange={setActiveTab} tabs={tabs} />

      {activeTab === "detail" ? <CourseDetail /> : null}
      {activeTab === "catalog" ? <CourseCatalog /> : null}
      {activeTab === "papers" ? <CoursePapers /> : null}
      {activeTab === "materials" ? <CourseMaterials /> : null}
      {activeTab === "qa" ? <CourseQAPanel /> : null}
    </>
  );
}

function CourseDetail() {
  return (
    <Card>
      <h3 className="m-0 text-lg">课程介绍</h3>
      <div className="mt-4 grid gap-3 leading-8 text-slate-700">
        {classCourse.detail.map((item) => <p className="m-0" key={item}>{item}</p>)}
      </div>
    </Card>
  );
}

function CourseCatalog() {
  return (
    <div className="grid gap-4">
      {courseCatalog.map((chapter) => (
        <Card key={chapter.title}>
          <h3 className="m-0 text-lg">{chapter.title}</h3>
          <div className="mt-4 grid gap-3">
            {chapter.lessons.filter((lesson) => lesson.type !== "练习").map((lesson) => (
              <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-[1fr_90px_110px_120px] md:items-center" key={lesson.title}>
                <div><strong>{lesson.title}</strong><p className="mt-1 text-sm text-muted">{lesson.duration}</p></div>
                <Tag>{lesson.type}</Tag>
                <Tag tone={lesson.statusTone}>{lesson.status}</Tag>
                <Button href="#/course-lesson" tone={lesson.status === "进行中" ? "primary" : "secondary"}>
                  {lesson.status === "已完成" ? "复习" : "学习"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function CoursePapers() {
  const coursePaperRows = paperPracticeRecords.filter((paper) => paper.source === "课程练习");

  return (
    <div>
      <DataTable
        columns={paperPracticeColumns}
        gridTemplateColumns={paperPracticeGridTemplate}
        rows={coursePaperRows}
        renderRow={(paper) => <PaperPracticeRow paper={paper} />}
      />
      <PrototypeNote className="mt-5">此处只显示与本课程关联的练习，并保留学生的练习进度和结果。</PrototypeNote>
    </div>
  );
}

function CourseMaterials() {
  return (
    <Card>
      <h3 className="m-0 text-lg">课件资源</h3>
      <div className="mt-4 grid gap-3">
        {courseMaterials.map((item) => (
          <div className="flex flex-col justify-between gap-3 rounded-ui border border-line p-4 md:flex-row md:items-center" key={item.title}>
            <div><strong>{item.title}</strong><p className="mt-1 text-sm text-muted">{item.type} · {item.size}</p></div>
            <Button href="#/course-material" tone="secondary">查看</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CourseQAPanel() {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_320px]">
      <Card>
        <h3 className="m-0 text-lg">课程答疑记录</h3>
        <div className="mt-4 grid gap-3">
          {qaRecords.filter((item) => item.course === classCourse.title).slice(0, 3).map((item) => (
            <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-[1fr_90px_110px] md:items-center" key={item.id}>
              <div>
                <strong>{item.lesson || item.course}</strong>
                <p className="mb-0 mt-1 text-xs text-muted">更新：{item.updatedAt}</p>
              </div>
              <Tag tone={hasQaReply(item) ? "green" : "gray"}>{hasQaReply(item) ? "已回复" : "未回复"}</Tag>
              <Button href={`#/qa-detail?id=${item.id}`} tone="ghost">查看记录</Button>
            </div>
          ))}
        </div>
        <Meta><Button href="#/qa" tone="secondary">进入答疑</Button></Meta>
      </Card>
      <div className="self-start">
        <AskTeacherCard course={classCourse.title} lesson="可选择具体课时" compact />
      </div>
    </div>
  );
}

const lessonFormats = [
  {
    key: "micro",
    label: "微课",
    title: "函数概念与表示",
    duration: "12 分钟",
    totalSeconds: 12 * 60,
    reportedSeconds: 7 * 60 + 26,
    summary: "通过短视频理解函数定义、定义域和值域，适合碎片时间快速复习。",
    hasPractice: true,
  },
  {
    key: "mooc",
    label: "慕课",
    title: "函数图像与性质精讲",
    duration: "48 分钟",
    totalSeconds: 48 * 60,
    reportedSeconds: 16 * 60 + 48,
    summary: "通过长视频系统讲解函数图像、单调性和常见题型，学习动作与微课一致。",
    hasPractice: true,
  },
  {
    key: "audio",
    label: "音频",
    title: "函数概念速听",
    duration: "12 分钟",
    totalSeconds: 12 * 60,
    reportedSeconds: 5 * 60 + 46,
    summary: "适合通勤或课后复听，重点回顾函数概念、表示方法和易错点。",
    hasPractice: true,
  },
  {
    key: "pdf",
    label: "PDF",
    title: "函数基础讲义",
    duration: "8 页",
    summary: "阅读函数基础讲义，掌握定义域、值域、函数表示法和典型例题。",
    hasPractice: false,
  },
  {
    key: "ppt",
    label: "PPT",
    title: "函数图像课件",
    duration: "18 页",
    summary: "按页查看课堂课件，重点理解一次函数和二次函数图像特征。",
    hasPractice: false,
  },
  {
    key: "richtext",
    label: "富文本",
    title: "函数知识点图文讲解",
    duration: "图文阅读",
    summary: "以图文方式梳理函数知识点、例题步骤和常见误区。",
    hasPractice: false,
  },
];

const lessonTypeMap = {
  微课: "micro",
  慕课: "mooc",
  音频: "audio",
  PDF: "pdf",
  PPT: "ppt",
  富文本: "richtext",
};

const lessonPracticeQuestions = [
  {
    title: "函数 f(x)=2x+1，则 f(3)=？",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    answer: "C. 7",
    analysis: "将 x=3 代入 2x+1，得到 2×3+1=7。",
  },
  {
    title: "下列哪一项可以表示函数关系？",
    options: ["A. 一个 x 对应多个 y", "B. 一个 x 只对应一个 y", "C. y 不能变化", "D. x 必须为整数"],
    answer: "B. 一个 x 只对应一个 y",
    analysis: "函数关系要求自变量的每个取值至多对应一个函数值。",
  },
  {
    title: "一次函数 y=kx+b 中，b 表示什么？",
    options: ["A. 斜率", "B. x 轴截距", "C. y 轴截距", "D. 定义域"],
    answer: "C. y 轴截距",
    analysis: "当 x=0 时 y=b，所以 b 表示图像与 y 轴的交点纵坐标。",
  },
];

export function CourseLessonPage() {
  const [activeLessonKey, setActiveLessonKey] = useState("micro");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const currentLesson = lessonFormats.find((item) => item.key === activeLessonKey) || lessonFormats[0];
  const practiceQuestion = lessonPracticeQuestions[practiceIndex];
  const canPractice = currentLesson.hasPractice;
  const lessonStatus = getLessonStatus(currentLesson);
  const lessonProgressLabel = getLessonProgressLabel(currentLesson);

  function openPractice() {
    setPracticeIndex(0);
    setSelectedAnswer("");
    setPracticeOpen(true);
  }

  function goNextPractice() {
    if (practiceIndex >= lessonPracticeQuestions.length - 1) {
      setPracticeOpen(false);
      return;
    }
    setPracticeIndex((value) => value + 1);
    setSelectedAnswer("");
  }

  return (
    <>
      <PageHeader
        title={currentLesson.title}
        desc="视频和音频按实际播放时间记录进度；PDF、PPT和图文课时打开后记为已完成。"
        action={<Button href="#/course-study" tone="secondary">返回课程详情</Button>}
      />
      <PrototypeNote>
        音视频进度建议返回已学习秒数和总时长；非音视频课时的完成条件由课时类型配置决定。具体上报时机待开发确认。
      </PrototypeNote>
      <div className="grid gap-5 md:grid-cols-[1fr_300px]">
        <Card className="p-0">
          <LessonContent lesson={currentLesson} />
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={lessonStatus === "已完成" ? "green" : "amber"}>{lessonStatus}</Tag>
              <Tag>{currentLesson.label}</Tag>
              <Tag tone="blue">{lessonProgressLabel}</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">本课要点</h2>
            <p className="leading-8 text-muted">{currentLesson.summary}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-blue-600" style={{ width: getLessonProgressWidth(currentLesson) }} />
            </div>
            <Meta>
              <Button tone="secondary">上一课时</Button>
              {canPractice ? <Button onClick={openPractice}>课时练习</Button> : null}
              <Button>下一课时</Button>
            </Meta>
          </div>
        </Card>
        <div className="grid gap-5">
          <Card>
            <h3 className="m-0 text-lg">课时目录</h3>
            <div className="mt-4 max-h-[640px] overflow-y-auto pr-1">
              <div className="grid gap-4">
                {courseCatalog.map((chapter) => (
                  <section key={chapter.title}>
                    <h4 className="mb-2 mt-0 text-sm text-muted">{chapter.title}</h4>
                    <div className="grid gap-2">
                      {chapter.lessons.filter((lesson) => lesson.type !== "练习").map((lesson) => {
                        const lessonKey = lessonTypeMap[lesson.type];
                        const isActive = lessonKey && activeLessonKey === lessonKey;
                        const lessonProgress = lessonFormats.find((item) => item.key === lessonKey);
                        return (
                          <button
                            className={`rounded-ui border p-3 text-left transition ${
                              isActive
                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                : "border-line text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                            }`}
                            key={lesson.title}
                            onClick={() => lessonKey && setActiveLessonKey(lessonKey)}
                            type="button"
                          >
                            <strong className="block">{lesson.title}</strong>
                            <span className="mt-1 block text-xs text-muted">{lesson.type} · {lesson.duration}</span>
                            {lessonProgress ? <span className="mt-1 block text-xs text-muted">进度：{getLessonProgressLabel(lessonProgress)} · {getLessonStatus(lessonProgress)}</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <PrototypeNote className="mt-4">目录按章节分组并支持内部滚动；课堂练习不直接进入目录，归属于具体课时，通过“课时练习”触发。</PrototypeNote>
          </Card>
          <AskTeacherCard course={classCourse.title} lesson={currentLesson.title} compact />
        </div>
      </div>
      <Modal open={practiceOpen} title="课时练习" onClose={() => setPracticeOpen(false)}>
        <div className="grid gap-4">
          <Meta><Tag>第 {practiceIndex + 1} / {lessonPracticeQuestions.length} 题</Tag><Tag>{currentLesson.label}课后</Tag></Meta>
          <h3 className="m-0 text-lg">{practiceQuestion.title}</h3>
          <div className="grid gap-3">
            {practiceQuestion.options.map((option) => (
              <label className={`flex gap-3 rounded-ui border p-4 ${selectedAnswer === option ? "border-blue-300 bg-blue-50" : "border-line"}`} key={option}>
                <input checked={selectedAnswer === option} name="lesson-practice" onChange={() => setSelectedAnswer(option)} type="radio" />
                {option}
              </label>
            ))}
          </div>
          {selectedAnswer ? (
            <section className="rounded-ui border border-line bg-slate-50 p-4 leading-7">
              <div><strong>参考答案：</strong>{practiceQuestion.answer}</div>
              <div className="mt-2"><strong>题目解析：</strong>{practiceQuestion.analysis}</div>
            </section>
          ) : null}
          <Meta>
            <Button tone="secondary" onClick={() => setPracticeOpen(false)}>关闭</Button>
            <Button onClick={() => selectedAnswer && goNextPractice()} tone={selectedAnswer ? "primary" : "secondary"}>{practiceIndex >= lessonPracticeQuestions.length - 1 ? "完成练习" : "下一题"}</Button>
          </Meta>
        </div>
      </Modal>
    </>
  );
}

function LessonContent({ lesson }) {
  if (lesson.key === "micro" || lesson.key === "mooc") {
    return (
      <div className="grid aspect-video min-h-[360px] place-items-center bg-slate-950 p-6 text-white">
        <div className="grid max-w-xl justify-items-center gap-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl">▶</span>
          <div>
            <Tag tone="blue">{lesson.label}</Tag>
            <strong className="mt-4 block text-xl">{lesson.title}</strong>
            <span className="mt-2 block text-sm text-white/70">{classCourse.title} · {lesson.duration}</span>
            <span className="mt-1 block text-xs text-white/60">已学习 {formatLessonTime(lesson.reportedSeconds)} / {formatLessonTime(lesson.totalSeconds)}</span>
          </div>
          <div className="h-2 w-[min(460px,70vw)] overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-white" style={{ width: getLessonProgressWidth(lesson) }} />
          </div>
        </div>
      </div>
    );
  }

  if (lesson.key === "audio") {
    return (
      <div className="bg-[linear-gradient(135deg,#0f766e,#1d4ed8)] p-5 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-2xl">♪</span>
          <div className="min-w-0 flex-1">
            <Tag tone="cyan">{lesson.label}</Tag>
            <strong className="mt-3 block truncate text-xl">{lesson.title}</strong>
            <span className="mt-1 block text-sm text-white/70">{classCourse.title} · {lesson.duration}</span>
            <span className="mt-1 block text-xs text-white/60">已学习 {formatLessonTime(lesson.reportedSeconds)} / {formatLessonTime(lesson.totalSeconds)}</span>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full rounded-full bg-white" style={{ width: getLessonProgressWidth(lesson) }} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button tone="secondary">播放</Button>
            <Button tone="secondary">倍速</Button>
          </div>
        </div>
      </div>
    );
  }

  if (lesson.key === "pdf") {
    return (
      <div className="bg-slate-100 p-6">
        <article className="mx-auto min-h-[640px] w-full max-w-3xl rounded-ui border border-line bg-white p-8 leading-8 shadow-sm">
          <Meta><Tag>{lesson.label}</Tag><Tag tone="green">{getLessonProgressLabel(lesson)}</Tag></Meta>
          <h2 className="mb-4 mt-5 text-xl">函数基础讲义</h2>
          <p>一、函数是描述两个变量之间对应关系的重要工具。每一个自变量取值，都对应唯一的函数值。</p>
          <p>二、复习时重点关注定义域、值域、解析式、图像表示和实际应用题中的变量关系。</p>
          <p>三、常见题型包括求函数值、判断函数关系、识别图像变化趋势和结合实际情境建立函数模型。</p>
          <p>四、阅读讲义后，建议回到课时练习或试卷练习中完成同类型题目巩固。</p>
        </article>
      </div>
    );
  }

  if (lesson.key === "ppt") {
    return (
      <div className="grid min-h-[460px] place-items-center bg-slate-900 p-6 text-white">
        <section className="aspect-video w-full max-w-3xl rounded-ui bg-white p-8 text-slate-900">
          <Meta><Tag>{lesson.label}</Tag><Tag tone="green">{getLessonProgressLabel(lesson)}</Tag></Meta>
          <h2 className="mt-5 text-2xl">函数图像与性质</h2>
          <ul className="mt-6 grid gap-3 leading-7">
            <li>观察图像与坐标轴的交点。</li>
            <li>结合斜率判断函数增减性。</li>
            <li>用关键点快速排除错误选项。</li>
          </ul>
        </section>
      </div>
    );
  }

  return (
    <article className="min-h-[620px] bg-white p-8 leading-8 text-slate-700">
      <Meta><Tag>{lesson.label}</Tag><Tag tone="green">{getLessonProgressLabel(lesson)}</Tag></Meta>
      <h2 className="mb-4 mt-5 text-2xl text-ink">函数知识点图文讲解</h2>
      <p>函数的核心是“对应关系”。判断一个关系是不是函数，先看每一个输入值是否只能得到一个输出值。</p>
      <p>常见表示方法包括解析式、表格和图像。考试中通常会把这三种表示互相转换，要求学生识别变量关系。</p>
      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-ui border border-line bg-slate-50 p-4">
          <strong>定义域</strong>
          <p className="mb-0 mt-2">使函数表达式有意义的所有自变量取值组成定义域。</p>
        </div>
        <div className="rounded-ui border border-line bg-slate-50 p-4">
          <strong>值域</strong>
          <p className="mb-0 mt-2">函数所有可能输出值组成值域，常结合图像或解析式判断。</p>
        </div>
      </section>
      <div className="mt-5 rounded-ui border border-line bg-slate-50 p-4">
        <strong>例题提示：</strong>
        <p className="mb-0 mt-2">若 f(x)=2x+1，求 f(3)，只需要把 x=3 代入解析式即可。</p>
      </div>
    </article>
  );
}

function getLessonProgressWidth(lesson) {
  return `${getLessonProgressPercent(lesson)}%`;
}

function getLessonProgressPercent(lesson) {
  if (!isMediaLesson(lesson)) return 100;
  if (!lesson.totalSeconds) return 0;
  return Math.min(100, Math.round((Math.min(lesson.reportedSeconds || 0, lesson.totalSeconds) / lesson.totalSeconds) * 100));
}

function getLessonProgressLabel(lesson) {
  if (!isMediaLesson(lesson)) return "已完成";
  return `${getLessonProgressPercent(lesson)}%`;
}

function getLessonStatus(lesson) {
  if (!isMediaLesson(lesson)) return "已完成";
  return (lesson.reportedSeconds || 0) >= lesson.totalSeconds ? "已完成" : "进行中";
}

function isMediaLesson(lesson) {
  return lesson.key === "micro" || lesson.key === "mooc" || lesson.key === "audio";
}

function formatLessonTime(seconds = 0) {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${minute}:${String(second).padStart(2, "0")}`;
}

export function CourseMaterialPage() {
  const material = courseMaterials[0];

  return (
    <>
      <PageHeader
        title="课件预览"
        desc="在线查看课程中的 PDF、PPT 和图片课件。"
        action={<Button href="#/course-study" tone="secondary">返回课程详情</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[560px]">
            <Meta><Tag>{material.type}</Tag><Tag>{material.size}</Tag><Tag tone="blue">{classCourse.title}</Tag></Meta>
          <h2 className="mb-4 mt-5 text-xl">{material.title}</h2>
          <div className="grid min-h-[380px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-center text-muted">
            <div>
              <strong className="block text-lg text-slate-700">{material.title}</strong>
              <span className="mt-2 block">课件内容加载完成后可在线翻页查看</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="m-0 text-lg">同课资料</h3>
          <div className="mt-4 grid gap-3">
            {courseMaterials.map((item) => (
              <a className="rounded-ui border border-line p-3 text-slate-700 hover:bg-slate-50" href="#/course-material" key={item.title}>
                <strong className="block">{item.title}</strong>
                <span className="mt-1 block text-xs text-muted">{item.type} · {item.size}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function AskTeacherCard({ course, lesson, compact = false, className = "" }) {
  return (
    <Card className={className}>
      <h3 className="m-0 text-lg">发起提问</h3>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm">
          关联课程
          <input className="min-h-10 rounded-ui border border-line bg-slate-50 px-3 text-slate-700" readOnly value={course} />
        </label>
        <label className="grid gap-2 text-sm">
          关联课时
          {lesson === "可选择具体课时" ? (
            <select className="min-h-10 rounded-ui border border-line px-3">
              {courseCatalog.flatMap((chapter) => chapter.lessons).filter((item) => item.type !== "练习").map((item) => (
                <option key={item.title}>{item.title}</option>
              ))}
            </select>
          ) : (
            <input className="min-h-10 rounded-ui border border-line bg-slate-50 px-3 text-slate-700" readOnly value={lesson} />
          )}
        </label>
        <label className="grid gap-2 text-sm">
          问题内容
          <textarea className={`${compact ? "min-h-24" : "min-h-28"} rounded-ui border border-line p-3`} placeholder="请描述你遇到的问题" />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button>提交问题</Button>
        </div>
      </div>
    </Card>
  );
}

export function QAPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const currentRecords = paginateRows(qaRecords, page, pageSize);

  return (
    <LearningSectionShell active="qa" title="我的答疑" desc="查看已提交的问题和老师回复。">
      <div>
        <DataTable
          columns={["提问课程", "提问时间", "最近回复", "回复状态", "操作"]}
          gridTemplateColumns="minmax(220px,1.5fr) 170px 170px 90px 110px"
          rows={currentRecords}
          renderRow={(item) => (
            <>
              <div>
                <strong>{item.course}</strong>
                {item.lesson ? <p className="mb-0 mt-1 text-xs text-muted">{item.lesson}</p> : null}
              </div>
              <span>{item.createdAt}</span>
              <span>{item.updatedAt}</span>
              <Tag tone={hasQaReply(item) ? "green" : "gray"}>{hasQaReply(item) ? "已回复" : "待回复"}</Tag>
              <Button href={`#/qa-detail?id=${item.id}`} tone="ghost">查看记录</Button>
            </>
          )}
        />
        <Pagination
          label="答疑"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20]}
          total={qaRecords.length}
        />
      </div>
    </LearningSectionShell>
  );
}

export function QADetailPage() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const item = qaRecords.find((record) => record.id === params.get("id")) || qaRecords[0];
  const messages = getQaMessages(item);

  return (
    <>
      <PageHeader
        title="答疑记录"
        action={<Button href="#/qa" tone="secondary">返回我的答疑</Button>}
      />
      <div className="grid gap-5">
        <Card>
          <Meta className="mt-0"><Tag tone={item.statusTone}>{item.status}</Tag><Tag>{item.course}</Tag>{item.lesson ? <Tag>{item.lesson}</Tag> : null}</Meta>
          <div className="mt-6 grid gap-4">
            {messages.map((message) => (
              <div className={`rounded-ui border p-4 ${message.tone === "blue" ? "border-blue-100 bg-blue-50" : message.tone === "amber" ? "border-amber-100 bg-amber-50" : "border-line bg-slate-50"}`} key={`${message.time}-${message.sender}`}>
                <Meta>
                  <Tag tone={message.tone}>{message.sender}</Tag>
                  <span className="text-sm text-muted">{message.time}</span>
                </Meta>
                <p className="mb-0 mt-3 leading-7 text-slate-700">{message.info}</p>
              </div>
            ))}
          </div>
          <label className="mt-6 grid gap-2">
            回复 / 追问
            <textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="继续补充答疑信息" />
          </label>
          <Meta><Button>继续追问</Button></Meta>
        </Card>
      </div>
    </>
  );
}

export function WrongBookPage() {
  const subjectOptions = ["全部", "语文", "数学", "英语", classes[0].category];
  const typeOptions = ["全部", ...Array.from(new Set(wrongQuestions.map((item) => item.questionType)))];
  const [subject, setSubject] = useState("全部");
  const [questionType, setQuestionType] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [analysisItem, setAnalysisItem] = useState(null);
  const [practiceItem, setPracticeItem] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const wrongRows = wrongQuestions.map((item, index) => ({ ...item, id: `wrong-${index + 1}` }));
  const filteredRows = wrongRows
    .filter((item) => !removedIds.includes(item.id))
    .filter((item) => subject === "全部" || item.subject === subject)
    .filter((item) => questionType === "全部" || item.questionType === questionType)
    .filter((item) => !keyword || item.point.includes(keyword) || item.title.includes(keyword) || item.course.includes(keyword) || item.questionStem.includes(keyword));
  const currentRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  function toggleSelected(id) {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  function removeWrongQuestion(id) {
    setRemovedIds((ids) => [...new Set([...ids, id])]);
    setSelectedIds((ids) => ids.filter((item) => item !== id));
  }

  function removeSelected() {
    setRemovedIds((ids) => [...new Set([...ids, ...selectedIds])]);
    setSelectedIds([]);
  }

  function resetFilters(next) {
    setPage(1);
    next();
  }

  function openPractice(item) {
    setPracticeItem(item);
    setPracticeAnswer("");
  }

  return (
    <ExamSectionShell active="wrong" title="错题本" desc="按科目、题型和关键词筛选错题，进入针对性练习。">
      <Card className="mb-5">
        <div className="grid gap-4">
          <FilterButtonGroup label="科目" labelClassName="w-12" options={subjectOptions} value={subject} onChange={(value) => resetFilters(() => setSubject(value))} />
          <FilterButtonGroup label="题型" labelClassName="w-12" options={typeOptions} value={questionType} onChange={(value) => resetFilters(() => setQuestionType(value))} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm">
            题干 / 课程 / 知识点
            <input className="min-h-10 rounded-ui border border-line px-3" placeholder="输入题干、课程或知识点关键词" value={keyword} onChange={(event) => resetFilters(() => setKeyword(event.target.value))} />
          </label>
          <Button tone="secondary" onClick={removeSelected}>批量移除</Button>
        </div>
      </Card>
      {currentRows.length ? (
        <>
          <DataTable
            columns={["", "题目预览", "题目类型", "课程 / 知识点", "错题次数", "上次练习", "操作"]}
            gridTemplateColumns="40px minmax(260px,1.7fr) 100px minmax(160px,1fr) 90px 120px minmax(220px,1fr)"
            rows={currentRows}
            renderRow={(item) => (
              <>
                <input checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} type="checkbox" />
                <div>
                  <strong>{getQuestionPreview(item.questionStem)}</strong>
                </div>
                <Tag tone="blue">{item.questionType}</Tag>
                <span>{item.course} / {item.point}</span>
                <span>{item.wrongCount} 次</span>
                <span>{item.lastPractice}</span>
                <div className="flex flex-wrap gap-2">
                  <Button tone="ghost" onClick={() => setAnalysisItem(item)}>解析</Button>
                  <Button tone="secondary" onClick={() => openPractice(item)}>练习</Button>
                  <Button tone="secondary" onClick={() => removeWrongQuestion(item.id)}>移除</Button>
                </div>
              </>
            )}
          />
          <Pagination
            label="错题"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[5, 10, 20]}
            total={filteredRows.length}
          />
        </>
      ) : (
        <Card>
          <h3 className="m-0">暂无符合条件的错题</h3>
          <p className="mb-0 mt-3 text-muted">可以调整筛选条件，或查看其他来源的错题。</p>
        </Card>
      )}
      <Modal open={Boolean(analysisItem)} title="错题解析" onClose={() => setAnalysisItem(null)}>
        {analysisItem ? (
          <div className="grid gap-4">
            <Meta><Tag>{analysisItem.questionType}</Tag><Tag>{analysisItem.source}</Tag><Tag tone="amber">{analysisItem.course} / {analysisItem.point}</Tag></Meta>
            <h3 className="m-0 text-lg">{analysisItem.title}</h3>
            <p className="m-0 leading-7 text-slate-700">{analysisItem.questionStem}</p>
            <p className="m-0 text-sm text-muted">{analysisItem.detail}</p>
            <section className="rounded-ui border border-line bg-slate-50 p-4 leading-7">
              <div><strong>参考答案：</strong>{analysisItem.answer}</div>
              <div className="mt-2"><strong>题目解析：</strong>{analysisItem.analysis}</div>
            </section>
            <Meta><Button onClick={() => setAnalysisItem(null)}>关闭</Button></Meta>
          </div>
        ) : null}
      </Modal>
      <Modal open={Boolean(practiceItem)} title="错题练习" onClose={() => setPracticeItem(null)}>
        {practiceItem ? (
          <div className="grid gap-4">
            <Meta><Tag>{practiceItem.questionType}</Tag><Tag>{practiceItem.course}</Tag><Tag>{practiceItem.point}</Tag></Meta>
            <h3 className="m-0 text-lg">{practiceItem.title}</h3>
            <p className="m-0 leading-7 text-slate-700">{practiceItem.questionStem}</p>
            <div className="grid gap-3">
              {["A. 5", "B. 6", practiceItem.answer, "D. 8"].map((option) => (
                <label className={`flex gap-3 rounded-ui border p-4 ${practiceAnswer === option ? "border-blue-300 bg-blue-50" : "border-line"}`} key={option}>
                  <input checked={practiceAnswer === option} name="wrong-single-practice" onChange={() => setPracticeAnswer(option)} type="radio" />
                  {option}
                </label>
              ))}
            </div>
            {practiceAnswer ? (
              <section className="rounded-ui border border-line bg-slate-50 p-4 leading-7">
                <div><strong>参考答案：</strong>{practiceItem.answer}</div>
                <div className="mt-2"><strong>题目解析：</strong>{practiceItem.analysis}</div>
              </section>
            ) : null}
            <Meta><Button tone="secondary" onClick={() => setPracticeItem(null)}>关闭</Button><Button onClick={() => setPracticeItem(null)}>完成本题</Button></Meta>
          </div>
        ) : null}
      </Modal>
    </ExamSectionShell>
  );
}

export function WrongQuestionPage() {
  const item = wrongQuestions[0];

  return (
    <>
      <PageHeader
        title="错题解析"
        desc="查看原题、我的答案、参考答案和题目解析。"
        action={<Button href="#/wrong-book" tone="secondary">返回错题本</Button>}
      />
      <Card>
        <Meta><Tag tone="amber">{item.status}</Tag><Tag>{item.source}</Tag><Tag>{item.point}</Tag></Meta>
        <h2 className="mt-5 text-xl">{item.title}</h2>
        <p className="leading-8 text-slate-700">已知函数 f(x)=2x+1，求 f(3) 的值。</p>
        <section className="mt-6 rounded-ui border border-line bg-slate-50 p-5">
          <div><strong>参考答案：</strong>{item.answer}</div>
          <p className="mb-0 mt-4 leading-8 text-slate-700">{item.analysis}</p>
        </section>
      </Card>
    </>
  );
}

export function WrongPracticePage() {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const item = wrongQuestions[0];

  return (
    <>
      <PageHeader
        title="错题练习"
        desc="重新作答这道错题，提交后立即查看答案和解析。"
        action={<Button href="#/wrong-book" tone="secondary">返回错题本</Button>}
      />
      <Card>
        <Meta><Tag>{item.subject}</Tag><Tag tone="amber">{item.point}</Tag></Meta>
        <h2 className="mt-5 text-xl">{item.title}</h2>
        <p className="leading-8 text-slate-700">若 f(x)=2x+1，则 f(3)=？</p>
        <div className="mt-5 grid gap-3">
          {["A. 5", "B. 6", item.answer, "D. 8"].map((option) => (
            <label className="flex gap-3 rounded-ui border border-line p-4" key={option}>
              <input checked={selectedAnswer === option} name="wrong-practice" onChange={() => setSelectedAnswer(option)} type="radio" />
              {option}
            </label>
          ))}
        </div>
        {selectedAnswer ? (
          <section className="mt-5 rounded-ui border border-line bg-slate-50 p-4 leading-7">
            <div><strong>参考答案：</strong>{item.answer}</div>
            <div className="mt-2"><strong>题目解析：</strong>{item.analysis}</div>
          </section>
        ) : null}
      </Card>
    </>
  );
}

export function LearningRecordPage() {
  return (
    <LearningSectionShell active="records" title="学习记录" desc="记录视频和音频课时的最近学习时间与完成进度。">
      <div className="grid gap-3">
        {learningRecords.map((item) => (
          <Card key={`${item.title}-${item.time}`} className="grid gap-4 md:grid-cols-[150px_120px_1fr] md:items-center">
            <div
              className="grid min-h-[84px] place-items-center rounded-ui p-3 text-center text-sm font-semibold text-white"
              style={{ background: item.coverTone }}
            >
              <span>{item.title}</span>
            </div>
            <time className="text-sm text-muted">{item.time}</time>
            <div><strong>{item.title}</strong><p className="mt-2 leading-7 text-muted">{item.detail}</p><Meta><Tag tone={item.status === "已完成" ? "green" : "amber"}>{item.status}</Tag><Button href="#/course-lesson" tone="ghost">继续学习</Button></Meta></div>
          </Card>
        ))}
      </div>
    </LearningSectionShell>
  );
}

function paginateRows(rows, page, pageSize) {
  return rows.slice((page - 1) * pageSize, page * pageSize);
}

function getQuestionPreview(stem) {
  if (!stem) return "";
  return stem.length > 34 ? `${stem.slice(0, 34)}...` : stem;
}

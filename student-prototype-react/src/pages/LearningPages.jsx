import { useState } from "react";
import { categories, classCourse, classCourses, classExams, classes, courseCatalog, courseMaterials, cultureSubjects, exams, learningRecords, paperPracticeRecords, qaRecords, wrongQuestions } from "../data/mockData";
import { ExamAnswerInput, ExamQuestionNavigator, ExamQuestionStatusLegend, getAllExamQuestions, getExamQuestionType, normalizeQuestionGroups } from "../components/examWorkflows";
import { Button, Card, DataTable, Meta, Modal, PageHeader, Pagination, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

export function LearningCenterPage() {
  const { role, roleKey } = usePrototypeRole();
  const currentIdentity = classes[0];
  const courseTasks = classCourses.slice(0, 2).map((course) => {
    const status = normalizeLearningStatus(course.status);
    return {
      tone: getLearningStatusTone(status),
      title: course.title,
      detail: status === "未开始" ? "" : `课程进度 ${course.progress} · ${course.learnedCount}/${course.lessonCount} 课时`,
      meta: status,
      action: status === "已完成" ? "复习课程" : status === "进行中" ? "继续学习" : "开始学习",
      href: "#/course-lesson",
    };
  });
  const paperPracticeTasks = paperPracticeRecords
    .filter((paper) => paper.source === "试卷中心")
    .slice(0, 4)
    .map((paper) => ({
      tone: getLearningStatusTone(paper.status),
      title: paper.title,
      detail: `题目数量：${paper.questionCount} 题 · 用时：${paper.duration}`,
      meta: paper.status,
      tags: [paper.category],
      action: paper.status === "已完成" ? "查看解析" : paper.status === "进行中" ? "继续刷题" : "开始练习",
      href: paper.status === "已完成" ? "#/paper-analysis" : "#/paper-answer",
    }));
  const classTestTasks = classExams.slice(0, 3).map((exam) => ({
    tone: exam.statusTone,
    title: exam.title,
    detail: `时长 ${exam.duration} · 总题数 ${exam.questionCount} 道 · 试卷总分 ${exam.totalScore} 分`,
    meta: exam.studentStatus !== "未开始" ? exam.studentStatus : exam.status,
    action: getClassExamActionConfig(exam).label,
    href: getClassExamActionConfig(exam).href,
  }));
  const examScheduleTasks = exams
    .filter((exam) => hasFormalExamPermission(exam, roleKey))
    .filter((exam) => ["未开始", "进行中", "评审中"].includes(exam.status))
    .slice(0, 3)
    .map((exam) => ({
      tone: exam.statusTone === "gray" ? "blue" : exam.statusTone,
      title: exam.title,
      detail: `${exam.startAt || exam.time} 至 ${exam.endAt || exam.time}`,
      meta: exam.status,
      tags: [exam.type],
      action: exam.status === "进行中" && !exam.submitted ? "开始考试" : "查看详情",
      href: exam.status === "进行中" && !exam.submitted ? "#/exam-answer" : `#/exam-detail?id=${exam.id}`,
    }));
  const registeredPaperPracticeTasks = paperPracticeRecords
    .filter((paper) => paper.source === "试卷中心" && !paper.relation.includes("电子与信息类"))
    .slice(0, 3)
    .map((paper) => ({
      tone: getLearningStatusTone(paper.status),
      title: paper.title,
      detail: `题目数量：${paper.questionCount} 题 · 用时：${paper.duration}`,
      meta: paper.status,
      tags: [paper.category],
      action: paper.status === "已完成" ? "查看解析" : paper.status === "进行中" ? "继续刷题" : "开始练习",
      href: paper.status === "已完成" ? "#/paper-analysis" : "#/paper-answer",
    }));
  const registeredPendingCount = registeredPaperPracticeTasks.length + examScheduleTasks.length + 2;
  const qaTasks = qaRecords.slice(0, 2).map((item) => ({
    tone: hasQaReply(item) ? "green" : "gray",
    title: getQaRelation(item),
    detail: `发起时间：${item.createdAt} · 更新时间：${item.updatedAt}`,
    meta: hasQaReply(item) ? "已回复" : "未回复",
    action: "查看记录",
    href: `#/qa-detail?id=${item.id}`,
  }));
  const pendingTaskCount = courseTasks.length + paperPracticeTasks.length + classTestTasks.length + examScheduleTasks.length + qaTasks.length + 2;

  if (roleKey === "visitor") {
    return (
      <>
        <PageHeader title="学习中心" desc="学习中心是登录后的学生工作台，未登录或未加入学校班级时不展示学习数据。" />
        <Card className="grid gap-5 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <h2 className="mb-3 text-xl">登录后查看学习中心</h2>
            <p className="leading-8 text-muted">
              登录或注册后，学生可以查看公开考试、试卷练习、错题巩固；加入学校班级后继续解锁班级课程、班级测试和班级答疑。
            </p>
            <PrototypeNote className="mt-3">
              未登录时不展示学习工作台数据，避免把学习中心做成公开内容页。
            </PrototypeNote>
            <Meta>
              <Button href={role.href}>{role.cta}</Button>
              <Button href="#/papers" tone="secondary">先浏览试卷</Button>
            </Meta>
          </div>
          <div className="rounded-ui border border-line bg-slate-50 p-5">
            <strong className="block">开通后可查看</strong>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <span>当前学校班级</span>
              <span>学习任务摘要</span>
              <span>班级课程 / 班级测试 / 班级答疑</span>
              <span>我的考试 / 错题巩固 / 学习记录</span>
            </div>
          </div>
        </Card>
      </>
    );
  }

  if (roleKey === "registered") {
    return (
      <>
        <PageHeader title="学习中心" desc="注册用户没有班级学习内容，但可以查看公开考试、试卷练习、错题巩固，并继续提交入校申请。" />
        <Card className="mb-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-sm text-muted">当前身份</span>
              <h2 className="mb-2 mt-2 text-xl">注册用户</h2>
              <p className="m-0 text-muted">暂未加入学校班级，可参加公开考试并提交入校申请。</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button href="#/school-apply">申请加入学校</Button>
              <Button href="#/my-exams" tone="secondary">我的考试</Button>
              <Tag tone="amber">未加入班级</Tag>
            </div>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="待处理事项" value={registeredPendingCount} />
          <Stat label="公开考试" value={examScheduleTasks.length} />
          <Stat label="试卷练习" value={registeredPaperPracticeTasks.length} />
          <Stat label="入校状态" value="待申请" />
        </div>

        <section className="mt-8">
          <PageHeader title="学习任务摘要" desc="注册用户的学习中心只展示个人可用内容；班级课程、班级测试和班级答疑在加入班级后展示。" />
          <div className="grid gap-4">
            <TaskGroup
              title="考试安排"
              desc="展示注册用户可参加或需要关注的公开考试。"
              tasks={examScheduleTasks}
              footer={<Button href="#/my-exams" tone="secondary">查看我的考试</Button>}
            />
            <TaskGroup
              title="试卷练习"
              desc="展示试卷中心里已经开始但尚未完成的试卷。"
              tasks={registeredPaperPracticeTasks}
              footer={<Button href="#/paper-practice" tone="secondary">查看试卷练习</Button>}
            />
          </div>
          <PrototypeNote className="mt-4">
            注册用户可以参加公开考试，因此学习中心保留个人考试、试卷练习和学习记录；班级课程、班级测试、班级答疑需要加入学校班级后才展示。
          </PrototypeNote>
        </section>

        <LearningRecordSummary />
      </>
    );
  }

  return (
    <>
      <PageHeader title="学习中心" desc="学生只能加入一个学校；在该学校下只能加入一个班级。学习中心直接展示当前学校班级，不再提供多班级切换。" />
      <Card className="mb-4">
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr_1fr] md:items-center">
          <div>
            <span className="text-sm text-muted">当前班级</span>
            <div className="mb-2 mt-2 flex flex-wrap items-center gap-2">
              <h2 className="m-0 text-xl">{currentIdentity.name}</h2>
              <Tag tone="blue">{currentIdentity.category}</Tag>
            </div>
            <p className="m-0 text-muted">{currentIdentity.school}</p>
          </div>
          <div className="rounded-ui bg-slate-50 p-4">
            <span className="text-sm text-muted">待处理事项</span>
            <b className="mt-2 block text-2xl">{pendingTaskCount}</b>
          </div>
          <div className="rounded-ui bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-sm text-muted">累计错题</span>
                <b className="mt-2 block text-2xl">38</b>
              </div>
              <Button href="#/wrong-book" tone="ghost">进入错题本</Button>
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <PageHeader title="学习任务摘要" desc="首页只展示各类学习资源的摘要，不承接完整列表。课程学习来自班级课程，试卷练习来自试卷中心，班级测试来自当前班级布置，考试安排只做正式考试提醒。" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TaskSummaryCard
            title="课程学习"
            desc="只展示最近学习或新分配的班级课程，不混入课堂练习。"
            tasks={courseTasks}
            href="#/class-courses"
            listAction="进入课程"
          />
          <TaskSummaryCard
            title="试卷练习"
            desc="展示试卷中心里已经开始或已经完成的试卷。"
            tasks={paperPracticeTasks}
            href="#/paper-practice"
            listAction="进入练习"
          />
          <TaskSummaryCard
            title="班级测试"
            desc="展示当前班级布置的随堂测试、阶段测试和结业测试。"
            tasks={classTestTasks}
            href="#/class-exam"
            listAction="进入测试"
          />
          <TaskSummaryCard
            title="考试安排"
            desc="只提醒当前学生近期需要关注的正式考试，完整筛选和历史记录仍进入考试中心。"
            tasks={examScheduleTasks}
            href="#/my-exams"
            listAction="查看安排"
          />
          <TaskSummaryCard
            title="班级答疑"
            desc="展示老师已回复、要求补充或需要学生继续处理的问题。"
            tasks={qaTasks}
            href="#/qa"
            listAction="进入答疑"
          />
        </div>
        <PrototypeNote className="mt-4">
          学习任务摘要按资源来源拆分，但首页只展示摘要卡片和最近一条，完整列表进入对应二级页面。
        </PrototypeNote>
      </section>

      <LearningRecordSummary note="学习中心现在以“当前学校班级 + 学习任务摘要 + 学习记录”组织页面。学生只能加入一个学校，并在该学校下加入一个班级；班级课程、班级测试和班级答疑入口合并到当前学校班级与学习任务摘要中。" />
    </>
  );
}

function LearningRecordSummary({ note }) {
  return (
    <section className="mt-8">
      <PageHeader title="学习记录" desc="当前阶段只记录视频和音频课时学习。" action={<Button href="#/learning-record" tone="secondary">查看全部记录</Button>} />
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
          <p className="mb-0 mt-4 text-sm text-muted">暂无待处理内容</p>
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
  if (status === "学习中") return "进行中";
  if (status === "待完成") return "未开始";
  if (status === "已学完" || status === "已结束") return "已完成";
  return status;
}

function getLearningStatusTone(status) {
  const normalizedStatus = normalizeLearningStatus(status);
  if (normalizedStatus === "已完成") return "green";
  if (normalizedStatus === "进行中") return "cyan";
  return "gray";
}

function getQaRelation(item) {
  return item.lesson ? `${item.course} / ${item.lesson}` : item.course;
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

export function MyExamsPage() {
  const { roleKey } = usePrototypeRole();
  const myExams = exams.filter((exam) => hasFormalExamPermission(exam, roleKey));
  const upcomingCount = myExams.filter((exam) => exam.status === "未开始" || exam.status === "进行中").length;
  const submittedCount = myExams.filter((exam) => exam.submitted).length;
  const publishedCount = myExams.filter((exam) => exam.status === "已公示" && exam.submitted).length;

  if (roleKey === "visitor") {
    return (
      <>
        <PageHeader title="我的考试" desc="登录后查看当前账号可参加、已交卷、已出分或未参加的正式考试。" />
        <Card>
          <h2 className="m-0 text-xl">登录后查看我的考试</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">游客可以浏览考试中心，但需要登录或注册后查看自己的公开考试和考试记录。</p>
          <Meta><Button href="#/login">登录/注册</Button><Button href="#/exams" tone="secondary">浏览考试中心</Button></Meta>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="我的考试"
        desc="展示当前身份相关的正式考试：可参加、待开始、已交卷、已出分和未参加记录。班级测试仍留在学习中心的班级测试页面。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="相关考试" value={myExams.length} />
        <Stat label="待关注" value={upcomingCount} />
        <Stat label="已交卷" value={submittedCount} />
        <Stat label="已出分" value={publishedCount} />
      </div>
      <div className="mt-6">
        {myExams.length ? (
          <DataTable
            columns={["考试", "考试类型", "科目/大类", "考试时间", "参加状态", "我的得分", "操作"]}
            gridTemplateColumns="minmax(220px,1.6fr) 100px 120px 170px 100px 90px minmax(150px,1fr)"
            rows={myExams}
            renderRow={(exam) => {
              const participation = getFormalExamParticipation(exam, roleKey);
              const canSeeScore = exam.status === "已公示" && exam.submitted;

              return (
                <>
                  <div>
                    <strong>{exam.title}</strong>
                    <p className="mb-0 mt-1 text-xs leading-5 text-muted">{exam.paperTitle}</p>
                  </div>
                  <Tag tone={exam.type === "学校联考" ? "blue" : "cyan"}>{exam.type}</Tag>
                  <span>{exam.subject === "专业课" ? exam.category : exam.subject}</span>
                  <span>
                    <strong className="block text-sm">{exam.startAt || exam.time}</strong>
                    <span className="mt-1 block text-xs text-muted">至 {exam.endAt || exam.time}</span>
                  </span>
                  <Tag tone={participation.tone}>{participation.label}</Tag>
                  <span>{canSeeScore ? exam.score : "-"}</span>
                  <MyExamAction exam={exam} />
                </>
              );
            }}
          />
        ) : (
          <Card>
            <h3 className="m-0">暂无我的考试</h3>
            <p className="mb-0 mt-3 leading-7 text-muted">
              当前身份暂无可参加或已参加的正式考试。注册用户可参加公开考试；班级学生可参加公开考试和当前班级授权的学校联考。
            </p>
            <Meta><Button href="#/exams" tone="secondary">浏览考试中心</Button></Meta>
          </Card>
        )}
      </div>
      <PrototypeNote className="mt-5">
        “我的考试”是学习中心下的个人考试列表；考试中心用于浏览全部公开考试和学校联考，班级测试不进入本页。
      </PrototypeNote>
    </>
  );
}

function hasFormalExamPermission(exam, roleKey) {
  if (exam.permission === "registered") return roleKey !== "visitor";
  if (exam.permission === "student") return roleKey === "student";
  return false;
}

function getFormalExamParticipation(exam, roleKey) {
  if (!hasFormalExamPermission(exam, roleKey)) return { label: "无权限", tone: "gray" };
  if (exam.status === "未开始") return { label: "待开始", tone: "amber" };
  if (exam.status === "进行中") return { label: exam.submitted ? "已交卷" : "可参加", tone: "green" };
  if (exam.status === "评审中") return { label: exam.submitted ? "已交卷" : "未参加", tone: exam.submitted ? "green" : "gray" };
  if (exam.status === "已公示") return { label: exam.submitted ? "已出分" : "未参加", tone: exam.submitted ? "green" : "gray" };
  return { label: exam.submitted ? "已交卷" : "未参加", tone: exam.submitted ? "green" : "gray" };
}

function MyExamAction({ exam }) {
  const detailHref = `#/exam-detail?id=${exam.id}`;
  const actionClassName = "grid min-w-[120px] gap-2 [&>a]:w-full";

  if (exam.status === "进行中" && !exam.submitted) {
    return (
      <div className={actionClassName}>
        <Button href={detailHref} tone="secondary">查看详情</Button>
        <Button href="#/exam-answer">开始考试</Button>
      </div>
    );
  }

  if (exam.status === "已公示" && exam.submitted) {
    return (
      <div className={actionClassName}>
        <Button href={`#/exam-analysis?id=${exam.id}`}>查看解析</Button>
        {exam.rankEnabled ? <Button href={`#/exam-rank?id=${exam.id}`} tone="secondary">查看排行</Button> : null}
      </div>
    );
  }

  return <div className={actionClassName}><Button href={detailHref} tone="secondary">查看详情</Button></div>;
}

export function ClassDetailPage() {
  return (
    <>
      <PageHeader title="班级档案" desc="班级详情弱化为档案页，主要学习内容已经前置到学习中心。" action={<Button href="#/learning" tone="secondary">返回学习中心</Button>} />
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
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="班级课程" value="4" /><Stat label="班级测试" value="3" /><Stat label="答疑待回复" value="1" /><Stat label="学习进度" value="62%" />
      </div>
    </>
  );
}

export function ClassCoursesPage() {
  const inProgressCount = classCourses.filter((course) => normalizeLearningStatus(course.status) === "进行中").length;
  const finishedCount = classCourses.filter((course) => normalizeLearningStatus(course.status) === "已完成").length;
  const waitingCount = classCourses.filter((course) => course.status === "未开始").length;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const currentCourses = paginateRows(classCourses, page, pageSize);

  return (
    <>
      <PageHeader
        title="班级课程"
        desc="展示当前班级分配给学生的课程列表，课程由学校端或教师端配置；点击课程进入课程学习详情。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="进行中" value={inProgressCount} />
        <Stat label="未开始" value={waitingCount} />
        <Stat label="已完成" value={finishedCount} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {currentCourses.map((course) => {
          const actionText = course.progress === "0%" ? "开始学习" : course.progress === "100%" ? "复习课程" : "继续学习";
          const courseStatus = normalizeLearningStatus(course.status);

          return (
            <Card key={course.title}>
              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <div
                  className="grid min-h-[128px] place-items-center rounded-ui p-4 text-center text-white"
                  style={{ background: course.coverTone }}
                >
                  <strong className="text-lg">{course.title}</strong>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={getLearningStatusTone(courseStatus)}>{courseStatus}</Tag>
                    <Tag>{course.category}</Tag>
                  </div>
                  <h3 className="mb-2 mt-4 text-lg">{course.currentLesson}</h3>
                  <p className="m-0 leading-7 text-muted">
                    作者：{course.publisher} · {course.learnedCount}/{course.lessonCount} 课时
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-blue-600" style={{ width: course.progress }} />
                  </div>
                  <Meta>
                    <Tag tone="blue">进度 {course.progress}</Tag>
                    <Button href="#/course-study">{actionText}</Button>
                  </Meta>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
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
        班级课程只展示当前学校班级分配的课程，不展示学生在公开入口单独试看或购买的课程；课程详情仍复用当前的课程学习详情页。
      </PrototypeNote>
    </>
  );
}

export function ClassExamPage() {
  const activeCount = classExams.filter((exam) => exam.status === "进行中").length;
  const waitingCount = classExams.filter((exam) => exam.status === "未开始").length;
  const endedCount = classExams.filter((exam) => exam.status === "已结束").length;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const currentExams = paginateRows(classExams, page, pageSize);

  return (
    <>
      <PageHeader
        title="班级测试"
        desc="班级测试没有课程分类或大类分类，只按测试本身展示名称、时长、题量、总分、开始时间、剩余时间和状态。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="进行中" value={activeCount} />
        <Stat label="未开始" value={waitingCount} />
        <Stat label="已结束" value={endedCount} />
      </div>
      <div className="mt-6 grid gap-4">
        {currentExams.map((exam) => (
          <Card key={exam.title} className="grid gap-5 md:grid-cols-[1fr_260px] md:items-center">
            <div>
              <h2 className="m-0 text-xl">{exam.title}</h2>
              <div className="mt-5 grid gap-4 text-muted md:grid-cols-3">
                <span>时长：{exam.duration}</span>
                <span>总题数：{exam.questionCount}道</span>
                <span>试卷总分：{exam.totalScore}分</span>
              </div>
            </div>
            <div className="grid gap-3 md:justify-items-end">
              <ClassExamAction exam={exam} />
              <div className="grid gap-2 text-sm md:text-right">
                <span>开始时间：{exam.startAt}</span>
                {exam.remainingTime ? <span>剩余时间：{exam.remainingTime}</span> : null}
                <span className="flex flex-wrap gap-2 md:justify-end">
                  <Tag tone={exam.statusTone}>考试{exam.status}</Tag>
                  {exam.studentStatus !== "未开始" ? <Tag tone={exam.studentStatusTone}>学生{exam.studentStatus}</Tag> : null}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Pagination
        label="班级测试"
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
        班级测试采用考试型答题和解析界面，但列表不再按题型、课程或专业分类展示；它只呈现测试本身的关键字段。
      </PrototypeNote>
    </>
  );
}

function ClassExamAction({ exam }) {
  const action = getClassExamActionConfig(exam);
  const actionClassName = "grid min-w-[112px] gap-2 [&>a]:w-full";

  return <div className={actionClassName}><Button href={action.href} tone={action.tone}>{action.label}</Button></div>;
}

function getClassExamActionConfig(exam) {
  if (exam.status === "进行中" && exam.studentStatus !== "已交卷") {
    return { label: "开始考试", href: "#/class-exam-answer", tone: "primary" };
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
        title="班级测试安排"
        desc="展示单场班级测试的基础字段和参加入口，不展示分类筛选、课程归属或跨校排行。"
        action={<Button href="#/class-exam" tone="secondary">返回班级测试</Button>}
      />
      <Card>
        <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag tone={exam.statusTone}>考试{exam.status}</Tag>
              {exam.studentStatus !== "未开始" ? <Tag tone={exam.studentStatusTone}>学生{exam.studentStatus}</Tag> : null}
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
        这个页面用于承接“查看安排”，字段与班级测试列表保持一致：名称、时长、总题数、试卷总分、开始时间、剩余时间和状态。
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
const paperPracticeColumns = ["试卷名称", "所属专业", "题目数量", "客观题数量", "客观题正确率", "用时", "状态", "操作"];
const paperPracticeGridTemplate = "minmax(220px,1.6fr) minmax(120px,0.9fr) 90px 100px 120px 100px 90px 120px";

function PaperPracticeRow({ paper }) {
  const status = normalizePaperPracticeStatus(paper.status);
  const actionText = status === "已完成" ? "查看解析" : status === "进行中" ? "继续刷题" : "开始练习";
  const actionHref = status === "已完成" ? "#/paper-analysis" : "#/paper-answer";

  return (
    <>
      <div>
        <a className="font-semibold text-ink hover:text-blue-600" href={actionHref}>{paper.title}</a>
      </div>
      <span>{paper.category}</span>
      <span>{paper.questionCount}</span>
      <span>{paper.objectiveCount}</span>
      <span>{paper.objectiveAccuracy}</span>
      <span>{paper.duration}</span>
      <Tag tone={getLearningStatusTone(status)}>{status}</Tag>
      <Button href={actionHref} tone={status === "已完成" ? "ghost" : "secondary"}>{actionText}</Button>
    </>
  );
}

function normalizePaperPracticeStatus(status) {
  if (status === "待完成") return "未开始";
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
  const subjectTypes = ["文化课", "专业课"];
  const paperSources = ["全部", "官方", "本校"];
  const paperTypes = ["全部", "一轮复习", "二轮专题", "三轮冲刺", "模拟测试", "真题汇编"];
  const paperYears = ["全部年份", "2025", "2024", "2023"];
  const defaultCategory = categories.find((category) => category.unlocked)?.name || categories[0].name;
  const [selectedSubjectType, setSelectedSubjectType] = useState("专业课");
  const [selectedCultureSubject, setSelectedCultureSubject] = useState(cultureSubjects[0].name);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedSource, setSelectedSource] = useState("全部");
  const [selectedType, setSelectedType] = useState("全部");
  const [selectedYear, setSelectedYear] = useState("全部年份");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const visiblePaperPracticeRecords = paperPracticeRecords.filter((paper) => paper.source === "试卷中心" && (paper.status === "进行中" || paper.status === "已完成"));
  const filteredPapers = visiblePaperPracticeRecords.filter((paper) => {
    const subjectMatched = selectedSubjectType === "专业课"
      ? paper.subject === "专业课" && paper.category === selectedCategory
      : paper.subject === selectedCultureSubject;
    const sourceMatched = selectedSource === "全部" || paper.paperSource === selectedSource;
    const typeMatched = selectedType === "全部" || paper.type === selectedType;
    const yearMatched = selectedYear === "全部年份" || paper.year === selectedYear;
    return subjectMatched && sourceMatched && typeMatched && yearMatched;
  });
  const unfinishedCount = filteredPapers.filter((paper) => paper.status === "进行中").length;
  const finishedCount = filteredPapers.filter((paper) => paper.status === "已完成").length;
  const totalPracticeDuration = formatPracticeDuration(filteredPapers.reduce((sum, paper) => sum + parsePracticeDuration(paper.duration), 0));
  const currentPapers = paginateRows(filteredPapers, page, pageSize);
  const isProfessional = selectedSubjectType === "专业课";
  const categoryOptions = Array.from(new Set(visiblePaperPracticeRecords.filter((paper) => paper.subject === "专业课").map((paper) => paper.category)));
  const cultureSubjectOptions = Array.from(new Set(visiblePaperPracticeRecords.filter((paper) => paper.subject !== "专业课").map((paper) => paper.subject)));

  function resetPracticeFilters(next) {
    setPage(1);
    next();
  }

  return (
    <>
      <PageHeader
        title="试卷练习"
        desc="只展示学生在试卷中心开始过或已经完成的试卷；筛选维度与试卷中心保持一致。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <Card className="mb-5 p-4">
        <div className="grid gap-4">
          <LearningFilterButtons label="类型" options={subjectTypes} value={selectedSubjectType} onChange={(value) => resetPracticeFilters(() => setSelectedSubjectType(value))} />
          <LearningFilterButtons
            label={isProfessional ? "专业" : "科目"}
            options={isProfessional ? categoryOptions : cultureSubjectOptions}
            value={isProfessional ? selectedCategory : selectedCultureSubject}
            onChange={(value) => resetPracticeFilters(() => (isProfessional ? setSelectedCategory(value) : setSelectedCultureSubject(value)))}
          />
        </div>
      </Card>
      <div className="mb-5 grid gap-4 rounded-ui border border-line bg-white p-4">
        <LearningFilterButtons label="来源" options={paperSources} value={selectedSource} onChange={(value) => resetPracticeFilters(() => setSelectedSource(value))} />
        <LearningFilterButtons label="分类" options={paperTypes} value={selectedType} onChange={(value) => resetPracticeFilters(() => setSelectedType(value))} />
        <label className="flex flex-wrap items-center gap-3 text-sm">
          <span className="w-12 font-semibold">年份</span>
          <select className="min-h-10 rounded-ui border border-line px-3" value={selectedYear} onChange={(event) => resetPracticeFilters(() => setSelectedYear(event.target.value))}>
            {paperYears.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="进行中" value={unfinishedCount} />
        <Stat label="已完成" value={finishedCount} />
        <Stat label="累计用时" value={totalPracticeDuration} />
        <Stat label="筛选结果" value={filteredPapers.length} />
      </div>
      <div className="mt-6">
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
          pageSizeOptions={[5, 10, 20]}
          total={filteredPapers.length}
        />
      </div>
      <PrototypeNote className="mt-5">
        试卷练习列表只保留试卷中心中的个人练习记录；课程内练习不混入该列表。点击试卷名称进入继续练习或解析。
      </PrototypeNote>
    </>
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
        title="函数与数列阶段测试"
        desc="班级测试采用考试型答题界面，支持题号导航、标记和提交，但不展示跨校排行。"
        action={<Button tone="warning" onClick={() => setConfirmSubmit(true)}>提交测试</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[500px]">
          <Meta>
            <Tag>阶段测试</Tag>
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
            <Button tone="warning" onClick={() => setConfirmSubmit(true)}>提交测试</Button>
          </Meta>
        </Card>
        <Card>
          <h3>题号导航</h3>
          <p className="leading-7 text-muted">按大题分组展示题号，覆盖单选、多选、判断、填空、简答和综合题。</p>
          <ExamQuestionNavigator activeKey={activeKey} groups={answerGroups} onSelect={(question) => setActiveKey(question.key)} />
          <ExamQuestionStatusLegend mode="answer" />
          <PrototypeNote className="mt-4">班级测试答题页不强调正式考试氛围，不展示赛事型考试介绍、联考排行或跨校信息。</PrototypeNote>
        </Card>
      </div>
      <Modal open={confirmSubmit} title="确认提交测试" onClose={() => setConfirmSubmit(false)}>
        <p className="m-0 leading-7 text-muted">提交后会生成本次班级测试记录，已完成题目进入解析和错题沉淀。</p>
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
        title="班级测试解析"
        desc="展示班级测试成绩、作答结果和题目解析；不展示跨校排行。"
        action={<Button href="#/class-exam" tone="secondary">返回班级测试</Button>}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="得分/总分" value="86 / 100" />
        <Stat label="正确率" value="86%" />
        <Stat label="答题用时" value="24 分钟" />
        <Stat label="测试状态" value="已出分" />
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
                解析富文本图片 / 视频占位
              </div>
            </section>
            <Meta>
              <Button tone="secondary" onClick={() => setActiveKey(analysisQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
              <Button onClick={() => setActiveKey(analysisQuestions[Math.min(analysisQuestions.length - 1, activeIndex + 1)].key)}>下一题</Button>
              <Button href="#/wrong-book" tone="ghost">加入错题巩固</Button>
            </Meta>
          </Card>
          <Card>
            <h3>题号导航</h3>
            <p className="leading-7 text-muted">点击题号查看对应题目、答案与解析，颜色表示本题结果。</p>
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
    { key: "detail", label: "详情" },
    { key: "catalog", label: "目录" },
    { key: "papers", label: "试卷" },
    { key: "materials", label: "课件" },
    { key: "qa", label: "答疑" },
  ];

  return (
    <>
      <PageHeader title={classCourse.title} />
      <Card className="mb-5">
        <div className="grid gap-5 md:grid-cols-[260px_1fr_160px] md:items-center">
          <div className="grid min-h-[150px] place-items-center rounded-ui bg-[linear-gradient(135deg,#1d4ed8,#0f766e)] p-5 text-center text-white">
            <strong className="text-xl">{classCourse.title}</strong>
            <span className="mt-3 text-sm text-white/75">{classCourse.category}</span>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag>作者：{classCourse.publisher}</Tag>
              <Tag tone="green">进度 {classCourse.progress}</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">{classCourse.currentLesson}</h2>
            <p className="leading-7 text-muted">{classCourse.summary}</p>
            <PrototypeNote className="mt-3">课程没有价格；详情展示课程介绍，目录展示课程内容，试卷展示绑定的测试题库，考试仍归考试中心或班级测试处理。</PrototypeNote>
          </div>
          <Button href="#/course-lesson">继续学习</Button>
        </div>
      </Card>

      <div className="mb-5 flex gap-2 overflow-x-auto rounded-ui border border-line bg-white p-2">
        {tabs.map((tab) => (
          <button
            className={`min-h-10 rounded-ui px-5 ${activeTab === tab.key ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

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
                <Button href="#/course-lesson" tone={lesson.status === "学习中" ? "primary" : "secondary"}>
                  {lesson.status === "已学完" ? "复习" : "学习"}
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
      <PrototypeNote className="mt-5">课程试卷与学习中心试卷练习使用同一套字段、状态和操作；这里只展示当前课程关联的练习记录。</PrototypeNote>
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
        <p className="mb-0 mt-2 text-sm leading-6 text-muted">当前课程相关问题与老师回复。</p>
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
    progress: "62%",
    summary: "通过短视频理解函数定义、定义域和值域，适合碎片时间快速复习。",
    hasPractice: true,
  },
  {
    key: "mooc",
    label: "慕课",
    title: "函数图像与性质精讲",
    duration: "48 分钟",
    progress: "35%",
    summary: "通过长视频系统讲解函数图像、单调性和常见题型，学习动作与微课一致。",
    hasPractice: true,
  },
  {
    key: "audio",
    label: "音频",
    title: "函数概念速听",
    duration: "12 分钟",
    progress: "48%",
    summary: "用于通勤或课后复听，重点回顾函数概念、表示方法和易错点。",
    hasPractice: true,
  },
  {
    key: "pdf",
    label: "PDF",
    title: "函数基础讲义",
    duration: "8 页",
    progress: "第 5 / 8 页",
    summary: "阅读函数基础讲义，掌握定义域、值域、函数表示法和典型例题。",
    hasPractice: false,
  },
  {
    key: "ppt",
    label: "PPT",
    title: "函数图像课件",
    duration: "18 页",
    progress: "第 7 / 18 页",
    summary: "按页查看课堂课件，重点理解一次函数和二次函数图像特征。",
    hasPractice: false,
  },
  {
    key: "richtext",
    label: "富文本",
    title: "函数知识点图文讲解",
    duration: "图文阅读",
    progress: "已读 60%",
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
        desc="课时学习页承接班级课程、学习记录、课时练习和课程答疑；不同课时类型展示不同学习内容。"
        action={<Button href="#/course-study" tone="secondary">返回课程详情</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_300px]">
        <Card className="p-0">
          <LessonContent lesson={currentLesson} />
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="amber">学习中</Tag>
              <Tag>{currentLesson.label}</Tag>
              <Tag tone="blue">{currentLesson.progress}</Tag>
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
          <Meta><Tag>{lesson.label}</Tag><Tag>{lesson.progress}</Tag></Meta>
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
          <Meta><Tag>{lesson.label}</Tag><Tag>{lesson.progress}</Tag></Meta>
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
      <Meta><Tag>{lesson.label}</Tag><Tag>{lesson.progress}</Tag></Meta>
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
  const progressMap = {
    micro: "62%",
    mooc: "35%",
    audio: "48%",
    pdf: "62%",
    ppt: "39%",
    richtext: "60%",
  };
  return progressMap[lesson.key] || "0%";
}

export function CourseMaterialPage() {
  const material = courseMaterials[0];

  return (
    <>
      <PageHeader
        title="课件预览"
        desc="承接课程资料中的查看动作，第一阶段用预览占位表达 PDF、PPT 等资料的打开体验。"
        action={<Button href="#/course-study" tone="secondary">返回课程详情</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[560px]">
          <Meta><Tag>{material.type}</Tag><Tag>{material.size}</Tag><Tag tone="blue">{classCourse.title}</Tag></Meta>
          <h2 className="mb-4 mt-5 text-xl">{material.title}</h2>
          <div className="grid min-h-[380px] place-items-center rounded-ui border border-dashed border-line bg-slate-50 text-center text-muted">
            <div>
              <strong className="block text-lg text-slate-700">资料预览区域</strong>
              <span className="mt-2 block">这里展示 PDF / PPT / 图片课件内容</span>
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
      <p className="mb-0 mt-2 text-sm leading-6 text-muted">
        {compact ? "当前问题会关联到正在学习的课时。" : "从课程上下文发起提问。"}
      </p>
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
  const waitingCount = qaRecords.filter((item) => item.status === "待回复" || item.status === "待补充").length;
  const repliedCount = qaRecords.filter((item) => item.status === "已回复").length;

  return (
    <>
      <PageHeader
        title="班级答疑"
        desc="答疑页只作为历史答疑列表和记录入口；发起提问放在课程详情和课时学习上下文里。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="全部答疑" value={qaRecords.length} />
        <Stat label="待处理" value={waitingCount} />
        <Stat label="已回复" value={repliedCount} />
      </div>
      <div className="mt-6">
        <DataTable
          columns={["关联课程", "发起时间", "更新时间", "是否回复", "操作"]}
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
              <Tag tone={hasQaReply(item) ? "green" : "gray"}>{hasQaReply(item) ? "是" : "否"}</Tag>
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
    </>
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
        desc="答疑详情展示同一问题下的学生提问、老师回复和继续追问，仍保持轻量留言形态。"
        action={<Button href="#/qa" tone="secondary">返回班级答疑</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card>
          <Tag tone={item.statusTone}>{item.status}</Tag>
          <h2 className="mb-2 mt-4 text-xl">{getQaRelation(item)}</h2>
          <p className="leading-7 text-muted">本记录按时间、发送人和答疑信息展示，不单独设置提问标题。</p>
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
          <Meta><Button>提交回复/追问</Button></Meta>
        </Card>
        <Card>
          <h3 className="m-0 text-lg">关联信息</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
            <span>课程：{item.course}</span>
            <span>课时：{item.lesson}</span>
            <span>首次提问：{item.createdAt}</span>
            <span>更新时间：{item.updatedAt}</span>
          </div>
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
    <>
      <PageHeader title="错题巩固" desc="汇总课程、试卷和考试中的错题，支持筛选、分页、单题解析、单题练习和手动移除。" />
      <Card className="mb-5">
        <div className="grid gap-4 md:grid-cols-[140px_140px_1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm">
            科目
            <select className="min-h-10 rounded-ui border border-line px-3" value={subject} onChange={(event) => resetFilters(() => setSubject(event.target.value))}>
              {subjectOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            题型
            <select className="min-h-10 rounded-ui border border-line px-3" value={questionType} onChange={(event) => resetFilters(() => setQuestionType(event.target.value))}>
              {typeOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
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
                <div className="mt-2 text-sm text-muted">本次练习只用于巩固，答错不会重复加入错题本。</div>
              </section>
            ) : null}
            <Meta><Button tone="secondary" onClick={() => setPracticeItem(null)}>关闭</Button><Button onClick={() => setPracticeItem(null)}>完成本题</Button></Meta>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export function WrongQuestionPage() {
  const item = wrongQuestions[0];

  return (
    <>
      <PageHeader
        title="错题解析"
        desc="承接错题本中的查看解析动作，展示原题、我的答案、正确答案和解析。"
        action={<Button href="#/wrong-book" tone="secondary">返回错题巩固</Button>}
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
        desc="错题练习用于对错题本中的题目做轻量巩固，不复刻完整试卷流程。"
        action={<Button href="#/wrong-book" tone="secondary">返回错题巩固</Button>}
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
    <>
      <PageHeader title="学习记录" desc="当前阶段只记录视频和音频课时的学习记录，不记录普通图文、试卷和考试流水。" />
      <div className="grid gap-3">
        {learningRecords.map((item) => (
          <Card key={`${item.title}-${item.time}`} className="grid gap-4 md:grid-cols-[150px_120px_1fr] md:items-center">
            <div
              className="grid min-h-[84px] place-items-center rounded-ui p-3 text-center text-sm font-semibold text-white"
              style={{ background: item.coverTone }}
            >
              <span>图片占位</span>
            </div>
            <time className="text-sm text-muted">{item.time}</time>
            <div><strong>{item.title}</strong><p className="mt-2 leading-7 text-muted">{item.detail}</p><Meta><Tag tone={item.status === "已完成" ? "green" : "amber"}>{item.status}</Tag><Button href="#/course-lesson" tone="ghost">继续学习</Button></Meta></div>
          </Card>
        ))}
      </div>
    </>
  );
}

function paginateRows(rows, page, pageSize) {
  return rows.slice((page - 1) * pageSize, page * pageSize);
}

function LearningFilterButtons({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="w-12 font-semibold">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            className={`min-h-9 rounded-ui border px-3 ${value === option ? "border-blue-600 bg-blue-50 text-blue-700" : "border-line bg-white text-slate-700 hover:bg-slate-50"}`}
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

function getQuestionPreview(stem) {
  if (!stem) return "";
  return stem.length > 34 ? `${stem.slice(0, 34)}...` : stem;
}

import { useState } from "react";
import { classCourse, classCourses, classExams, classes, courseCatalog, courseMaterials, coursePapers, exams, learningRecords, paperPracticeRecords, wrongQuestions } from "../data/mockData";
import { ExamAnswerInput, ExamQuestionNavigator, ExamQuestionStatusLegend, getAllExamQuestions, getExamQuestionType, normalizeQuestionGroups } from "../components/examWorkflows";
import { Button, Card, DataTable, Meta, Modal, PageHeader, Pagination, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

export function LearningCenterPage() {
  const { role, roleKey } = usePrototypeRole();
  const currentIdentity = classes[0];
  const courseTasks = [
    {
      tone: "blue",
      title: "数学基础强化",
      detail: "继续课时：函数概念与表示，课程进度 62%",
      meta: "班级课程 · 最近学习",
      action: "继续学习",
      href: "#/course-lesson",
    },
    {
      tone: "amber",
      title: "函数基础课堂练习",
      detail: "课程内练习，10 题 / 15 分钟，尚未完成",
      meta: "课程内试卷 · 待完成",
      action: "去练习",
      href: "#/class-exam-answer",
    },
    {
      tone: "blue",
      title: "数据库基础",
      detail: "老师新分配，尚未开始学习",
      meta: "班级课程 · 未开始",
      action: "开始学习",
      href: "#/course-lesson",
    },
  ];
  const paperPracticeTasks = [
    {
      tone: "cyan",
      title: "电子与信息类专业综合卷（一）",
      detail: "上次做到 22/50，继续完成本套练习",
      meta: "试卷中心 · 进行中",
      action: "继续刷题",
      href: "#/paper-answer",
    },
    {
      tone: "cyan",
      title: "数学基础模拟卷（一）",
      detail: "上次做到 18/45，继续完成本套练习",
      meta: "试卷中心 · 进行中",
      action: "继续刷题",
      href: "#/paper-answer",
    },
  ];
  const classTestTasks = classExams.slice(0, 3).map((exam) => ({
    tone: exam.statusTone,
    title: exam.title,
    detail: `时长 ${exam.duration} · 总题数 ${exam.questionCount} 道 · 试卷总分 ${exam.totalScore} 分`,
    meta: `班级测试 · ${exam.status}${exam.studentStatus !== "未开始" ? ` · ${exam.studentStatus}` : ""}`,
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
      meta: `${exam.type} · ${exam.subject === "专业课" ? exam.category : exam.subject} · ${exam.status}`,
      action: exam.status === "进行中" && !exam.submitted ? "进入考试" : "查看详情",
      href: exam.status === "进行中" && !exam.submitted ? "#/exam-answer" : `#/exam-detail?id=${exam.id}`,
    }));
  const registeredPaperPracticeTasks = paperPracticeRecords
    .filter((paper) => paper.source === "试卷中心" && !paper.relation.includes("电子与信息类"))
    .slice(0, 3)
    .map((paper) => ({
      tone: paper.statusTone,
      title: paper.title,
      detail: `${paper.relation} · ${paper.questionCount} 题`,
      meta: `${paper.source} · ${paper.status}`,
      action: paper.status === "已完成" ? "查看解析" : paper.status === "进行中" ? "继续刷题" : "开始练习",
      href: paper.status === "已完成" ? "#/paper-analysis" : "#/paper-answer",
    }));
  const registeredPendingCount = registeredPaperPracticeTasks.length + examScheduleTasks.length + 2;
  const qaTasks = [
    {
      tone: "gray",
      title: "老师已回复 E-R 模型判断问题",
      detail: "查看回复并决定是否继续追问",
      meta: "班级答疑 · 已回复未查看",
      action: "查看答疑",
      href: "#/qa-detail",
    },
    {
      tone: "gray",
      title: "函数图像题需要补充截图",
      detail: "老师要求补充题目截图后继续解答",
      meta: "班级答疑 · 待补充",
      action: "补充问题",
      href: "#/qa-detail",
    },
  ];
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
            注册用户可以参加公开考试，因此学习中心保留个人考试、试卷练习和错题巩固；班级课程、班级测试、班级答疑需要加入学校班级后才展示。
          </PrototypeNote>
        </section>

        <section className="mt-8">
          <PageHeader title="个人学习资产" desc="注册用户也可以沉淀公开考试、试卷练习产生的个人学习资产。" />
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="m-0 text-lg">错题巩固</h3>
                  <p className="leading-7 text-muted">汇总公开考试和试卷练习中的错题。</p>
                  <Meta><Tag tone="amber">待掌握 24</Tag><Tag tone="green">已掌握 14</Tag></Meta>
                </div>
                <Button href="#/wrong-book" tone="ghost">去巩固</Button>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="m-0 text-lg">学习记录</h3>
                  <p className="leading-7 text-muted">当前阶段只记录视频和音频课时学习。</p>
                  <Meta><Tag>最近 {learningRecords.length} 条</Tag><Tag tone="blue">视频/音频</Tag></Meta>
                </div>
                <Button href="#/learning-record" tone="ghost">查看记录</Button>
              </div>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="学习中心" desc="学生只能加入一个学校；在该学校下只能加入一个班级。学习中心直接展示当前学校班级，不再提供多班级切换。" />
      <Card className="mb-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-sm text-muted">当前学校班级</span>
            <h2 className="mb-2 mt-2 text-xl">{currentIdentity.school}</h2>
            <p className="m-0 text-muted">{currentIdentity.name} · {currentIdentity.category}</p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button href="#/class-courses" tone="secondary">班级课程</Button>
            <Button href="#/class-exam" tone="secondary">班级测试</Button>
            <Button href="#/qa" tone="secondary">班级答疑</Button>
            <Tag tone="blue">{currentIdentity.category}</Tag>
            <Tag tone="green">专业课试卷已授权</Tag>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="待处理事项" value={pendingTaskCount} />
        <Stat label="本周学习" value="4.5h" />
        <Stat label="累计错题" value="38" />
        <Stat label="学校班级" value="1" />
      </div>

      <section className="mt-8">
        <PageHeader title="学习任务摘要" desc="首页只展示各类学习资源的摘要，不承接完整列表。课程学习来自班级课程，试卷练习来自课程练习和试卷中心，班级测试来自当前班级布置，考试安排只做正式考试提醒。" />
        <div className="grid gap-4">
          <TaskGroup
            title="课程学习"
            desc="展示最近学习中的课时、课程内练习和新分配课程。"
            tasks={courseTasks}
            footer={<Button href="#/class-courses" tone="secondary">查看班级课程</Button>}
          />
          <TaskGroup
            title="试卷练习"
            desc="展示课程练习和试卷中心里已经开始但尚未完成的试卷。"
            tasks={paperPracticeTasks}
            footer={<Button href="#/paper-practice" tone="secondary">查看试卷练习</Button>}
          />
          <TaskGroup
            title="班级测试"
            desc="展示当前班级布置的随堂测试、阶段测试和结业测试。"
            tasks={classTestTasks}
            footer={<Button href="#/class-exam" tone="secondary">查看班级测试</Button>}
          />
          <TaskGroup
            title="考试安排"
            desc="只提醒当前学生近期需要关注的正式考试，完整筛选和历史记录仍进入考试中心。"
            tasks={examScheduleTasks}
            footer={<Button href="#/my-exams" tone="secondary">查看我的考试</Button>}
          />
          <TaskGroup
            title="班级答疑"
            desc="展示老师已回复、要求补充或需要学生继续处理的问题。"
            tasks={qaTasks}
            footer={<Button href="#/qa" tone="secondary">查看全部答疑</Button>}
          />
        </div>
        <PrototypeNote className="mt-4">
          学习任务摘要按资源来源拆分：课程学习包含课程课时和课程内试卷/练习，首页最多展示 3 条；试卷练习展示课程练习和试卷中心里已开始未完成的试卷；班级测试只展示当前班级布置的测试；考试安排只做正式考试提醒，完整管理仍在考试中心；班级答疑只提醒需要学生动作的问题。
        </PrototypeNote>
      </section>

      <section className="mt-8">
        <PageHeader title="个人学习资产" desc="错题本和学习记录属于学生个人资产，当前阶段不再提供按多学校、多班级筛选。" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="m-0 text-lg">错题巩固</h3>
                <p className="leading-7 text-muted">汇总试卷刷题、考试、班级测试和课堂练习中的错题。</p>
                <Meta><Tag tone="amber">待掌握 24</Tag><Tag tone="green">已掌握 14</Tag></Meta>
              </div>
              <Button href="#/wrong-book" tone="ghost">去巩固</Button>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="m-0 text-lg">学习记录</h3>
                <p className="leading-7 text-muted">当前阶段只记录视频和音频课时学习。</p>
                <Meta><Tag>最近 {learningRecords.length} 条</Tag><Tag tone="blue">当前班级记录</Tag></Meta>
              </div>
              <Button href="#/learning-record" tone="ghost">查看记录</Button>
            </div>
          </Card>
        </div>
        <PrototypeNote className="mt-4">学习中心现在以“当前学校班级 + 学习任务摘要 + 个人学习资产”组织页面。学生只能加入一个学校，并在该学校下加入一个班级；班级课程、班级测试和班级答疑入口合并到当前学校班级与学习任务摘要中。</PrototypeNote>
      </section>
    </>
  );
}

function TaskGroup({ title, desc, tasks, footer }) {
  return (
    <Card>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h3 className="m-0 text-lg">{title}</h3>
          <p className="mb-0 mt-2 text-sm leading-6 text-muted">{desc}</p>
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
        </div>
        <p className="mb-0 mt-1 leading-6 text-muted">{task.detail}</p>
      </div>
      <Button href={task.href} tone={task.tone === "gray" ? "secondary" : "primary"}>{task.action}</Button>
    </div>
  );
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
        <Button href="#/exam-answer">进入考试</Button>
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
            <Meta><Tag>专业课试卷权限已开通</Tag><Tag>学习进度 {classes[0].progress}</Tag></Meta>
          </div>
          <Button href="#/course-lesson">继续学习</Button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="班级课程" value="4" /><Stat label="班级测试" value="3" /><Stat label="答疑待回复" value="1" /><Stat label="学习进度" value="62%" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><h3>班级课程</h3><p className="leading-7 text-muted">4 门课程 · 2 门待学</p><PrototypeNote className="mt-3">课程由老师从资源库成品课程、知识点切片和课堂练习中重排后分配。</PrototypeNote><Meta><Button href="#/course-study">学习数学基础强化</Button><Button href="#/course-study" tone="secondary">学习数据库基础</Button></Meta></Card>
        <Card><h3>班级测试</h3><p className="leading-7 text-muted">5 场测试 · 1 场进行中 · 1 场待开始</p><PrototypeNote className="mt-3">班级测试是老师在班级内布置的小测、阶段测或结业测，不进入公开考试/联考详情页。</PrototypeNote><Meta><Button href="#/class-exam" tone="ghost">查看班级测试</Button></Meta></Card>
        <Card><h3>班级答疑</h3><p className="leading-7 text-muted">1 条待回复</p><PrototypeNote className="mt-3">向老师一对一留言，可关联课程、课时或题目。</PrototypeNote><Meta><Button href="#/qa" tone="ghost">进入答疑</Button></Meta></Card>
        <Card><h3>班级通知/资料</h3><p className="leading-7 text-muted">本周任务已发布</p><PrototypeNote className="mt-3">展示老师发布的学习通知、资料说明和近期任务。</PrototypeNote><Meta><Tag tone="amber">本周完成函数练习</Tag></Meta></Card>
      </div>
    </>
  );
}

export function ClassCoursesPage() {
  const inProgressCount = classCourses.filter((course) => course.status === "学习中").length;
  const finishedCount = classCourses.filter((course) => course.status === "已学完").length;
  const waitingCount = classCourses.filter((course) => course.status === "未开始").length;

  return (
    <>
      <PageHeader
        title="班级课程"
        desc="展示当前班级分配给学生的课程列表，课程由学校端或教师端配置；点击课程进入课程学习详情。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="学习中" value={inProgressCount} />
        <Stat label="未开始" value={waitingCount} />
        <Stat label="已学完" value={finishedCount} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {classCourses.map((course) => {
          const actionText = course.progress === "0%" ? "开始学习" : course.progress === "100%" ? "复习课程" : "继续学习";

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
                    <Tag tone={course.statusTone}>{course.status}</Tag>
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
        {classExams.map((exam) => (
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

export function PaperPracticePage() {
  const unfinishedCount = paperPracticeRecords.filter((paper) => paper.status === "进行中" || paper.status === "待完成").length;
  const finishedCount = paperPracticeRecords.filter((paper) => paper.status === "已完成").length;

  return (
    <>
      <PageHeader
        title="试卷练习"
        desc="汇总课程内练习和学生在试卷中心开始过的试卷，方便学生继续测试、查看解析或进入错题练习。"
        action={<Button href="#/learning" tone="secondary">返回学习中心</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="待完成" value={unfinishedCount} />
        <Stat label="已完成" value={finishedCount} />
        <Stat label="总记录" value={paperPracticeRecords.length} />
      </div>
      <div className="mt-6">
        <DataTable
          columns={["试卷名称", "来源", "题目数", "客观题正确率", "用时", "状态", "操作"]}
          gridTemplateColumns="minmax(220px,1.7fr) minmax(120px,1fr) 90px 120px 100px 100px minmax(140px,1fr)"
          rows={paperPracticeRecords}
          renderRow={(paper) => (
            <>
              <div>
                <strong>{paper.title}</strong>
                <p className="mb-0 mt-1 text-xs leading-5 text-muted">{paper.relation}</p>
              </div>
              <span>{paper.source}</span>
              <span>{paper.questionCount} 题</span>
              <span>{paper.objectiveAccuracy}</span>
              <span>{paper.duration}</span>
              <Tag tone={paper.statusTone}>{paper.status}</Tag>
              <div className="flex flex-wrap gap-2">
                <Button href={paper.status === "已完成" ? "#/paper-analysis" : "#/paper-answer"} tone={paper.status === "已完成" ? "secondary" : "primary"}>
                  {paper.action}
                </Button>
                {paper.status === "已完成" ? <Button href="#/wrong-book" tone="ghost">错题练习</Button> : null}
              </div>
            </>
          )}
        />
      </div>
      <PrototypeNote className="mt-5">
        试卷练习合并两类来源：课程内绑定的练习/测试，以及学生从试卷中心开始过或完成过的试卷；正式考试仍保留在考试中心或班级测试中。
      </PrototypeNote>
    </>
  );
}

export function ClassExamAnswerPage() {
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [activeKey, setActiveKey] = useState(classExamQuestions[0].key);
  const activeIndex = Math.max(0, classExamQuestions.findIndex((question) => question.key === activeKey));
  const activeQuestion = classExamQuestions[activeIndex] || classExamQuestions[0];
  const activeQuestionType = getExamQuestionType(activeQuestion);
  const activeIsComposite = activeQuestion.groupTitle.includes("综合题");

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
            <Button tone="secondary" onClick={() => setActiveKey(classExamQuestions[Math.max(0, activeIndex - 1)].key)}>上一题</Button>
            <Button onClick={() => setActiveKey(classExamQuestions[Math.min(classExamQuestions.length - 1, activeIndex + 1)].key)}>保存并下一题</Button>
            <Button tone="ghost">标记本题</Button>
            <Button tone="warning" onClick={() => setConfirmSubmit(true)}>提交测试</Button>
          </Meta>
        </Card>
        <Card>
          <h3>题号导航</h3>
          <p className="leading-7 text-muted">按大题分组展示题号，覆盖单选、多选、判断、填空、简答和综合题。</p>
          <ExamQuestionNavigator activeKey={activeKey} groups={classExamQuestionGroups} onSelect={(question) => setActiveKey(question.key)} />
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
  ];

  return (
    <>
      <PageHeader title={classCourse.title} action={<Button href="#/qa" tone="ghost">向老师提问</Button>} />
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
                <Button href={lesson.type === "课件" ? "#/course-material" : "#/course-lesson"} tone={lesson.status === "学习中" ? "primary" : "secondary"}>
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
  return (
    <div className="grid gap-4">
      {coursePapers.map((paper) => (
        <Card key={paper.title}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="m-0 text-lg">{paper.title}</h3>
              <p className="mt-2 leading-7 text-muted">{paper.scope}</p>
              <Meta><Tag>{paper.meta}</Tag><Tag tone={paper.statusTone}>{paper.status}</Tag></Meta>
            </div>
            <Button href="#/class-exam-answer" tone={paper.status === "待完成" ? "primary" : "secondary"}>
              {paper.status === "待完成" ? "开始测试" : "查看"}
            </Button>
          </div>
        </Card>
      ))}
      <PrototypeNote>这里的“试卷”是课程绑定的测试题库或练习，不是考试中心的正式考试活动。</PrototypeNote>
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

const lessonFormats = [
  { key: "video", label: "视频", title: "函数概念与表示", duration: "18 分钟" },
  { key: "audio", label: "音频", title: "函数概念速听", duration: "12 分钟" },
  { key: "pdf", label: "PDF", title: "函数基础讲义", duration: "8 页" },
];

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
  const [activeFormat, setActiveFormat] = useState("video");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const currentLesson = lessonFormats.find((item) => item.key === activeFormat) || lessonFormats[0];
  const nextLessons = courseCatalog.flatMap((chapter) => chapter.lessons).filter((lesson) => lesson.type !== "练习").slice(1, 5);
  const practiceQuestion = lessonPracticeQuestions[practiceIndex];
  const canPractice = activeFormat === "video" || activeFormat === "audio";

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
        desc="课程课时播放页承接班级课程、学习记录和继续学习入口；当前阶段重点覆盖视频和音频学习记录。"
        action={<Button href="#/course-study" tone="secondary">返回课程详情</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_300px]">
        <Card className="p-0">
          <div className="border-b border-line p-3">
            <div className="flex gap-2 overflow-x-auto">
              {lessonFormats.map((format) => (
                <button
                  className={`min-h-10 rounded-ui px-4 ${activeFormat === format.key ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-700 hover:bg-blue-50"}`}
                  key={format.key}
                  onClick={() => setActiveFormat(format.key)}
                  type="button"
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
          {activeFormat === "pdf" ? (
            <div className="grid min-h-[360px] place-items-center bg-slate-50 text-center text-muted">
              <div>
                <strong className="block text-xl text-slate-700">{currentLesson.title}</strong>
                <span className="mt-2 block">{classCourse.title} · {currentLesson.duration}</span>
                <div className="mt-6 min-h-[180px] w-[min(420px,70vw)] rounded-ui border border-dashed border-line bg-white p-6 text-left leading-7">
                  <strong className="text-slate-700">PDF 预览</strong>
                  <p className="mb-0 mt-3">函数的概念、定义域、值域和常见表示方法。</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${activeFormat === "audio" ? "bg-[linear-gradient(135deg,#0f766e,#1d4ed8)]" : "bg-slate-950"} grid min-h-[360px] place-items-center text-white`}>
              <div className="grid justify-items-center gap-4 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-2xl">{activeFormat === "audio" ? "♪" : "▶"}</span>
                <div>
                  <strong className="block text-xl">{currentLesson.title}</strong>
                  <span className="mt-2 block text-sm text-white/70">{classCourse.title} · {currentLesson.duration}</span>
                </div>
                <div className="h-2 w-[min(460px,70vw)] overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full rounded-full bg-white" style={{ width: activeFormat === "audio" ? "48%" : "62%" }} />
                </div>
              </div>
            </div>
          )}
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="amber">学习中</Tag>
              <Tag>{currentLesson.label}课时</Tag>
              <Tag tone="blue">已学 62%</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">本课要点</h2>
            <p className="leading-8 text-muted">理解函数的定义、表示方式和常见应用场景，完成后会写入学习记录，并同步更新课程进度。</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <span className="block h-full rounded-full bg-blue-600" style={{ width: "62%" }} />
            </div>
            <Meta>
              <Button tone="secondary">上一课时</Button>
              {canPractice ? <Button onClick={openPractice}>课时练习</Button> : null}
              {canPractice ? <Button tone="secondary" onClick={openPractice}>模拟播放完成</Button> : null}
              <Button href="#/qa-detail" tone="ghost">针对本课提问</Button>
            </Meta>
          </div>
        </Card>
        <Card>
          <h3 className="m-0 text-lg">课时目录</h3>
          <div className="mt-4 grid gap-3">
            {nextLessons.map((lesson) => (
              <a className="rounded-ui border border-line p-3 text-slate-700 hover:border-blue-200 hover:bg-blue-50" href={lesson.type === "课件" ? "#/course-material" : "#/course-lesson"} key={lesson.title}>
                <strong className="block">{lesson.title}</strong>
                <span className="mt-1 block text-xs text-muted">{lesson.type} · {lesson.duration}</span>
              </a>
            ))}
          </div>
        </Card>
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
          <Meta><Button href="#/qa-detail" tone="ghost">对资料提问</Button></Meta>
        </Card>
      </div>
    </>
  );
}

export function QAPage() {
  return (
    <>
      <PageHeader title="班级答疑" desc="轻量留言形式，不做实时 IM。学生向老师提问，老师在学校端回复。" />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3>历史答疑</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-ui border border-line p-4"><strong>函数图像这道题为什么选 C？</strong><p className="mt-2 text-muted">关联：数学基础强化 / 课堂练习 1</p><Meta><Tag tone="amber">待回复</Tag><Button href="#/qa-detail" tone="ghost">查看记录</Button></Meta></div>
            <div className="rounded-ui border border-line p-4"><strong>数据库 E-R 图怎么判断联系类型？</strong><p className="mt-2 text-muted">老师回复：先看实体之间是一对一、一对多还是多对多。</p><Meta><Tag tone="green">已回复</Tag><Button href="#/qa-detail" tone="ghost">查看记录</Button></Meta></div>
          </div>
        </Card>
        <Card>
          <h3>发起提问</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              关联课程
              <select className="min-h-10 rounded-ui border border-line px-3">
                {classCourses.map((course) => <option key={course.title}>{course.title}</option>)}
              </select>
            </label>
            <label className="grid gap-2">
              关联课时（非必选）
              <select className="min-h-10 rounded-ui border border-line px-3">
                <option>函数概念与表示</option>
                <option>函数图像与性质</option>
                <option>E-R 模型入门</option>
                <option>阅读定位综合训练</option>
              </select>
            </label>
            <label className="grid gap-2">问题内容<textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="请描述你遇到的问题" /></label>
            <Button>提交问题</Button>
          </div>
          <PrototypeNote className="mt-4">提问面向当前班级老师，先选择班级课程，再按需要关联具体课时或题目。</PrototypeNote>
        </Card>
      </div>
    </>
  );
}

export function QADetailPage() {
  return (
    <>
      <PageHeader
        title="答疑记录"
        desc="答疑详情展示同一问题下的学生提问、老师回复和继续追问，仍保持轻量留言形态。"
        action={<Button href="#/qa" tone="secondary">返回班级答疑</Button>}
      />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card>
          <Tag tone="green">已回复</Tag>
          <h2 className="mb-2 mt-4 text-xl">数据库 E-R 图怎么判断联系类型？</h2>
          <p className="leading-7 text-muted">关联课程：数据库基础 · 关联课时：E-R 模型入门</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-ui bg-slate-50 p-4">
              <strong>我：</strong>
              <p className="mb-0 mt-2 leading-7 text-slate-700">题目里给了学生和课程两个实体，我不确定应该判断为一对多还是多对多。</p>
            </div>
            <div className="rounded-ui border border-blue-100 bg-blue-50 p-4">
              <strong>王老师：</strong>
              <p className="mb-0 mt-2 leading-7 text-slate-700">先看一个学生能否选择多门课程，再看一门课程能否被多个学生选择。如果两边都成立，就是多对多联系。</p>
            </div>
          </div>
          <label className="mt-6 grid gap-2">
            继续追问
            <textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="补充你的问题或截图说明" />
          </label>
          <Meta><Button>提交追问</Button><Button href="#/course-lesson" tone="ghost">回到课时</Button></Meta>
        </Card>
        <Card>
          <h3 className="m-0 text-lg">关联信息</h3>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
            <span>课程：数据库基础</span>
            <span>课时：E-R 模型入门</span>
            <span>首次提问：2026-02-13 12:00:00</span>
            <span>更新时间：2026-02-13 16:20:00</span>
          </div>
        </Card>
      </div>
    </>
  );
}

export function WrongBookPage() {
  const subjectOptions = ["全部", "语文", "数学", "英语", classes[0].category];
  const sourceOptions = ["全部", "课程", "试卷", "考试"];
  const [subject, setSubject] = useState("全部");
  const [source, setSource] = useState("全部");
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
    .filter((item) => source === "全部" || item.source === source)
    .filter((item) => !keyword || item.point.includes(keyword) || item.title.includes(keyword));
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
        <div className="grid gap-4 md:grid-cols-[160px_160px_1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm">
            科目
            <select className="min-h-10 rounded-ui border border-line px-3" value={subject} onChange={(event) => resetFilters(() => setSubject(event.target.value))}>
              {subjectOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            错题来源
            <select className="min-h-10 rounded-ui border border-line px-3" value={source} onChange={(event) => resetFilters(() => setSource(event.target.value))}>
              {sourceOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            知识点
            <input className="min-h-10 rounded-ui border border-line px-3" placeholder="输入知识点或题目关键词" value={keyword} onChange={(event) => resetFilters(() => setKeyword(event.target.value))} />
          </label>
          <Button tone="secondary" onClick={removeSelected}>批量移除</Button>
        </div>
      </Card>
      {currentRows.length ? (
        <>
          <DataTable
            columns={["", "错题", "科目", "来源", "知识点", "状态", "操作"]}
            gridTemplateColumns="40px minmax(220px,1.5fr) 110px 90px 120px 100px minmax(220px,1fr)"
            rows={currentRows}
            renderRow={(item) => (
              <>
                <input checked={selectedIds.includes(item.id)} onChange={() => toggleSelected(item.id)} type="checkbox" />
                <div><strong>{item.title}</strong><p className="mt-1 text-xs text-muted">{item.detail}</p></div>
                <span>{item.subject}</span>
                <span>{item.source}</span>
                <span>{item.point}</span>
                <Tag tone={item.status === "已掌握" ? "green" : "amber"}>{item.status}</Tag>
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
            <Meta><Tag>{analysisItem.subject}</Tag><Tag>{analysisItem.source}</Tag><Tag tone="amber">{analysisItem.point}</Tag></Meta>
            <h3 className="m-0 text-lg">{analysisItem.title}</h3>
            <p className="m-0 leading-7 text-muted">{analysisItem.detail}</p>
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
            <Meta><Tag>{practiceItem.subject}</Tag><Tag>{practiceItem.point}</Tag></Meta>
            <h3 className="m-0 text-lg">{practiceItem.title}</h3>
            <p className="m-0 leading-7 text-slate-700">若 f(x)=2x+1，则 f(3)=？</p>
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
          <Card key={item.title} className="grid gap-4 md:grid-cols-[120px_1fr]">
            <time className="text-sm text-muted">{item.time}</time>
            <div><strong>{item.title}</strong><p className="mt-2 leading-7 text-muted">{item.detail}</p><Meta><Tag tone={item.status === "已完成" ? "green" : "amber"}>{item.status}</Tag><Button href="#/course-lesson" tone="ghost">继续学习</Button></Meta></div>
          </Card>
        ))}
      </div>
    </>
  );
}

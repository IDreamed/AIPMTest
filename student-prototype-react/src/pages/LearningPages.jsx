import { useState } from "react";
import { classCourse, classExams, classes, courseCatalog, courseMaterials, coursePapers, learningRecords, wrongQuestions } from "../data/mockData";
import { Button, Card, DataTable, Meta, PageHeader, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

export function LearningCenterPage() {
  const { role, roleKey } = usePrototypeRole();
  const [selectedClassName, setSelectedClassName] = useState(classes[0]?.name || "");
  const currentIdentity = classes.find((item) => item.name === selectedClassName) || classes[0];
  const courseTasks = [
    {
      tone: "blue",
      title: "数学基础强化",
      detail: "继续课时：函数概念与表示，课程进度 62%",
      meta: "班级课程 · 最近学习",
      action: "继续学习",
      href: "#/course-study",
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
      href: "#/course-study",
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
  const examTasks = [
    {
      tone: "green",
      title: "电子与信息类学校联考",
      detail: "05-08 09:00 开始，当前学校班级已授权",
      meta: "学校联考 · 专业课",
      action: "查看详情",
      href: "#/exam-detail?id=school-computer",
    },
    {
      tone: "green",
      title: "春季数学公开测评",
      detail: "正在进行，今日 18:00 结束，尚未交卷",
      meta: "公开考试 · 数学",
      action: "进入考试",
      href: "#/exam-answer",
    },
  ];
  const qaTasks = [
    {
      tone: "gray",
      title: "老师已回复 E-R 模型判断问题",
      detail: "查看回复并决定是否继续追问",
      meta: "班级答疑 · 已回复未查看",
      action: "查看答疑",
      href: "#/qa",
    },
    {
      tone: "gray",
      title: "函数图像题需要补充截图",
      detail: "老师要求补充题目截图后继续解答",
      meta: "班级答疑 · 待补充",
      action: "补充问题",
      href: "#/qa",
    },
  ];
  const pendingTaskCount = courseTasks.length + paperPracticeTasks.length + examTasks.length + qaTasks.length + 2;

  if (roleKey !== "student") {
    const isVisitor = roleKey === "visitor";

    return (
      <>
        <PageHeader title="学习中心" desc="学习中心是登录后的学生工作台，未登录或未加入学校班级时不展示学习数据。" />
        <Card className="grid gap-5 md:grid-cols-[1fr_300px] md:items-center">
          <div>
            <h2 className="mb-3 text-xl">{isVisitor ? "登录后查看学习中心" : "暂无学校班级"}</h2>
            <p className="leading-8 text-muted">
              {isVisitor
                ? "登录或注册后，学生可以查看自己的学校班级、待完成任务、课程、测试、错题本和学习记录。"
                : "加入学校班级后，这里会展示学校班级、学习任务、班级课程和个人学习资产。"}
            </p>
            <PrototypeNote className="mt-3">
              {roleKey === "visitor"
                ? "未登录时不展示学习工作台数据，避免把学习中心做成公开内容页。"
                : "未加入学校班级时不展示班级课程、班级测试和班级答疑。"}
            </PrototypeNote>
            <Meta>
              <Button href={role.href}>{role.cta}</Button>
              <Button href={isVisitor ? "#/papers" : "#/school-apply"} tone="secondary">
                {isVisitor ? "先浏览试卷" : "查看入校申请"}
              </Button>
            </Meta>
          </div>
          <div className="rounded-ui border border-line bg-slate-50 p-5">
            <strong className="block">开通后可查看</strong>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <span>当前学校班级</span>
              <span>学习任务摘要</span>
              <span>班级课程 / 班级测试 / 班级答疑</span>
              <span>个人错题本 / 学习记录</span>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="学习中心" desc="学生可加入多个学校，但每个学校下只能有一个班级；下拉选择当前学校班级，用于班级内容和专业课权限上下文。" action={<Button href="#/school-apply" tone="ghost">申请新的学校班级</Button>} />
      <Card className="mb-4 grid gap-4 md:grid-cols-[1fr_280px] md:items-end">
        <label className="grid gap-2">
          <span className="text-sm text-muted">当前学校班级</span>
          <select
            className="min-h-11 rounded-ui border border-line bg-white px-3"
            value={selectedClassName}
            onChange={(event) => setSelectedClassName(event.target.value)}
          >
            {classes.map((item) => (
              <option key={item.name} value={item.name}>{item.school} / {item.name} / {item.category}</option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Tag tone="blue">{currentIdentity.category}</Tag>
          <Tag tone="green">专业课试卷已授权</Tag>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="待处理事项" value={pendingTaskCount} />
        <Stat label="本周学习" value="4.5h" />
        <Stat label="累计错题" value="38" />
        <Stat label="学校班级" value={classes.length} />
      </div>

      <section className="mt-8">
        <PageHeader title="学习任务摘要" desc="首页只展示各类学习资源的摘要，不承接完整列表。课程学习来自班级课程，试卷练习来自试卷中心，考试安排来自考试中心。" />
        <div className="grid gap-4">
          <TaskGroup
            title="课程学习"
            desc="展示最近学习中的课时、课程内练习和新分配课程。"
            tasks={courseTasks}
            footer={<Button href="#/course-study" tone="secondary">查看全部课程</Button>}
          />
          <TaskGroup
            title="试卷练习"
            desc="展示试卷中心里已经开始但尚未完成的试卷。"
            tasks={paperPracticeTasks}
            footer={<Button href="#/papers" tone="secondary">查看全部试卷</Button>}
          />
          <TaskGroup
            title="考试安排"
            desc="展示考试中心里有权限、未交卷、正在进行或即将开始的考试。"
            tasks={examTasks}
            footer={<Button href="#/exams" tone="secondary">查看考试中心</Button>}
          />
        </div>
        <PrototypeNote className="mt-4">
          学习任务摘要按资源来源拆分：课程学习包含课程课时和课程内试卷/练习，首页最多展示 3 条；试卷练习只展示试卷中心里已开始未完成的试卷，首页最多展示 3 条；考试安排属于强时间约束，有权限且未结束的正在进行/近期考试全部展示。班级测试和答疑属于当前班级学习，不和考试中心考试混为一组；如果数量较多，进入对应列表页查看全部。
        </PrototypeNote>
      </section>

      <section className="mt-8">
        <PageHeader title="当前班级学习" desc="这里展示当前学校班级下的班级课程、班级测试和班级答疑，明确绑定顶部下拉选择的学校班级。" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="m-0 text-lg">班级课程</h3>
            <p className="leading-7 text-muted">老师已分配 {currentIdentity.courses} 门课程，最近学习到数学基础强化。</p>
            <Meta><Tag tone="blue">2 门进行中</Tag><Tag>2 门未开始</Tag></Meta>
            <Meta><Button href="#/course-study">进入课程</Button></Meta>
          </Card>
          <Card>
            <h3 className="m-0 text-lg">班级测试</h3>
            <p className="leading-7 text-muted">1 场待完成，3 场已完成，平均分 85。</p>
            <Meta><Tag tone="amber">待完成 1</Tag><Tag tone="green">已完成 3</Tag></Meta>
            <Meta><Button href="#/class-exam" tone="ghost">查看测试</Button></Meta>
          </Card>
          <Card>
            <h3 className="m-0 text-lg">班级答疑</h3>
            <p className="leading-7 text-muted">一对一留言给老师，查看待回复和已回复问题。</p>
            <Meta><Tag tone="green">已回复 1</Tag><Tag>待回复 1</Tag></Meta>
            <Meta><Button href="#/qa" tone="ghost">进入答疑</Button></Meta>
          </Card>
        </div>
        <Card className="mt-4">
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <h3 className="m-0 text-lg">答疑提醒</h3>
              <p className="mb-0 mt-2 text-sm leading-6 text-muted">只提醒需要学生动作的问题，例如老师已回复未查看或要求补充说明。</p>
            </div>
            <Tag tone="blue">{qaTasks.length} 项</Tag>
          </div>
          <div className="grid gap-3">
            {qaTasks.map((task) => (
              <TaskRow key={task.title} task={task} />
            ))}
          </div>
          <Meta><Button href="#/qa" tone="secondary">查看全部答疑</Button></Meta>
        </Card>
      </section>

      <section className="mt-8">
        <PageHeader title="个人学习资产" desc="错题本和学习记录高于班级，默认汇总学生个人全部学习数据，也可以在内部按学校班级筛选。" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="m-0 text-lg">错题本</h3>
                <p className="leading-7 text-muted">汇总试卷刷题、考试、班级测试和课堂练习中的错题。</p>
                <Meta><Tag tone="amber">待掌握 24</Tag><Tag tone="green">已掌握 14</Tag></Meta>
              </div>
              <Button href="#/wrong-book" tone="ghost">查看错题</Button>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h3 className="m-0 text-lg">学习记录</h3>
                <p className="leading-7 text-muted">记录课程学习、刷题、测试和考试完成情况。</p>
                <Meta><Tag>最近 {learningRecords.length} 条</Tag><Tag tone="blue">支持按学校班级筛选</Tag></Meta>
              </div>
              <Button href="#/learning-record" tone="ghost">查看记录</Button>
            </div>
          </Card>
        </div>
        <PrototypeNote className="mt-4">学习中心现在以“当前学校班级下拉 + 学习任务摘要 + 当前班级学习 + 个人学习资产”组织页面。顶部下拉提供班级内容和专业课权限上下文；学习任务摘要按课程、试卷、考试资源来源拆分；错题本、学习记录属于学生个人。</PrototypeNote>
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
        <Tag tone="blue">{tasks.length} 项</Tag>
      </div>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskRow key={task.title} task={task} />
        ))}
      </div>
      {footer ? <Meta>{footer}</Meta> : null}
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
          <Button href="#/course-study">继续学习</Button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="班级课程" value="4" /><Stat label="班级测试" value="3" /><Stat label="答疑待回复" value="1" /><Stat label="学习进度" value="62%" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><h3>班级课程</h3><p className="leading-7 text-muted">4 门课程 · 2 门待学</p><PrototypeNote className="mt-3">课程由老师从资源库成品课程、知识点切片和课堂练习中重排后分配。</PrototypeNote><Meta><Button href="#/course-study">学习数学基础强化</Button><Button href="#/course-study" tone="secondary">学习数据库基础</Button></Meta></Card>
        <Card><h3>班级测试</h3><p className="leading-7 text-muted">3 场测试 · 1 场待完成</p><PrototypeNote className="mt-3">班级测试是老师在班级内布置的小测、阶段测或结业测，不进入公开考试/联考详情页。</PrototypeNote><Meta><Button href="#/class-exam" tone="ghost">查看班级测试</Button></Meta></Card>
        <Card><h3>班级答疑</h3><p className="leading-7 text-muted">1 条待回复</p><PrototypeNote className="mt-3">向老师一对一留言，可关联课程、课时或题目。</PrototypeNote><Meta><Button href="#/qa" tone="ghost">进入答疑</Button></Meta></Card>
        <Card><h3>班级通知/资料</h3><p className="leading-7 text-muted">本周任务已发布</p><PrototypeNote className="mt-3">展示老师发布的学习通知、资料说明和近期任务。</PrototypeNote><Meta><Tag tone="amber">本周完成函数练习</Tag></Meta></Card>
      </div>
    </>
  );
}

export function ClassExamPage() {
  const pendingCount = classExams.filter((exam) => exam.status === "待完成").length;
  const finishedExams = classExams.filter((exam) => exam.status === "已完成");
  const averageScore = Math.round(finishedExams.reduce((total, exam) => total + Number(exam.score || 0), 0) / finishedExams.length);

  return (
    <>
      <PageHeader title="班级测试" action={<Button href="#/class-detail" tone="secondary">返回班级</Button>} />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="待完成" value={pendingCount} />
        <Stat label="已完成" value={finishedExams.length} />
        <Stat label="平均分" value={averageScore} />
      </div>
      <div className="mt-6 grid gap-4">
        {classExams.map((exam) => (
          <Card key={exam.title}>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-lg">{exam.title}</h3>
                  <Tag tone={exam.statusTone}>{exam.status}</Tag>
                  <Tag>{exam.type}</Tag>
                </div>
                <p className="mt-3 leading-7 text-muted">{exam.course} · {exam.scope}</p>
                <Meta><Tag>{exam.meta}</Tag><Tag>{exam.deadline}</Tag>{exam.score !== "-" ? <Tag tone="green">得分 {exam.score}</Tag> : null}</Meta>
              </div>
              <Button href="#/class-exam-answer" tone={exam.status === "待完成" ? "primary" : "secondary"}>
                {exam.status === "待完成" ? "开始测试" : exam.status === "已完成" ? "查看记录" : "查看安排"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <PrototypeNote className="mt-5">
        班级测试只服务班级教学闭环，功能比公开考试/学校联考更轻：不需要正式考试介绍、不展示跨校排行，重点是完成状态、成绩、答题记录和错题沉淀。
      </PrototypeNote>
    </>
  );
}

export function ClassExamAnswerPage() {
  return (
    <>
      <PageHeader title="函数与数列阶段测试" action={<Button href="#/class-exam" tone="secondary">返回测试列表</Button>} />
      <div className="grid gap-5 md:grid-cols-[1fr_260px]">
        <Card className="min-h-[400px]">
          <Meta><Tag>单选题</Tag><Tag>第 1 / 20 题</Tag><Tag tone="green">已保存</Tag></Meta>
          <h2 className="mt-6 text-xl">函数 y=2x+1 的图像与 y 轴交点坐标是？</h2>
          <div className="mt-5 grid gap-3">
            {["A. (0, 1)", "B. (1, 0)", "C. (0, 2)", "D. (2, 0)"].map((item) => (
              <label key={item} className="flex gap-3 rounded-ui border border-line p-4"><input type="radio" name="class-q1" />{item}</label>
            ))}
          </div>
          <Meta><Button tone="secondary">上一题</Button><Button>保存并下一题</Button></Meta>
        </Card>
        <Card>
          <h3>测试进度</h3>
          <p className="leading-7 text-muted">已答 8 题，未答 12 题。</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, index) => <span key={index} className={`grid h-9 place-items-center rounded-ui border ${index < 4 ? "border-green-600 bg-green-600 text-white" : index === 4 ? "border-blue-600 bg-blue-50 text-blue-600" : "border-line"}`}>{index + 1}</span>)}
          </div>
          <Meta><Button tone="warning">提交测试</Button></Meta>
          <PrototypeNote className="mt-4">班级测试答题页不强调正式考试氛围，不展示赛事型考试介绍、联考排行或跨校信息。</PrototypeNote>
        </Card>
      </div>
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
              <Tag tone="blue">{classCourse.className}</Tag>
              <Tag>发布人：{classCourse.publisher}</Tag>
              <Tag tone="green">进度 {classCourse.progress}</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">{classCourse.currentLesson}</h2>
            <p className="leading-7 text-muted">{classCourse.summary}</p>
            <PrototypeNote className="mt-3">课程没有价格；详情展示课程介绍，目录展示课程内容，试卷展示绑定的测试题库，考试仍归考试中心或班级测试处理。</PrototypeNote>
          </div>
          <Button href="#/course-study">继续学习</Button>
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
            {chapter.lessons.map((lesson) => (
              <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-[1fr_90px_110px_120px] md:items-center" key={lesson.title}>
                <div><strong>{lesson.title}</strong><p className="mt-1 text-sm text-muted">{lesson.duration}</p></div>
                <Tag>{lesson.type}</Tag>
                <Tag tone={lesson.statusTone}>{lesson.status}</Tag>
                <Button href={lesson.type === "练习" ? "#/class-exam-answer" : "#/course-study"} tone={lesson.status === "学习中" ? "primary" : "secondary"}>
                  {lesson.status === "已学完" ? "复习" : lesson.type === "练习" ? "去练习" : "学习"}
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
            <Button tone="secondary">查看</Button>
          </div>
        ))}
      </div>
    </Card>
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
            <div className="rounded-ui border border-line p-4"><strong>函数图像这道题为什么选 C？</strong><p className="mt-2 text-muted">关联：数学基础强化 / 课堂练习 1</p><Meta><Tag tone="amber">待回复</Tag></Meta></div>
            <div className="rounded-ui border border-line p-4"><strong>数据库 E-R 图怎么判断联系类型？</strong><p className="mt-2 text-muted">老师回复：先看实体之间是一对一、一对多还是多对多。</p><Meta><Tag tone="green">已回复</Tag></Meta></div>
          </div>
        </Card>
        <Card>
          <h3>发起提问</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">关联内容<select className="min-h-10 rounded-ui border border-line px-3"><option>数学基础强化 / 函数概念</option><option>数据库基础 / E-R 模型</option></select></label>
            <label className="grid gap-2">问题内容<textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="请描述你遇到的问题" /></label>
            <Button>提交问题</Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export function WrongBookPage() {
  return (
    <>
      <PageHeader title="错题本" desc="汇总试卷刷题、考试中心考试、班级课堂练习中的错题，第一阶段不做复杂考情分析。" action={<Button href="#/paper-answer">重新练习</Button>} />
      <DataTable
        columns={["错题", "来源", "知识点", "状态", "操作"]}
        rows={wrongQuestions}
        renderRow={(item) => (
          <>
            <div><strong>{item.title}</strong><p className="mt-1 text-xs text-muted">{item.detail}</p></div>
            <span>{item.source}</span><span>{item.point}</span><Tag tone={item.status === "已掌握" ? "green" : "amber"}>{item.status}</Tag><Button tone="ghost">查看解析</Button>
          </>
        )}
      />
    </>
  );
}

export function LearningRecordPage() {
  return (
    <>
      <PageHeader title="学习记录" desc="简单展示学生在哪个课程学了什么、学到哪里、学习时长和完成状态。" />
      <div className="grid gap-3">
        {learningRecords.map((item) => (
          <Card key={item.title} className="grid gap-4 md:grid-cols-[120px_1fr]">
            <time className="text-sm text-muted">{item.time}</time>
            <div><strong>{item.title}</strong><p className="mt-2 leading-7 text-muted">{item.detail}</p><Meta><Tag tone={item.status === "已完成" ? "green" : "amber"}>{item.status}</Tag><Button href="#/course-study" tone="ghost">继续学习</Button></Meta></div>
          </Card>
        ))}
      </div>
    </>
  );
}

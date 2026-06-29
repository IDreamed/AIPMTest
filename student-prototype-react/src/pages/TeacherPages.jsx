import { classCourses, classExams, papers, qaRecords } from "../data/mockData";
import { Button, Card, DataTable, Meta, PageHeader, PrototypeNote, Tag } from "../components/ui";

const teacherMainModules = [
  {
    title: "教学资源",
    desc: "查看学校授权给教师使用的课程、课件、题库和试卷资源，作为组课、出作业和组卷的素材来源。",
    scope: "资源库",
  },
  {
    title: "课程管理",
    desc: "基于教学资源组建班级课程，维护课程目录、课时、课件、课程试卷和课程答疑入口。",
    scope: "组课与派课",
  },
  {
    title: "试卷管理",
    desc: "查看可用试卷，按课程或班级场景选择试卷；正式考试用卷和公开练习试卷需要区分权限。",
    scope: "试卷与组卷",
  },
  {
    title: "班级管理",
    desc: "围绕教师负责的班级处理教学执行，包括我的班级、作业、学生学情和答疑。",
    scope: "班级教学",
  },
];

const resourceRows = [
  { type: "课程资源", source: "学校授权资源库", use: "可用于组课、派课和课程目录维护" },
  { type: "课件资源", source: "课程关联资料", use: "可加入课程课时或作为课程资料展示" },
  { type: "题库资源", source: "学校授权题库", use: "可用于课程练习、作业或组卷" },
  { type: "试卷资源", source: "试卷库", use: "可用于试卷练习、作业或考试组卷" },
];

const classManageModules = [
  { title: "我的班级", desc: "查看教师负责的班级、专业大类、课程安排和学生名单。" },
  { title: "作业", desc: "面向班级布置作业，查看提交状态、批阅结果和作业记录。" },
  { title: "学生学情", desc: "按班级、课程、学生查看学习进度、作业完成和错题情况。" },
  { title: "答疑", desc: "处理学生从课程、课时或学习过程中发起的问题。" },
];

const teacherClasses = [
  { name: "高三计算机冲刺班", category: "电子与信息类", course: "数学基础强化", student: "42 人", role: "任课教师" },
  { name: "高三英语提升班", category: "文化课", course: "英语阅读提分", student: "36 人", role: "任课教师" },
];

function SectionTitle({ title, desc, action }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h2 className="m-0 text-xl">{title}</h2>
        {desc ? <p className="mb-0 mt-2 text-sm leading-6 text-muted">{desc}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function TeacherDashboardPage() {
  return (
    <>
      <PageHeader
        title="教师端"
        desc="教师端承接教学执行类功能，重点处理资源使用、课程建设、试卷管理和班级教学。"
      />
      <PrototypeNote>
        教师端是前台业务端，不等同于学校管理后台。人员、学校、班级基础配置仍由管理后台维护；教师端只展示当前教师有权限操作的教学数据。
      </PrototypeNote>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teacherMainModules.map((item) => (
          <Card className="flex h-full flex-col justify-between gap-4" key={item.title}>
            <div>
              <Meta className="mt-0">
                <Tag tone="blue">{item.scope}</Tag>
              </Meta>
              <h2 className="mb-0 mt-4 text-xl">{item.title}</h2>
              <p className="mb-0 mt-3 leading-7 text-muted">{item.desc}</p>
            </div>
            <Button tone="secondary">进入{item.title}</Button>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <SectionTitle
            title="教学资源"
            desc="教师只能使用学校授权范围内的资源；资源是否可用于考试、作业或课程，由资源类型和授权范围决定。"
            action={<Button tone="secondary">查看资源库</Button>}
          />
          <DataTable
            columns={["资源类型", "数据来源", "教师端用途"]}
            rows={resourceRows}
            renderRow={(item) => (
              <>
                <span>{item.type}</span>
                <span>{item.source}</span>
                <span>{item.use}</span>
              </>
            )}
          />
          <PrototypeNote className="mt-4">
            数据来源：课程资源、课件、题库、试卷库。教师端不展示未授权资源，也不负责学校采购或授权配置。
          </PrototypeNote>
        </Card>

        <Card>
          <SectionTitle title="课程管理" desc="课程管理不是学生课程详情页，而是教师维护课程内容和班级派课的入口。" />
          <div className="grid gap-3">
            {classCourses.slice(0, 4).map((course) => (
              <div className="rounded-ui border border-line p-4" key={course.title}>
                <Meta className="mt-0">
                  <Tag tone={course.statusTone}>{course.status}</Tag>
                  <Tag>{course.subject}</Tag>
                </Meta>
                <strong className="mt-3 block">{course.title}</strong>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">
                  {course.className} · {course.lessonCount} 个课时 · 发布人 {course.publisher}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[420px_1fr]">
        <Card>
          <SectionTitle title="试卷管理" desc="教师可查看可用试卷，并根据场景选择用作练习、作业或考试组卷。" />
          <div className="grid gap-3">
            {papers.filter((paper) => paper.unlocked).slice(0, 4).map((paper) => (
              <div className="rounded-ui border border-line p-4" key={paper.title}>
                <Meta className="mt-0">
                  <Tag>{paper.category}</Tag>
                  <Tag tone="green">{paper.source}</Tag>
                </Meta>
                <strong className="mt-3 block">{paper.title}</strong>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">
                  {paper.questionCount} 题 · {paper.totalScore} 分 · {paper.duration}
                </p>
              </div>
            ))}
          </div>
          <PrototypeNote className="mt-4">
            正式考试创建不能直接复用公开练习权限。若后端考试基于试卷，应区分“公开练习试卷”和“考试专用试卷”或提供单独组卷流程。
          </PrototypeNote>
        </Card>

        <Card>
          <SectionTitle title="班级管理" desc="班级管理是教师端的教学执行区，包含我的班级、作业、学生学情和答疑。" />
          <div className="grid gap-4 md:grid-cols-2">
            {classManageModules.map((item) => (
              <div className="rounded-ui border border-line bg-slate-50 p-4" key={item.title}>
                <h3 className="m-0 text-base">{item.title}</h3>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 mt-0 text-base">我的班级</h3>
              <div className="grid gap-3">
                {teacherClasses.map((item) => (
                  <div className="rounded-ui border border-line p-4" key={item.name}>
                    <strong>{item.name}</strong>
                    <p className="mb-0 mt-2 text-sm leading-6 text-muted">
                      {item.category} · {item.course} · {item.student} · {item.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 mt-0 text-base">作业与答疑</h3>
              <div className="grid gap-3">
                {classExams.slice(0, 2).map((item) => (
                  <div className="rounded-ui border border-line p-4" key={item.title}>
                    <Meta className="mt-0">
                      <Tag tone={item.statusTone}>{item.status}</Tag>
                      <Tag>{item.startAt}</Tag>
                    </Meta>
                    <strong className="mt-3 block">{item.title}</strong>
                  </div>
                ))}
                {qaRecords.slice(0, 1).map((item) => (
                  <div className="rounded-ui border border-line p-4" key={item.id}>
                    <Meta className="mt-0">
                      <Tag tone={item.reply ? "green" : "amber"}>{item.reply ? "已回复" : "待回复"}</Tag>
                      <Tag>{item.course}</Tag>
                    </Meta>
                    <strong className="mt-3 block">{item.question}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <PrototypeNote className="mt-4">
            学生学情数据来自学习记录、作业提交记录、答疑记录和错题记录；这里仅做教师端入口呈现，具体明细页可后续按班级管理子功能展开。
          </PrototypeNote>
        </Card>
      </section>
    </>
  );
}

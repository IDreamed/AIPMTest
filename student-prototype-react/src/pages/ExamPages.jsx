import { useEffect, useState } from "react";
import { categories, cultureSubjects, exams } from "../data/mockData";
import { Button, Card, DataTable, Meta, PageHeader, PrototypeNote, Stat, Tag, usePrototypeRole } from "../components/ui";

export function ExamCenterPage() {
  const { roleKey } = usePrototypeRole();
  const subjectTypes = ["文化课", "专业课"];
  const examTypes = ["全部考试", "公开考试", "学校联考"];
  const examStatuses = ["全部状态", "未开始", "进行中", "已结束"];
  const defaultCategory = categories.find((category) => category.unlocked)?.name || categories[0].name;
  const [selectedSubjectType, setSelectedSubjectType] = useState("文化课");
  const [selectedCultureSubject, setSelectedCultureSubject] = useState(cultureSubjects[0].name);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCultureSubjects, setShowAllCultureSubjects] = useState(false);
  const [selectedType, setSelectedType] = useState("全部考试");
  const [selectedStatus, setSelectedStatus] = useState("全部状态");
  const [keyword, setKeyword] = useState("");
  const isProfessional = selectedSubjectType === "专业课";
  const isStudent = roleKey === "student";
  const availableCategories = isStudent ? categories.filter((category) => category.unlocked) : categories;
  const sortedCategories = [...availableCategories].sort((a, b) => b.papers - a.papers);
  const visibleCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 6);
  const sortedCultureSubjects = [...cultureSubjects].sort((a, b) => b.exams - a.exams);
  const visibleCultureSubjects = showAllCultureSubjects ? sortedCultureSubjects : sortedCultureSubjects.slice(0, 6);
  const filteredExams = exams.filter((exam) => {
    const subjectMatched = isProfessional
      ? exam.subject === "专业课" && exam.category === selectedCategory
      : exam.subject === selectedCultureSubject;
    const typeMatched = selectedType === "全部考试" || exam.type === selectedType;
    const statusMatched = selectedStatus === "全部状态" || exam.status === selectedStatus;
    const keywordMatched = !keyword.trim() || exam.title.includes(keyword.trim());
    return subjectMatched && typeMatched && statusMatched && keywordMatched;
  });

  useEffect(() => {
    if (isProfessional && !availableCategories.some((category) => category.name === selectedCategory) && availableCategories[0]) {
      setSelectedCategory(availableCategories[0].name);
    }
  }, [availableCategories, isProfessional, selectedCategory]);

  return (
    <>
      <PageHeader title="考试中心" desc="公开考试与学校联考统一展示，包含进行中、未开始和已结束考试；排行和成绩归属于具体考试。" />
      <PrototypeNote className="mb-5">
        不做报名流程；有权限且考试进行中即可进入考试。交卷才算参加考试，未交卷不生成成绩、答题记录或排行。
      </PrototypeNote>
      <div className="mb-5 flex gap-2 overflow-x-auto rounded-ui border border-line bg-white p-2">
        {subjectTypes.map((subjectType) => (
          <button
            className={`min-h-10 rounded-ui px-5 ${selectedSubjectType === subjectType ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
            key={subjectType}
            onClick={() => setSelectedSubjectType(subjectType)}
            type="button"
          >
            {subjectType}
          </button>
        ))}
      </div>

      {isProfessional ? (
        <Card className="mb-5">
          <div className="grid gap-4">
            <div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 text-xl font-semibold">专业大类</h2>
                  <Tag tone="blue">{availableCategories.length} 个大类</Tag>
                </div>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">选择专业大类后查看对应专业课考试，资源概览只展示各大类配置数量。</p>
              </div>
            </div>

            <div className="rounded-ui border border-line bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <strong>专业大类资源概览</strong>
                {sortedCategories.length > 6 ? (
                  <Button tone="secondary" onClick={() => setShowAllCategories((value) => !value)}>
                    {showAllCategories ? "收起" : "展开全部"}
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCategories.map((category) => (
                  <button
                    className={`flex items-center justify-between gap-3 rounded-ui border bg-white px-3 py-3 text-left transition ${
                      selectedCategory === category.name ? "border-blue-600 text-blue-700" : "border-line hover:bg-slate-50"
                    }`}
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    type="button"
                  >
                    <span className="truncate">{category.name}</span>
                    <strong className="shrink-0 text-sm">{category.papers} 项</strong>
                  </button>
                ))}
              </div>
            </div>

            <PrototypeNote>
              专业大类为后台动态配置；考试中心与试卷中心保持同一套专业课筛选交互。
            </PrototypeNote>
          </div>
        </Card>
      ) : (
        <Card className="mb-5">
          <div className="grid gap-4">
            <div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 text-xl font-semibold">文化课科目</h2>
                  <Tag tone="blue">{cultureSubjects.length} 个科目</Tag>
                </div>
                <p className="mb-0 mt-2 text-sm leading-6 text-muted">选择文化课科目后查看对应考试，资源概览只展示各科目配置数量。</p>
              </div>
            </div>

            <div className="rounded-ui border border-line bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <strong>文化课资源概览</strong>
                {sortedCultureSubjects.length > 6 ? (
                  <Button tone="secondary" onClick={() => setShowAllCultureSubjects((value) => !value)}>
                    {showAllCultureSubjects ? "收起" : "展开全部"}
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCultureSubjects.map((subject) => (
                  <button
                    className={`flex items-center justify-between gap-3 rounded-ui border bg-white px-3 py-3 text-left transition ${
                      selectedCultureSubject === subject.name ? "border-blue-600 text-blue-700" : "border-line hover:bg-slate-50"
                    }`}
                    key={subject.name}
                    onClick={() => setSelectedCultureSubject(subject.name)}
                    type="button"
                  >
                    <span className="truncate">{subject.name}</span>
                    <strong className="shrink-0 text-sm">{subject.exams} 项</strong>
                  </button>
                ))}
              </div>
            </div>

            <PrototypeNote>
              文化课科目由后台动态配置；考试中心与试卷中心保持同一套二级筛选交互。
            </PrototypeNote>
          </div>
        </Card>
      )}

      <div className="mb-5 flex flex-wrap gap-3 rounded-ui border border-line bg-white p-4">
        <select className="min-h-10 rounded-ui border border-line px-3" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          {examTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="min-h-10 rounded-ui border border-line px-3" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
          {examStatuses.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input className="min-h-10 rounded-ui border border-line px-3" placeholder="搜索考试名称" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        <PrototypeNote>
          一级先筛选文化课/专业课；文化课二级筛选展示后台配置的语文、数学、英语，专业课二级筛选展示后台配置的 19 个职教高考大类。
        </PrototypeNote>
      </div>
      <DataTable
        columns={["考试", "考试类型", "科目/大类", "时间", "参加状态", "操作"]}
        gridTemplateColumns="minmax(260px,2fr) 110px 120px 170px 120px 170px"
        rows={filteredExams}
        renderRow={(exam) => (
          <>
            <div><strong>{exam.title}</strong><p className="mt-1 text-xs text-muted">{exam.summary}</p></div>
            <Tag tone={exam.type === "学校联考" ? "blue" : "cyan"}>{exam.type}</Tag>
            <span>{exam.subject === "专业课" ? exam.category : exam.subject}</span><span>{exam.time}</span>
            <ExamParticipation exam={exam} roleKey={roleKey} />
            <ExamAction exam={exam} roleKey={roleKey} />
          </>
        )}
      />
    </>
  );
}

function hasExamPermission(exam, roleKey) {
  if (exam.permission === "registered") return roleKey !== "visitor";
  if (exam.permission === "student") return roleKey === "student";
  return false;
}

function getExamParticipation(exam, roleKey) {
  const statusTone = {
    无权限: "gray",
    待开始: "amber",
    未开始: "amber",
    可参加: "green",
    已交卷: "green",
    查看成绩: "green",
    未参加: "gray",
  };

  if (!hasExamPermission(exam, roleKey)) return { label: "无权限", tone: "gray" };
  const configuredStatus = exam.participationStatus?.[roleKey];
  if (configuredStatus) return { label: configuredStatus, tone: statusTone[configuredStatus] || "gray" };
  if (exam.status === "未开始") return { label: "未开始", tone: "amber" };
  if (exam.status === "进行中") return { label: "可参加", tone: "green" };
  if (exam.submitted) return { label: "已交卷", tone: "green" };
  return { label: "未参加", tone: "gray" };
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

  if (exam.status === "进行中") {
    return (
      <div className="flex justify-end gap-2 whitespace-nowrap">
        <Button href={detailHref} tone="secondary">查看详情</Button>
        <Button href="#/exam-answer">进入考试</Button>
      </div>
    );
  }

  if (exam.status === "已结束" && exam.submitted) {
    return <div className="flex justify-end whitespace-nowrap"><Button href={detailHref} tone="secondary">查看成绩</Button></div>;
  }

  return <div className="flex justify-end whitespace-nowrap"><Button href={detailHref} tone="secondary">查看详情</Button></div>;
}

export function ExamDetailPage() {
  const { roleKey } = usePrototypeRole();
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const exam = exams.find((item) => item.id === params.get("id")) || exams[1];
  const permitted = hasExamPermission(exam, roleKey);
  const participation = getExamParticipation(exam, roleKey);
  const canEnter = permitted && exam.status === "进行中";
  const canSeeResult = permitted && exam.status === "已结束" && exam.submitted;
  const isSchoolExam = exam.type === "学校联考";
  const ranks = [
    ["1", "李同学", "示范中职学校", "296", "已出分"],
    ["2", "王同学", "东方职业学校", "291", "已出分"],
    ["12", "我", "示范中职学校", "286", "我的成绩"],
  ];
  return (
    <>
      <PageHeader title={exam.title} desc="用于展示考试时间、参与范围、权限状态、富文本介绍、排名规则和参加入口。" action={canEnter ? <Button href="#/exam-answer">进入考试</Button> : null} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="考试类型" value={exam.type === "学校联考" ? "联考" : "公开"} />
        <Stat label="科目" value={exam.subject === "专业课" ? exam.category : exam.subject} />
        <Stat label="状态" value={exam.status} />
        <Stat label="参加状态" value={participation.label} />
      </div>
      <Card className="mt-6 leading-8 text-slate-700">
        <h2 className="m-0 mb-3 text-xl text-ink">考试介绍</h2>
        <p>{isSchoolExam ? "本场学校联考面向已授权学校及指定班级开放，考试内容覆盖文化课基础能力与专业核心知识点，用于统一检验阶段性教学效果。" : "本场公开考试面向注册用户开放，用于学生体验平台正式考试流程并完成阶段性自测。"}</p>
        <h3 className="mb-2 mt-4 text-lg text-ink">考试目标</h3>
        <ul className="ml-5 list-disc">
          <li>检验学生对职教高考重点知识点的掌握情况。</li>
          {isSchoolExam ? <li>帮助学校对比班级、学校及个人在联考中的表现。</li> : <li>帮助学生了解自己的阶段性学习水平。</li>}
          <li>为后续课程安排、刷题训练和答疑辅导提供参考。</li>
        </ul>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><h3>考试规则</h3><p className="leading-7 text-muted">考试须在规定时间内一次完成，交卷后生成记录。</p><Meta>{exam.rankEnabled ? <Tag tone="blue">开启排行</Tag> : <Tag>不展示排行</Tag>}{isSchoolExam ? <Tag>统一考试</Tag> : <Tag>公开考试</Tag>}</Meta><PrototypeNote className="mt-3">正式考试不保存题目进度，不支持中途退出后继续；交卷才算参加考试。</PrototypeNote></Card>
        <Card><h3>权限状态</h3><p className="leading-7 text-muted">{permitted ? "有参加权限" : "暂无参加权限"}</p><Meta><Tag tone={permitted ? "green" : "amber"}>{permitted ? "有权限" : "无权限"}</Tag><Tag tone={participation.tone}>{participation.label}</Tag></Meta><PrototypeNote className="mt-3">{isSchoolExam ? "学校联考仅授权班级学生可参加。" : "公开考试对注册用户和班级学生开放，游客需先登录。"}</PrototypeNote></Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card><h3>我的成绩</h3><p className="leading-7 text-muted">{canSeeResult ? `总分 ${exam.score}` : participation.label}</p><Meta><Tag tone={canSeeResult ? "green" : "gray"}>{canSeeResult ? "已出分" : participation.label}</Tag></Meta><PrototypeNote className="mt-3">交卷后才生成成绩；未交卷或未参加不展示成绩。</PrototypeNote></Card>
        <Card><h3>我的答题</h3><p className="leading-7 text-muted">{canSeeResult ? "已生成答题记录" : "暂无记录"}</p><Meta>{canSeeResult ? <Button href="#/exam-answer" tone="ghost">查看答题记录</Button> : <Tag tone="gray">无记录</Tag>}</Meta><PrototypeNote className="mt-3">答题记录只对已交卷学生开放。</PrototypeNote></Card>
        <Card><h3>本场排行</h3><p className="leading-7 text-muted">{canSeeResult && exam.rankEnabled ? "个人第 12，学校第 3" : "暂无排行"}</p><Meta><Tag tone={canSeeResult && exam.rankEnabled ? "blue" : "gray"}>{exam.rankEnabled ? "开启排行" : "未开启排行"}</Tag></Meta><PrototypeNote className="mt-3">排行归属于具体考试；未交卷或未开启排行时不展示。</PrototypeNote></Card>
      </div>
      {exam.rankEnabled ? <section className="mt-8">
        <PageHeader title="单场考试排行" desc="考试中心不单独展示全局排行，排行进入具体考试后查看。" />
        {canSeeResult ? (
          <DataTable
            columns={["排名", "考生", "学校", "成绩", "状态"]}
            rows={ranks}
            renderRow={(row) => (
              <>
                <strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><Tag tone={row[4] === "我的成绩" ? "blue" : "green"}>{row[4]}</Tag>
              </>
            )}
          />
        ) : (
          <Card><p className="leading-7 text-muted">暂无排行</p><PrototypeNote className="mt-3">已交卷且考试开启排行后，才展示单场考试排行。</PrototypeNote></Card>
        )}
      </section> : null}
    </>
  );
}

export function ExamAnswerPage() {
  return (
    <>
      <PageHeader title="考试答题页" desc="考试中心进入，强调倒计时、交卷确认和考试结束状态。" action={<Button tone="warning">交卷</Button>} />
      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        <Card className="min-h-[420px]">
          <Meta><Tag>单选题</Tag><Tag>第 8 / 60 题</Tag><Tag tone="red">剩余 01:12:36</Tag></Meta>
          <h2 className="mt-6 text-xl">在数据库设计中，用于描述实体之间关系的模型通常称为？</h2>
          <div className="mt-5 grid gap-3">
            {["A. E-R 模型", "B. 线性模型", "C. 物理模型", "D. 编译模型"].map((item) => (
              <label key={item} className="flex gap-3 rounded-ui border border-line p-4"><input type="radio" name="q8" />{item}</label>
            ))}
          </div>
          <Meta><Button tone="secondary">上一题</Button><Button>下一题</Button><Button tone="warning">交卷</Button></Meta>
        </Card>
        <Card>
          <h3>题号导航</h3>
          <p className="leading-7 text-muted">已答 24 题，未答 36 题。</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, index) => <span key={index} className={`grid h-9 place-items-center rounded-ui border ${index < 4 ? "border-green-600 bg-green-600 text-white" : index === 7 ? "border-blue-600 bg-blue-50 text-blue-600" : "border-line"}`}>{index + 1}</span>)}
          </div>
          <PrototypeNote className="mt-4">正式考试不保存题目进度，必须在本次考试时间内一次完成；交卷才算参加考试。</PrototypeNote>
        </Card>
      </div>
    </>
  );
}

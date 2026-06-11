import { useMemo, useState } from "react";
import { courseMaterials, coursePapers, homeBanners, news, recommendedCourses } from "../data/mockData";
import { Button, Card, Meta, Modal, PageHeader, PrototypeNote, Tag, usePrototypeRole } from "../components/ui";

const newsCategories = ["全部", "政策解读", "考试通知", "平台公告", "备考指南"];

const previewLessons = [
  { title: "函数概念与表示", duration: "试看 10 分钟" },
  { title: "函数图像与性质", duration: "试看 10 分钟" },
  { title: "数列基础入门", duration: "试看 8 分钟" },
  { title: "立体几何高频题型", duration: "未开放试看" },
];

export function HomePage() {
  const { requestStudentAreaAccess } = usePrototypeRole();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeNews, setActiveNews] = useState(null);
  const banner = homeBanners[activeBanner] || homeBanners[0];
  const entryCards = [
    { title: "学习中心", desc: "进入课程、试卷题库、班级测试、学习记录和错题本。", href: "#/learning", tone: "from-blue-600 to-cyan-600" },
    { title: "考试中心", desc: "查看当前可以参加的考试，以及已经参加过的考试记录。", href: "#/exams", tone: "from-rose-600 to-orange-500" },
  ];

  function showPrevBanner() {
    setActiveBanner((index) => (index - 1 + homeBanners.length) % homeBanners.length);
  }

  function showNextBanner() {
    setActiveBanner((index) => (index + 1) % homeBanners.length);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-ui border border-line bg-white shadow-panel">
        <img
          alt=""
          className="h-[260px] w-full object-cover md:h-[420px]"
          src={banner.image}
        />
        {homeBanners.length > 1 ? (
          <>
            <button
              aria-label="上一张"
              className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/80 text-xl text-slate-800 shadow-panel hover:bg-white"
              onClick={showPrevBanner}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="下一张"
              className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/80 text-xl text-slate-800 shadow-panel hover:bg-white"
              onClick={showNextBanner}
              type="button"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {homeBanners.map((item, index) => (
                <button
                  aria-label={`第 ${index + 1} 张`}
                  className={`h-2.5 rounded-full transition-all ${index === activeBanner ? "w-8 bg-white" : "w-2.5 bg-white/60"}`}
                  key={item.image}
                  onClick={() => setActiveBanner(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        {entryCards.map((item) => (
          <a
            className="group overflow-hidden rounded-ui border border-line bg-white p-5 shadow-panel transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
            href={item.href}
            key={item.title}
            onClick={(event) => {
              if (!requestStudentAreaAccess()) event.preventDefault();
            }}
          >
            <span className={`mb-4 block h-1.5 rounded-full bg-gradient-to-r ${item.tone}`} />
            <strong className="text-xl text-slate-900">{item.title}</strong>
            <p className="mb-0 mt-3 min-h-[52px] leading-7 text-muted">{item.desc}</p>
          </a>
        ))}
        <PrototypeNote className="md:col-span-2">首页轮播由后台配置，当前 mock 只保留图片地址和跳转链接；快捷入口复用现有学生功能权限校验。</PrototypeNote>
      </section>

      <section className="mt-9">
        <PageHeader title="推荐课程" desc="首页推荐课程由平台运营配置，当前按视频试看课程处理；可配置试看课时和试看时长，不等同于班级课程。" />
        <div className="grid grid-cols-4 gap-4">
          {recommendedCourses.slice(0, 12).map((course) => (
            <a
              href="#/course-preview"
              key={course.title}
              className="group flex flex-col overflow-hidden rounded-ui border border-line bg-white shadow-panel transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden text-white" style={{ background: course.accent }}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,.1),rgba(15,23,42,.38))]" />
                <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-white/20" />
                <div className="absolute -right-2 bottom-4 h-24 w-16 rounded-t-full bg-white/30" />
                <div className="relative grid h-full place-items-center p-4 text-center">
                  <strong className="text-xl leading-7">{course.title}</strong>
                </div>
              </div>
              <div className="grid flex-1 gap-3 p-4">
                <h3 className="m-0 text-base font-semibold leading-6 text-slate-900">{course.title}</h3>
                <div className="grid gap-2 text-sm leading-6 text-muted">
                  <span>{course.subject} · {course.lessonCount} 课时</span>
                  <span>创建人：{course.creator}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-9">
        <PageHeader title="资讯中心" desc="首页展示最新资讯摘要，点击查看后以富文本弹窗方式模拟资讯详情；完整列表进入资讯中心。" action={<Button href="#/news" tone="ghost">查看更多资讯</Button>} />
        <Card>
          {news.slice(0, 3).map((item) => (
            <div key={item.id} className="flex flex-col justify-between gap-4 border-b border-line py-4 last:border-0 md:flex-row md:items-center">
              <div>
                <Meta><Tag tone="cyan">{item.type}</Tag><Tag>{item.date}</Tag></Meta>
                <strong className="mt-3 block">{item.title}</strong>
                <p className="mt-1 text-muted">{item.summary}</p>
              </div>
              <Button tone="secondary" onClick={() => setActiveNews(item)}>查看</Button>
            </div>
          ))}
        </Card>
      </section>

      <Modal open={!!activeNews} title={activeNews?.title} onClose={() => setActiveNews(null)}>
        <NewsRichText item={activeNews} />
      </Modal>
    </>
  );
}

export function NewsPage() {
  const [activeType, setActiveType] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [activeNews, setActiveNews] = useState(null);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchType = activeType === "全部" || item.type === activeType;
      const matchKeyword = !keyword.trim() || item.title.includes(keyword.trim()) || item.summary.includes(keyword.trim());
      return matchType && matchKeyword;
    });
  }, [activeType, keyword]);

  return (
    <>
      <PageHeader title="资讯中心" desc="资讯类型为固定枚举，不提供动态类型管理；考试通知只作为信息发布，不替代考试中心流程。" />
      <div className="mb-5 grid gap-3 rounded-ui border border-line bg-white p-4 md:grid-cols-[1fr_260px] md:items-center">
        <div className="flex flex-wrap gap-2">
          {newsCategories.map((type) => (
            <button
              className={`min-h-10 rounded-ui border px-4 ${activeType === type ? "border-blue-600 bg-blue-50 text-blue-600" : "border-line bg-white text-slate-700 hover:bg-slate-50"}`}
              key={type}
              onClick={() => setActiveType(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
        <input
          className="min-h-10 rounded-ui border border-line px-3"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索资讯标题"
          value={keyword}
        />
      </div>
      <div className="grid gap-4">
        {filteredNews.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <Meta><Tag tone="cyan">{item.type}</Tag><Tag>{item.date}</Tag></Meta>
                <h3 className="mb-2 mt-4 text-lg">{item.title}</h3>
                <p className="leading-7 text-muted">{item.summary}</p>
              </div>
              <Button tone="secondary" onClick={() => setActiveNews(item)}>查看详情</Button>
            </div>
          </Card>
        ))}
        {filteredNews.length === 0 ? <Card><p className="m-0 text-muted">暂无符合条件的资讯。</p></Card> : null}
      </div>
      <PrototypeNote className="mt-5">资讯详情在当前原型中使用弹窗模拟富文本展示；如果后续资讯内容较长或需要分享链接，再扩展独立详情页。</PrototypeNote>
      <Modal open={!!activeNews} title={activeNews?.title} onClose={() => setActiveNews(null)}>
        <NewsRichText item={activeNews} />
      </Modal>
    </>
  );
}

function NewsRichText({ item }) {
  if (!item) return null;

  return (
    <article className="grid gap-5">
      <Meta><Tag tone="cyan">{item.type}</Tag><Tag>{item.date}</Tag></Meta>
      <p className="m-0 leading-8 text-slate-700">{item.content}</p>
      <section>
        <h4 className="mb-3 mt-0 text-base">重点摘要</h4>
        <ul className="m-0 grid gap-2 pl-5">
          <li>围绕职教高考备考节奏，帮助学生及时了解平台动态和备考信息。</li>
          <li>考试通知类资讯只承担信息发布，参加考试仍进入考试中心完成。</li>
          <li>资讯类型为固定栏目，便于学生快速筛选查看。</li>
        </ul>
      </section>
      <div className="rounded-ui border border-dashed border-line bg-slate-50 p-5 text-center text-sm text-muted">
        相关资料、公告附件和重点说明将在此展示
      </div>
    </article>
  );
}

export function CoursePreviewPage() {
  const { roleKey } = usePrototypeRole();
  const [activeTab, setActiveTab] = useState("detail");
  const [activeLesson, setActiveLesson] = useState(0);
  const tabs = [
    { key: "detail", label: "详情" },
    { key: "papers", label: "试卷" },
    { key: "materials", label: "课件" },
  ];
  const lesson = previewLessons[activeLesson];
  function renderPreviewAction() {
    if (roleKey === "student") return <Button href="#/learning">进入学习中心</Button>;
    if (roleKey === "visitor") return <Button href="#/login">登录/注册</Button>;
    return <Button href="#/profile" tone="ghost">查看认证状态</Button>;
  }

  return (
    <>
      <PageHeader title="数学基础冲刺课" desc="首页推荐课程试看页，当前按视频试看课程处理；不等同于学习中心的班级课程详情页。" action={renderPreviewAction()} />
      <Card className="mb-5">
        <div className="grid gap-5 md:grid-cols-[260px_1fr_160px] md:items-center">
          <div className="grid min-h-[150px] place-items-center rounded-ui bg-[linear-gradient(135deg,#2563eb,#0891b2)] p-5 text-center text-white">
            <strong className="text-xl">数学基础冲刺课</strong>
            <span className="mt-3 text-sm text-white/75">推荐课程</span>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag tone="blue">推荐课程</Tag>
              <Tag>发布人：平台运营</Tag>
              <Tag tone="amber">可试看 3 课时</Tag>
            </div>
            <h2 className="mb-2 mt-5 text-xl">函数、数列与几何高频基础巩固</h2>
            <p className="leading-7 text-muted">围绕职教高考数学基础模块，提供视频试看、课程介绍、绑定试卷和课件资源预览。</p>
            <PrototypeNote className="mt-3">推荐课程没有价格；当前试看课时默认按视频课处理，试看时长只对视频生效。完整多类型课时学习放在学习中心课程详情页处理。</PrototypeNote>
          </div>
          <Button href="#/course-preview">开始试看</Button>
        </div>
      </Card>

      <div className="mb-5 grid gap-5 md:grid-cols-[1fr_320px]">
        <Card className="grid min-h-[340px] place-items-center bg-slate-900 p-8 text-center text-white">
          <div>
            <h2 className="mb-3 mt-0 text-2xl">{lesson.title}</h2>
            <p className="text-white/70">{lesson.duration}</p>
          </div>
        </Card>
        <Card>
          <h3 className="m-0 text-lg">视频试看课时</h3>
          <div className="mt-4 grid gap-2">
            {previewLessons.map((item, index) => (
              <button
                className={`flex items-center justify-between gap-3 rounded-ui border px-3 py-3 text-left ${
                  index === activeLesson ? "border-blue-600 bg-blue-50 text-blue-700" : "border-line bg-white hover:bg-slate-50"
                }`}
                key={item.title}
                onClick={() => setActiveLesson(index)}
                type="button"
              >
                <span>
                  <strong className="block">{item.title}</strong>
                  <span className="mt-1 block text-xs text-muted">{item.duration}</span>
                </span>
                <Tag tone={index < 3 ? "blue" : "gray"}>{index < 3 ? "可试看" : "需开通"}</Tag>
              </button>
            ))}
          </div>
          <Meta>{renderPreviewAction()}</Meta>
        </Card>
      </div>

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

      {activeTab === "detail" ? (
        <Card>
          <h3 className="m-0 text-lg">课程介绍</h3>
          <p className="mt-4 leading-8 text-slate-700">本课程面向需要快速补齐数学基础的学生，按高频知识点组织视频讲解、课件和练习，帮助学生先体验平台课程学习方式。</p>
        </Card>
      ) : null}
      {activeTab === "papers" ? (
        <div className="grid gap-4">
          {coursePapers.map((paper) => (
            <Card key={paper.title}>
              <h3 className="m-0 text-lg">{paper.title}</h3>
              <Meta><Tag>{paper.meta}</Tag><Tag tone="gray">需开通</Tag></Meta>
            </Card>
          ))}
          <PrototypeNote>推荐课程中的试卷用于展示课程绑定练习结构，不等同于考试中心，也不等同于班级测试。</PrototypeNote>
        </div>
      ) : null}
      {activeTab === "materials" ? (
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
      ) : null}
    </>
  );
}

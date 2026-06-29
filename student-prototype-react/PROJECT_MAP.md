# PROJECT_MAP

> 用途：学生端前端原型的跨对话协作索引。新对话优先读取本文件，再决定是否读取具体源码。
> 原则：本文只记录当前实现、产品边界和定位信息，不记录过程性讨论。

---

## 1. 项目概况

- 项目名称：职教高考轻量化教考系统学生端前端交互原型
- 项目路径：`H:\Document\projects\student-prototype-react`
- 工作区路径：`H:\Document\projects`
- Git 位置：`H:\Document\projects\student-prototype-react\.git`
- 技术栈：React + Tailwind + Vite
- 路由方式：Hash 路由，不使用 `react-router`
- 原型目标：用于客户演示的可交互学生端原型，不追求上线代码，但需要多轮可控修改。

---

## 2. 协作规则

- 用户明确要求实现时，直接修改并验证；用户只讨论方案时不抢先改代码。
- 前端改动完成后优先执行 `npm.cmd run build` 验证。
- 改完说明修改结果、关键影响和验证结果。
- 页面以真实业务场景构建，不把开发说明或产品解释当作页面正文。
- 与界面无关的业务说明放到 `PrototypeNote`；标注由全局独立覆盖层展示，不参与页面布局。
- 学生可见提示按真实使用场景表达，说明当前结果和下一步操作，不出现原型、验证、样例、占位符或后续扩展等研发文案。
- 身份切换和标注按钮是原型展示控件，当前收纳在右上角 `场景预览` 浮层，不进入顶部主导航。
- 预览身份包含游客、认证审核中、认证未通过、班级学生和教师。
- 教师身份默认不加入学生班级，不能进入学生学习和考试功能；顶部主菜单额外显示“教师端”，跳转 `#/teacher`。
- 指定页面修改时，优先按本文定位目标文件；只有全局一致性调整时才做全局搜索。

---

## 3. 文件结构

```text
student-prototype-react/
├─ src/
│  ├─ App.jsx
│  ├─ components/
│  │  ├─ examWorkflows.jsx
│  │  └─ ui.jsx
│  ├─ data/
│  │  └─ mockData.js
│  └─ pages/
│     ├─ HomePages.jsx
│     ├─ PaperPages.jsx
│     ├─ ExamPages.jsx
│     ├─ AdminPages.jsx
│     ├─ LearningPages.jsx
│     ├─ ProfilePages.jsx
│     ├─ TeacherPages.jsx
│     └─ ServicePages.jsx
├─ DESIGN_SYSTEM.md
├─ 交接.md
```

### 文件职责

- `src/App.jsx`
  - Hash 路由表。
  - 页面组件入口映射。

- `src/components/ui.jsx`
  - 全局原型壳层与通用 UI。
  - 包含：`AppShell`、`usePrototypeRole`、`PrototypeNote`、`PageHeader`、`Card`、`Button`、`Tag`、`Meta`、`DataTable`、`Pagination`、`Modal`、`SchoolApplyModal`、`Stat`。
  - 包含列表型页面通用组件：`ListPageFrame`、`FilterPanel`、`FilterTagRow`、`FilterChip`、`ListDivider`、`ListToolbar`、`SelectControl`、`TextControl`、`SearchControl`、`AdminDataTable`、`AdminPagination`。
  - `DataTable` 支持自定义列宽。
  - 顶部右侧账号入口：游客显示头像占位和登录/注册；登录后显示头像、用户名和下拉菜单。
  - 登录后账号下拉包含：个人中心、退出登录。
  - 顶部主导航不展示个人中心；个人中心入口只通过账号下拉进入。
  - `场景预览` 浮层在右上角，包含身份切换和标注开关。
  - 标注开启后，页面中的 `PrototypeNote` 以编号浮点锚定对应元素，点击或悬停展开说明；标注层独立于业务界面，不撑开页面间距。
  - 需求标注优先说明数据来源、权限、字段含义和计算方式；接口不明确时使用“待开发确认”。
  - 全局拦截未登录/未入校用户进入学习中心、试卷练习、考试中心等学生功能区，按身份提示登录/注册或进入个人中心。
  - `SchoolApplyModal` 仅用于个人中心中再次申请入校，不再作为独立申请加入学校入口。

- `src/components/examWorkflows.jsx`
  - 共享考试/测试答题与解析组件。
  - 包含：考试题组 mock、题目状态样式、题号导航、题号状态图例、题型输入组件、题组标准化工具。
  - 正式考试、作业答题和作业解析复用该文件的题号导航与答题组件。

- `src/data/mockData.js`
  - 全部 mock 数据。
  - 包含导航、资讯、推荐课程、文化课科目、专业大类、试卷、考试、当前班级、作业、课程、课时目录、课程试卷、课件、试卷练习记录、答疑记录、学习记录、错题等。

- `src/pages/HomePages.jsx`
  - 首页、资讯中心、推荐课程试看页。

- `src/pages/PaperPages.jsx`
  - 试卷练习、试卷答题页、试卷解析页。

- `src/pages/ExamPages.jsx`
  - 考试中心、考试记录、考试详情、正式考试答题页、考试成绩与解析页、考试排行页。

- `src/pages/AdminPages.jsx`
  - 平台运营后台。
  - 包含：后台首页、平台资讯管理、资讯新建、资讯编辑、资讯预览、首页推荐课程管理。

- `src/pages/LearningPages.jsx`
  - 学习中心、班级档案、班级课程、作业、作业安排、作业答题、作业解析、课程学习详情、课时播放、课件预览、试卷练习记录、班级答疑、答疑详情、错题本、错题解析、错题练习、学习记录。

- `src/pages/ProfilePages.jsx`
  - 个人中心、登录/注册。
- `src/pages/TeacherPages.jsx`
  - 教师端前台功能页。
  - 一级功能包含：教学资源、课程管理、试卷管理、班级管理。
  - 班级管理下包含：我的班级、作业、学生学情、答疑。
- `src/pages/ServicePages.jsx`
  - 报考指南、虚拟实训占位页面。

- `交接.md`
  - 离职交接文档。
  - 记录项目运行方式、业务范围、关键规则、当前未提交变更、风险和接手建议。

- `DESIGN_SYSTEM.md`
  - 设计规范文档。
  - 固定页面骨架、间距、字号、色彩、表单控件、表格和分页规范。
  - 后续列表型页面改造优先按该规范和 `src/components/ui.jsx` 的通用组件落地。

---

## 4. 路由映射

```text
公开访问区
#/                  HomePages.jsx / HomePage
#/news              HomePages.jsx / NewsPage
#/course-preview    HomePages.jsx / CoursePreviewPage
#/application-guide ServicePages.jsx / ApplicationGuidePage
#/virtual-training  ServicePages.jsx / VirtualTrainingPage

考试区
#/exams             ExamPages.jsx / ExamCenterPage
#/my-exams          ExamPages.jsx / MyExamsPage
#/exam-detail       ExamPages.jsx / ExamDetailPage
#/exam-answer       ExamPages.jsx / ExamAnswerPage
#/exam-analysis     ExamPages.jsx / ExamAnalysisPage
#/exam-rank         ExamPages.jsx / ExamRankPage
#/papers            LearningPages.jsx / PaperPracticePage
#/paper-answer      PaperPages.jsx / PaperAnswerPage
#/paper-analysis    PaperPages.jsx / PaperAnalysisPage
#/wrong-book        LearningPages.jsx / WrongBookPage
#/wrong-question    LearningPages.jsx / WrongQuestionPage
#/wrong-practice    LearningPages.jsx / WrongPracticePage

学习中心区
#/learning          LearningPages.jsx / LearningCenterPage
#/class-detail      LearningPages.jsx / ClassDetailPage
#/class-courses     LearningPages.jsx / ClassCoursesPage
#/course-study      LearningPages.jsx / CourseStudyPage
#/course-lesson     LearningPages.jsx / CourseLessonPage
#/course-material   LearningPages.jsx / CourseMaterialPage
#/class-exam        LearningPages.jsx / ClassExamPage
#/class-exam-detail LearningPages.jsx / ClassExamDetailPage
#/class-exam-answer LearningPages.jsx / ClassExamAnswerPage
#/class-exam-analysis LearningPages.jsx / ClassExamAnalysisPage
#/qa                LearningPages.jsx / QAPage
#/qa-detail         LearningPages.jsx / QADetailPage
#/wrong-book        LearningPages.jsx / WrongBookPage
#/wrong-question    LearningPages.jsx / WrongQuestionPage
#/wrong-practice    LearningPages.jsx / WrongPracticePage
#/learning-record   LearningPages.jsx / LearningRecordPage

账号与权限区
#/profile           ProfilePages.jsx / ProfilePage
#/login             ProfilePages.jsx / LoginPage
#/teacher           TeacherPages.jsx / TeacherDashboardPage

运营后台区
#/admin                       AdminPages.jsx / AdminDashboardPage
#/admin/news                  AdminPages.jsx / AdminNewsPage
#/admin/news/new              AdminPages.jsx / AdminNewsCreatePage
#/admin/news/edit             AdminPages.jsx / AdminNewsEditPage
#/admin/news/preview          AdminPages.jsx / AdminNewsPreviewPage
#/admin/recommend-courses     AdminPages.jsx / AdminRecommendCoursesPage
```

`#/admin` 及其子路由不套用学生端 `AppShell`。

---

## 5. 当前页面能力

### 首页与公开访问

- 首页 `#/` 是公开访问页。
- 首页包含后台轮播图、学习中心/考试中心/报考指南/虚拟实训快捷入口、推荐课程、资讯摘要。
- 首页轮播由后台配置，当前 mock 数据保留图片和跳转链接字段；前端轮播只做图片展示，不触发跳转。
- 首页入口卡片为：学习中心、考试中心、报考指南、虚拟实训。
- 学习中心、考试中心和虚拟实训入口统一校验学生身份：
  - 游客点击提示登录/注册。
  - 已注册但未认证通过或认证未通过用户提示未加入学校，并引导进入个人中心。
  - 已入校学生进入对应中心。
- 报考指南为公开访问模块，不要求登录或入校认证。
- 报考指南和虚拟实训当前使用占位页面，后续根据业务内容继续完善。
- 推荐课程为后台运营配置，当前按视频试看处理。
- 推荐课程在首页展示为 4 列 x 3 行平铺卡片，当前 mock 共 12 条。
- 推荐课程卡片为上图下信息结构：
  - 课程题目
  - 科目 + 课时数，同一行展示，如 `英语 · 10 课时`
  - 发布人
- 推荐课程卡片不展示课程简介；简介类内容只进入推荐课程试看页的“介绍”页签。
- 推荐课程卡片点击统一进入 `#/course-preview`。
- 推荐课程试看页只处理视频试看课时列表，不复用学习中心完整课程详情；未入校用户按当前身份引导登录或进入个人中心。
- 推荐课程试看页页签为：介绍、试卷、课件；课程标题下不展示简短介绍。
- 资讯中心 `#/news` 展示资讯列表，资讯详情用弹窗模拟富文本。
- 资讯类型固定枚举：政策解读、考试通知、平台公告、备考指南。
- 考试通知只作为资讯发布，不替代考试中心参加考试流程。

### 试卷练习

- 试卷练习 `#/papers` 归入考试中心，不再作为学习中心子模块。
- 筛选只保留四项：语文、数学、英语、专业课。
- 专业课默认展示当前学生所在班级/专业已授权的题库资源，不再让学生选择 19 个专业大类。
- 游客和注册用户由全局权限拦截，不能进入试卷练习。
- 班级学生可进入试卷练习并作答有权限的试卷。
- 试卷列表字段：
  - 试卷名称，标题旁展示官方/本校标签。
  - 分类。
  - 年份。
  - 时长。
  - 总题数。
  - 总分。
  - 已做次数。
  - 状态/结果。
  - 操作。
- 已完成试卷在列表中只展示分数，不展示推荐意见。
- 已完成试卷操作：查看解析、重新开始。
- 进行中试卷展示已用时间，操作为继续练习。
- 试卷列表包含分页控件，每页条数可选：10、20、30；切换筛选或每页条数时页码重置为第 1 页。
- 列表操作按钮使用统一小尺寸，已完成试卷的两个操作按钮上下排列，避免超出列表显示区。

### 试卷答题与解析

- 试卷答题页 `#/paper-answer` 支持开始练习、继续练习、重新开始。
- 试卷练习支持中途退出，按钮文案为“保存退出”。
- 试卷答题页展示本次已用时间统计。
- 试卷练习完成后进入 `#/paper-analysis`。
- 试卷结构按真实试卷组织：
  - 一、单选题
  - 二、多选题
  - 三、判断题
  - 四、填空题
  - 五、简答题
  - 六、综合题
- 综合题为一个主题干 + 多个子题。
- 综合题子题仍是常规题型：单选、多选、判断、填空、简答。
- 题号导航按大题分组展示；综合题按主题号分行展示子题。
- 标记本题只属于本次试卷记录，在题号导航和解析页展示，不进入学习中心。
- 题目状态：未答题、已答题、正确、错误、已评分；标记为叠加状态。
- 试卷解析页展示答题总结、得分、正确率、答题用时、完成题量、评估建议、题号导航、单题答案和题目解析。
- 题目解析来自后台富文本，可能包含文字、图片、视频。

### 考试中心

- 考试中心 `#/exams` 只展示当前学生能参加的未开始或进行中考试。
- 模拟考试包含文化课和专业课。
- 未入校或认证未通过用户会被全局权限拦截，不能进入考试中心和考试记录。
- 考试中心筛选只保留四项：语文、数学、英语、专业课。
- 不展示已交卷、评审中、已公示、无权限或未参加考试；已交卷考试进入考试记录。
- “考试记录”作为考试中心下的个人考试页 `#/my-exams`，只展示学生已交卷参加过的考试。
- 考试状态：未开始、进行中、评审中、已公示。
- 学生考试状态：无权限、待开始、可参加、已交卷、未参加、已出分。
- 学生状态由“权限 + 考试状态 + 是否交卷”推导。
- 考试列表展示考试名称、考试类型、科目/大类、考试时间、考试状态、操作。
- 考试列表包含分页控件，每页条数可选：20、30、50；切换科目或每页条数时页码重置为第 1 页。
- 未开始且有权限考试显示“查看详情”，学生状态为“待开始”。
- 进行中且未交卷的有权限考试显示“查看详情 + 开始考试”。
- 考试中心列表按考试状态排序：进行中的考试在上，未开始的考试在下。
- 考试记录只展示学生已交卷参加过的考试，状态展示沿用“考试状态 + 学生状态”。
- 考试记录列表标题只展示考试名称，不展示试卷说明或状态样例后缀。
- 考试记录按钮状态沿用考试流程：进行中已交卷和评审中已交卷只提供查看详情，已公示已出分提供查看成绩、答题解析和排行入口。
- 专业课模拟考试 mock 覆盖以下状态组合：
  - 未开始 + 待开始。
  - 进行中 + 可参加。
  - 进行中 + 已交卷。
  - 评审中 + 已交卷。
  - 评审中 + 未参加。
  - 已公示 + 未参加。
  - 已公示 + 已出分。

### 考试详情

- 考试详情 `#/exam-detail` 展示单场考试信息。
- 页面顺序：
  - 基础状态
  - 考试介绍
  - 权限说明 + 考试时间安排
  - 我的成绩
- 考试介绍是后台富文本配置，靠上展示。
- 考试介绍区域支持文字、图片、视频占位，内容过长时内部滚动。
- 考试时间安排展示开始时间、结束时间、成绩公示时间。
- 权限说明根据当前身份和考试权限展示。
- 我的成绩区展示得分/总分、正确率、答题用时、个人排名。
- `评审中 + 已交卷` 展示“已交卷，成绩评审中”，并提示成绩公示前不能查看成绩、排行和题目解析。
- `已公示 + 已交卷` 才提供成绩与解析、完整排行入口。
- 考试详情不展示题目作答区。
- 考试详情不展开完整排名榜单。

### 考试答题、解析与排行

- 考试答题页 `#/exam-answer` 是正式考试场景。
- 考试必须一次完成。
- 考试页展示倒计时。
- 不保存中途状态。
- 不支持继续考试。
- 不提供保存退出。
- 交卷前使用确认弹窗。
- 交卷才算参加考试。
- 考试答题页使用与试卷答题一致的结构：大题分组、综合题主题干 + 子题、题号导航、标记本题。
- 考试成绩与解析页 `#/exam-analysis` 展示得分/总分、题目状态、单题解析和综合题解析。
- 考试排行页 `#/exam-rank` 独立展示排行。
- 考试排行包含考生排行和学校排行。
- 排行页包含分页控件。
- 每页条数可选：20、30、50。
- 切换排行类型时页码重置为第 1 页。

### 学习中心

- 学习中心 `#/learning` 是登录后的学生课程学习入口。
- 未登录时不展示学习工作台数据，只提示登录/注册。
- 注册但未认证通过或未入校用户由全局权限拦截，提示进入个人中心查看认证或再次申请入校。
- 当前产品规则：一个学生只能加入一个学校；在该学校下只能加入一个班级。
- 学习中心不提供学校/班级切换，直接展示当前班级和所属学校。
- 学习中心默认页是“我的课程”，不是学习任务摘要或综合工作台。
- 学习中心首页采用左侧菜单 + 右侧课程卡片平铺：
  - 左侧展示学生头像占位、姓名、学校、班级。
  - 左侧菜单：我的课程、作业、学习记录。
  - 左侧菜单均展示对应数量统计。
  - 右侧默认展示当前学生被学校/老师安排的课程卡片。
- 学习中心总标题由统一布局展示，所有一级子页保持同一顶部占位，切换时左侧菜单不漂移。
- 学习中心一级子页保持统一布局，均展示同一套左侧学生信息和导航：
  - `#/learning`
  - `#/class-exam`
  - `#/learning-record`
- 我的课程卡片展示：
  - 本校 / 官方标签。
  - 课程名称。
  - 课程状态。
  - 具体科目或专业大类标签，例如语文、数学、英语、电子与信息类。
  - 当前课时。
  - 发布人。
  - 总课时与已学课时。
  - 学习进度。
  - 开始学习 / 继续学习 / 复习课程。
- 我的课程卡片不展示课程简介；简介类内容只进入课程学习详情的“介绍”页签。
- 学习中心首页不再展示“学习任务摘要”“老师安排的学习”等摘要模块。
- 课程试卷、作业、课程资料不作为学习中心首页一级入口，统一放回课程详情或对应模块。
- 考试相关功能不进入学习中心；考试记录、试卷练习和错题本归考试中心。
- 班级课程 `#/class-courses` 仍保留为完整课程列表页，点击进入课程学习详情；列表包含分页控件。
- 试卷练习 `#/papers` 是考试中心下的试卷练习页，承接试卷筛选、答题和解析能力。
- 试卷练习筛选只保留：
  - 语文。
  - 数学。
  - 英语。
  - 专业课。
- 试卷练习列表字段：
  - 试卷名称。
  - 科目。
  - 题目数量。
  - 时长。
  - 总分。
  - 状态。
  - 操作。
- 试卷练习列表上方展示练习试卷、进行中、已完成，不重复展示当前科目。
- 快速练习/随机组卷需求暂不明确，当前试卷练习页不展示快速练习入口。
- 试卷练习列表点击试卷名称进入继续练习或解析。
- 试卷练习列表包含分页控件，当前每页条数可选 10、20、30。
- 试卷练习答题与解析复用已有页面：
  - 未完成/继续练习：`#/paper-answer`
  - 已完成/查看解析：`#/paper-analysis`
- 学习记录是个人学习数据，高于班级，但当前阶段不提供学校/班级筛选。
- 学习记录当前只记录视频和音频课时，不记录普通图文、试卷和考试流水。
- 学习记录列表展示课程封面图占位。
- 班级答疑是一对一留言系统，不做实时聊天。
- 班级答疑入口 `#/qa` 只展示答疑列表和分页，不展示发起提问表单。
- 发起提问放在课程学习详情 `#/course-study` 和课时播放 `#/course-lesson` 的课程/课时上下文中。

### 课程学习、课时与资料

- 课程学习详情 `#/course-study` 展示课程介绍、目录、课程试卷、课件资料和课程答疑。
- 课程中指向内容维护人的字段统一使用“发布人”。
- 课程学习详情页签为：介绍、目录、试卷、课件、答疑；不再使用“详情”命名。
- 课程学习详情标题区不展示课程简介，简介类内容只在“介绍”页签内呈现。
- 班级课程卡片不展示班级信息，因为学生只有一个当前班级。
- 课程目录不直接展示课堂练习；课堂练习归属于具体课时，在课时播放中触发。
- 课程学习详情页包含“发起提问”区域，提问默认关联当前课程，可选择具体课时。
- 课时播放页 `#/course-lesson` 支持多种课时格式：
  - 微课。
  - 慕课。
  - 音频。
  - PDF。
  - PPT。
  - 富文本。
- 课时播放页包含“发起提问”区域，提问默认关联当前课程和当前课时。
- 课程和课时状态统一为：未开始、进行中、已完成。
- 微课、慕课和音频课时展示播放区域、已学习时间、进度、课时练习按钮。
- 非音视频课时（PDF、PPT、富文本）打开查看详情即视为已完成。
- 音视频课时在打开、切换课时、关闭浏览器或播放完成时上报当前播放时间节点。
- 音视频课时进度按上报时间 / 总时长计算；上报时间大于等于课时时长时，课时状态为已完成。
- 课时进度规则属于需求标注，不作为学生可见正文展示。
- 音视频课时可通过“课时练习”打开课堂练习弹窗。
- 课堂练习弹窗一次展示一道题。
- 每题作答后展示参考答案和题目解析。
- 课堂练习支持继续下一题、完成练习或关闭弹窗。
- 课时播放页不展示“保存进度”按钮。
- 课件预览页 `#/course-material` 承接课程资料中的“查看”动作，当前用 PDF/PPT/图片资料预览占位表达。

### 作业

- 作业 `#/class-exam` 是教师面向班级布置的非正式测评任务。
- 作业不作为学习中心首页一级入口；学生主要从学习中心侧栏或课程上下文进入。
- 作业不属于正式考试中心，不进入正式考试筛选、详情、排行体系。
- 作业没有课程分类、专业分类或题型分类。
- 作业列表包含分页控件。
- 作业列表采用卡片式安排结构，字段为：
  - 作业名称。
  - 时长。
  - 总题数。
  - 试卷总分。
  - 开始时间。
  - 剩余时间。
  - 作业状态。
  - 学生状态。
  - 操作。
- 作业状态固定为：
  - 未开始。
  - 进行中。
  - 已结束。
- 作业的学生状态包括：
  - 未开始，默认可不显示。
  - 缺考。
  - 已交卷。
  - 已出分。
- 作业按钮由“作业状态 + 学生状态”共同决定：
  - 进行中 + 未交卷：开始作业。
  - 进行中 + 已交卷：查看记录。
  - 已结束 + 已出分：查看解析。
  - 已结束 + 已交卷：等待出分。
  - 已结束 + 缺考：查看安排。
  - 未开始：查看安排。
- 作业安排页 `#/class-exam-detail` 展示单项作业基础字段和参加入口。
- 作业答题页 `#/class-exam-answer` 复用共享考试答题组件，支持单选、多选、判断、填空、简答、综合题。
- 作业解析页 `#/class-exam-analysis` 复用共享考试题号导航和解析结构。
- 作业保留基础作答、提交、判卷流程，但不做正式考试排行和跨校公示。

### 错题本

- 错题本 `#/wrong-book` 汇总课程、试卷和考试中的错题。
- 错题本归入考试中心子模块，不再放在学习中心侧栏。
- 错题本支持筛选：
  - 科目：全部、语文、数学、英语、当前班级专业大类名称。
  - 题型：全部、单选题、多选题、判断题、填空题、计算题等。
  - 题干 / 课程 / 知识点：输入搜索框。
- 科目和题型筛选采用展开按钮组，不使用下拉框。
- 错题本不提供错题来源筛选。
- 错题本列表字段：
  - 题目预览：截取部分题干，不在预览下方展示额外介绍。
  - 题目类型。
  - 课程 / 知识点。
  - 错题次数。
  - 上次练习。
  - 操作：解析、练习、移除。
- 错题本支持分页，当前每页条数可选 5、10、20。
- 错题本支持单条移除。
- 错题本支持勾选多条后批量移除。
- 错题解析在错题本内以弹窗展示，不再跳转完整解析页。
- 错题解析弹窗展示题型、来源、课程/知识点、题干、参考答案和题目解析。
- 错题练习在错题本内以弹窗展示，只针对当前一道题练习。
- 错题练习选择答案后展示参考答案和题目解析。
- 错题练习答错不重复加入错题本。
- `#/wrong-question` 和 `#/wrong-practice` 路由仍保留为兜底页面，但常规错题本操作优先使用弹窗。

### 班级答疑

- 班级答疑 `#/qa` 展示答疑列表、统计和分页。
- `#/qa` 不展示发起提问表单。
- 学生从答疑列表进入单条答疑记录 `#/qa-detail?id=...`。
- 发起提问入口位于课程学习详情和课时播放页面，面向当前班级老师。
- 课程学习详情中的提问默认关联当前课程，可选择具体课时。
- 课时播放页中的提问默认关联当前课程和当前课时。
- 答疑详情 `#/qa-detail` 展示同一问题下的学生提问、老师回复、待补充说明和继续追问。

### 账号与权限

- 登录/注册：`#/login`
- 个人中心：`#/profile`
- 教师端：`#/teacher`
- 注册时需要选择要加入的学校和目标专业；学校来自平台学校列表，目标专业为 19 个职教高考专业大类。
- 右上角账号入口：
  - 游客：头像占位 + 登录/注册。
  - 注册用户/班级学生：头像 + 用户名，下拉包含个人中心、退出登录。
- 顶部主导航不展示个人中心；个人中心入口只通过登录后的账号下拉进入。
- 个人中心当前结构：
  - 基本信息。
  - 所属学校与审核状态。
  - 账户安全。
- 所属学校状态规则：
  - 没有加入学校：所属学校为“无”，引导进入个人中心处理。
  - 审核中：所属学校为“无”，显示“审核中 + 查看审核”。
  - 已通过：所属学校显示对应学校名称，显示“已认证”。
  - 认证未通过 / 已拒绝：可在个人中心再次申请入校，打开 `SchoolApplyModal`。
- `查看审核` 弹窗展示本次提交审核的信息。
- 再次申请入校弹窗 `SchoolApplyModal`：
  - 字段：要加入的学校、目标专业、申请说明。
  - 学校下拉来自平台学校列表。
  - 目标专业下拉为 19 个职教高考专业大类。
  - 不再提供身份证明图片上传。

### 运营后台

- 教师身份顶部主菜单显示“教师端”，进入 `#/teacher`；运营后台仍只通过 `场景预览` 浮层进入。
- 教师端 `#/teacher` 按后端教学功能前置实现，不展示待办事项统计。
- 教师端一级功能：
  - 教学资源：查看学校授权的课程、课件、题库、试卷资源。
  - 课程管理：组课、维护课程目录、课时、课件、课程试卷和课程答疑入口。
  - 试卷管理：查看可用试卷，区分练习、作业和考试用卷场景。
  - 班级管理：教师负责班级下的我的班级、作业、学生学情、答疑。
- 运营后台不套用学生端导航和身份壳层。
- 平台资讯管理 `#/admin/news`：
  - 资讯不提供封面。
  - 资讯不提供排序，按发布时间倒序展示。
  - 新建、编辑、预览使用独立页面，不使用弹窗。
  - 支持分页。
- 首页推荐课程管理 `#/admin/recommend-courses`：
  - 推荐课程从课程库选择。
  - 课程库选择弹窗只展示已上架课程。
  - 课程库选择弹窗支持分页。
  - 课程模糊搜索范围：课程名称、课程 ID、发布人。
  - 推荐课程列表和课程库选择弹窗中，指向课程维护人的列名统一为“发布人”。
  - 推荐课程最多 12 个。
  - 推荐课程配置试看课时数。
  - 试看时长固定为每课时 5 分钟。
  - 推荐课程列表不展示更新人。
  - 推荐课程排序值越大越靠前。

---

## 6. 状态与数据约定

- 课程状态只使用：未开始、进行中、已完成。
- 课时状态只使用：未开始、进行中、已完成。
- 试卷状态只使用：未开始、进行中、已完成。
- 考试中心模拟考试状态独立于课程/课时/试卷状态，可使用：未开始、进行中、评审中、已公示。
- 作业学生状态独立，可使用：未开始、缺考、已交卷、已出分。
- 答疑状态不单独存枚举，当前由是否存在老师回复推导为未回复/已回复。
- 当前状态字段仍分散在 `src/data/mockData.js` 和页面 helper 中；后续建议抽 `src/constants/status.js` 统一管理枚举、颜色、动作文案和旧状态归一化。
- 不应再新增同义状态，例如：学习中、已学完、待完成。

---

## 7. 常见修改定位

- 改首页宣传文案：`src/pages/HomePages.jsx` / `HomePage`
- 改首页推荐课程卡片：`src/pages/HomePages.jsx` / `HomePage`
- 改报考指南或虚拟实训占位页：`src/pages/ServicePages.jsx`
- 改资讯中心列表或弹窗：`src/pages/HomePages.jsx` / `NewsPage`、`NewsRichText`
- 改推荐课程试看页：`src/pages/HomePages.jsx` / `CoursePreviewPage`
- 改试卷练习筛选、列表：`src/pages/PaperPages.jsx` / `PaperCenterPage`
- 改试卷答题页：`src/pages/PaperPages.jsx` / `PaperAnswerPage`
- 改试卷解析页：`src/pages/PaperPages.jsx` / `PaperAnalysisPage`
- 改考试中心列表、筛选：`src/pages/ExamPages.jsx` / `ExamCenterPage`
- 改考试记录：`src/pages/ExamPages.jsx` / `MyExamsPage`
- 改考试详情：`src/pages/ExamPages.jsx` / `ExamDetailPage`
- 改正式考试答题页：`src/pages/ExamPages.jsx` / `ExamAnswerPage`
- 改考试成绩与解析：`src/pages/ExamPages.jsx` / `ExamAnalysisPage`
- 改考试排行：`src/pages/ExamPages.jsx` / `ExamRankPage`
- 改运营后台首页：`src/pages/AdminPages.jsx` / `AdminDashboardPage`
- 改资讯管理：`src/pages/AdminPages.jsx` / `AdminNewsPage`、`AdminNewsCreatePage`、`AdminNewsEditPage`、`AdminNewsPreviewPage`
- 改首页推荐课程管理：`src/pages/AdminPages.jsx` / `AdminRecommendCoursesPage`
- 改学习中心首页：`src/pages/LearningPages.jsx` / `LearningCenterPage`
- 改班级课程列表：`src/pages/LearningPages.jsx` / `ClassCoursesPage`
- 改课程学习详情：`src/pages/LearningPages.jsx` / `CourseStudyPage`
- 改课程课时播放：`src/pages/LearningPages.jsx` / `CourseLessonPage`
- 改课程资料预览：`src/pages/LearningPages.jsx` / `CourseMaterialPage`
- 改试卷练习记录：`src/pages/LearningPages.jsx` / `PaperPracticePage`
- 改作业：`src/pages/LearningPages.jsx` / `ClassExamPage`
- 改作业安排：`src/pages/LearningPages.jsx` / `ClassExamDetailPage`
- 改作业答题：`src/pages/LearningPages.jsx` / `ClassExamAnswerPage`
- 改作业解析：`src/pages/LearningPages.jsx` / `ClassExamAnalysisPage`
- 改教师端：`src/pages/TeacherPages.jsx` / `TeacherDashboardPage`
- 改班级答疑：`src/pages/LearningPages.jsx` / `QAPage`
- 改答疑详情：`src/pages/LearningPages.jsx` / `QADetailPage`
- 改错题本：`src/pages/LearningPages.jsx` / `WrongBookPage`
- 改错题解析兜底页：`src/pages/LearningPages.jsx` / `WrongQuestionPage`
- 改错题练习兜底页：`src/pages/LearningPages.jsx` / `WrongPracticePage`
- 改学习记录：`src/pages/LearningPages.jsx` / `LearningRecordPage`
- 改考试/测试共享答题组件：`src/components/examWorkflows.jsx`
- 改个人中心：`src/pages/ProfilePages.jsx` / `ProfilePage`
- 改入校申请弹窗：`src/components/ui.jsx` / `SchoolApplyModal`
- 改登录注册：`src/pages/ProfilePages.jsx` / `LoginPage`
- 改 mock 数据：`src/data/mockData.js`
- 改顶部栏、账号入口、场景预览、通用组件：`src/components/ui.jsx`
- 改路由：`src/App.jsx`

---

## 8. 维护提示

- 本文是当前实现索引，不记录历史过程。
- 新增页面后同步更新路由映射和常见修改定位。
- 修改跨模块产品规则后同步更新“当前页面能力”和“状态与数据约定”。
- 删除或重构页面后清理过时说明。
- 指定页面修改时，优先按本文定位文件，避免无必要全局扫描。

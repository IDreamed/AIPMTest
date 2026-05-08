# PROJECT_MAP

> 用途：学生端前端原型的跨对话协作索引。新对话优先读取本文件，再决定是否读取具体源码。
> 原则：本文只记录当前实现、产品边界和定位信息，不记录过程性讨论。

---

## 1. 项目概况

- 项目名称：职教高考轻量化教考系统学生端前端交互原型
- 项目路径：`D:\Document\projects\student-prototype-react`
- 工作区路径：`D:\Document\projects`
- Git 位置：`D:\Document\projects\.git`
- 技术栈：React + Tailwind + Vite
- 路由方式：Hash 路由，不使用 `react-router`
- 原型目标：用于客户演示的可交互学生端原型，不追求上线代码，但需要多轮可控修改。

---

## 2. 协作规则

- 修改前先列修改项，等待用户确认。
- 用户明确说“可以”“开始”“修改”等确认后再改代码。
- 不主动执行 `npm` / `vite` 命令。
- 改完只说明修改结果和关键影响，不附运行命令。
- 页面以真实业务场景构建，不把开发说明或产品解释当作页面正文。
- 与界面无关的业务说明放到 `PrototypeNote`。
- 身份切换和标注按钮是原型展示控件，当前收纳在右上角 `原型控制` 浮层，不进入顶部主导航。
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
│     ├─ LearningPages.jsx
│     └─ ProfilePages.jsx
```

### 文件职责

- `src/App.jsx`
  - Hash 路由表。
  - 页面组件入口映射。

- `src/components/ui.jsx`
  - 全局原型壳层与通用 UI。
  - 包含：`AppShell`、`usePrototypeRole`、`PrototypeNote`、`PageHeader`、`Card`、`Button`、`Tag`、`Meta`、`DataTable`、`Pagination`、`Modal`、`SchoolApplyModal`、`Stat`。
  - `DataTable` 支持自定义列宽。
  - 顶部右侧账号入口：游客显示头像占位和登录/注册；登录后显示头像、用户名和下拉菜单。
  - 登录后账号下拉包含：个人中心、退出登录。
  - 顶部主导航不展示个人中心；个人中心入口只通过账号下拉进入。
  - `原型控制` 浮层在右上角，包含身份切换和标注开关。
  - 全局拦截 `href="#/school-apply"`，打开统一的 `SchoolApplyModal`，不直接跳转页面。

- `src/components/examWorkflows.jsx`
  - 共享考试/测试答题与解析组件。
  - 包含：考试题组 mock、题目状态样式、题号导航、题号状态图例、题型输入组件、题组标准化工具。
  - 正式考试、班级测试答题和班级测试解析复用该文件的题号导航与答题组件。

- `src/data/mockData.js`
  - 全部 mock 数据。
  - 包含导航、资讯、推荐课程、文化课科目、专业大类、试卷、考试、当前班级、班级测试、课程、课时目录、课程试卷、课件、学习记录、错题等。

- `src/pages/HomePages.jsx`
  - 首页、资讯中心、推荐课程试看页。

- `src/pages/PaperPages.jsx`
  - 试卷中心、试卷答题页、试卷解析页。

- `src/pages/ExamPages.jsx`
  - 考试中心、考试详情、正式考试答题页、考试成绩与解析页、考试排行页。

- `src/pages/LearningPages.jsx`
  - 学习中心、我的考试、班级档案、班级课程、班级测试、班级测试安排、班级测试答题、班级测试解析、课程学习详情、课时播放、课件预览、试卷练习、班级答疑、答疑详情、错题本、错题解析、错题练习、学习记录。

- `src/pages/ProfilePages.jsx`
  - 个人中心、入校申请旧路由页、登录/注册。

---

## 4. 路由映射

```text
公开访问区
#/                  HomePages.jsx / HomePage
#/news              HomePages.jsx / NewsPage
#/course-preview    HomePages.jsx / CoursePreviewPage

试卷练习区
#/papers            PaperPages.jsx / PaperCenterPage
#/paper-answer      PaperPages.jsx / PaperAnswerPage
#/paper-analysis    PaperPages.jsx / PaperAnalysisPage

考试区
#/exams             ExamPages.jsx / ExamCenterPage
#/exam-detail       ExamPages.jsx / ExamDetailPage
#/exam-answer       ExamPages.jsx / ExamAnswerPage
#/exam-analysis     ExamPages.jsx / ExamAnalysisPage
#/exam-rank         ExamPages.jsx / ExamRankPage

学习中心区
#/learning          LearningPages.jsx / LearningCenterPage
#/class-detail      LearningPages.jsx / ClassDetailPage
#/class-courses     LearningPages.jsx / ClassCoursesPage
#/course-study      LearningPages.jsx / CourseStudyPage
#/course-lesson     LearningPages.jsx / CourseLessonPage
#/course-material   LearningPages.jsx / CourseMaterialPage
#/paper-practice    LearningPages.jsx / PaperPracticePage
#/my-exams          LearningPages.jsx / MyExamsPage
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
#/school-apply      ProfilePages.jsx / SchoolApplyPage
#/login             ProfilePages.jsx / LoginPage
```

`#/school-apply` 路由仍保留，但常规入口会被 `AppShell` 拦截为全局申请弹窗。

---

## 5. 当前页面能力

### 首页与公开访问

- 首页 `#/` 是公开访问页。
- 首页包含平台宣传、推荐课程、资讯摘要。
- 推荐课程为后台运营配置，当前按视频试看处理。
- 推荐课程在首页展示为 4 列 x 3 行平铺卡片，当前 mock 共 12 条。
- 推荐课程卡片为上图下信息结构：
  - 课程题目
  - 科目 + 课时数，同一行展示，如 `英语 · 10 课时`
  - 创建人
- 推荐课程卡片点击统一进入 `#/course-preview`。
- 推荐课程试看页只处理视频试看课时列表，不复用学习中心完整课程详情。
- 资讯中心 `#/news` 展示资讯列表，资讯详情用弹窗模拟富文本。
- 资讯类型固定枚举：政策解读、考试通知、平台公告、备考指南。
- 考试通知只作为资讯发布，不与考试中心联动。

### 试卷中心

- 试卷中心 `#/papers` 是单独的练习模式。
- 筛选区采用紧凑行式布局：
  - 类型：文化课 / 专业课。
  - 科目或专业：文化课时显示语文、数学、英语；专业课时显示专业大类。
  - 来源：全部 / 官方 / 本校，按钮展开。
  - 分类：全部 / 一轮复习 / 二轮专题 / 三轮冲刺 / 模拟测试 / 真题汇编，按钮展开。
  - 年份：下拉选择，当前 mock 为全部年份、2025、2024、2023。
- 文化课科目和专业大类都按后台动态配置理解。
- 专业课当前 mock：19 个专业大类。
- 游客和注册用户可浏览官方试卷列表，但不能作答。
- 班级学生可浏览官方和本校试卷，并可作答当前班级授权大类下的试卷。
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
- 进行中试卷展示剩余时间，操作为继续刷题。
- 试卷列表包含分页控件，每页条数可选：20、30、50；切换筛选或每页条数时页码重置为第 1 页。
- 列表操作按钮使用统一小尺寸，已完成试卷的两个操作按钮上下排列，避免超出列表显示区。

### 试卷答题与解析

- 试卷答题页 `#/paper-answer` 支持开始刷题、继续刷题、重新开始。
- 试卷练习支持中途退出，按钮文案为“保存退出”。
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

- 考试中心 `#/exams` 展示平台考试，分为公开考试和学校联考。
- 公开考试面向注册用户和班级学生开放。
- 学校联考面向授权学校、授权班级、对应专业大类学生开放。
- 游客可浏览考试概况，但不能参加。
- 注册用户可参加公开考试，不能参加学校联考。
- 考试中心顶部专业筛选已与试卷中心适配：
  - 类型：文化课 / 专业课。
  - 科目或专业：根据类型动态切换。
- 考试中心其它筛选包含：
  - 公开考试 / 学校联考。
  - 考试状态。
  - 关键词。
- 考试中心不再内置“我的考试”筛选；“我的考试”作为学习中心下的独立个人考试页 `#/my-exams`。
- 考试状态：未开始、进行中、评审中、已公示。
- 学生考试状态：无权限、待开始、可参加、已交卷、未参加、已出分。
- 学生状态由“权限 + 考试状态 + 是否交卷”推导。
- 考试列表展示考试名称、考试类型、科目/大类、考试时间、参加状态、操作。
- 考试列表包含分页控件，每页条数可选：20、30、50；切换筛选、关键词或每页条数时页码重置为第 1 页。
- 已公示且已交卷的考试显示“查看详情 + 查看解析”。
- 进行中的有权限考试显示“查看详情 + 进入考试”。

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

- 学习中心 `#/learning` 是登录后的学生工作台。
- 未登录时不展示学习工作台数据，只提示登录/注册。
- 注册用户没有班级学习内容，但可查看公开考试、试卷练习、错题巩固、学习记录和入校申请入口。
- 当前产品规则：一个学生只能加入一个学校；在该学校下只能加入一个班级。
- 学习中心不再提供多学校/多班级下拉切换，直接展示当前学校班级。
- 班级绑定专业大类，专业课试卷权限由当前班级绑定大类决定。
- 学习中心首页只做摘要，不承接全部完整列表。
- 学习中心首页结构：
  - 当前学校班级。
  - 学习任务摘要。
  - 个人学习资产。
- 学习任务摘要按资源来源拆分：
  - 课程学习。
  - 试卷练习。
  - 班级测试。
  - 考试安排。
  - 班级答疑。
- 学习任务摘要各栏目入口按钮放在栏目右上角，作为明显的二级入口。
- 班级课程 `#/class-courses` 展示当前班级分配课程列表，点击进入课程学习详情。
- 试卷练习 `#/paper-practice` 是学习中心下的独立列表页，汇总课程内练习和学生从试卷中心开始过/完成过的试卷。
- 试卷练习答题与解析复用试卷中心已有页面：
  - 未完成/继续练习：`#/paper-answer`
  - 已完成/查看解析：`#/paper-analysis`
- 我的考试 `#/my-exams` 是学习中心下的个人正式考试列表：
  - 游客提示登录。
  - 注册用户展示自己的公开考试。
  - 班级学生展示公开考试和当前班级授权的学校联考。
  - 班级测试不进入我的考试。
- 错题巩固、学习记录是个人学习资产，高于班级，但当前阶段不提供多学校/多班级筛选。
- 学习记录当前只记录视频和音频课时，不记录普通图文、试卷和考试流水。
- 班级答疑是一对一留言系统，不做实时聊天。
- 答疑针对当前班级老师；提问时先选择课程，可选关联课时。
- 注册用户在学习中心点击“查看入校申请”跳转个人中心。

### 课程学习、课时与资料

- 课程学习详情 `#/course-study` 展示课程详情、目录、课程试卷、课件资料。
- 课程详情中的“作者”字段使用“作者：”，不再使用“发布人”。
- 班级课程卡片不展示班级信息，因为学生只有一个当前班级。
- 课程目录不直接展示课堂练习；课堂练习归属于具体课时，在课时播放中触发。
- 课时播放页 `#/course-lesson` 支持多种课时格式：
  - 视频。
  - 音频。
  - PDF。
- 视频和音频课时展示播放区域、进度、课时练习按钮。
- 视频和音频课时可通过“课时练习”或“模拟播放完成”打开课堂练习弹窗。
- 课堂练习弹窗一次展示一道题。
- 每题作答后展示参考答案和题目解析。
- 课堂练习支持继续下一题、完成练习或关闭弹窗。
- 课时播放页不展示“保存进度”按钮。
- 课件预览页 `#/course-material` 承接课程资料中的“查看”动作，当前用 PDF/PPT/图片资料预览占位表达。

### 班级测试

- 班级测试 `#/class-exam` 属于学习中心中的班级内部测试。
- 班级测试不属于考试中心，不进入考试中心筛选、详情、排行体系。
- 班级测试没有课程分类、专业分类或题型分类。
- 班级测试列表采用卡片式考试安排结构，字段为：
  - 测试名称。
  - 时长。
  - 总题数。
  - 试卷总分。
  - 开始时间。
  - 剩余时间。
  - 考试状态。
  - 学生状态。
  - 操作。
- 班级测试的考试状态固定为：
  - 未开始。
  - 进行中。
  - 已结束。
- 班级测试的学生状态包括：
  - 未开始，默认可不显示。
  - 缺考。
  - 已交卷。
  - 已出分。
- 班级测试按钮由“考试状态 + 学生状态”共同决定：
  - 进行中 + 未交卷：开始考试。
  - 进行中 + 已交卷：查看记录。
  - 已结束 + 已出分：查看解析。
  - 已结束 + 已交卷：等待出分。
  - 已结束 + 缺考：查看安排。
  - 未开始：查看安排。
- 班级测试安排页 `#/class-exam-detail` 展示单场测试基础字段和参加入口。
- 班级测试答题页 `#/class-exam-answer` 复用共享考试答题组件，支持单选、多选、判断、填空、简答、综合题。
- 班级测试解析页 `#/class-exam-analysis` 复用共享考试题号导航和解析结构。
- 班级测试保留基础作答、提交、判卷流程，但不做正式考试排行和跨校公示。

### 错题巩固

- 错题巩固 `#/wrong-book` 汇总课程、试卷和考试中的错题。
- 错题本支持筛选：
  - 科目：全部、语文、数学、英语、当前班级专业大类名称。
  - 错题来源：全部、课程、试卷、考试。
  - 知识点：输入搜索框。
- 错题本支持分页，当前每页条数可选 5、10、20。
- 错题本支持单条移除。
- 错题本支持勾选多条后批量移除。
- 错题解析在错题本内以弹窗展示，不再跳转完整解析页。
- 错题解析弹窗只展示单个题目的题目、来源、知识点、参考答案和题目解析。
- 错题练习在错题本内以弹窗展示，只针对当前一道题练习。
- 错题练习选择答案后展示参考答案和题目解析。
- 错题练习答错不重复加入错题本。
- `#/wrong-question` 和 `#/wrong-practice` 路由仍保留为兜底页面，但常规错题本操作优先使用弹窗。

### 班级答疑

- 班级答疑 `#/qa` 展示历史答疑和发起提问。
- 提问面向当前班级老师。
- 提问表单包含关联课程和可选关联课时。
- 答疑详情 `#/qa-detail` 展示同一问题下的学生提问、老师回复和继续追问。

### 账号与权限

- 登录/注册：`#/login`
- 入校申请旧路由：`#/school-apply`
- 个人中心：`#/profile`
- 右上角账号入口：
  - 游客：头像占位 + 登录/注册。
  - 注册用户/班级学生：头像 + 用户名，下拉包含个人中心、退出登录。
- 顶部主导航不展示个人中心；个人中心入口只通过登录后的账号下拉进入。
- 个人中心当前结构：
  - 基本信息。
  - 所属学校与审核状态。
  - 账户安全。
- 所属学校状态规则：
  - 没有加入学校：所属学校为“无”，显示“加入学校”。
  - 审核中：所属学校为“无”，显示“审核中 + 查看审核”。
  - 已通过：所属学校显示对应学校名称，显示“已认证”。
  - 已拒绝：所属学校为“无”，显示“已驳回 + 加入学校”。
- `查看审核` 弹窗展示本次提交审核的信息。
- 全局申请弹窗支持学生身份和教师身份：
  - 学生：姓名、手机号、学校、身份证明图片。
  - 教师：姓名、手机号、学校、职位非必选、职称非必选、身份证明图片。
  - 上传支持 jpg、jpeg、png，文件大小不超过 10MB。

---

## 6. 常见修改定位

- 改首页宣传文案：`src/pages/HomePages.jsx` / `HomePage`
- 改首页推荐课程卡片：`src/pages/HomePages.jsx` / `HomePage`
- 改资讯中心列表或弹窗：`src/pages/HomePages.jsx` / `NewsPage`、`NewsRichText`
- 改推荐课程试看页：`src/pages/HomePages.jsx` / `CoursePreviewPage`
- 改试卷中心筛选、列表：`src/pages/PaperPages.jsx` / `PaperCenterPage`
- 改试卷答题页：`src/pages/PaperPages.jsx` / `PaperAnswerPage`
- 改试卷解析页：`src/pages/PaperPages.jsx` / `PaperAnalysisPage`
- 改考试中心列表、筛选：`src/pages/ExamPages.jsx` / `ExamCenterPage`
- 改考试详情：`src/pages/ExamPages.jsx` / `ExamDetailPage`
- 改正式考试答题页：`src/pages/ExamPages.jsx` / `ExamAnswerPage`
- 改考试成绩与解析：`src/pages/ExamPages.jsx` / `ExamAnalysisPage`
- 改考试排行：`src/pages/ExamPages.jsx` / `ExamRankPage`
- 改学习中心首页：`src/pages/LearningPages.jsx` / `LearningCenterPage`
- 改学习中心我的考试：`src/pages/LearningPages.jsx` / `MyExamsPage`
- 改班级课程列表：`src/pages/LearningPages.jsx` / `ClassCoursesPage`
- 改课程学习详情：`src/pages/LearningPages.jsx` / `CourseStudyPage`
- 改课程课时播放：`src/pages/LearningPages.jsx` / `CourseLessonPage`
- 改课程资料预览：`src/pages/LearningPages.jsx` / `CourseMaterialPage`
- 改试卷练习列表：`src/pages/LearningPages.jsx` / `PaperPracticePage`
- 改班级测试：`src/pages/LearningPages.jsx` / `ClassExamPage`
- 改班级测试安排：`src/pages/LearningPages.jsx` / `ClassExamDetailPage`
- 改班级测试答题：`src/pages/LearningPages.jsx` / `ClassExamAnswerPage`
- 改班级测试解析：`src/pages/LearningPages.jsx` / `ClassExamAnalysisPage`
- 改班级答疑：`src/pages/LearningPages.jsx` / `QAPage`
- 改答疑详情：`src/pages/LearningPages.jsx` / `QADetailPage`
- 改错题巩固：`src/pages/LearningPages.jsx` / `WrongBookPage`
- 改错题解析兜底页：`src/pages/LearningPages.jsx` / `WrongQuestionPage`
- 改错题练习兜底页：`src/pages/LearningPages.jsx` / `WrongPracticePage`
- 改学习记录：`src/pages/LearningPages.jsx` / `LearningRecordPage`
- 改考试/测试共享答题组件：`src/components/examWorkflows.jsx`
- 改个人中心：`src/pages/ProfilePages.jsx` / `ProfilePage`
- 改入校申请弹窗：`src/components/ui.jsx` / `SchoolApplyModal`
- 改登录注册：`src/pages/ProfilePages.jsx` / `LoginPage`
- 改 mock 数据：`src/data/mockData.js`
- 改顶部栏、账号入口、原型控制、通用组件：`src/components/ui.jsx`
- 改路由：`src/App.jsx`

---

## 7. 维护提示

- 本文是当前实现索引，不记录历史过程。
- 新增页面后同步更新路由映射和常见修改定位。
- 修改跨模块产品规则后同步更新“当前页面能力”。
- 删除或重构页面后清理过时说明。
- 指定页面修改时，优先按本文定位文件，避免无必要全局扫描。

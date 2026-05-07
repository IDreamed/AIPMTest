# PROJECT_MAP

> 用途：学生端前端原型的跨对话协作索引。新对话优先读取本文件，再决定是否读取具体源码。
> 原则：本文只记录当前实现、产品边界和定位信息，不记录过程性讨论。

---

## 1. 项目概况

- 项目名称：职教高考轻量化教考系统学生端前端交互原型
- 项目路径：`D:\projects\student-prototype-react`
- 工作区路径：`D:\projects`
- Git 位置：`D:\projects\.git`
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
- 身份切换和标注按钮用于模拟权限与原型说明切换，是原型展示控件；默认收纳在左下角原型控制浮层，不放在顶部主视觉范围。
- 指定页面修改时，优先按本文定位目标文件；只有全局一致性调整时才做全局搜索。

---

## 3. 文件结构

```text
student-prototype-react/
├─ src/
│  ├─ App.jsx
│  ├─ components/
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
  - 包含：`AppShell`、`usePrototypeRole`、`PrototypeNote`、`PageHeader`、`Card`、`Button`、`Tag`、`Meta`、`DataTable`、`Pagination`、`Modal`、`Stat`。
  - `DataTable` 支持自定义列宽。
  - 顶部右侧包含账号入口：未登录显示头像占位和登录/注册；登录后显示头像、用户名和下拉菜单。
  - 身份切换和标注按钮收纳在左下角原型控制浮层，避免干扰顶部导航和业务主视觉。

- `src/data/mockData.js`
  - 全部 mock 数据。
  - 包含导航、资讯、推荐课程、文化课科目、专业大类、试卷、考试、班级、班级测试、课程、课时目录、课程试卷、课件、学习记录、错题等。

- `src/pages/HomePages.jsx`
  - 首页、资讯中心、推荐课程试看页。

- `src/pages/PaperPages.jsx`
  - 试卷中心、试卷答题页、试卷解析页。

- `src/pages/ExamPages.jsx`
  - 考试中心、考试详情、正式考试答题页、考试成绩与解析页、考试排行页。

- `src/pages/LearningPages.jsx`
  - 学习中心、班级档案、班级测试、班级测试答题、课程学习详情、班级答疑、错题本、学习记录。

- `src/pages/ProfilePages.jsx`
  - 个人中心、入校申请、登录/注册。

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
#/course-study      LearningPages.jsx / CourseStudyPage
#/class-exam        LearningPages.jsx / ClassExamPage
#/class-exam-answer LearningPages.jsx / ClassExamAnswerPage
#/qa                LearningPages.jsx / QAPage
#/wrong-book        LearningPages.jsx / WrongBookPage
#/learning-record   LearningPages.jsx / LearningRecordPage

账号与权限区
#/profile           ProfilePages.jsx / ProfilePage
#/school-apply      ProfilePages.jsx / SchoolApplyPage
#/login             ProfilePages.jsx / LoginPage
```

---

## 5. 当前页面能力

### 首页与公开访问

- 首页 `#/` 是公开访问页。
- 首页包含平台宣传、推荐课程、资讯摘要。
- 推荐课程为后台运营配置，当前按视频试看处理。
- 推荐课程在首页展示为 4 列 x 2 行平铺卡片，共 8 条 mock 数据。
- 推荐课程卡片使用封面占位图，点击统一进入 `#/course-preview`。
- 推荐课程试看页只处理视频试看课时列表，不复用学习中心完整课程详情。
- 资讯中心 `#/news` 展示资讯列表，资讯详情用弹窗模拟富文本。
- 资讯类型固定枚举：政策解读、考试通知、平台公告、备考指南。
- 考试通知只作为资讯发布，不与考试中心联动。

### 试卷中心

- 试卷中心 `#/papers` 是单独的练习模式。
- 试卷筛选为两级结构：
  - 一级：文化课 / 专业课。
  - 二级：文化课科目 / 专业大类。
- 文化课科目和专业大类都按后台动态配置理解。
- 文化课当前 mock：语文、数学、英语。
- 专业课当前 mock：19 个专业大类。
- 二级筛选统一使用资源概览卡片交互，不使用重复下拉。
- 游客和注册用户可浏览试卷列表，但不能作答。
- 班级学生可作答班级授权专业大类下的试卷。
- 试卷列表展示试卷信息、类别、题量/时长、学习状态和操作。
- 试卷列表包含分页控件，每页条数可选：20、30、50；切换筛选或每页条数时页码重置为第 1 页。

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
- 题目状态：
  - 未答题
  - 已答题
  - 正确
  - 错误
  - 已评分
  - 标记为叠加状态
- 试卷解析页展示答题总结、题号导航、单题答案和题目解析。
- 题目解析来自后台富文本，可能包含文字、图片、视频。

### 考试中心

- 考试中心 `#/exams` 展示平台考试，分为公开考试和学校联考。
- 公开考试面向注册用户和班级学生开放。
- 学校联考面向授权学校、授权班级、对应专业大类学生开放。
- 游客可浏览考试概况，但不能参加。
- 注册用户可参加公开考试，不能参加学校联考。
- 考试中心筛选包含：
  - 全部考试 / 我的考试
  - 公开考试 / 学校联考
  - 文化课 / 专业课
  - 科目 / 专业大类
  - 考试状态
  - 关键词
- “我的考试”用于和学习中心区分：
  - 游客：提示登录。
  - 注册用户：展示自己的公开考试。
  - 班级学生：展示公开考试和当前班级授权的学校联考。
- 考试状态：
  - 未开始
  - 进行中
  - 评审中
  - 已公示
- 学生考试状态：
  - 无权限
  - 待开始
  - 可参加
  - 已交卷
  - 未参加
  - 已出分
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
- 未登录或未加入学校班级时，不展示学习工作台内容。
- 学生可以加入多个学校。
- 同一学校下，一个学生只能加入一个班级。
- 班级绑定专业大类。
- 学习中心通过“当前学校班级”下拉提供班级上下文。
- 学习中心首页只做摘要，不承接全部完整列表。
- 错题本、学习记录是个人学习资产，高于班级。
- 班级答疑是一对一留言系统，不做实时聊天。

### 班级测试

- 班级测试属于学习中心中的班级内部测试。
- 班级测试不属于考试中心。
- 班级测试保留基础作答、提交、判卷流程。
- 班级测试不做正式考试详情、排行和公示。
- 班级测试没有考试详情页，点击直接开始测试。
- 班级测试只查看自己的答题情况和测试结果。

### 账号与权限

- 登录/注册：`#/login`
- 入校申请：`#/school-apply`
- 个人中心：`#/profile`
- 右上角账号入口：
  - 游客：头像占位 + 登录/注册。
  - 注册用户/班级学生：头像 + 用户名，下拉包含个人中心、退出登录。
- 顶部主导航不展示个人中心；个人中心入口只通过登录后的账号下拉进入。
- “我的申请/申请进度”放在个人中心，不作为右上角下拉菜单项，不使用“我的审核”命名。
- 权限身份由左下角原型控制浮层模拟切换：
  - 游客
  - 注册用户
  - 班级学生

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
- 改课程学习详情：`src/pages/LearningPages.jsx` / `CourseStudyPage`
- 改班级测试：`src/pages/LearningPages.jsx` / `ClassExamPage`
- 改班级答疑：`src/pages/LearningPages.jsx` / `QAPage`
- 改错题本：`src/pages/LearningPages.jsx` / `WrongBookPage`
- 改学习记录：`src/pages/LearningPages.jsx` / `LearningRecordPage`
- 改个人中心：`src/pages/ProfilePages.jsx` / `ProfilePage`
- 改入校申请：`src/pages/ProfilePages.jsx` / `SchoolApplyPage`
- 改登录注册：`src/pages/ProfilePages.jsx` / `LoginPage`
- 改 mock 数据：`src/data/mockData.js`
- 改顶部栏、通用组件、标注逻辑：`src/components/ui.jsx`
- 改路由：`src/App.jsx`

---

## 7. 维护提示

- 本文是当前实现索引，不记录历史过程。
- 新增页面后同步更新路由映射和常见修改定位。
- 修改跨模块产品规则后同步更新“当前页面能力”。
- 删除或重构页面后清理过时说明。
- 指定页面修改时，优先按本文定位文件，避免无必要全局扫描。

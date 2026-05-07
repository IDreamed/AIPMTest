# PROJECT_MAP

> 用途：这是学生端前端原型的跨对话协作索引。新对话中优先阅读本文件，再决定是否需要读取具体源码。  
> 目标：减少反复扫描文件、减少不必要的工具调用、保持多轮修改的产品规则一致。

---

## 1. 项目基本信息

- 项目名称：职教高考轻量化教考系统学生端前端交互原型
- 项目路径：`D:\projects\student-prototype-react`
- 工作区路径：`D:\projects`
- Git 位置：`D:\projects\.git`
- 技术栈：React + Tailwind + Vite
- 路由方式：Hash 路由，不使用 react-router
- 原型目标：给客户演示可交互学生端原型，不追求上线代码，但需要多轮可控修改。

---

## 2. 协作规则

- 修改前先列计划/修改项，等待用户确认。
- 用户明确说“可以”“开始”“修改”等确认后再改代码。
- 不主动执行 `npm` / `vite` 命令。
- 改完只说明“修改完了”和关键结果，不附运行命令。
- 页面以真实场景构建，这是一个真正的可交互原型。
- 业务规则、开发说明、原型解释等与界面无关的说明放到 `PrototypeNote`，不要直接作为页面正文。
- 顶部栏“当前身份：游客/注册用户/班级学生”用来模拟权限切换，方便原型展示，不是真实的现实。
- 后续优先按本文件定位目标文件；指定页面修改时，不先做全局搜索。
- 只有需要全局一致操作时，才考虑全局搜索。

---

## 3. 文件结构索引

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

### 关键文件职责

- `src/App.jsx`
  - Hash 路由表。
  - 页面组件入口映射。

- `src/components/ui.jsx`
  - 全局原型壳层与通用 UI。
  - 包含：`AppShell`、`usePrototypeRole`、`PrototypeNote`、`PageHeader`、`Card`、`Button`、`Tag`、`Meta`、`DataTable`、`Modal`、`Stat`。
  - 顶部栏包含身份切换和标注开关。
  - 顶部栏不放业务 CTA。

- `src/data/mockData.js`
  - 全部 mock 数据。
  - 包含导航、资讯、推荐课程、专业大类、试卷、考试、班级、班级测试、课程、课时目录、课程试卷、课件、学习记录、错题等。

- `src/pages/HomePages.jsx`
  - 首页、资讯中心、推荐课程试看页。

- `src/pages/PaperPages.jsx`
  - 试卷中心、试卷刷题页。

- `src/pages/ExamPages.jsx`
  - 考试中心、考试详情、正式考试答题页。

- `src/pages/LearningPages.jsx`
  - 学习中心、班级档案、班级测试、班级测试答题、课程学习详情、班级答疑、错题本、学习记录。

- `src/pages/ProfilePages.jsx`
  - 个人中心、入校申请、登录/注册。

---

## 4. 路由到文件映射

```text
公开访问区
#/                  HomePages.jsx / HomePage
#/news              HomePages.jsx / NewsPage
#/course-preview    HomePages.jsx / CoursePreviewPage

试卷练习区
#/papers            PaperPages.jsx / PaperCenterPage
#/paper-answer      PaperPages.jsx / PaperAnswerPage

考试区
#/exams             ExamPages.jsx / ExamCenterPage
#/exam-detail       ExamPages.jsx / ExamDetailPage
#/exam-answer       ExamPages.jsx / ExamAnswerPage

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

## 5. 页面模块归类

### 公开访问区

- 首页 `#/`
- 资讯中心 `#/news`
- 推荐课程试看 `#/course-preview`

### 试卷练习区

- 试卷中心 `#/papers`
- 试卷刷题页 `#/paper-answer`

### 考试区

- 考试中心 `#/exams`
- 考试详情 `#/exam-detail`
- 正式考试答题 `#/exam-answer`
- 考试公示页：建议新增，尚未实现

### 学习中心区

- 学习中心首页 `#/learning`
- 我的课程：建议作为学习中心子界面新增，尚未实现
- 课程学习详情 `#/course-study`
- 班级测试 `#/class-exam`
- 班级测试答题 `#/class-exam-answer`
- 班级答疑 `#/qa`
- 错题本 `#/wrong-book`
- 学习记录 `#/learning-record`

### 账号与权限区

- 登录/注册 `#/login`
- 入校申请 `#/school-apply`
- 个人中心 `#/profile`

---

## 6. 常见修改定位

- 改首页宣传文案：`src/pages/HomePages.jsx` / `HomePage`
- 改推荐课程轮播：`src/pages/HomePages.jsx` / `HomePage`
- 改资讯中心列表或弹窗：`src/pages/HomePages.jsx` / `NewsPage`、`NewsRichText`
- 改推荐课程试看页：`src/pages/HomePages.jsx` / `CoursePreviewPage`
- 改试卷中心筛选、专业大类、列表：`src/pages/PaperPages.jsx` / `PaperCenterPage`
- 改试卷刷题页：`src/pages/PaperPages.jsx` / `PaperAnswerPage`
- 改考试中心：`src/pages/ExamPages.jsx` / `ExamCenterPage`
- 改考试详情：`src/pages/ExamPages.jsx` / `ExamDetailPage`
- 改正式考试答题页：`src/pages/ExamPages.jsx` / `ExamAnswerPage`
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

## 7. 已确定产品规则摘要

### 首页

- 首页是公开访问页。
- 顶部菜单为主要模块的入口导航。
- 首页顶部平台介绍使用总结性、宣传性文案。
- 首页模块包含：平台宣传、推荐课程、资讯摘要。

### 资讯中心

- 资讯中心展示平台上发布的公告，新闻等资讯。
- 资讯类型固定枚举，当前类型：政策解读、考试通知、平台公告、备考指南。
- 资讯详情使用弹窗展示，内容为富文本内容展示，可能包含文本，图片，视频，链接。
- 模拟数据不使用真实图片，使用占位符即可。
- 考试通知只作为信息发布， 不与考试中心进行联动。

### 推荐课程

- 首页推荐课程是后台管理运营配置，不等同于班级课程。
- 首页推荐课程默认按视频试看处理。
- 试看时长只对视频生效。
- 推荐课程试看页不处理富文本/PDF/PPT/音频课时预览。
- 推荐课程试看页不复用学习中心完整课程详情页。
- 推荐课程试看页只保留视频试看课时列表。
- 推荐课程试看页 Tab：详情、试卷、课件。

### 试卷中心

- 试卷中心展示对应专业分类中的试卷列表(数据从后台获取)。
- 试卷中心为单独的练习模式。
- 当前没有公开可作答试卷，所有试卷访问都应该具有权限。
- 游客可浏览查看所有专业的试卷列表，但是不能操作，操作弹窗提示登录/注册。
- 注册用户可浏览查看所有专业的试卷列表，但是不能操作，操作提示申请入校。
- 只有班级学生可以作答班级对应专业的试卷。
- 公共课：语文、数学、英语。
- 专业课按 19 个专业大类筛选。
- 专业课试卷权限由当前学校班级绑定大类决定。
- 专业大类筛选区域应紧凑：
  - 用下拉选择完整专业大类。
  - 默认只展示 6 个专业大类资源概览。
  - 支持展开全部 19 个。
  - 概览只显示“大类名称 + 总试卷数”。
- 试卷列表里展示具体权限和学习状态。

### 试卷刷题

- 无权限用户不开放作答界面。
- 题型包含：单选、多选、判断、填空、简答、综合题。
- 综合题为一个题干 + 多个子题。
- 完成练习后系统判卷客观题并给出解析。
- 错题进入错题本。
- 试卷刷题允许中途退出，保存进度和继续刷题。

### 考试中心

- 考试中心展示平台发布的考试，分为公开考试和学校联考。
- 公开考试面考试向注册用户，所有学校班级学生开放。
- 学校联考面向拥有考试对应专业大类授权的学校中，对应专业的班级学生开放。
- 游客可浏览公开考试，学校联考概况，但不能参加。
- 注册用户无学校班级授权，不能参加学校联考。
- 考试状态：未开始、进行中、评审中、已公示。
- 学生考试状态：无权限、待开始、可参加、已交卷、未参加、查看成绩。
- 考试中心筛选包含：考试类型、科目、专业大类、考试状态。
- 考试中心不做“学生考试状态”相关的筛选。
- 考试中心列表展示每个考试的“考试状态”和“学生考试状态”。

### 考试详情

- 展示单场考试基础信息、状态、规则、授权、成绩/公示信息。
- 考试详情不展示题目作答区。
- 考试详情不展开完整排名榜单。
- 结果展示方式由后台配置结果决定：
  - `rankEnabled = true`：成绩 + 排名。
  - `rankEnabled = false`：仅成绩。
- 学生端不提供考试相关的设置。

### 考试中心考试答题

- 考试必须一次完成，进入考试展示倒计时。
- 不保存中途状态。
- 不支持继续考试。
- 交卷才算参加考试。
- 不展示保存并下一题。

### 学习中心

- 学习中心是登录后的学生工作台，未登录或未加入学校班级时不展示学习工作台内容。
- 学生可以加入多个学校。
- 同一学校下，一个学生只能加入一个班级。
- 班级绑定专业大类。
- 学习中心通过“当前学校班级”下拉提供班级上下文。
- 学习中心首页只做摘要，不承接所有完整列表。
- 错题本、学习记录是个人学习资产，高于班级。
- 学习中心复杂度最高，后续应谨慎逐页推进。

### 班级测试

- 班级测试属于学习中心中的班级内部。
- 班级测试不属于考试中心，保留基础作答、提交、判卷流程，但不做正式考试详情、排行和公示。
- 班级测试没有考试详情页，点击直接开始考试。
- 班级测试没有排行等信息，只能查看自己的答题情况和考试结果。

### 班级答疑

- 班级答疑是一对一留言，每个学生都能通过答疑向老师提问。
- 不做实时聊天，为留言系统。

---

## 8. 最近重点调整记录

- 首页顶部平台介绍已改为更偏宣传性文案。
- 推荐课程轮播已做视觉优化：当前项更突出、右侧列表更清楚、底部进度更像轮播控件。
- 资讯中心详情弹窗已改为模拟富文本展示。
- 推荐课程试看页已去掉重复目录 Tab。
- 试卷中心专业大类区域已压缩：
  - 下拉选择完整大类。
  - 默认展示 6 个资源概览。
  - 支持展开全部。
  - 删除权限、可刷题、身份等重复信息。
- 公共课试卷筛选卡片已删除重复标签。
- 页面内容中的“当前身份：游客/注册用户/班级学生”标注已清理。

---

## 9. 工具使用建议

- 新对话中先读取本文件，优先按本文件定位目标文件。
- 指定页面修改时，不需要先全局搜索。
- 全局一致性清理时，可以做一次搜索，例如：
  - 删除所有“当前身份”。
  - 全局替换“咨询中心”为“资讯中心”。
  - 全局统一按钮文案。
- 不主动执行 `npm` / `vite`。
- Windows 沙箱/权限问题无法通过本文件彻底解决。
- 本文件能减少不必要的扫描和读取，但不能完全替代全局搜索。


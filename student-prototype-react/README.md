# 职教高考学生端 React 原型

这是从静态 HTML 原型迁移出的组件化版本，目标是让后续多轮修改更可控。

## 技术栈

- Vite
- React
- Tailwind CSS
- 轻量 hash 路由

## 目录

```text
src/
├─ App.jsx
├─ components/
│  ├─ ui.jsx
│  └─ examWorkflows.jsx
├─ data/
│  └─ mockData.js
├─ pages/
│  ├─ HomePages.jsx
│  ├─ PaperPages.jsx
│  ├─ ExamPages.jsx
│  ├─ AdminPages.jsx
│  ├─ LearningPages.jsx
│  └─ ProfilePages.jsx
└─ index.css
```

交接优先阅读：

- `交接.md`：离职交接文档，包含运行方式、业务范围、状态约定、风险和接手建议。
- `PROJECT_MAP.md`：项目地图，包含路由、文件职责、页面能力和常见修改定位。

## 页面

- `#/` 首页
- `#/news` 资讯中心
- `#/course-preview` 运营课程试看
- `#/papers` 试卷中心
- `#/paper-answer` 试卷刷题
- `#/exams` 考试中心
- `#/exam-detail` 考试详情
- `#/exam-answer` 考试答题
- `#/exam-analysis` 考试解析
- `#/exam-rank` 考试排行
- `#/learning` 学习中心
- `#/class-detail` 班级学习详情
- `#/class-courses` 班级课程
- `#/course-study` 班级课程学习
- `#/course-lesson` 课时学习
- `#/paper-practice` 试卷练习
- `#/my-exams` 考试安排
- `#/qa` 班级答疑
- `#/qa-detail` 答疑记录
- `#/wrong-book` 错题本
- `#/learning-record` 学习记录
- `#/profile` 个人中心
- `#/school-apply` 入校申请
- `#/login` 登录注册
- `#/admin` 运营后台
- `#/admin/news` 资讯管理
- `#/admin/recommend-courses` 首页推荐课程管理

## 运行

```bash
npm install
npm run dev
```

后续建议优先改 `src/data/mockData.js` 和 `src/components/ui.jsx`，再改具体页面。

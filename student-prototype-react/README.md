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
│  └─ ui.jsx
├─ data/
│  └─ mockData.js
├─ pages/
│  ├─ HomePages.jsx
│  ├─ PaperPages.jsx
│  ├─ ExamPages.jsx
│  ├─ LearningPages.jsx
│  └─ ProfilePages.jsx
└─ index.css
```

## 页面

- `#/` 首页
- `#/news` 资讯中心
- `#/course-preview` 运营课程试看
- `#/papers` 试卷中心
- `#/paper-answer` 试卷刷题
- `#/exams` 考试中心
- `#/exam-detail` 考试详情
- `#/exam-answer` 考试答题
- `#/learning` 学习中心
- `#/class-detail` 班级学习详情
- `#/course-study` 班级课程学习
- `#/qa` 班级答疑
- `#/wrong-book` 错题本
- `#/learning-record` 学习记录
- `#/profile` 个人中心
- `#/school-apply` 入校申请
- `#/login` 登录注册

## 运行

```bash
npm install
npm run dev
```

后续建议优先改 `src/data/mockData.js` 和 `src/components/ui.jsx`，再改具体页面。

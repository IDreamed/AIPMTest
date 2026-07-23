# 项目整体 PRD：教学管理与学生学习闭环平台原型

更新时间：2026-07-22

> **交付状态说明：教师端原型未完成。** 当前 React 页面用于验证一期信息架构和最小教学闭环，不代表真实接口、权限模型、跨页面数据状态和完整研发验收已经完成。

## Problem Statement

当前项目同时存在三类信息源：Axure 导出的后台原型、已经完成较多学生端闭环的 React 原型、以及最近确认要纳入一期目标的教师端前台。交接时最大的风险不是某个页面缺失，而是端侧边界混淆：

- Axure 后台原型实际分为平台管理端和学校管理后台，但其中一部分学校管理后台页面本质是教师日常教学执行能力，应该迁入教师端前台。
- React 原型的学生端和教师端闭环已基本补齐，交接风险转为前后台边界、权限归属和 mock 交互不能代表真实接口实现。
- 旧文档中仍有旧版班级测评命名和多学校规则等历史口径，和最新确认的一期目标不一致。
- 一期交付要围绕“教学管理与学生学习闭环底座”，不是单纯学生端，也不是完整后台管理系统。

本 PRD 的目标是形成一份可交接的统一需求文档，说明当前项目应该交付什么、已经实现到哪里、Axure 后端页面如何归属、学生端和教师端应该如何继续前端化，以及已实现后端管理界面需要按新需求调整哪些边界。

## Solution

一期交付定位为“教学管理与学生学习闭环底座”。平台以 React 前端原型和 mock 数据为边界，验证角色、页面流程、数据结构、权限关系和交互一致性，不做真实后端接口联调。

### 产品端侧

| 端 | 定位 | 一期交付口径 |
|---|---|---|
| 公开访问端 | 面向游客和潜在学生 | 首页、资讯中心、推荐课程试看、报考指南、虚拟实训入口 |
| 学生端前台 | 学生学习和测评闭环 | 学习中心、课程学习、课时学习、课程资料、作业、考试、试卷练习、错题本、我的答疑、学习记录、个人中心 |
| 教师端前台 | 教师教学执行前台 | 教学资源、组课管理、我的课程、我的班级、学生管理、班级派课、班级作业、阅卷、学情、答疑管理 |
| 平台运营后台 | 内容运营基础能力 | 资讯管理、首页推荐课程管理 |
| 平台管理端 | 平台级内容、授权、审核和考试管理 | 始终为后端管理端，功能基本已实现；不进入 React 前台重做范围，但需按新需求调整部分后端界面 |
| 学校管理后台 | 学校组织、人员、班级和权限配置 | 后端管理端；教师教学执行能力应迁入教师端前台，组织和权限配置保留在后端 |

### Axure 后端界面审查结论

Axure `html/` 目录共有 89 个一级 HTML 页面，其中 4 个为启动页或入口页，85 个为业务页面。业务页面已全部纳入 `Axure后台页面功能清单.md` 的覆盖清单。

平台管理端页面包含：

- 平台人事管理、学校资源授权。
- 专业分类、知识点标签、试卷分类。
- 平台资源库、平台题库、题目新建、批量导入、AI 命题。
- 平台课程、课时、课件、课程试卷。
- 平台试卷、固定卷、随机卷、选题。
- 题目审核、资源审核、考试审核。
- 平台联考、考试配置、发布后考试管理、阅卷、考试统计。

学校管理后台页面包含：

- 学校菜单。
- 教师/学生人员管理、学生入校审核。
- 学校授权资源查看、题库查看。
- 学校侧课程、试卷、分班管理。
- 班级教务、派课、学生详情、学习详情、答疑。
- `11_5考试` 页面组，产品命名统一为“班级作业”。

一期前端与后端边界的关键判断：

- `资源库查看`、`题库查看`、`课程管理_1`、`试卷管理`、`班级教务管理`、`派课`、`答疑`、`11_5考试` 页面组属于教师教学执行能力，应迁入教师端前台。
- 因后台班级权限现阶段无法调整，教师端一期迁移新建班级、添加学生和分班的最小配置能力；学生审核、停用、跨校转移、教师角色和学校权限仍属于学校管理后台。
- 平台账号、学校授权、审核、平台联考配置属于平台管理后端。平台管理后端基本已实现，不作为教师端或学生端前台，但需要按新需求调整部分界面和命名边界。

### 后端界面调整点

平台管理后端保留既有实现，但需要按新需求检查和调整这些界面：

- 试卷管理：补充或明确试卷用途，区分练习试卷、作业试卷、考试专用试卷。
- 考试配置：正式考试创建不能直接选择开放练习试卷，应选择考试专用试卷或进入单独考试组卷流程。
- 考试管理和考试统计：旧公开考试和学校联考合并为一个平台联考能力，不承接班级作业命名。
- 课程和课时管理：平台官方课程仍由平台管理后端维护；教师端只承接校本组课和班级教学执行。
- 学校授权：继续由平台管理后端控制学校可见专业大类、资源库、题库、课程和试卷范围。

学校管理后台也需要按新边界调整：

- 保留教师管理、学生审核/停用、跨校转移、班级冻结/解散和角色权限；新建班级、添加学生和分班的最小能力迁入教师端。
- 教师日常教学执行能力从学校后台迁入教师端前台，包括资源查看、题库查看、组课、派课、班级作业、学生学情和答疑。
- `11_5考试` 页面组如果短期仍保留在后端菜单中，产品文案应统一调整为班级作业。
- 旧的“功能后台”式学校菜单需要收缩为组织后台，避免教师在后台入口完成日常教学动作。

### 当前 React 原型实现状态

已实现或基本实现：

- 公开首页、资讯中心、推荐课程试看。
- 学生身份拦截和场景预览。
- 注册、个人中心、入校申请字段顺序。
- 学习中心：我的课程、作业、我的答疑、学习记录。
- 课程详情：介绍、目录、试卷、课件、答疑。
- 课时播放：微课、慕课、音频、PDF、PPT、富文本占位，以及课堂练习弹窗。
- 作业：列表、安排页、答题页、解析页。
- 考试中心：当前考试、考试记录、考试详情、正式答题、解析、排行。
- 试卷练习和错题本。
- 平台运营后台：资讯管理和首页推荐课程管理。
- 教师端前台多页面原型：教学资源、组课管理、我的课程、试卷管理、我的班级、学生管理、班级派课、班级作业、作业批阅、作业统计、学生详情、答疑管理。

尚未完整实现：

- React 原型尚未接入真实后端接口、数据库、鉴权和文件预览。
- 教师端当前为 mock 数据驱动的前台原型；资源预览、组课、派课、作业保存、批阅和答疑回复均为原型交互，不产生真实后端数据变更。

非 React 前台范围但需要交接说明：

- 平台管理端始终是后端管理端，功能基本已实现；后续根据需求变更调整部分后端界面。
- 学校管理后台也是后端管理端；除一期迁移的建班、添加学生和分班外，人员审核、班级状态、教师角色和权限等组织配置能力保留在后端。
- 从学校管理后台迁出的教师教学执行能力，需要在教师端前台重新组织页面和交互。

### 核心业务闭环

```text
平台/学校配置
  -> 学校获得资源授权
  -> 学校完成教师权限和学生审核
  -> 教师新建班级并分配学生
  -> 教师查看授权资源并组课
  -> 教师给班级派课
  -> 学生进入学习中心学习课程和课时
  -> 学生完成课时练习、班级作业、试卷练习和正式考试
  -> 错题进入错题本，视频/音频进入学习记录
  -> 学生发起答疑，教师回复
  -> 教师查看学生学情和作业/答疑情况
```

### 关键产品规则

- 学生端按当前规则只展示一个当前学校和一个当前班级，不提供学校/班级切换。
- 注册表单字段顺序为：申请的学校、目标专业、手机号、验证码、密码、确认密码。
- 学习中心左侧导航为：我的课程、作业、我的答疑、学习记录。
- 考试中心承接正式考试、考试记录、试卷练习和错题本。
- 作业作为教师布置给班级的非正式测评任务，归入学习中心，不进入正式考试中心。
- `11_5考试`、`11_5_1_新建考试`、`11_5_2编辑考试`、`11_5_3考试统计` 在产品中统一命名为班级作业、新建班级作业、编辑班级作业、班级作业统计。
- 课程进度、课时进度、答题状态等学习提醒保留；跨模块汇总统计和经营分析看板不进入一期。
- 试卷需要区分三类用途：练习试卷、作业试卷、考试专用试卷。
- 正式考试不能直接选择开放练习试卷，避免学生提前练到考试卷。
- 教师端是前台业务端，不等同于运营后台或学校后台。

## User Stories

1. 作为游客，我希望浏览首页，以便理解平台的学习、考试、虚拟实训、报考指南、课程和资讯入口。
2. 作为游客，我希望阅读公开资讯，以便了解政策解读、考试通知、平台公告和备考指南。
3. 作为游客，我希望试看推荐课程，以便在申请学校前判断课程内容是否有价值。
4. 作为游客，我希望访问受限学习功能时获得登录或注册提示，以便知道下一步该做什么。
5. 作为注册学生，我希望申请学校并选择目标专业，以便学校审核我的学习权限。
6. 作为注册学生，我希望查看入校审核状态，以便知道自己是否能进入学习和考试功能。
7. 作为认证未通过的学生，我希望再次提交学校、目标专业和申请说明，以便修正申请信息。
8. 作为班级学生，我希望看到当前学校、班级和专业，以便知道自己可以访问哪些资源。
9. 作为班级学生，我希望在学习中心看到老师安排的课程，以便继续完成学习任务。
10. 作为班级学生，我希望课程卡片展示课程状态、科目、当前课时、发布人、已学课时和学习进度，以便判断下一步学什么。
11. 作为班级学生，我希望打开课程详情，以便查看介绍、目录、试卷、课件和答疑。
12. 作为班级学生，我希望学习微课、慕课和音频课时，以便系统记录学习进度和已学习时间。
13. 作为班级学生，我希望打开 PDF、PPT 和富文本课时，以便使用非音视频学习资源。
14. 作为班级学生，我希望完成课时练习，以便立即查看答案和解析。
15. 作为班级学生，我希望预览课程资料，以便课件能支撑课程学习。
16. 作为班级学生，我希望查看视频和音频课时学习记录，以便回顾最近学习情况。
17. 作为班级学生，我希望保留课程进度提醒，以便知道还没有完成的学习内容。
18. 作为班级学生，我希望查看老师布置的班级作业，以便完成非正式测评任务。
19. 作为班级学生，我希望作业卡片展示时长、题数、总分、开始时间、剩余时间、状态和操作，以便知道当前能做什么。
20. 作为班级学生，我希望开始作业前查看作业安排，以便理解时间和结果规则。
21. 作为班级学生，我希望作答班级作业题目，以便提交老师布置的作业。
22. 作为班级学生，我希望作业答题支持单选、多选、判断、填空、简答和综合题，以便匹配后台题目结构。
23. 作为班级学生，我希望提交作业前二次确认，以便避免误提交。
24. 作为班级学生，我希望成绩可见后查看作业解析，以便理解错题原因。
25. 作为班级学生，我希望班级作业不进入正式考试中心，以便区分作业和正式考试。
26. 作为班级学生，我希望查看当前可参加考试，以便参加学校或平台安排的考试。
27. 作为班级学生，我希望考试中心只展示我能参加的未开始或进行中考试，以便列表不被无关考试干扰。
28. 作为班级学生，我希望考试详情展示介绍、权限、时间安排和我的结果状态，以便判断能否开始或需要等待。
29. 作为班级学生，我希望正式考试必须一次完成，以便考试规则清晰。
30. 作为班级学生，我希望正式考试有倒计时和交卷确认，以便管理考试时间并避免误交卷。
31. 作为班级学生，我希望已交卷考试进入考试记录，以便当前考试列表保持清晰。
32. 作为班级学生，我希望成绩公示后查看得分、答案、解析和排行，以便理解考试结果。
33. 作为班级学生，我希望排行页区分考生排行和学校排行，以便查看正确榜单。
34. 作为班级学生，我希望按语文、数学、英语和专业课筛选试卷练习，以便练习有权限的材料。
35. 作为班级学生，我希望继续未完成的试卷练习，以便练习进度不丢失。
36. 作为班级学生，我希望重新开始已完成的试卷练习，以便复习错题后再次训练。
37. 作为班级学生，我希望练习后查看试卷解析，以便查看得分、正确率、用时和题目解析。
38. 作为班级学生，我希望错题本汇总课程、试卷、作业和考试错题，以便集中复盘薄弱点。
39. 作为班级学生，我希望筛选和搜索错题，以便聚焦科目、题型、课程或知识点。
40. 作为班级学生，我希望在弹窗中查看错题解析，以便不离开当前列表位置。
41. 作为班级学生，我希望一次练习一道错题，以便有针对性地纠错。
42. 作为班级学生，我希望移除单条或多条错题，以便已掌握题目不再干扰复习。
43. 作为班级学生，我希望从课程详情和课时页面发起提问，以便问题带有学习上下文。
44. 作为班级学生，我希望查看我的答疑列表和详情，以便跟进老师回复并继续追问。
45. 作为教师，我希望在顶部导航进入教师端，以便将教学工作和学生功能分开。
46. 作为教师，我希望查看学校授权资源和题库，以便备课和布置作业。
47. 作为教师，我希望按专业大类、资源库、知识点、素材类型、题型和难度筛选资源，以便定位教学素材。
48. 作为教师，我希望预览资源和题目，以便判断是否适合课程或作业。
49. 作为教师，我希望基于资源创建或维护校本课程，以便让班级学习匹配教学计划。
50. 作为教师，我希望维护课程目录、课时、课时练习、课件和课程试卷，以便课程结构完整。
51. 作为教师，我希望查看我的课程，以便管理自己创建或负责的课程。
52. 作为教师，我希望新建班级并添加、分配学生，以便不依赖后台即可开始教学。
53. 作为教师，我希望查看我的班级，以便看到班级专业、学生、已派课程和教学动作。
54. 作为教师，我希望给班级派课，以便学生能在学习中心学习课程。
55. 作为教师，我希望取消派课时保留学习记录，以便历史学习数据不被破坏。
56. 作为教师，我希望选择作业试卷并设置开始时间和时长来创建班级作业，以便学生在学习中心完成。
57. 作为教师，我希望在作业开始前编辑班级作业，以便修正配置错误。
58. 作为教师，我希望作业开始后锁定关键信息，以便学生在稳定规则下作答。
59. 作为教师，我希望查看作业提交、缺考、批阅和出分状态，以便跟进学生完成情况。
60. 作为教师，我希望批阅主观题和综合题中的主观子题，以便作业和考试分数完整。
61. 作为教师，我希望客观题自动评分且不可人工改分，以便批阅高效且一致。
62. 作为教师，我希望查看班级作业统计，以便了解班级表现，但不依赖跨模块经营看板。
63. 作为教师，我希望查看学生详情和课时学习详情，以便诊断学生学习进度。
64. 作为教师，我希望按学生姓名或手机号搜索答疑，以便高效处理学生问题。
65. 作为教师，我希望回复学生问题和追问，以便形成完整教学支持闭环。
66. 作为学校管理员，我希望审核学生入校申请并确认学校和专业，以便只有审核通过学生访问学校资源。
67. 作为学校管理员，我希望管理学生状态、班级状态和教师角色，以便学校教学组织配置正确。
68. 作为学校管理员，我希望组织和权限管理保留在学校后台，以便教师不会误操作系统配置。
69. 作为平台管理员，我希望管理平台账号和权限，以便平台运营受控。
70. 作为平台管理员，我希望管理学校资源授权和到期时间，以便学校只访问已购买或已分配资源。
71. 作为平台管理员，我希望管理专业分类和知识点体系，以便资源、题目、课程、试卷和考试共用结构。
72. 作为平台管理员，我希望管理资源、题目、课程和试卷，以便官方教学资产集中维护。
73. 作为平台管理员，我希望资源、题目和考试经过审核状态流转，以便发布内容可控。
74. 作为平台管理员，我希望配置平台联考，以便正式考试流程可用。
75. 作为平台运营人员，我希望管理资讯，以便首页和资讯中心内容可维护。
76. 作为平台运营人员，我希望管理首页推荐课程，以便试看内容支撑获客和转化。

## Implementation Decisions

- The current deliverable is a React + Vite + Tailwind frontend prototype using local mock data. No real backend, database, file storage, or authentication is included in一期.
- Hash routing remains the routing mechanism. Existing routes in `App.jsx` are the main integration surface for verification.
- The highest implementation seam is page-level route behavior under different prototype roles. Component-level logic can be reused, but acceptance should focus on visible route behavior.
- Student identity uses prototype roles: visitor, review pending, rejected, class student, and teacher. Teacher is not treated as a student and should not enter student-only learning/exam flows.
- 考试中的旧公开考试和旧学校联考在需求上合并为一种“平台联考”。后端最终只保留一个新建平台联考入口和一种考试类型，参加范围通过专业、学校、班级或注册用户等配置表达。
- The top navigation order is 首页、学习中心、考试中心、虚拟实训、报考指南. Teacher role additionally sees 教师端.
- Public access pages keep students in the same visual system as learning pages. Admin routes do not use the student `AppShell`.
- Shared UI components in `components/ui.jsx` should be preferred for page headers, cards, filters, segmented tabs, tables, pagination, modals, tags, and buttons.
- Shared question workflow components in `components/examWorkflows.jsx` should be used for formal exams, assignments, and paper analysis where possible.
- Question structure is unified around single choice, multiple choice, judgment, fill-in, short answer, and composite questions.
- Course and lesson student-facing states are limited to 未开始、进行中、已完成.
- Formal exam lifecycle states are independent: 未开始、进行中、评审中、已公示.
- Assignment status uses 未开始、进行中、已结束 plus student status such as 缺考、已交卷、已出分.
- Course progress statistics are retained as necessary student reminders. Aggregate statistic cards requiring backend cross-module calculation should not be shown in一期.
- Student learning center keeps only 我的课程、作业、我的答疑、学习记录 as left navigation.
- Paper practice and wrong book belong under exam center, not the learning center sidebar.
- “作业”是学生端对班级作业的展示名称。不要在产品 UI 中恢复旧版班级测评命名。
- Axure `11_5考试` source pages remain referenced only as source file names. Product naming is 班级作业.
- Teacher端 must be rebuilt using current frontend design conventions. It should not directly copy Axure backend table-heavy screens without adapting interaction and layout.
- 平台管理端始终是后端管理端，且功能基本已实现；本 React 原型不重做平台管理后端，只在 PRD 中标注因需求变更需要调整的后端界面边界。
- 学校管理后台也不是教师端。除一期最小迁移的新建班级、添加学生和分班外，学校组织、学生审核/停用、班级冻结/解散、教师角色和权限配置保留在后端；教师教学执行能力迁入教师端前台。
- React 原型中的平台运营后台一期只覆盖资讯管理和首页推荐课程管理。除上述教师端最小迁移外，完整学校、用户、班级状态、权限和后台考试发布等管理能力属于既有后端管理系统或后续后端调整范围。
- `BACKEND_CAPABILITIES_CHECKLIST.md` contains historical rules and should not override this PRD where conflicts exist.

## Testing Decisions

The primary verification seam is route-level smoke testing in the browser with role switching. For this prototype, tests should verify visible behavior, page flow, and state/action consistency rather than implementation internals.

Build and static checks:

- Run `npm run build` after code changes.
- Use `rg` checks for deprecated product language around old class assessment naming and old school-application field naming.
- Use `PROJECT_MAP.md` and this PRD as scope references when reviewing changes.

Student flow smoke tests:

- Visitor can open 首页、资讯、推荐课程试看、报考指南.
- Visitor is blocked from 学习中心、考试中心、试卷练习、错题本、虚拟实训 with a useful next action.
- Review pending and rejected users see appropriate personal center state and cannot access class learning functions.
- Class student can open 学习中心 and see 我的课程、作业、我的答疑、学习记录.
- Class student can enter course detail, lesson page, material preview, lesson exercise, and course Q&A.
- Class student can open 作业 list, arrangement, answer, and analysis pages.
- Class student can open 考试中心, exam detail, formal answer, analysis, and rank pages.
- Class student can open 试卷练习, continue/restart practice, and see paper analysis.
- Class student can open 错题本, filter/search, view analysis, practice, and remove questions.
- Class student can open 我的答疑 and Q&A detail.

Teacher flow smoke tests:

- Teacher role sees 教师端 in top navigation and the subtitle 教师端教学平台.
- Teacher is blocked from student-only learning and exam functions with a route to 教师端.
- Teacher default route opens teaching resources; no separate teacher workbench is required.
- Teacher pages verify: resource filtering, course building, course maintenance, paper management, class course assignment, class assignment creation/editing, grading, assignment statistics, student learning detail, and Q&A reply.

运营后台 smoke tests:

- Admin routes render outside student shell.
- News management supports filtering, pagination, create/edit/preview page flow.
- Recommended course management supports course library selection, pagination, search, max 12 recommendation rule, sort, and trial lesson count.

Axure coverage verification:

- Business Axure pages should remain mapped in `Axure后台页面功能清单.md`.
- New PRD or implementation changes should not reclassify platform management pages as teacher frontend without explicit product decision.
- The `11_5考试` page group should continue to be treated as 班级作业 in product wording.
- Platform management pages should remain backend management pages. Review changes there as backend UI adjustments, not React frontendization.

## Out of Scope

- Real backend API integration, database schema, authentication, authorization middleware, file upload, and file preview services.
- Rebuilding the platform management backend inside the React student/teacher frontend. The platform management backend already exists and remains backend; only requirement-driven backend UI adjustments are in scope for later backend work.
- Rebuilding the full school management backend inside the React student/teacher frontend. Teacher management, student审核/停用、跨校转移、班级冻结/解散、教师角色、权限和资源授权仍属于后台；教师端只迁移一期必需的建班、添加学生和分班能力。
- Complex BI dashboards,经营分析看板, cross-module summary statistics, or operational performance reports.
- Deep virtual training business workflows.
- Deep application guide or志愿填报 workflows.
- Payment, subscription, commercial order, or contract workflows.
- Real-time chat. Q&A is one-to-one留言式答疑.
- AI question generation production capability. Axure contains AI 命题, but一期可占位.
- Full resource/question/paper versioning backend. The PRD requires version-snapshot awareness, but the prototype does not implement storage.
- Full import/export, Word parsing, and batch upload functionality.

## Further Notes

### Source of Truth

Use these documents in this order when conflicts appear:

1. This PRD.
2. `一期项目交付目标.md`.
3. `PROJECT_MAP.md`.
4. `后台功能与设计说明.md`.
5. `Axure后台页面功能清单.md`.
6. React source code.

`BACKEND_CAPABILITIES_CHECKLIST.md` is historical and contains outdated class-assessment naming and multiple school/class switching rules. Do not use it as the latest product rule without reconciliation.

### Current Implementation Gap

The largest previous product gap was teacher端前台. The current React prototype now covers these teacher vertical slices with mock data:

1. Teacher navigation and default teaching resources route.
2. Teaching resources and question bank browsing.
3. Course building and lesson/courseware/paper maintenance.
4. My classes, student assignment, and class course assignment.
5. Class assignment list, create/edit, paper selection, and status rules.
6. Grading workflow for subjective and composite questions.
7. Student learning situation pages.
8. Teacher Q&A management and reply flow.

### Handoff Guidance

- Do not treat Axure UI styling as the frontend design target. Use Axure for functional fields and workflows, then implement in the React design system.
- Do not treat platform management pages as React frontend work. They are existing backend management pages; requirement changes there should be handled as backend UI adjustments.
- Do not rename assignment back to test/exam in student or teacher UI.
- Do not add aggregate statistic cards unless the data is a necessary learning reminder or already available without backend consolidation.
- When adding pages, update both `PROJECT_MAP.md` and this PRD if scope or behavior changes.

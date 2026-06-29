# 职教高考服务平台原型仓库

本仓库用于保存当前阶段前端原型、Axure 后台原型导出、项目需求资料和交接文档。

## Mac 接手

先看：

```text
MAC_HANDOFF.md
```

本地运行前端原型：

```bash
cd student-prototype-react
npm ci
npm run dev
```

构建验证：

```bash
cd student-prototype-react
npm run build
```

## 主要目录

- `student-prototype-react/`：React + Vite + Tailwind 前端交互原型。
- `html/`：Axure 后台原型导出的本地 HTML。
- `.agents/`：用于产品分析和交付审查的 PM skills。
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动构建部署流程。

## 关键文档

- `MAC_HANDOFF.md`：换机继续开发交接说明。
- `student-prototype-react/PROJECT_MAP.md`：前端项目地图。
- `student-prototype-react/DESIGN_SYSTEM.md`：设计规范。
- `后台功能与设计说明.md`：后台功能梳理。
- `Axure后台页面功能清单.md`：Axure 页面功能清单。
- `江西省职教高考服务平台项目建设与运营方案.docx`：早期立项需求文档。

## 在线预览

推送到 GitHub 后，仓库会通过 GitHub Actions 自动构建 `student-prototype-react` 并发布到 GitHub Pages。

首次发布或换仓库后，在 GitHub 的 `Settings -> Pages` 中确认 `Source` 使用 `GitHub Actions`。

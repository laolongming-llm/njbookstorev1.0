# 南京书店专题站（nj-bookstore）

基于 Vue 3 + Vite 的多页面专题展示项目，当前包含：

- 首页 `/`
- 虚拟漫游 `/manyou`
- 时空寻踪 `/shikong`
- 作家书缘 `/shuyuan`
- 沙龙互动占位路由 `/shalong`（当前复用 `Home.vue`，待后续独立开发）

## 技术栈

- Vue 3（Composition API / `<script setup>`）
- Vue Router 4
- Vite 5
- Mapbox GL（用于 `/shikong` 地图交互）

## 快速开始

在项目根目录执行：

```bash
npm install
npm run dev
```

常用命令：

- `npm run dev`：本地开发
- `npm run build`：生产构建（交接前建议执行）
- `npm run preview`：本地预览构建产物

## 数据构建脚本

项目包含两类数据构建脚本（PowerShell）：

1. 构建时空寻踪数据

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\script\build-shikong-data.ps1
```

输出：

- `public/data/shikong/writers.json`
- `public/data/shikong/events-map.json`
- `script/output/cleaning-report.json`

2. 构建作家书缘数据

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\script\build-zuojiashuyuan-data.ps1
```

输出：

- `public/data/zuojiashuyuan/writers-content.json`
- `public/data/zuojiashuyuan/writer-images-manifest.json`
- `public/materials/zuojiashuyuan/writer-docx-images/` 下提取图片

## 目录结构

```text
src/
  components/        # 通用与页面组件
  composables/       # 复用逻辑（如作家书缘数据处理）
  constants/         # 静态配置
  data/              # 本地静态数据
  router/            # 路由配置
  styles/            # 全局样式
  views/             # 路由页面
public/
  materials/         # 页面素材资源
  data/              # 页面消费的 JSON 数据
script/
  *.ps1              # 数据清洗/构建脚本
  output/            # 构建报告
```

## 页面与接手说明

- `/shalong` 已预留路由，当前组件指向 `src/views/Home.vue`
- 后续开发沙龙互动共创页时，可直接新增 `src/views/Shalong.vue` 并在 `src/router/index.js` 替换对应路由组件
- `/shikong` 依赖 Mapbox，首次接手建议重点回归地图点位、弹窗和简介弹层
- `/shuyuan` 数据来自 `public/data/zuojiashuyuan/`，如更新素材请同步执行数据脚本

## 交接前检查建议

- `npm run build` 通过
- 手动检查路由：`/`、`/manyou`、`/shikong`、`/shuyuan`
- 若改动数据，确认 `public/data/shikong/` 与 `public/data/zuojiashuyuan/` 能正确加载

## 许可证

`LICENSE`（MIT）

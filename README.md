# 南京书店项目 - 共创心愿功能

## 项目结构

```
njbookstore/
├── njbookstore/          # 前端项目（Vue 3）
│   ├── src/
│   │   ├── views/
│   │   │   └── ShalongWish.vue    # 共创心愿页面
│   │   └── services/
│   │       └── api.js            # API服务
│   └── package.json
├── backend/              # 后端项目（Node.js + Express）
│   ├── server.js         # 服务器主文件
│   ├── database.db       # SQLite数据库文件（自动创建）
│   └── package.json
└── README.md             # 本文件
```

## 技术栈

### 前端
- Vue 3 + Vite
- Axios（HTTP客户端）

### 后端
- Node.js + Express
- SQLite（文件型数据库）
- CORS（跨域支持）

## 快速开始

### 1. 安装依赖

#### 前端依赖
```bash
cd njbookstore
npm install
```

#### 后端依赖
```bash
cd backend
npm install
```

### 2. 启动服务

#### 启动后端服务
```bash
cd backend
npm start
```
后端服务将运行在 http://localhost:3001

#### 启动前端开发服务器
```bash
cd njbookstore
npm run dev
```
前端服务将运行在 http://localhost:5173

### 3. 访问页面

打开浏览器访问：http://localhost:5173/shalong/wish

## API接口说明

### 获取心愿列表
```
GET /api/wishes
```
返回所有心愿数据，按创建时间倒序排列

### 创建心愿
```
POST /api/wishes
```
请求体：
```json
{
  "author": "昵称",
  "content": "心愿内容"
}
```

### 删除心愿（可选）
```
DELETE /api/wishes/:id
```
删除指定ID的心愿

## 数据库说明

- 使用SQLite数据库，文件名为 `database.db`
- 数据库表结构：
  - `wishes` 表：存储心愿数据
    - `id`：主键，自增
    - `author`：作者昵称
    - `content`：心愿内容
    - `created_at`：创建时间

## 功能特性

1. **心愿展示**：从数据库加载并展示所有心愿
2. **心愿提交**：用户可以提交新的心愿
3. **加载状态**：显示加载动画和错误提示
4. **错误处理**：网络请求失败时使用本地备用数据
5. **表单验证**：确保昵称和内容不为空
6. **响应式设计**：适配不同屏幕尺寸

## 部署说明

### 生产环境部署

#### 前端部署
```bash
cd njbookstore
npm run build
```
构建产物在 `dist` 目录，可部署到静态服务器

#### 后端部署
```bash
cd backend
npm start
```
可使用PM2等进程管理器管理Node.js服务

## 注意事项

1. 确保后端服务运行在端口3001
2. 前端API请求地址已配置为 http://localhost:3001/api
3. SQLite数据库文件会自动创建在backend目录下
4. 首次启动时数据库表会自动创建
5. 如果后端服务未启动，前端会使用本地备用数据

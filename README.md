# 商家知识管理 + RAG 问答机器人 Monorepo

字节前端训练营 2025 小组项目骨架。专注于「工程结构与类型定义」，预留 DI、异步队列、SSE/流式输出等扩展点，便于后续落地业务实现。

**技术栈**：Node.js 22、TypeScript 5.5、npm workspaces、Next.js 14、Fastify 4、ESLint/Prettier、Vitest。

---

## 仓库结构

- `frontend/`：Next.js App Router 前端
- `backend/`：Fastify + TypeScript 后端
- `packages/shared/`：前后端共享的类型、常量和 DTO
- 根目录：统一脚本、TS/ESLint 配置、Husky 等

---

## 快速开始

1. 安装依赖（根目录）

```gitbash
npm install
```

2. 配置环境变量（可复制示例）

- 后端：复制 `backend/.env.example` → `backend/.env`
  - 关键变量：`BACKEND_PORT=3001`
- 前端：复制 `frontend/.env.local.example` → `frontend/.env.local`
  - 关键变量：`NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`

3. 本地运行

- 同时启动（shared watch + 前端 + 后端）：
  ```powershell
  npm run dev
  ```
- 仅前端（含 shared watch）：
  ```powershell
  npm run dev:frontend:ws
  ```
- 仅后端（含 shared watch）：
  ```powershell
  npm run dev:backend:ws
  ```

4. 质量检查

```powershell
npm run typecheck
npm run lint
```

5. 构建与启动（生产）

```powershell
npm run build
npm run start:backend
npm run start:frontend
```

> 已开启后端 CORS，允许 `http://localhost:3000` 开发来源；可按需改为环境变量白名单。

---

## 脚本速查（根目录）

- `npm run dev`：shared watch + 前端 + 后端
- `npm run dev:frontend:ws`：shared watch + 前端
- `npm run dev:backend:ws`：shared watch + 后端
- `npm run build`：按序构建 shared → frontend → backend
- `npm run start:frontend`：启动构建后的前端
- `npm run start:backend`：启动构建后的后端
- `npm run typecheck`：两端类型检查
- `npm run lint`：两端 Lint

工作区脚本（子包）：

- `frontend/`：`dev`、`build`、`start`、`typecheck`、`lint`
- `backend/`：`dev`、`build`、`start`、`typecheck`、`lint`、`test`

---

## API 路由与模块

统一前缀 `http://localhost:3001/api/*`

- `/api/kms`：知识管理（KMS）
  - `POST /documents`：创建文档（入库并投递处理任务）
  - `GET /documents/:id/status`：查询文档处理状态
- `/api/chat`：问答（RAG）
  - `POST /ask`：同步回答（占位）
  - `GET /ask/stream`：SSE 流式回答（占位）
- `/api/analytics`：分析看板
  - `GET /health`：健康检查（占位）
- `/api/multimodal`：多模态接口（占位）

---

## 架构与扩展点

- 依赖注入（DI）：`backend/src/core/container.ts`，通过 `DI_KEYS` 注册/解析服务与客户端，便于替换实现与测试注入。
- 基础设施客户端（占位）：
  - DB：`backend/src/infra/db/dbClient.ts`
  - 向量库：`backend/src/infra/vector/vectorClient.ts`
  - 队列：`backend/src/infra/queue/queueClient.ts`
- RAG 能力：`backend/src/modules/rag/services/*`
  - `RetrievalService`（检索）、`ProviderRegistry`（大模型提供方选择）、`ChatService`（问答编排）、`providers/*`（OpenAI 等实现占位）
- SSE：`/api/chat/ask/stream` 已预留流式返回管道
- 队列：`QueueClient.enqueueDocumentProcessingJob()` 预留文档解析/向量化投递点

---

## 共享类型（packages/shared）

- `src/models/*`：业务实体（Business/Scene/Document/Chunk/Chat 等）
- `src/dtos/*`：DTO（KMS/Chat/Analytics 请求响应）
- `src/constants/index.ts`：通用常量（分页、队列任务类型）
- `build` 输出到 `dist/`，前后端统一引入 `@project/shared`

---

## 下一步落地建议（启发式）

1. KMS：打通“文档入库→异步处理→状态查询”
   - 在 `DocumentService.createDocument` 中：保存文档为 `processing`，调用 `QueueClient.enqueueDocumentProcessingJob` 投递任务
   - 编写 `DocumentRepository`（存储实现占位，可先用内存 Map），在 `getDocumentStatus` 返回 `DocumentStatusDto`
   - 处理任务流：`handleDocumentProcessingJob` 中完成 解析→切分→向量化→入库→状态更新

2. RAG：补齐检索与生成
   - 在 `RetrievalService` 中封装相似度检索（选型：FAISS/Weaviate/Pinecone 等）
   - 在 `ProviderRegistry`/`providers/*` 中实现大模型补全（先用 DummyProvider，后接 OpenAI）
   - 在 `ChatService.ask` 中编排：向量检索→构建 Prompt→调用模型→落库消息→返回 `AskResponse`
   - 在 `askStream` + 路由中完成 SSE 推流（`text/event-stream`）

3. 数据层选型
   - 事务数据：Prisma + Postgres（或 SQLite 先行）
   - 向量库：本地 FAISS（开发）/ 云端向量库（生产）

4. 前端联调与体验
   - `frontend/lib/*Api.ts` 接口对齐后端路由
   - Chat 页增加输入框与“流式渲染”占位实现
   - KMS 文档列表/详情页读取真实接口

5. 测试与质量
   - 路由测试：Fastify `app.inject` 针对 `/api/kms` 与 `/api/chat`
   - 服务单测：`ChatService`/`DocumentService` 的 happy-path 与异常场景
   - Lint/Typecheck 保持在 CI 中执行

---

## 数据库选型与设计建议

### 当前状态

- 本仓库当前**没有持久化数据库**，KMS 的 `DocumentRepository` 已实现为**内存 Map**（位于 `backend/src/modules/kms/repositories/document.repository.ts`），其他仓储为占位实现。
- 基础 infra 抽象文件存在：`backend/src/infra/db/dbClient.ts`、`backend/src/infra/vector/vectorClient.ts`、`backend/src/infra/queue/queueClient.ts`，用于未来接入真实实现。

### 推荐选型（分层思路）

- 事务/关系型 DB（元数据、业务表）：推荐 Postgres + Prisma（生产）；开发可先用 SQLite + Prisma 以降低上手成本。
- 向量检索（embedding 存储与相似度搜索）：推荐托管/专用向量库（Pinecone、Qdrant、Weaviate、Milvus）。开发时可用 FAISS 本地实现。
- 异步队列：BullMQ + Redis（Node 生态成熟），也可选 RabbitMQ 或云队列（SQS）视部署偏好。

### 示例 schema（Prisma 片段，作为起点）

```prisma
model Business {
	id        String    @id @default(cuid())
	name      String
	createdAt DateTime  @default(now())
	updatedAt DateTime  @updatedAt
	scenes    Scene[]
	documents Document[]
}

model Document {
	id         String   @id @default(cuid())
	businessId String
	sceneId    String?
	title      String
	status     String
	createdAt  DateTime @default(now())
	updatedAt  DateTime @updatedAt
	chunks     DocumentChunk[]
}

model DocumentChunk {
	id         String   @id @default(cuid())
	documentId String
	idx        Int
	content    String   @db.Text
	metadata   Json?
	createdAt  DateTime @default(now())
}
```

### 向量数据设计（两种常见方式）

- 推荐：将 embedding 存放在向量 DB（如 Qdrant/Pinecone），关系 DB 保存 chunk 元数据并带上向量库 id 或直接用 chunkId 作为 metadata。检索流程：先用向量 DB 检索 topK → 从关系 DB 获取完整文本/上下文。
- 备选：使用 Postgres + pgvector（适合小规模/简单场景），但在高并发或大规模数据下可能成为瓶颈。

### 在本仓库中接入的步骤（高层）

1. 在 `backend` 安装并初始化 ORM（如 Prisma）：`npm install prisma --save-dev && npm install @prisma/client`，`npx prisma init`。
2. 编写 `prisma/schema.prisma`，运行迁移：`npx prisma migrate dev --name init`。
3. 在 `backend/src/infra/db/dbClient.ts` 中封装 PrismaClient（connect/disconnect/事务）。
4. 为仓储创建真实实现（例如 `PrismaDocumentRepository`），并保持与现有 repo 的方法签名兼容。
5. 在 `backend/src/server.ts` 用 DI 注册真实仓储与 dbClient（替换内存实现）。
6. 向量库：实现 `infra/vector/vectorClient.ts`（upsert/search），并在 `RetrievalService` 中使用。
7. 队列：实现 `infra/queue/queueClient.ts`（BullMQ），并添加 worker 进程处理文档向量化任务。

### 本地开发与迁移建议

- 本地开发：先用 SQLite + Prisma，向量部分可用简化的 FAISS 或本地 Qdrant 容器。
- 迁移：从内存/测试数据迁移到关系 DB 时写脚本抓取并插入真实 DB；向量数据可批量 upsert 到向量库。

---

---

## 关键文件速览（责任说明）

共享（`packages/shared/`）

- `src/models/business.ts`：业务、场景、文档、分片等实体类型
- `src/models/chat.ts`：聊天会话与消息
- `src/models/analytics.ts`：分析视图数据结构
- `src/dtos/kms.dto.ts`：文档创建/状态/分页 DTO
- `src/dtos/chat.dto.ts`：问答请求/响应/引用 DTO
- `src/dtos/analytics.dto.ts`：分析 DTO（占位）
- `src/constants/index.ts`：分页常量、队列任务类型枚举
- `src/index.ts`：统一导出入口

后端（`backend/src/`）

- `server.ts`：应用入口，装配 DI（客户端、服务、Provider）并监听端口
- `app.ts`：创建 Fastify 实例，注册 CORS 与路由
- `core/container.ts`：简易 DI 容器与 `DI_KEYS`
- `infra/http/router.ts`：聚合并挂载模块路由（KMS/RAG/Analytics/Multimodal）
- `infra/db/dbClient.ts`：数据库客户端占位
- `infra/vector/vectorClient.ts`：向量库客户端占位
- `infra/queue/queueClient.ts`：队列客户端占位（文档处理投递）
- `modules/kms/routes/kms.router.ts`：KMS 路由（创建文档、查询状态）
- `modules/kms/services/document.service.ts`：文档入库/状态/任务处理编排
- `modules/kms/repositories/*`：KMS 仓储占位
- `modules/rag/routes/chat.router.ts`：问答与流式问答路由占位
- `modules/rag/services/ChatService.ts`：问答编排（检索→补全→落库）
- `modules/rag/services/RetrievalService.ts`：检索服务（相似度搜索）
- `modules/rag/services/ProviderRegistry.ts`：模型提供方注册/选择器
- `modules/rag/services/providers/*`：具体模型提供方（OpenAI/Dummy）
- `modules/analytics/routes/analytics.router.ts`：分析健康检查占位
- `modules/multimodal/*`：多模态相关占位

前端（`frontend/`）

- `app/*`：App Router 页面结构（KMS/Chat/Analytics）
- `lib/apiClient.ts`：统一 fetch 封装（读取 `NEXT_PUBLIC_API_BASE_URL`）
- `lib/kmsApi.ts`：KMS 接口封装占位
- `lib/chatApi.ts`：问答接口与 SSE 占位
- `lib/analyticsApi.ts`：分析接口占位

---

## 备注

- 代码目前以“结构与类型”为主，核心业务实现与外部集成（DB/向量库/大模型/队列）均为占位，便于分阶段落地。
- 已对 ESLint / TypeScript 做好 Monorepo 兼容配置；共享包在 `dev` 模式下开启 watch，保证 FE/BE 实时获得最新类型。
- 已实现最小 KMS 流：`POST /api/kms/documents` 创建文档并设为 `processing`，约 150ms 后自动转为 `active`，可用 `GET /api/kms/documents/:id/status` 轮询查看。

---

## 最小示例：创建文档并查看状态

创建文档：

```bash
curl -X POST http://localhost:3001/api/kms/documents \
	-H "Content-Type: application/json" \
	-d '{"businessId":"b1","sceneId":"s1","title":"测试文档"}'
```

响应示例：

```json
{
  "id": "doc_xxxxx",
  "businessId": "b1",
  "sceneId": "s1",
  "title": "测试文档",
  "status": "processing",
  "createdAt": "...",
  "updatedAt": "..."
}
```

查询状态：

```bash
curl http://localhost:3001/api/kms/documents/doc_xxxxx/status
```

初始：

```json
{ "id": "doc_xxxxx", "status": "processing", "updatedAt": "..." }
```

约 150ms 后：

```json
{ "id": "doc_xxxxx", "status": "active", "updatedAt": "..." }
```

说明：

- 当前实现为纯内存，不持久化；重新启动服务或热重载会丢失数据。
- 后续可替换 `DocumentRepository` 为数据库实现，并改用真实队列 + 向量处理逻辑。

# 工程上下文 (EngineeringContext)

> 面向协作开发与代码智能代理（code agent）的架构概要。此文档旨在帮助新加入的工程师或自动化助手快速建立对项目层次、模块职责、依赖注入机制、开发流程与扩展约定的统一认知。

---

## 1. 分层总览

| 层级                           | 说明                                                          | 典型目录                                 |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------------------- |
| 表现层 (Frontend)              | Next.js 14 App Router，负责 UI、交互、发起 API 请求、SSE 订阅 | `frontend/app`, `frontend/lib`           |
| 接入层 (HTTP Routes)           | Fastify 路由，将 HTTP 请求转交对应业务服务，做基础验证/序列化 | `backend/src/modules/*/routes`           |
| 业务服务层 (Services)          | 编排核心业务逻辑（创建文档、检索、问答、分析等）              | `backend/src/modules/*/services`         |
| 仓储/数据访问层 (Repositories) | 读写实体数据、与数据库或持久化系统交互（当前多数为占位/内存） | `backend/src/modules/*/repositories`     |
| 基础设施 (Infra Clients)       | 对外部系统的抽象：数据库、向量库、队列、中间件                | `backend/src/infra/*`                    |
| 共享类型 (Shared Types)        | 前后端通用模型、DTO、常量                                     | `packages/shared/src`                    |
| 横切关注 (Cross-cutting)       | DI 容器、配置、日志、错误处理、队列/SSE 扩展点                | `backend/src/core`, `backend/src/config` |

分层设计目标：低耦合、可替换、便于测试。服务不直接依赖具体实现，而通过 DI 容器解析抽象。

---

## 2. 依赖注入 (DI) 机制

文件：`backend/src/core/container.ts`

核心概念：

- `Container`：维护 `factories` 与 `singletons`，通过字符串 token (`DI_KEYS`) 注册与解析。
- `DI_KEYS`：集中定义所有可解析组件的键，避免字符串散落。

注册模式：

```ts
container.registerSingleton(DI_KEYS.QueueClient, () => createQueueClient());
container.register(DI_KEYS.DocumentService, () => new DocumentService(container));
```

解析模式（路由内）：

```ts
const service = container.resolve<DocumentService>(DI_KEYS.DocumentService);
```

扩展建议：

1. 添加新服务：更新 `DI_KEYS` → 创建 service 文件 → 在 `server.ts` 中注册。
2. 更换实现：保持 `DI_KEYS` 不变，替换注册工厂即可（对调用方透明）。
3. 动态配置：可在工厂内读取 `.env` 或配置模块注入。必要时引入更强大的容器（如 Inversify）。

错误处理：`resolve` 找不到 key 时抛出明确错误；避免静默失败。

---

## 3. 关键目录与文件职责

### 3.1 Shared (`packages/shared`)

- `models/*`：领域实体（Business / Scene / Document / Chunk / ChatSession / ChatMessage / Analytics Models）。
- `dtos/*`：前后端交互的请求/响应结构，稳定向后兼容；新增字段需保证可选或做好版本演进策略。
- `constants/index.ts`：分页大小、队列任务类型等不会频繁变更的项目级常量。
- `index.ts`：统一导出，供 `@project/shared` 被前后端引用。

### 3.2 Backend 核心

- `server.ts`：应用启动入口；组装 DI、注册 Provider；监听端口。
- `app.ts`：创建 Fastify 实例、注册 CORS、挂载路由。
- `infra/http/router.ts`：按模块聚合路由。
- `core/container.ts`：DI 容器与 token 管理。
- `config/env.ts`：环境变量加载与结构化配置。
- `config/logger.ts`：日志（可扩展为 bunyan/pino 等）。

### 3.3 Backend 模块示例 (KMS / RAG / Analytics / Multimodal)

- 路由 (`routes/*.router.ts`)：解析请求体与参数 → 调用对应 Service → 返回 DTO。
- 服务 (`services/*.ts`)：编排业务动作；不做复杂协议转换；保持纯逻辑。
- 仓储 (`repositories/*.ts`)：屏蔽底层存储细节（当前内存实现/占位）。
- Provider 与引擎：RAG 模块中的模型提供方策略 / 检索服务。

### 3.4 Frontend

- `app/*`：Next.js 页面与布局结构；仅做轻逻辑与展示。
- `lib/apiClient.ts`：统一封装 fetch（基础 URL + JSON 处理）。
- `lib/*Api.ts`：按模块分的 API 调用层，对后端路由进行语义包装。
- 状态管理（未来可选）：React Query / Zustand / Redux，根据复杂度演进。

---

## 4. 开发 / 测试 / 运行流程

### 4.1 常用命令（根目录）

```powershell
npm run dev              # shared watch + frontend + backend
npm run dev:frontend:ws  # 仅前端 + shared watch
npm run dev:backend:ws   # 仅后端 + shared watch
npm run typecheck        # 前后端类型检查
npm run lint             # ESLint 检查
npm run build            # 构建 shared → frontend → backend
npm run start:backend    # 启动编译后的后端
npm run start:frontend   # 启动编译后的前端
```

### 4.2 代码迭代典型循环

1. 新增/修改 shared 类型 → watch 自动重新编译 → 前后端立即可用。
2. 后端添加路由与服务 → `npm run dev:backend:ws` 热更新。
3. 前端调用新接口 → 填充页面占位数据 → 手动或自动测试。
4. 编写单测（服务逻辑优先，其次路由）→ 引入真实或模拟 Provider/Repo。
5. 提交前：`npm run lint && npm run typecheck`（husky 可自动执行）。

### 4.3 测试策略建议

- 单元测试：服务层纯逻辑（模拟仓储与 Provider）。
- 集成测试：使用 Fastify `app.inject` 直接调用路由。
- 端到端（后期）：真实队列 + 向量检索 + LLM 调用流程串联。

---

## 5. 扩展与变更指南

### 5.1 新增模块 (例如“通知模块”)

1. 创建目录：`backend/src/modules/notify`（routes/services/repositories）。
2. 在 `DI_KEYS` 中加入相关 token。
3. 在 `server.ts` 注册服务及依赖。
4. 在 `infra/http/router.ts` 中注册路由前缀。
5. 在 shared 中新增必要模型/DTO（避免重复定义）。

### 5.2 引入真实数据库

1. 选择 ORM（Prisma）与数据库（Postgres）。
2. 在 `infra/db/dbClient.ts` 实现连接与关闭逻辑。
3. 替换仓储：由内存 Map → Prisma Client；确保方法签名不变。
4. 编写迁移脚本与环境变量 (`DB_URL`).

### 5.3 向量检索上线

1. 选型：FAISS（本地）或云向量库（Pinecone/Weaviate）。
2. 在 `infra/vector/vectorClient.ts` 抽象：`upsertEmbedding(documentId, chunkIndex, vector)`、`search(queryVector, topK)`。
3. 在 `RetrievalService` 中组合 embedding + search。

### 5.4 队列处理

1. 使用 BullMQ + Redis；在 `infra/queue/queueClient.ts` 中封装 `enqueueDocumentProcessingJob`。
2. 新建一个 `worker` 入口（独立进程）执行文档解析/切分/embedding。
3. 处理完成后更新文档状态并写入 chunks。

### 5.5 SSE 流式回答

1. 在路由 `/api/chat/ask/stream` 设置：`Content-Type: text/event-stream`、`Cache-Control: no-cache`、`Connection: keep-alive`。
2. 实现 `ChatService.askStream`：检索 → 构建 prompt → 调用模型 → token 回调写入 `event: message` + `data: <chunk>`。
3. 结束时发送 `event: end`。

### 5.6 DTO 与版本演进

- DTO 新增字段默认可选，避免破坏兼容。
- 若出现不可兼容改动（删除/重命名），需通过版本前缀 `/api/v2/*` 或响应中包含 `version` 字段。

### 5.7 错误处理约定

- 服务层抛出标准 `Error`（或自定义错误类型）；路由层转换成 `{ error: message }`。
- 后续可集中定义错误类型（ValidationError / NotFoundError / ConflictError）。

### 5.8 命名约定

- 文件与目录使用小写+中划线或小写驼峰（当前风格：驼峰 + 点后缀）。
- DTO/模型使用 PascalCase 接口命名；枚举使用 PascalCase；常量全大写或驼峰根据语义保持统一。

---

## 6. 最小 KMS 流实现说明

当前已在内存中实现：

- `DocumentRepository`：使用 Map 保存文档。
- `DocumentService.createDocument`：创建后状态为 `processing`，异步定时器模拟处理完成 → `active`。
- `GET /api/kms/documents/:id/status`：轮询查看最新状态。

迁移建议：

1. 替换为真实队列 + worker，提高可伸缩性。
2. 文档处理链可记录日志与事件（后续可做进度流式推送）。

---

## 7. 代码智能代理协作提示

为避免 agent 误操作，推荐：

- 修改涉及 shared 类型时，确保对应前后端编译通过再提交。
- 不随意更改 `DI_KEYS` 已存在的 token 名称；新增可尾部加模块前缀避免冲突。
- 大规模重构（例如更换 ORM）应先在本文件新增“迁移计划”段落再执行。
- 在 PR 中引用本文件相关章节（例如“5.2 引入真实数据库”）作为变更说明。

### 7.1 代码风格与格式化约束

- 项目代码风格的唯一来源是根目录下的 `.eslintrc.cjs`、`.prettierrc.json` 与 `.prettierignore`（README“代码风格”一节也记录要点）。**任何 agent 在阅读或生成代码前，必须先读取上述文件，确认当前约束，再按照约束书写代码。**
- 主要规则（概览）：TypeScript/React 规则基于 `eslint:recommended` + `@typescript-eslint` + `react`，通过 `plugin:prettier/recommended` 强制 Prettier 结果，并启用了 `@typescript-eslint/naming-convention`（默认 camelCase，const 可 camelCase/UPPER_CASE，类型/枚举为 PascalCase，带引号属性不强制）。Prettier 采用 `printWidth=100`、2 空格缩进、单引号、必须分号、无尾随逗号、LF 行尾。
- 所有 JS/TS/TSX/CJS/MJS 文件提交前必须通过 `npx lint-staged`（Husky 自动调用）。若 agent 以非 git 流程修改文件，也需要显式运行 `npm run format` 和 `npm run lint`（需在 Git Bash 环境下执行）来验证。
- 若需新增或调整风格规则，必须先在 `AGENT_LOG.md` Claim（因为涉及 `.eslintrc.cjs`、`.prettierrc` 等关键文件），并在本节记录新的要求，确保后续 agent 有据可依。

---

## 8. 后续改进占位

- 安全：鉴权中间件、角色权限（在路由层插入）。
- 观测：统一请求日志 + 性能指标（pino + OpenTelemetry）。
- 配置：集中化配置管理（dotenv + schema 校验）。
- 部署：Docker Compose（Postgres + Redis + 服务 + 前端）。
- 监控：健康检查扩展 `/api/health` 汇总各模块状态。

---

## 协作与 AI agent 协调日志

本项目提供一个全局协调日志 `AGENT_LOG.md`（仓库根目录），作为所有 code agent 与人工协作者的“单一事实来源”。在修改共享节点或全局配置前，自动化 agent 一定要：

- 读取 `AGENT_LOG.md` 的最新条目以确认当前未被占用的任务或没有未完成的 Claim；
- 先追加一个 `Claim` 条目（说明拟修改的文件/分支/目的），再开始变更；
- 变更完成后追加 `Done` 条目并包含 commit id 与后续步骤；

## 强制性约束（必须遵守）

为避免自动 agent 间的竞态和潜在破坏性改动，本仓库**强制性约定**：任何自动化 agent 在修改下列“关键/共享”文件或目录之前，必须自动调用 `scripts/agent-log.js`（或等价工具）提交一条 `Claim` 条目，且在变更完成后提交 `Done` 条目：

- `packages/shared/**`
- 根级配置：`package.json`, `tsconfig.base.json`, `.eslintrc.cjs`, `.prettierrc`
- `backend/src/core/DI_KEYS*`（即 `DI_KEYS` 定义处）
- `backend/src/infra/**`（db/vector/queue 客户端）

任何 agent 在检测到自己未能成功写入 Claim（例如脚本返回错误或没有写入日志）时，应立刻中止修改并回滚变更。下方给出推荐的调用示例，agent 必须以同步或可断言成功的方式执行：

命令行示例：

```bash
# Claim
node ./scripts/agent-log.js -- --actor "agent-01" --type Claim --title "Modify shared types" --scope "packages/shared/src/models/*" --branch "feat/my-change"

# After changes, Done
node ./scripts/agent-log.js -- --actor "agent-01" --type Done --title "Modify shared types" --scope "packages/shared/src/models/*" --commit "<commit-hash>"
```

NodeJS 自动调用示例（agent 代码片段，必须检查退出码或异常并在失败时中止）:

```js
const { execSync } = require('child_process');
function claimOrAbort(actor, title, scope, branch) {
  const cmd = `node ./scripts/agent-log.js -- --actor "${actor}" --type Claim --title "${title}" --scope "${scope.join(',')}" --branch "${branch}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    throw new Error('Failed to write Claim to AGENT_LOG.md — aborting change');
  }
}

function doneRecord(actor, title, scope, commit) {
  const cmd = `node ./scripts/agent-log.js -- --actor "${actor}" --type Done --title "${title}" --scope "${scope.join(',')}" --commit "${commit}"`;
  execSync(cmd, { stdio: 'inherit' });
}

// Usage example in agent workflow
claimOrAbort(
  'agent-01',
  'Modify shared types',
  ['packages/shared/src/models/business.ts'],
  'feat/my-change',
);
// perform edits and git operations here
doneRecord(
  'agent-01',
  'Modify shared types',
  ['packages/shared/src/models/business.ts'],
  'abc123def',
);
```

审计与故障处理：如果 agent 在写 Claim 后长时间未提交 Done，应当追加 `Blocked` 条目说明原因；若写入失败多次，应通知人工维护者并停止相关自动化任务。

仓库中也提供了一个小工具 `scripts/agent-log.js`，以及 `npm run agent:log` 快捷脚本，用于以标准格式追加条目，要求所有 agent 使用此工具以保证格式一致并便于自动解析。

如需新增章节，请保持：编号递增、标题简洁、内容面向“快速理解与安全改动”。

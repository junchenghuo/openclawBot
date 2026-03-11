# OpenClaw 二次开发版（openclawBot）

本仓库是基于官方 OpenClaw 项目进行的二次开发版本，主要面向中文用户和本地部署场景，聚焦于：

- OpenClaw 网关与控制台的可用性改造
- Web 配置页面（`/config`）的中文汉化
- 配置字段说明、分组描述、按钮文案的中文可读性优化

上游项目：`https://github.com/openclaw/openclaw`

## 作者简介

### 霍钧城（分布式 AI 架构师）

具备多年企业级研发与架构经验，长期聚焦“高并发分布式系统 + 业务中台 + AI Agent 工程化落地”的融合实践。

联系方式：`howard_007@163.com`

- 擅长企业级架构设计与高可用治理，具备从单体到微服务的演进经验。
- 深度参与 B2B2C 电商与供应链核心链路建设，具备支付中台与分账结算实践。
- 聚焦 AI Agent 工程化落地，覆盖 RAG、Tool Calling、MCP 与 Skills 资产化建设。

---

## 项目定位

OpenClaw 是一个运行在你自己设备上的个人 AI 助手框架，支持多渠道消息接入、网关控制、工具调用和设备节点能力。

本仓库在保持官方架构的前提下，重点做了中文化和工程化补强，便于直接落地到中文使用环境。

---

## 二次开发重点

### 1) Web 控制台中文化（重点）

针对 `http://127.0.0.1:18789/config` 的配置控制台完成多层汉化改造：

- 顶层 UI 文案：按钮、状态、空态提示
- 分组级文案：Section 标题与描述
- 字段级文案：`label/help` 按路径翻译
- 中文兜底机制：未手工翻译字段也能给出中文技术说明

### 2) 术语策略

采用“可翻译词中文化 + 技术名词保留英文”的策略，避免误翻导致语义偏差。

例如：`Gateway`、`WebSocket`、`Token`、`Cron`、`Node`、`CLI` 等保持英文，行为词和描述词使用中文。

### 3) 可持续扩展

已建立路径化翻译与兜底机制，后续只需按高频模块补充词条，即可持续提升翻译质量。

---

## 汉化改造记录（摘要）

更新时间：`2026-03-04`

核心改造文件：

1. `ui/src/ui/views/config.ts`
2. `ui/src/ui/views/config-form.render.ts`
3. `ui/src/ui/views/config-form.node.ts`
4. `ui/src/i18n/locales/en.ts`
5. `ui/src/i18n/locales/zh-CN.ts`
6. `ui/src/i18n/lib/config-localization.ts`（新增）

当前覆盖效果：

- Config 页面操作层文案已中文化
- 分组（Section）标题与描述已中文化
- 字段 `label/help` 以中文优先显示
- 未手工补词条字段由规则引擎提供中文兜底

---

## 快速开始（源码运行）

运行环境：`Node >= 22`

```bash
pnpm install
pnpm ui:build
pnpm build
pnpm openclaw onboard --install-daemon
```

常用开发命令：

```bash
# 网关开发模式（监听变更）
pnpm gateway:watch

# 代码检查
pnpm check

# 测试
pnpm test
```

官方文档：

- `https://docs.openclaw.ai/start/getting-started`
- `https://docs.openclaw.ai/gateway/configuration`
- `https://docs.openclaw.ai/gateway/security`

---

## 汉化生效流程

每次修改前端文案后，建议执行：

```bash
pnpm ui:build
openclaw gateway stop
openclaw gateway install
```

然后在浏览器对配置页强制刷新（`Cmd + Shift + R`）。

---

## 重新同步上游后的复用建议

当拉取上游最新代码导致汉化改动被覆盖时，按以下顺序恢复：

1. 先确认 `ui/src/i18n/lib/config-localization.ts` 是否仍在
2. 检查 `config.ts` / `config-form.render.ts` / `config-form.node.ts` 是否仍调用本地化函数
3. 在 `ui/src/i18n/locales/zh-CN.ts` 继续补高频字段词条（优先 `gateway`、`tools`、`messages`、`session`）
4. 重新执行 `pnpm ui:build` 并验证页面文案

---

## 目录建议（给二次开发者）

- `ui/src/i18n/locales/zh-CN.ts`：中文词条主入口
- `ui/src/i18n/lib/config-localization.ts`：路径规则与兜底逻辑
- `ui/src/ui/views/config*.ts`：配置页面渲染逻辑
- `src/`：CLI、网关与核心能力
- `apps/`：iOS / Android / macOS 端相关代码

---

## 作者介绍

### 霍钧城（分布式 AI 架构师）

具备多年企业级研发与架构经验，长期聚焦“高并发分布式系统 + 电商交易中台 + AI 应用落地”的融合架构实践。

联系方式：`howard_007@163.com`

**技术架构能力（Technical Architecture）**

- 具备从单体到微服务的架构演进经验，熟悉 Spring Cloud、网关、配置中心、任务调度、消息中间件与可观测体系建设。
- 擅长高并发与高可用设计，围绕缓存分层、异步解耦、分布式锁、最终一致性、熔断限流等方案提升系统稳定性。
- 有云原生工程化落地经验，能够基于 Docker/K8s/Jenkins/DevOps 构建持续交付与自动化发布体系。

**业务架构能力（Business Architecture）**

- 深度参与 B2B2C 电商与供应链场景，覆盖商品、订单、库存、支付、分账、结算、对账等核心链路。
- 具备统一支付中台设计经验，支持多支付渠道接入、多级分账与实时结算，保障交易链路一致性与可追踪性。
- 强调平台化与中台化建设，通过通用能力抽象与组件复用，支撑多端业务持续迭代与规模增长。
- 面向业务智能化升级，推动企业级 Agent 在客服、运营、风控、供应链协同等场景落地，形成“人+AI+系统”协作闭环。
- 具备数字员工体系设计经验，围绕岗位职责、工具权限、SOP 流程与绩效指标构建可运营的 AI Workforce。

**AI 架构能力（AI Architecture / Agent Engineering）**

- 具备大模型平台化搭建与使用能力，支持多模型接入、模型路由、推理参数治理与成本/延迟/效果平衡。
- 基于 Spring AI + Qwen/DeepSeek/OpenAI 等模型构建企业级 AI 应用，覆盖智能问答、流程自动化、AI Copilot 与数字员工。
- 采用 RAG + Hybrid Search（向量检索 + 关键词检索）+ Rerank 架构，提升企业知识问答准确率与可解释性。
- 结合 Function Calling / Tool Calling 打通“自然语言意图 -> 业务操作执行”闭环，实现 Agentic Workflow 的工程化落地。
- 构建 MCP（Model Context Protocol）工具生态，沉淀 MCP Server 与标准化能力接口，支持跨系统工具编排与安全调用。
- 建设 Skills（技能）资产体系，将高频业务能力封装为可复用 Skill，支持版本化、灰度发布与持续迭代。
- 推动 Multi-Agent 协作模式，在复杂任务中通过 Planner/Executor/Reviewer 等角色分工提升稳定性与产出质量。
- 强化 AI 工程化治理（PromptOps、EvalOps、Guardrails、Observability），实现从 PoC 到 Production 的可持续演进。

该仓库的中文化改造与二次开发方向，也延续了上述方法论：先做稳定架构，再做业务可用，最后做 AI 能力融合与持续迭代。

---

## 说明

- 本仓库用于 OpenClaw 的本地二次开发与中文化维护。
- 如需对齐官方最新能力，请定期同步上游并按“复用建议”回灌汉化层。
- 欢迎继续补充词条和优化中文术语一致性。

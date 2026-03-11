import { i18n, t } from "./translate.ts";

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

function hasAsciiLetters(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

function normalizeSegment(raw: string): string[] {
  return raw
    .replace(/\*/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

const WORD_MAP: Record<string, string> = {
  env: "环境",
  shell: "Shell",
  import: "导入",
  enabled: "启用",
  timeout: "超时",
  ms: "毫秒",
  vars: "变量",
  variable: "变量",
  variables: "变量",
  overrides: "覆盖",
  override: "覆盖",
  setup: "设置",
  wizard: "向导",
  last: "最近",
  run: "运行",
  command: "命令",
  mode: "模式",
  version: "版本",
  config: "配置",
  diagnostics: "诊断",
  logging: "日志",
  log: "日志",
  update: "更新",
  updates: "更新",
  check: "检查",
  checks: "检查",
  auto: "自动",
  stable: "稳定",
  beta: "测试",
  interval: "间隔",
  hours: "小时",
  hour: "小时",
  minutes: "分钟",
  minute: "分钟",
  seconds: "秒",
  second: "秒",
  gateway: "Gateway",
  auth: "认证",
  token: "Token",
  password: "密码",
  trusted: "受信任",
  trust: "信任",
  proxy: "代理",
  bind: "绑定",
  tailscale: "Tailscale",
  tls: "TLS",
  remote: "远程",
  transport: "传输",
  url: "URL",
  ssh: "SSH",
  node: "Node",
  host: "主机",
  port: "端口",
  api: "API",
  control: "控制",
  ui: "界面",
  tools: "工具",
  tool: "工具",
  allow: "允许",
  allowlist: "允许列表",
  deny: "拒绝",
  denylist: "拒绝列表",
  list: "列表",
  also: "附加",
  by: "按",
  from: "来源",
  to: "到",
  on: "在",
  off: "关闭",
  profile: "配置档",
  provider: "Provider",
  providers: "Provider",
  default: "默认",
  defaults: "默认项",
  channel: "频道",
  channels: "频道",
  message: "消息",
  messages: "消息",
  chat: "聊天",
  commands: "命令",
  hooks: "Hooks",
  skills: "技能",
  agents: "代理",
  agent: "代理",
  models: "模型",
  model: "模型",
  browser: "浏览器",
  session: "会话",
  sessions: "会话",
  cron: "Cron",
  web: "Web",
  discovery: "发现",
  policy: "策略",
  scope: "范围",
  rules: "规则",
  rule: "规则",
  limit: "限制",
  limits: "限制",
  max: "最大",
  min: "最小",
  bytes: "字节",
  chars: "字符",
  history: "历史",
  queue: "队列",
  debounce: "防抖",
  retry: "重试",
  retries: "重试",
  delay: "延迟",
  jitter: "抖动",
  threshold: "阈值",
  thresholds: "阈值",
  stream: "流式",
  streaming: "流式",
  search: "搜索",
  fetch: "抓取",
  cache: "缓存",
  flush: "刷新",
  trace: "追踪",
  name: "名称",
  prompt: "提示词",
  include: "包含",
  only: "仅",
  cross: "跨",
  context: "上下文",
  thread: "线程",
  group: "群组",
  status: "状态",
  send: "发送",
  reset: "重置",
  maintenance: "维护",
  compaction: "压缩",
  batch: "批量",
  entry: "条目",
  entries: "条目",
  mapping: "映射",
  mappings: "映射",
  binding: "绑定",
  bindings: "绑定",
  loop: "循环",
  detection: "检测",
  elevated: "高权限",
  exec: "Exec",
  fs: "FS",
  links: "链接",
  link: "链接",
  memory: "记忆",
  media: "媒体",
  plugins: "插件",
  plugin: "插件",
  path: "路径",
  file: "文件",
  files: "文件",
  key: "键",
  keys: "键",
  id: "ID",
  size: "大小",
  rate: "速率",
  security: "安全",
  reload: "重载",
  apply: "应用",
};

const TECH_TERMS: Record<string, string> = {
  openclaw: "OpenClaw",
  gateway: "Gateway",
  websocket: "WebSocket",
  control: "Control",
  ui: "UI",
  api: "API",
  url: "URL",
  http: "HTTP",
  https: "HTTPS",
  tls: "TLS",
  ssh: "SSH",
  json: "JSON",
  json5: "JSON5",
  cli: "CLI",
  shell: "Shell",
  tailscale: "Tailscale",
  oauth: "OAuth",
  token: "Token",
  webhook: "Webhook",
  cron: "Cron",
  node: "Node",
};

const PATH_LABEL_OVERRIDES_ZH: Record<string, string> = {
  "tools.agentToAgent": "代理间工具访问",
  "tools.agentToAgent.enabled": "启用代理间工具",
  "tools.agentToAgent.allow": "代理目标允许列表",
  "tools.allow": "工具允许列表",
  "tools.alsoAllow": "工具附加允许列表",
  "tools.byProvider": "按 Provider 配置工具策略",
  "tools.deny": "工具拒绝列表",
  "tools.elevated": "高权限工具访问",
  "tools.elevated.enabled": "启用高权限工具访问",
  "tools.elevated.allowFrom": "高权限工具允许规则",
  "tools.exec": "命令执行工具 (Exec)",
  "tools.exec.host": "Exec 执行主机",
  "tools.exec.security": "Exec 安全策略",
  "tools.exec.ask": "Exec 审批策略",
  "tools.exec.node": "Exec Node 绑定",
  "tools.fs": "文件系统工具 (FS)",
  "tools.fs.workspaceOnly": "仅限工作区的文件系统工具",
  "tools.links": "链接理解工具",
  "tools.loopDetection": "工具循环检测",
  "tools.profile": "工具预设档",
  "tools.web": "Web 工具",
};

const TAG_MAP: Record<string, string> = {
  security: "安全",
  auth: "认证",
  network: "网络",
  access: "访问",
  privacy: "隐私",
  observability: "可观测",
  performance: "性能",
  reliability: "稳定性",
  storage: "存储",
  models: "模型",
  media: "媒体",
  automation: "自动化",
  channels: "频道",
  tools: "工具",
  advanced: "高级",
};

function translateByPath(pathKey: string): string {
  if (!pathKey) {
    return "";
  }
  const segments = pathKey.split(".").filter(Boolean);
  const translatedSegments: string[] = [];
  for (const segment of segments) {
    const parts = normalizeSegment(segment);
    if (parts.length === 0) {
      continue;
    }
    const translatedParts = parts.map((part) => TECH_TERMS[part] ?? WORD_MAP[part] ?? part);
    let joined = translatedParts.join(" ");
    joined = joined.replace(/超时 毫秒/g, "超时（毫秒）");
    joined = joined
      .replace(/允许 列表/g, "允许列表")
      .replace(/拒绝 列表/g, "拒绝列表")
      .replace(/默认 项/g, "默认项")
      .replace(/流式 检测/g, "流式检测")
      .replace(/防抖/g, "防抖")
      .replace(/Exec Host/g, "Exec 主机")
      .replace(/Exec Security/g, "Exec 安全策略")
      .replace(/Exec Ask/g, "Exec 审批策略")
      .replace(/FS tools/gi, "FS 工具")
      .replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, "$1$2")
      .trim();
    translatedSegments.push(joined);
  }
  return translatedSegments.join(" ").trim();
}

function zhFallbackLabel(pathKey: string, fallback: string): string {
  if (i18n.getLocale() !== "zh-CN") {
    return fallback;
  }
  if (hasChinese(fallback)) {
    return fallback;
  }
  if (!hasAsciiLetters(fallback)) {
    return fallback;
  }
  const override = PATH_LABEL_OVERRIDES_ZH[pathKey];
  if (override) {
    return override;
  }
  const byPath = translateByPath(pathKey);
  if (byPath) {
    return byPath;
  }
  return fallback;
}

function zhFallbackHelp(pathKey: string, label: string, fallback?: string): string | undefined {
  if (!fallback) {
    return fallback;
  }
  if (i18n.getLocale() !== "zh-CN") {
    return fallback;
  }
  if (hasChinese(fallback)) {
    return fallback;
  }
  if (!hasAsciiLetters(fallback)) {
    return fallback;
  }
  const defaultMatch = fallback.match(/\(default:\s*([^)]+)\)/i);
  const defaultHint = defaultMatch ? ` 默认值：${defaultMatch[1]}。` : "";
  const topic = label || translateByPath(pathKey) || "该配置项";
  return `用于配置「${topic}」。该项会影响 OpenClaw 在当前系统环境中的运行行为，请按部署与安全策略调整。${defaultHint}`;
}

export function localizeConfigTag(tag: string): string {
  if (i18n.getLocale() !== "zh-CN") {
    return tag;
  }
  const mapped = TAG_MAP[tag.toLowerCase()];
  if (!mapped) {
    return tag;
  }
  return `${mapped} (${tag})`;
}

export function localizeConfigFieldLabel(pathKey: string, fallback: string): string {
  const key = `config.fields.${pathKey}.label`;
  const value = t(key);
  if (value !== key) {
    return value;
  }
  return zhFallbackLabel(pathKey, fallback);
}

export function localizeConfigFieldHelp(
  pathKey: string,
  label: string,
  fallback?: string,
): string | undefined {
  const key = `config.fields.${pathKey}.help`;
  const value = t(key);
  if (value !== key) {
    return value;
  }
  return zhFallbackHelp(pathKey, label, fallback);
}

export function localizeConfigSectionLabel(sectionKey: string, fallback: string): string {
  const key = `config.sections.${sectionKey}.label`;
  const value = t(key);
  if (value !== key) {
    return value;
  }
  return zhFallbackLabel(sectionKey, fallback);
}

export function localizeConfigSectionDescription(
  sectionKey: string,
  label: string,
  fallback: string,
): string {
  const key = `config.sections.${sectionKey}.description`;
  const value = t(key);
  if (value !== key) {
    return value;
  }
  return zhFallbackHelp(sectionKey, label, fallback) ?? fallback;
}

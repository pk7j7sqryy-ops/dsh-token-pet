# Token 泡泡 (Token Pet) 🐻
<img width="2426" height="1340" alt="Weixin Image_2026-08-15_233831_465" src="https://github.com/user-attachments/assets/732913a1-b8de-42a7-a084-bef87814aafe" />


> DeepSeek Harness (DSH) 动态 Cordis 插件 · `dsh-plugin`

一个给 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 用的**动态 Cordis 插件**（Host + Client 两半），在会话头部右上角嵌一个卡通「布布」玩偶，实时展示当前会话的 **Token 用量**，并附带 **今天日期/周几 + 实时天气 + 未来 3 天预报 + 极端天气预警**，全程跟随主题色自适应深浅色。

> 动态插件是「进程内临时扩展」：源码不落盘、重启即失效，通过 DSH 的 `cordis_define` / `cordis_run` 工具激活。本仓库提供可复用的源码 + 说明。

## 功能特性

- **嵌入右上角，不悬浮**：挂在 `conversation.session.header.utilities`（会话头部右上角工具区），和「下载日志」等原生按钮并排，是正常布局流的一部分。
- **今天日期 / 周几**：`📅 8月15日 · 周五`，用浏览器本地时区实时计算，零网络。
- **实时天气**：`☀️ 晴 26°C`（点击可刷新；悬停显示城市），由 Host 通过 IP 定位（ipwho.is）+ Open-Meteo 拉取，缓存 30 分钟；失败时优雅降级为「天气不可用」，不影响其它功能。
- **未来 3 天预报**：今天 / 明天 / 后天逐日天气（图标 + 最高/最低温）。
- **卡通用量小部件**：
  - 折叠态是一个圆角小药丸：布布玩偶 + 占用百分比。
  - 展开态（点药丸 / Esc 或点外部收起）：
    - 📅 今天日期周几 + 🌤 天气
    - 🗓 未来 3 天预报
    - 🎯 上下文占用：主题色进度条 + `已用 / 窗口上限`，绿 → 黄 → 红渐变。
    - 📊 本会话累计：输入 / 输出 / 缓存读 / 缓存写（含合计）。
    - 🧩 上下文构成：系统提示 / 工具定义 / 消息内容。
    - 💬 布布的台词，随占用变化。
- **表情玩偶「布布」**：内联 SVG 圆脸小布偶，表情随用量变化：
  - 无数据 → 闭眼微笑
  - <40% → 圆眼大笑
  - 40–70% → 微笑
  - 70–90% → 皱眉扁嘴
  - ≥90% → 瞪眼张嘴 + 冒汗 + 进度条脉冲
- **极端天气预警**：按 WMO 天气代码识别暴雨 / 雷暴 / 大雪，触发红色警告条 + 动画雨滴（🌧）或雪花（🌨）粒子，折叠药丸上也亮一个闪烁提示图标；若未来 3 天里有严重天气（明天/后天），也会提前预警「明天 雷暴，注意防范」。
- **跟随主题色**：全部颜色走 `--dsw-alias-*` CSS 变量，深/浅色自动适配，零硬编码 UI 色（布偶本体为角色固有色）。
- **Token 零请求**：token 数据直接复用宿主已投射到前端的投影；天气走 Host `web` 服务（正规网络能力）。

## 效果示意

> 占位：上线后补一张截图（折叠药丸 + 展开卡片，深/浅色各一张）。

## 技术实现

| 能力 | 选型 | 说明 |
|------|------|------|
| 挂载位置 | `conversation.session.header.utilities` Slot | additive，`replaceRisk: none`，不会替换原生 UI |
| Token 数据 | `useProjection` 标准 prop | 读 `contextPressure` / `tokenUsage` / `contextBreakdown` 三个投影 |
| 占用口径 | `projectedTokens ?? pressureTokens` ÷ `contextWindow` | 与官方 ContextMeter 一致：能立刻反映压缩效果 |
| 日期/周几 | Client 本地 `new Date()` | 浏览器本地时区，零网络 |
| 天气 | Host `harness.handle('weather')` | IP 定位（ipwho.is）→ Open-Meteo（current + daily 3 天）；Host 缓存 30 分钟 |
| 网络能力 | `web.fetch` 优先，回退 `shell`+curl | 桌面 DSH 常无 fetch provider，故失败时用 curl 兜底；均不可用则降级 |
| 样式 | `styles.insert(css)` | Package 私有样式，随插件停用自动清理 |
| 主题 | `--dsw-alias-bg-overlay`、`--dsw-alias-label-*`、`--dsw-alias-state-{success,warn,error}-primary`、`--dsw-shadow-lv3` | 深浅色自适应 |

## 文件结构

```
.
├── client.js   # Client 半：UI + 布布玩偶 + token 展示 + 日期周几 + 天气/预报渲染
├── host.js     # Host 半：天气 RPC（IP 定位 + Open-Meteo 当前/3天预报 + 严重天气判定）
├── LICENSE     # MIT
└── README.md   # 本说明
```

## 使用说明

### 前提条件

- 已安装并运行 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（Web GUI 或 CLI）。
- 在某个会话里能使用 `cordis_define` / `cordis_run` 工具（Cordis 模式，一般默认自带）。

### 快速安装（动态插件，进程内生效）
直接复制github地址让Ai帮你安装即可，也可以：
1. 在 DSH 会话里调用 `cordis_define`：
   - `plugin.kind: "new"`，`idPrefix` 填 3–6 位小写字母（如 `tokpet`）；
   - 把 `client.js` 里 `return {` 到结尾的**整个函数体**粘进 `code.client`；
   - 把 `host.js` 里 `return {` 到结尾的**整个函数体**粘进 `code.host`（提供天气）。
2. 用返回的 `pluginId` / `packageId` 调用 `cordis_run`（首次用 `run`；更新用 `update`）。
3. 刷新页面，会话头部右上角就会出现布布。

### 日常使用

- **折叠态**：右上角一个小药丸 = 布布玩偶 + 上下文占用百分比；有极端天气/未来预警时，药丸上还会多一个闪烁图标。
- **展开**：点药丸打开卡片；点外部 / 按 `Esc` / 点 `✕` 收起。
- **天气刷新**：点卡片里的天气那一格，可手动刷新（Host 缓存 30 分钟）。
- **表情**：布布的表情随上下文占用变化（轻松→紧张→快满冒汗）。

### 常见问题

- **天气显示「不可用」？** 说明本机 `web` 服务既无 fetch provider、`curl` 也不可用/被沙箱拦截；日期周几和 token 部分不受影响。检查 `curl` 是否可用、网络是否通。
- **定位城市不对？** 定位走 IP（ipwho.is），挂 VPN/代理会漂移。想固定城市：改 `host.js` 里 `locate()`，直接返回目标经纬度即可。
- **为什么没有政府红/橙预警？** 气象局/和风天气等官方预警接口需要 API key，无法无 key 直连。当前用 WMO 天气代码判断「当前极端天气 + 未来 3 天严重天气」；有 key 可替换 `forecast()` 接入真·官方预警。
- **想要长期内置？** 动态插件重启即失效；需按 DSH 宿主组合（`cordis.yml` / agent preset）方式挂载，见官方文档。

### 更新插件（已装过）

1. 用 `cordis_inspect_self` 找到 `pluginId`；
2. 用 `cordis_define`（`kind: "existing"` + 原 `pluginId`）追加新 Package；
3. 用 `cordis_run`（`mode: "update"`）切换到新 Package。

## 衍生功能规划（Roadmap）

- [ ] 用量预警：70%/90% 时弹动 + toast 提醒，建议 `/compact`
- [ ] 一键压缩：卡片内直接放「压缩上下文」按钮，联动 compaction 服务
- [ ] 成本估算：接模型单价，token 换算 ¥/$
- [ ] 天气增强：空气质量 / 可手动指定城市 / 接官方预警 API key
- [ ] 用量历史曲线：按 turn/step 记录，画迷你折线
- [ ] 工具调用成本拆解：统计每个工具累计拉进多少 token
- [ ] 跨会话汇总 + 预算限额 / 用量导出 / 模型 token 效率对比
- [ ] 宠物养成：用量当「喂食」进度，吉祥物升级变色（纯趣味）

## 许可

[MIT](./LICENSE)

# Token 泡泡 (Token Pet) 🐻

<img width="2426" height="1340" alt="Token Pet 截图" src="https://github.com/user-attachments/assets/732913a1-b8de-42a7-a084-bef87814aafe" />

> DeepSeek Harness (DSH) 插件 · `dsh-plugin`

一个给 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 用的插件，在会话头部右上角嵌一个卡通「布布」玩偶，实时展示当前会话的 **Token 用量**，并附带 **今天日期/周几 + 实时天气 + 未来 3 天预报 + 极端天气预警**，全程跟随主题色自适应深浅色。

## 功能特性

- **嵌入右上角，不悬浮**：挂在 `conversation.session.header.utilities`（会话头部右上角工具区），和「下载日志」等原生按钮并排。
- **今天日期 / 周几**：`📅 8月15日 · 周五`，浏览器本地时区实时计算，零网络。
- **实时天气**：`☀️ 晴 26°C`（点击可刷新），IP 定位（ipwho.is）+ Open-Meteo，缓存 30 分钟，失败优雅降级。
- **未来 3 天预报**：今天 / 明天 / 后天逐日天气（图标 + 最高/最低温）。
- **卡通用量小部件**（展开态）：
  - 🎯 上下文占用：主题色进度条 + `已用 / 窗口上限`。
  - 📊 本会话累计：输入 / 输出 / 缓存读 / 缓存写（含合计）。
  - 🧩 上下文构成：系统提示 / 工具定义 / 消息内容。
- **表情玩偶「布布」**：内联 SVG 圆脸小布偶，表情随用量变化（闭眼微笑 → 大笑 → 微笑 → 皱眉 → 快满冒汗）。
- **极端天气预警**：暴雨 / 雷暴 / 大雪触发红色警告条 + 动画雨滴（🌧）或雪花（🌨）粒子；未来 3 天有严重天气也提前预警，折叠药丸上亮闪烁图标。
- **跟随主题色**：全部颜色走 `--dsw-alias-*` CSS 变量，深浅色自适应。
- **Token 零请求**：token 数据直接复用宿主已投射到前端的投影。

## 安装

> 💡 直接复制这个仓库的 GitHub 地址（`github:pk7j7sqryy-ops/dsh-token-pet`）发给 AI 助手，让它帮你安装，也可以按照以下方法：

### 方式 A（推荐）：作为包安装

```sh
dsh plugin --profile web add github:pk7j7sqryy-ops/dsh-token-pet
```

安装后重启 `dsh --profile web`，会话头部右上角就会出现布布。也可以 `dsh plugin --profile web add dsh-token-pet`（若已发布到 npm）。

### 方式 B：动态插件（进程内临时）

把 `dynamic/client.js` 粘进 `cordis_define` 的 `code.client`、`dynamic/host.js` 粘进 `code.host`，再 `cordis_run` 即可（重启失效）。详见 `dynamic/` 下两份文件头部的注释。

## 日常使用

- **折叠态**：右上角小药丸 = 布布玩偶 + 占用百分比；有极端天气/未来预警时多一个闪烁图标。
- **展开**：点药丸打开卡片；点外部 / 按 `Esc` / 点 `✕` 收起。
- **天气刷新**：点卡片里的天气那一格手动刷新（缓存 30 分钟）。

## 常见问题

- **天气显示「不可用」？** 本机 `web` 服务无 fetch provider 且 `curl` 不可用/被沙箱拦截；token 部分不受影响。
- **定位城市不对？** 定位走 IP（ipwho.is），挂 VPN/代理会漂移；改 `lib/index.js` 的 `locate()` 可固定经纬度。
- **为什么没有政府红/橙预警？** 气象局/和风天气等官方预警需 API key，无法无 key 直连；当前用 WMO 代码判断当前 + 未来 3 天严重天气。
- **想要长期内置？** 用方式 A 装成包即可随 profile 常驻。

## 技术实现

| 能力 | 选型 |
|------|------|
| 挂载位置 | `conversation.session.header.utilities` Slot（additive） |
| Token 数据 | `useProjection` 标准 prop（`contextPressure` / `tokenUsage` / `contextBreakdown`） |
| 占用口径 | `projectedTokens ?? pressureTokens` ÷ `contextWindow` |
| 天气 | Host RPC（`connection.rpc.handle("/token-pet")`）：ipwho.is → Open-Meteo |
| 网络能力 | `web.fetch` 优先，回退 `shell` + curl |
| 主题 | `--dsw-alias-*` CSS 变量 |

## 文件结构

```
.
├── package.json        # npm 包 + dsh.bundle.patch / dsh.client 声明
├── cordis.patch.yml    # 组合补丁：把插件按 id 插进 profile
├── lib/
│   ├── index.js        # Host 半：天气 RPC（真实 ESM 模块）
│   └── client.js       # Client 半：UI + 布布玩偶（__ModuleLoader__ bundle）
├── dynamic/            # 动态插件源码（备选安装方式 B）
│   ├── client.js
│   └── host.js
├── LICENSE
└── README.md
```

## 衍生功能规划（Roadmap）

- [ ] 用量预警：70%/90% 时弹动 + toast，建议 `/compact`
- [ ] 一键压缩：卡片内直接放「压缩上下文」按钮
- [ ] 成本估算：接模型单价，token 换算 ¥/$
- [ ] 天气增强：空气质量 / 手动指定城市 / 接官方预警 API key
- [ ] 用量历史曲线 / 工具调用成本拆解 / 跨会话汇总 / 宠物养成

## 许可

[MIT](./LICENSE)

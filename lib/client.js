// dsh-token-pet — browser half (client plugin bundle).
//
// Loaded by dsh-client-modules at /plugins/dsh-token-pet/client.js and executed
// through the shell's lazy-CJS module table (window.__ModuleLoader__.load),
// the same shape the shipped ui-* packages emit. The widget registers into
// `conversation.session.header.utilities` (session header top-right) and reads
// token projections via the slot's standard `useProjection` prop.
window.__ModuleLoader__.load({
  id: "dsh-token-pet",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");

    const inject = ["slots"];

    const CSS = `
.tkp-root{display:inline-flex;position:relative;flex:none}
.tkp-pill{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px 0 5px;cursor:pointer;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;transition:background .15s ease,transform .15s ease,border-color .15s ease}
.tkp-pill:hover{background:var(--dsw-alias-interactive-bg-hover);transform:translateY(-1px)}
.tkp-pill-num{font-size:12px;font-weight:700;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;letter-spacing:.2px}
.tkp-pill-warn{margin-left:1px;font-size:13px;line-height:1;animation:tkpBlink 1.6s ease-in-out infinite}
@keyframes tkpBlink{0%,100%{opacity:1}50%{opacity:.4}}
.tkp-bubu{display:block;flex:none;animation:tkpBob 2.6s ease-in-out infinite}
@keyframes tkpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.4px)}}
@media (prefers-reduced-motion:reduce){.tkp-bubu,.tkp-drop,.tkp-flake,.tkp-pill-warn{animation:none}}
.tkp-card{position:absolute;top:calc(100% + 10px);right:0;z-index:100;width:280px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-shadow-lv3);border-radius:16px;padding:12px;color:var(--dsw-alias-label-secondary);animation:tkpPop .18s ease}
@keyframes tkpPop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}
.tkp-head{display:flex;align-items:center;gap:9px}
.tkp-title{font-size:13px;font-weight:700;color:var(--dsw-alias-label-primary)}
.tkp-close{margin-left:auto;width:22px;height:22px;border:none;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;display:grid;place-items:center;font-size:12px;line-height:1}
.tkp-close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.tkp-today{display:flex;align-items:center;gap:10px;margin-top:11px;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-interactive-bg-hover)}
.tkp-today-item{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--dsw-alias-label-primary);font-weight:600;min-width:0}
.tkp-today-item:last-child{margin-left:auto}
.tkp-today-btn{border:none;background:transparent;cursor:pointer;padding:0;color:var(--dsw-alias-label-primary);font-weight:600;font-size:12px}
.tkp-today-btn:hover{color:var(--dsw-alias-state-business-primary)}
.tkp-today-icon{flex:none}
.tkp-today-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tkp-warn{position:relative;overflow:hidden;display:flex;align-items:center;gap:7px;margin-top:11px;padding:9px 10px;border-radius:10px;background:var(--dsw-alias-state-error-primary);color:#fff;font-size:12px;font-weight:700}
.tkp-warn-icon{flex:none;font-size:15px;position:relative;z-index:1}
.tkp-warn-text{position:relative;z-index:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tkp-drop{position:absolute;top:-14px;width:2px;height:9px;border-radius:2px;background:linear-gradient(#cfe9ff,transparent);animation:tkpFall linear infinite;z-index:0}
.tkp-flake{position:absolute;top:-12px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 5px #dbeaff;animation:tkpSnow linear infinite;z-index:0}
@keyframes tkpFall{to{transform:translateY(50px);opacity:0}}
@keyframes tkpSnow{0%{transform:translate(0,0);opacity:1}25%{transform:translate(4px,12px)}50%{transform:translate(-4px,24px)}75%{transform:translate(3px,36px)}100%{transform:translate(0,48px);opacity:0}}
.tkp-sec{margin-top:11px}
.tkp-sec-label{font-size:11px;font-weight:700;color:var(--dsw-alias-label-secondary);margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;letter-spacing:.3px}
.tkp-days{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.tkp-day{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 4px;border-radius:10px;background:var(--dsw-alias-interactive-bg-hover)}
.tkp-day-wd{font-size:11px;color:var(--dsw-alias-label-secondary);font-weight:600;white-space:nowrap}
.tkp-day-icon{font-size:18px;line-height:1}
.tkp-day-temp{font-size:11px;color:var(--dsw-alias-label-primary);font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.tkp-bar{height:10px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);overflow:hidden}
.tkp-bar-fill{height:100%;border-radius:999px;transition:width .4s ease,background .4s ease}
.tkp-bar-row{display:flex;justify-content:space-between;align-items:baseline;margin-top:6px}
.tkp-big{font-size:16px;font-weight:800;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.tkp-dim{font-size:11px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}
.tkp-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 14px}
.tkp-cell{display:flex;align-items:center;gap:6px;font-size:12px}
.tkp-dot{width:7px;height:7px;border-radius:50%;flex:none}
.tkp-cell-label{color:var(--dsw-alias-label-secondary)}
.tkp-cell-val{margin-left:auto;color:var(--dsw-alias-label-primary);font-weight:700;font-variant-numeric:tabular-nums}
.tkp-row{display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px}
.tkp-foot{margin-top:11px;padding:7px 10px;border-radius:10px;background:var(--dsw-alias-interactive-bg-hover);font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);text-align:center}
.tkp-full .tkp-bar-fill{animation:tkpPulse 1.1s ease-in-out infinite}
@keyframes tkpPulse{0%,100%{opacity:1}50%{opacity:.5}}
@media (prefers-reduced-motion:reduce){.tkp-full .tkp-bar-fill{animation:none}}
`;

    function fmt(n) {
      if (n == null || Number.isNaN(n)) return "—";
      const scaled = (v) => (v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10));
      if (n < 1e3) return String(Math.round(n));
      if (n < 1e6) return scaled(n / 1e3) + "K";
      return scaled(n / 1e6) + "M";
    }

    function todayText() {
      const d = new Date();
      const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return (d.getMonth() + 1) + "月" + d.getDate() + "日 · " + week[d.getDay()];
    }

    function contextOccupancy(pressure) {
      if (pressure == null) return null;
      const usedTokens = pressure.projectedTokens != null ? pressure.projectedTokens : pressure.pressureTokens;
      if (usedTokens === undefined || pressure.contextWindow === undefined) return null;
      return { percent: Math.min(100, Math.round(usedTokens / pressure.contextWindow * 100)), usedTokens, contextWindow: pressure.contextWindow };
    }

    const MSG = {
      idle: "等第一条用量上报，布布先陪你玩～",
      low: "轻轻松松，随便聊～",
      mid: "状态不错，继续冲～",
      high: "有点挤啦，留意一下用量哦",
      full: "快满啦！建议压缩一下上下文",
    };

    function eyes(cx1, cx2, cy, r) {
      return [
        React.createElement("circle", { cx: cx1, cy: cy, r: r, fill: "#4a3440" }),
        React.createElement("circle", { cx: cx2, cy: cy, r: r, fill: "#4a3440" }),
        React.createElement("circle", { cx: cx1 + r * 0.35, cy: cy - r * 0.35, r: r * 0.36, fill: "#fff" }),
        React.createElement("circle", { cx: cx2 + r * 0.35, cy: cy - r * 0.35, r: r * 0.36, fill: "#fff" }),
      ];
    }

    function mouth(d) {
      return React.createElement("path", { d, fill: "none", stroke: "#c98aa6", strokeWidth: 1.8, strokeLinecap: "round", strokeDasharray: "2 1.6" });
    }

    function brow(x1, y1, x2, y2) {
      return React.createElement("path", { d: "M" + x1 + " " + y1 + " L" + x2 + " " + y2, stroke: "#4a3440", strokeWidth: 1.6, strokeLinecap: "round", fill: "none" });
    }

    function faceParts(mood) {
      if (mood === "idle") return [
        React.createElement("path", { d: "M14.5 26 Q17 23.4 19.5 26", fill: "none", stroke: "#4a3440", strokeWidth: 2, strokeLinecap: "round" }),
        React.createElement("path", { d: "M28.5 26 Q31 23.4 33.5 26", fill: "none", stroke: "#4a3440", strokeWidth: 2, strokeLinecap: "round" }),
        mouth("M20.5 33.5 Q24 37 27.5 33.5"),
      ];
      if (mood === "low") return [
        ...eyes(17.5, 30.5, 26, 2.6),
        mouth("M19.5 32.5 Q24 38.5 28.5 32.5"),
      ];
      if (mood === "mid") return [
        ...eyes(17.5, 30.5, 26, 2.5),
        mouth("M21 33.5 Q24 35.5 27 33.5"),
      ];
      if (mood === "high") return [
        ...eyes(17.5, 30.5, 26, 2.6),
        brow(14.5, 21.5, 20, 23.5),
        brow(33.5, 21.5, 28, 23.5),
        mouth("M21 34.5 Q24 35 27 34.5"),
      ];
      return [
        ...eyes(17.5, 30.5, 26, 3.1),
        brow(14, 21, 20, 23.5),
        brow(34, 21, 28, 23.5),
        React.createElement("ellipse", { cx: 24, cy: 34.5, rx: 3, ry: 3.8, fill: "#c98aa6" }),
        React.createElement("path", { d: "M33 19 q2.6 3.6 0 5 q-2.6 -1.4 0 -5 Z", fill: "#7fc9ff" }),
      ];
    }

    function Bubu(props) {
      const size = props.size || 26;
      return React.createElement("svg", { viewBox: "0 0 48 48", width: size, height: size, "aria-hidden": true, className: "tkp-bubu" },
        React.createElement("circle", { cx: 9.5, cy: 16, r: 7, fill: "#fff6ee" }),
        React.createElement("circle", { cx: 38.5, cy: 16, r: 7, fill: "#fff6ee" }),
        React.createElement("circle", { cx: 9.5, cy: 16, r: 3.4, fill: "#ffd9c2" }),
        React.createElement("circle", { cx: 38.5, cy: 16, r: 3.4, fill: "#ffd9c2" }),
        React.createElement("circle", { cx: 24, cy: 27, r: 17.5, fill: "#fff6ee" }),
        React.createElement("path", { d: "M24 8.5 Q26.5 5 28.5 8 Q26 10 24 8.5 Z", fill: "#ffe0cc" }),
        React.createElement("ellipse", { cx: 16.5, cy: 32.5, rx: 3.4, ry: 2.2, fill: "#ffb8c6", opacity: 0.85 }),
        React.createElement("ellipse", { cx: 31.5, cy: 32.5, rx: 3.4, ry: 2.2, fill: "#ffb8c6", opacity: 0.85 }),
        ...faceParts(props.mood),
      );
    }

    function particles(kind) {
      const cls = kind === "snow" ? "tkp-flake" : "tkp-drop";
      const out = [];
      for (let i = 0; i < 10; i++) {
        out.push(React.createElement("span", {
          key: i,
          className: cls,
          style: {
            left: (i * 10 + 4) + "%",
            animationDelay: (i * 0.45) + "s",
            animationDuration: (kind === "snow" ? 2.4 + (i % 3) * 0.5 : 1.15 + (i % 3) * 0.35) + "s",
          },
        }));
      }
      return out;
    }

    function TokenPet(props) {
      const connection = props.connection;
      const rpc = connection && connection.rpc ? connection.rpc : null;

      const [open, setOpen] = React.useState(false);
      const [weather, setWeather] = React.useState(null);
      const [wLoading, setWLoading] = React.useState(true);
      const pressure = props.useProjection("contextPressure");
      const usage = props.useProjection("tokenUsage");
      const breakdown = props.useProjection("contextBreakdown");

      const occ = contextOccupancy(pressure);
      const percent = occ ? occ.percent : null;
      const mood = percent == null ? "idle" : percent < 40 ? "low" : percent < 70 ? "mid" : percent < 90 ? "high" : "full";
      const barColor = percent == null ? "var(--dsw-alias-label-tertiary)" : percent < 40 ? "var(--dsw-alias-state-success-primary)" : percent < 70 ? "var(--dsw-alias-state-warn-primary)" : "var(--dsw-alias-state-error-primary)";

      function fetchWeather() {
        setWLoading(true);
        if (rpc && typeof rpc.call === "function") {
          rpc.call("/token-pet", "weather", null)
            .then((res) => { setWeather(res && res.ok ? res : { ok: false, reason: "failed" }); setWLoading(false); })
            .catch(() => { setWeather({ ok: false, reason: "failed" }); setWLoading(false); });
        } else {
          setWeather({ ok: false, reason: "failed" });
          setWLoading(false);
        }
      }

      React.useEffect(() => {
        let alive = true;
        setWLoading(true);
        const done = (res) => { if (alive) { setWeather(res && res.ok ? res : { ok: false, reason: "failed" }); setWLoading(false); } };
        const fail = () => { if (alive) { setWeather({ ok: false, reason: "failed" }); setWLoading(false); } };
        if (rpc && typeof rpc.call === "function") {
          rpc.call("/token-pet", "weather", null).then(done).catch(fail);
        } else {
          fail();
        }
        return () => { alive = false; };
      }, []);

      React.useEffect(() => {
        if (!open) return;
        const onDown = (e) => {
          const t = e.target;
          if (t && typeof t.closest === "function" && t.closest(".tkp-root")) return;
          setOpen(false);
        };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
      }, [open]);

      const cell = (label, val, color) =>
        React.createElement("div", { className: "tkp-cell", key: label },
          React.createElement("span", { className: "tkp-dot", style: { background: color } }),
          React.createElement("span", { className: "tkp-cell-label" }, label),
          React.createElement("span", { className: "tkp-cell-val" }, fmt(val)),
        );

      let weatherIcon, weatherText;
      if (weather && weather.ok) {
        weatherIcon = weather.icon;
        weatherText = weather.desc + " " + weather.temp + "°C";
      } else if (wLoading) {
        weatherIcon = "⏳";
        weatherText = "天气加载中…";
      } else {
        weatherIcon = "🌡️";
        weatherText = "天气不可用";
      }
      const weatherTitle = (weather && weather.ok && weather.city) ? "点击刷新天气 · " + weather.city : "点击刷新天气";

      const sev = (weather && weather.ok && weather.severity) || null;
      const severe = !!(sev && sev.warn);
      const advanceWarn = (weather && weather.ok && weather.advanceWarn) || null;
      const warnText = severe ? sev.warn : advanceWarn;
      const warnIcon = severe ? weatherIcon : "⚠️";
      const warnKind = severe ? sev.kind : null;

      const today = React.createElement("div", { className: "tkp-today" },
        React.createElement("div", { className: "tkp-today-item" },
          React.createElement("span", { className: "tkp-today-icon" }, "📅"),
          React.createElement("span", { className: "tkp-today-text" }, todayText()),
        ),
        React.createElement("button", { type: "button", className: "tkp-today-item tkp-today-btn", onClick: fetchWeather, title: weatherTitle },
          React.createElement("span", { className: "tkp-today-icon" }, weatherIcon),
          React.createElement("span", { className: "tkp-today-text" }, weatherText),
        ),
      );

      const warnBlock = warnText ? React.createElement("div", { className: "tkp-warn" },
        React.createElement("span", { className: "tkp-warn-icon" }, warnIcon),
        React.createElement("span", { className: "tkp-warn-text" }, warnText),
        warnKind ? particles(warnKind) : null,
      ) : null;

      let dailyBlock = null;
      if (weather && weather.ok && weather.daily && weather.daily.length) {
        const labels = ["今天", "明天", "后天"];
        const cols = weather.daily.map((d, i) =>
          React.createElement("div", { className: "tkp-day", key: i },
            React.createElement("div", { className: "tkp-day-wd" }, labels[i] + " " + d.wd),
            React.createElement("div", { className: "tkp-day-icon" }, d.icon),
            React.createElement("div", { className: "tkp-day-temp" }, d.tmax + "°/" + d.tmin + "°"),
          ),
        );
        dailyBlock = React.createElement("div", { className: "tkp-sec" },
          React.createElement("div", { className: "tkp-sec-label" }, "未来 3 天"),
          React.createElement("div", { className: "tkp-days" }, ...cols),
        );
      }

      const barPct = percent != null ? percent : 0;
      const occupancy = React.createElement("div", { className: "tkp-sec" },
        React.createElement("div", { className: "tkp-sec-label" }, "上下文占用"),
        React.createElement("div", { className: "tkp-bar" },
          React.createElement("div", { className: "tkp-bar-fill", style: { width: barPct + "%", background: barColor } }),
        ),
        React.createElement("div", { className: "tkp-bar-row" },
          React.createElement("span", { className: "tkp-big" }, percent != null ? percent + "%" : "—"),
          React.createElement("span", { className: "tkp-dim" },
            occ ? "~" + fmt(occ.usedTokens) + " / " + fmt(occ.contextWindow) : "暂无数据"),
        ),
      );

      let usageBlock = null;
      if (usage) {
        const total = usage.uncachedInputTokens + usage.outputTokens + (usage.cacheReadTokens || 0) + (usage.cacheWriteTokens || 0);
        usageBlock = React.createElement("div", { className: "tkp-sec" },
          React.createElement("div", { className: "tkp-sec-label" },
            React.createElement("span", null, "本会话累计"),
            React.createElement("span", null, "合计 " + fmt(total)),
          ),
          React.createElement("div", { className: "tkp-grid" },
            cell("输入", usage.uncachedInputTokens, "var(--dsw-static-blue-450)"),
            cell("输出", usage.outputTokens, "var(--dsw-static-pink-450)"),
            cell("缓存读", usage.cacheReadTokens, "#a78bfa"),
            cell("缓存写", usage.cacheWriteTokens, "var(--dsw-alias-state-success-primary)"),
          ),
        );
      }

      let breakdownBlock = null;
      if (breakdown) {
        const row = (label, val, color) =>
          React.createElement("div", { className: "tkp-row", key: label },
            React.createElement("span", { className: "tkp-dot", style: { background: color } }),
            React.createElement("span", { className: "tkp-cell-label" }, label),
            React.createElement("span", { className: "tkp-cell-val" }, fmt(val)),
          );
        breakdownBlock = React.createElement("div", { className: "tkp-sec" },
          React.createElement("div", { className: "tkp-sec-label" }, "上下文构成"),
          row("系统提示", breakdown.systemTokens, "var(--dsw-static-neutral-bluish-400)"),
          row("工具定义", breakdown.toolsTokens, "#a78bfa"),
          row("消息内容", breakdown.messageTokens, "var(--dsw-static-blue-450)"),
        );
      }

      const cardClass = "tkp-card" + (percent != null && percent >= 90 ? " tkp-full" : "");
      const card = React.createElement("div", { className: cardClass, role: "dialog" },
        React.createElement("div", { className: "tkp-head" },
          React.createElement(Bubu, { mood: mood, size: 34 }),
          React.createElement("span", { className: "tkp-title" }, "Token 泡泡"),
          React.createElement("button", { className: "tkp-close", onClick: () => setOpen(false), "aria-label": "收起" }, "✕"),
        ),
        today,
        warnBlock,
        dailyBlock,
        occupancy,
        usageBlock,
        breakdownBlock,
        React.createElement("div", { className: "tkp-foot" }, MSG[mood]),
      );

      const pill = React.createElement("button", {
        type: "button",
        className: "tkp-pill",
        onClick: () => setOpen(!open),
        "aria-label": "Token 用量",
        "aria-expanded": open,
        "aria-haspopup": "dialog",
      },
        React.createElement(Bubu, { mood: mood, size: 24 }),
        percent != null ? React.createElement("span", { className: "tkp-pill-num" }, percent + "%") : null,
        (severe || advanceWarn) ? React.createElement("span", { className: "tkp-pill-warn" }, warnIcon) : null,
      );

      return React.createElement("span", { className: "tkp-root" }, pill, open ? card : null);
    }

    function apply(ctx) {
      const slots = ctx.slots;
      const connection = ctx.get("connection");

      let style = null;
      if (typeof document !== "undefined" && document.head) {
        style = document.createElement("style");
        style.setAttribute("data-plugin", "dsh-token-pet");
        style.textContent = CSS;
        document.head.appendChild(style);
      }
      ctx.effect(() => () => { if (style) style.remove(); });

      slots.inject("conversation.session.header.utilities", () => slots.register(
        { name: "conversation.session.header.utilities", id: "token-pet", order: 0, label: "Token 泡泡" },
        (props) => React.createElement(TokenPet, Object.assign({}, props, { connection })),
      ));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});

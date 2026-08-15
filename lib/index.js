// dsh-token-pet — host half.
//
// Owns the weather RPC channel: IP geolocation (ipwho.is) + Open-Meteo
// (current + 3-day daily), with a 30-minute cache. Network access prefers the
// host `web` service (web.fetch); when no fetch provider is registered (common
// on desktop DSH), it falls back to `shell` + curl. Any failure returns
// `{ ok: false, reason }` so the browser half degrades gracefully.

export const name = "token-pet";

export function apply(ctx) {
  const web = ctx.get("web");
  const shell = ctx.get("shell");
  const connection = ctx.get("connection");

  function wmo(code) {
    if (code === 0) return { icon: "☀️", desc: "晴" };
    if (code === 1) return { icon: "🌤️", desc: "大部晴" };
    if (code === 2) return { icon: "⛅", desc: "多云" };
    if (code === 3) return { icon: "☁️", desc: "阴" };
    if (code === 45 || code === 48) return { icon: "🌫️", desc: "雾" };
    if (code >= 51 && code <= 57) return { icon: "🌦️", desc: "毛毛雨" };
    if (code >= 61 && code <= 67) return { icon: "🌧️", desc: "雨" };
    if (code >= 71 && code <= 77) return { icon: "🌨️", desc: "雪" };
    if (code >= 80 && code <= 82) return { icon: "🌦️", desc: "阵雨" };
    if (code === 85 || code === 86) return { icon: "🌨️", desc: "阵雪" };
    if (code >= 95) return { icon: "⛈️", desc: "雷暴" };
    return { icon: "🌡️", desc: "未知" };
  }

  function severityOf(code) {
    if (code === 95 || code === 96 || code === 99) return { level: "storm", kind: "rain", warn: "雷暴预警，尽量待在室内" };
    if (code === 65 || code === 67 || code === 82) return { level: "heavyRain", kind: "rain", warn: "暴雨预警，注意出行安全" };
    if (code === 75 || code === 86) return { level: "heavySnow", kind: "snow", warn: "大雪预警，注意防寒防滑" };
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { level: "rain", kind: "rain", warn: null };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { level: "snow", kind: "snow", warn: null };
    return { level: "normal", kind: null, warn: null };
  }

  function isSevere(code) {
    return code === 95 || code === 96 || code === 99 || code === 65 || code === 67 || code === 82 || code === 75 || code === 86;
  }

  function weekdayOf(dateStr) {
    const p = dateStr.split("-");
    const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    const wd = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return wd[d.getDay()];
  }

  async function viaWeb(url) {
    if (web === undefined) return null;
    try {
      const r = await web.fetch({ url });
      if (r.statusCode < 200 || r.statusCode >= 300) return null;
      const text = r.body && r.body.content;
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  async function viaCurl(url) {
    if (shell === undefined) return null;
    try {
      const spec = shell.resolve({ command: "curl -sS --max-time 12 " + JSON.stringify(url), timeoutMs: 15000, stdoutMaxBytes: 65536 });
      const r = await shell.run(spec);
      if (r.exitCode !== 0) return null;
      const text = r.stdout && r.stdout.text;
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  async function getJson(url) {
    const a = await viaWeb(url);
    if (a != null) return a;
    return viaCurl(url);
  }

  async function locate() {
    const j = await getJson("https://ipwho.is/");
    if (!j || j.success === false || j.latitude == null || j.longitude == null) return null;
    return { lat: j.latitude, lon: j.longitude, city: j.city || "", country: j.country || "" };
  }

  async function forecast(loc) {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + loc.lat + "&longitude=" + loc.lon + "&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto";
    const j = await getJson(url);
    const cw = j && j.current_weather;
    if (!cw || cw.temperature == null) return null;
    const daily = [];
    const d = j.daily;
    if (d && d.time && d.weathercode && d.temperature_2m_max && d.temperature_2m_min) {
      const n = Math.min(3, d.time.length);
      for (let i = 0; i < n; i++) {
        const wm = wmo(d.weathercode[i]);
        daily.push({ wd: weekdayOf(d.time[i]), tmax: Math.round(d.temperature_2m_max[i]), tmin: Math.round(d.temperature_2m_min[i]), icon: wm.icon, desc: wm.desc, code: d.weathercode[i] });
      }
    }
    return { temp: Math.round(cw.temperature), code: cw.weathercode, windspeed: cw.windspeed, daily };
  }

  let cache = null;

  ctx.effect(() => {
    if (!connection || !connection.rpc || typeof connection.rpc.handle !== "function") return () => {};
    return connection.rpc.handle("/token-pet", async (endpoint) => {
      if (endpoint !== "weather") return { ok: false, reason: "not_found" };
      const now = Date.now();
      if (cache && now - cache.t < 30 * 60 * 1000) return cache.data;
      try {
        const loc = await locate();
        if (!loc) return { ok: false, reason: "location" };
        const w = await forecast(loc);
        if (!w) return { ok: false, reason: "weather" };
        const wm = wmo(w.code);
        const daily = w.daily || [];
        let advanceWarn = null;
        if (daily.length >= 2) {
          const labels = ["", "明天", "后天"];
          const parts = [];
          for (let i = 1; i < daily.length; i++) {
            if (isSevere(daily[i].code)) parts.push(labels[i] + " " + daily[i].desc);
          }
          if (parts.length) advanceWarn = parts.join("、") + "，注意防范";
        }
        const data = { ok: true, city: loc.city, country: loc.country, temp: w.temp, windspeed: w.windspeed, icon: wm.icon, desc: wm.desc, severity: severityOf(w.code), daily, advanceWarn, t: now };
        cache = { t: now, data };
        return data;
      } catch (e) {
        if (ctx.logger && ctx.logger.error) ctx.logger.error("[token-pet]", e);
        return { ok: false, reason: "failed" };
      }
    }, { authority: "loopback" });
  });
}

// 予約管理画面（/admin）のモック。データはすべて画面の中だけの表示例で、どこにも送らない。
// 本番では、ログイン（2段階認証）、保存、お客様への連絡、二重予約の確認をサーバー側で行う。

const PRICE = { 2: 2000, 3: 3000, 4: 3600, 5: 4500, 6: 5400, 7: 5600, 8: 6400, 9: 7200, 10: 7500, 11: 7700, 12: 8400 };
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const yen = (n) => n.toLocaleString("ja-JP") + "円";
const base = new Date(); base.setHours(0, 0, 0, 0);
const dayOf = (off) => { const d = new Date(base); d.setDate(base.getDate() + off); return d; };
const md = (off) => { const d = dayOf(off); return `${d.getMonth() + 1}/${d.getDate()}（${WD[d.getDay()]}）`; };
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const toTime = (min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
const span = (start, min) => `${start}〜${toTime(toMin(start) + min)}`;
const recvAt = (h) => { const d = new Date(Date.now() - h * 3600e3); return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; };

// ---- 表示例のデータ ----------------------------------------------------
const STATUS = { pending: "承認待ち", confirmed: "入金待ち", paid: "入金済み", declined: "お断り", cancelled: "キャンセル" };

const REQ = [
  { no: "K7M2Q9XA", recvH: 3, status: "pending", name: "佐藤 美咲", kana: "さとう みさき", tel: "090-0000-1111", mail: "sato@example.com", purpose: "教室・レッスン", people: 8,
    note: "子ども向けの書道教室を月2回ひらきたいです。墨を使うので、床にシートを敷きます。", flags: ["子どもの参加"], found: "Instagram", line: true,
    choices: [{ day: 9, start: "10:00", h: 3 }, { day: 10, start: "13:00", h: 3 }, { day: 16, start: "10:00", h: 3 }] },
  { no: "R4T8W2NP", recvH: 14, status: "pending", name: "鈴木 由香", kana: "すずき ゆか", tel: "080-0000-2222", mail: "suzuki@example.com", purpose: "撮影", people: 3,
    note: "手づくりの器を撮りたいです。自然光の入る部屋を使わせてください。", flags: ["撮影"], found: "Google検索", line: false,
    choices: [{ day: 5, start: "12:00", h: 4 }, { day: 7, start: "9:00", h: 4 }] },
  { no: "H3J9C6LU", recvH: 27, status: "pending", name: "高橋 恵", kana: "たかはし めぐみ", tel: "090-0000-3333", mail: "takahashi@example.com", purpose: "教室・レッスン", people: 12,
    note: "ベビーマッサージの教室です。親子6組の予定です。", flags: ["子どもの参加"], found: "知人の紹介", line: true,
    choices: [{ day: 4, start: "10:00", h: 2 }, { day: 11, start: "10:00", h: 2 }] },
  { no: "P8Q2D5GH", recvH: 70, status: "confirmed", pick: 0, name: "田中 真理", kana: "たなか まり", tel: "080-0000-4444", mail: "tanaka@example.com", purpose: "教室・レッスン", people: 10,
    note: "夜のヨガ教室です。マットは持ち込みます。", flags: [], found: "Instagram", line: true,
    choices: [{ day: 3, start: "18:00", h: 3 }, { day: 10, start: "18:00", h: 3 }] },
  { no: "W6N3B7KT", recvH: 150, status: "paid", pick: 0, name: "渡辺 直子", kana: "わたなべ なおこ", tel: "090-0000-5555", mail: "watanabe@example.com", purpose: "交流会", people: 5,
    note: "地域の子育てサークルの集まりです。", flags: ["飲食"], found: "チラシ", line: false,
    choices: [{ day: 0, start: "13:00", h: 4 }] },
  { no: "Z2X5V8MC", recvH: 200, status: "paid", pick: 0, name: "中島 ゆり", kana: "なかじま ゆり", tel: "080-0000-6666", mail: "nakajima@example.com", purpose: "ワークショップ", people: 12,
    note: "季節の和菓子づくりと、お茶をいただく会です。", flags: ["飲食", "販売"], found: "Instagram", line: true,
    choices: [{ day: 12, start: "10:00", h: 6 }] },
  { no: "F9G4S3YE", recvH: 40, status: "declined", name: "山田 健", kana: "やまだ けん", tel: "090-0000-7777", mail: "yamada@example.com", purpose: "その他", people: 30,
    note: "バンドのライブをしたいです。", flags: ["音楽や大きな音"], found: "Google検索", line: false, reason: "定員を超えるため",
    choices: [{ day: 6, start: "17:00", h: 4 }] },
  { no: "A5E8R2WZ", recvH: 120, status: "cancelled", pick: 0, name: "木村 彩花", kana: "きむら あやか", tel: "080-0000-8888", mail: "kimura@example.com", purpose: "ワークショップ", people: 6,
    note: "フラワーアレンジの教室です。", flags: [], found: "知人の紹介", line: true,
    choices: [{ day: 2, start: "10:00", h: 3 }] },
];

let SLOTS = [
  { id: "L1", kind: "lesson", day: 0, start: "10:00", min: 60, name: "セミパーソナル", cap: 5 },
  { id: "L2", kind: "lesson", day: 1, start: "10:00", min: 60, name: "セミパーソナル", cap: 5 },
  { id: "L3", kind: "lesson", day: 2, start: "19:00", min: 50, name: "パーソナル", cap: 1 },
  { id: "L4", kind: "lesson", day: 4, start: "10:00", min: 50, name: "パーソナル", cap: 1 },
  { id: "E1", kind: "event", day: 5, start: "13:00", min: 120, name: "季節の手しごとワークショップ", cap: 8 },
  { id: "L5", kind: "lesson", day: 6, start: "14:00", min: 60, name: "セミパーソナル", cap: 5 },
  { id: "L6", kind: "lesson", day: 8, start: "10:00", min: 60, name: "セミパーソナル", cap: 5 },
];

const BOOK = [
  ["L1", "伊藤 さくら", true], ["L1", "小林 舞", false], ["L1", "斎藤 真由", false],
  ["L2", "加藤 優子", true], ["L2", "清水 杏", false],
  ["L4", "吉田 恵美", false],
  ["E1", "中村 彩", false], ["E1", "松本 香", false], ["E1", "井上 奈々", false],
  ["L6", "池田 美穂", false], ["L6", "石川 葵", true], ["L6", "森 理沙", true], ["L6", "山本 千尋", false, "cancelled"],
].map(([slot, name, trial, status], i) => ({ id: `B${100 + i}`, slot, name, trial, status: status || "confirmed" }));

let CLOSED = [{ day: 13, reason: "設備の点検" }];

let FAILED = [
  { id: "N1", to: "鈴木 由香", what: "申込み受付のお知らせ", how: "メール", why: "メールアドレスに届きませんでした（宛先が見つからない）", when: recvAt(14) },
  { id: "N2", to: "小林 舞", what: "前日のお知らせ", how: "LINE", why: "公式LINEの友だち登録が外れています", when: recvAt(15) },
];

let NEWS = [
  { id: 1, date: "11/10", title: "12月の営業日のお知らせ", status: "公開" },
  { id: 2, date: "11/02", title: "季節の手しごとワークショップの参加者を募集します", status: "公開" },
  { id: 3, date: "—", title: "年末年始のお休みについて", status: "下書き" },
];

const IG = [
  { id: "ig1", cap: "朝の縁側。今日は午前のピラティスから", show: true },
  { id: "ig2", cap: "障子を張り替えました", show: true },
  { id: "ig3", cap: "書道教室のみなさん（ご利用の様子）", show: true },
  { id: "ig4", cap: "ワークショップの準備中", show: true },
  { id: "ig5", cap: "冬の空き状況のお知らせ", show: true },
  { id: "ig6", cap: "庭の紅葉", show: true },
];

// ---- 共通の計算 --------------------------------------------------------
const slotById = (id) => SLOTS.find((s) => s.id === id);
const booked = (id) => BOOK.filter((b) => b.slot === id && b.status === "confirmed").length;
const reqBy = (no) => REQ.find((r) => r.no === no);
const isHeld = (r) => r.status === "confirmed" || r.status === "paid";

// その日に埋まっている時間（承認済みのレンタル・レッスン・イベント・休業日）
function busy(exceptNo) {
  const list = [];
  REQ.forEach((r) => {
    if (!isHeld(r) || r.no === exceptNo) return;
    const c = r.choices[r.pick];
    list.push({ day: c.day, s: toMin(c.start), e: toMin(c.start) + c.h * 60, kind: "rental", label: `レンタル ${r.name} 様`, no: r.no, status: r.status });
  });
  SLOTS.forEach((s) => list.push({ day: s.day, s: toMin(s.start), e: toMin(s.start) + s.min, kind: s.kind, label: `${s.name}（${booked(s.id)}/${s.cap}名）` }));
  CLOSED.forEach((c) => list.push({ day: c.day, s: 0, e: 24 * 60, kind: "closed", label: `休業日（${c.reason}）` }));
  return list;
}
function conflictOf(day, start, min, exceptNo) {
  const s = toMin(start), e = s + min;
  return busy(exceptNo).find((b) => b.day === day && s < b.e && b.s < e);
}

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.add("hidden"), 3600);
}
const chip = (status) => `<span class="chip ${status}">${STATUS[status]}</span>`;
function waitNote(r) {
  if (r.status !== "pending") return "";
  if (r.recvH >= 24) return `<span class="chip declined">24時間を過ぎています</span>`;
  if (r.recvH >= 18) return `<span class="chip pending">あと${24 - r.recvH}時間で24時間</span>`;
  return `<span class="note">${r.recvH}時間前</span>`;
}
const choiceText = (c) => `${md(c.day)} ${span(c.start, c.h * 60)}（${c.h}時間）`;
function updateBadge() {
  const n = REQ.filter((r) => r.status === "pending").length;
  $("nav-pending").textContent = n || "";
}

// ---- 画面 --------------------------------------------------------------
const VIEWS = {};

VIEWS.dashboard = () => {
  const pending = REQ.filter((r) => r.status === "pending").sort((a, b) => b.recvH - a.recvH);
  const today = busy().filter((b) => b.day === 0 && b.kind !== "closed").sort((a, b) => a.s - b.s);
  const unpaid = REQ.filter((r) => r.status === "confirmed");
  const oldest = pending[0];
  return `
    <h1>ホーム</h1>
    <div class="cards">
      <div class="card ${pending.length ? "warn" : ""}"><p class="k">承認待ちの申込み</p><p class="v">${pending.length}<small>件</small></p><p class="s">${oldest ? `いちばん古いものは${oldest.recvH}時間前` : "ありません"}</p></div>
      <div class="card"><p class="k">今日の予定</p><p class="v">${today.length}<small>件</small></p><p class="s">${md(0)}</p></div>
      <div class="card"><p class="k">入金待ち</p><p class="v">${unpaid.length}<small>件</small></p><p class="s">承認済みでお振込み前</p></div>
      <div class="card ${FAILED.length ? "warn" : ""}"><p class="k">届かなかった連絡</p><p class="v">${FAILED.length}<small>件</small></p><p class="s">メール・LINE</p></div>
    </div>

    <h2>承認待ちの申込み</h2>
    ${pending.length ? `<div class="tbl"><table class="t"><thead><tr><th>受付</th><th>お名前</th><th>目的</th><th>第1希望</th><th>金額</th><th>経過</th></tr></thead><tbody>
      ${pending.map((r) => `<tr class="click" data-open="${r.no}"><td>${r.no}</td><td>${r.name} 様</td><td>${r.purpose}</td><td>${choiceText(r.choices[0])}</td><td class="num">${yen(PRICE[r.choices[0].h])}</td><td>${waitNote(r)}</td></tr>`).join("")}
    </tbody></table></div>
    <p class="note">お客様には「24時間以内にお返事します」と伝えています。<span style="color:var(--c-danger)">※返事の期限は要確認</span></p>` : `<p class="note">承認待ちの申込みはありません。</p>`}

    <div class="grid2">
      <div><h2>今日の予定</h2><div class="panel"><ul class="list">
        ${today.length ? today.map((b) => `<li${b.no ? ` class="click" data-open="${b.no}" style="cursor:pointer"` : ""}><span class="time">${toTime(b.s)}〜${toTime(b.e)}</span><span class="chip ${b.kind}">${{ rental: "レンタル", lesson: "レッスン", event: "イベント" }[b.kind]}</span><span>${b.label}</span></li>`).join("") : "<li>予定はありません</li>"}
      </ul></div></div>
      <div><h2>入金待ち</h2><div class="panel"><ul class="list">
        ${unpaid.length ? unpaid.map((r) => `<li class="click" data-open="${r.no}" style="cursor:pointer"><span class="time">${md(r.choices[r.pick].day)}</span><span>${r.name} 様</span><span style="margin-left:auto">${yen(PRICE[r.choices[r.pick].h])}</span></li>`).join("") : "<li>ありません</li>"}
      </ul></div></div>
    </div>

    <h2>届かなかった連絡</h2>
    ${FAILED.length ? `<div class="tbl"><table class="t"><thead><tr><th>いつ</th><th>宛先</th><th>内容</th><th>理由</th><th></th></tr></thead><tbody>
      ${FAILED.map((f) => `<tr><td>${f.when}</td><td>${f.to} 様（${f.how}）</td><td>${f.what}</td><td>${f.why}</td><td><div class="row"><button class="btn" data-resend="${f.id}">送り直す</button><button class="btn" data-phoned="${f.id}">電話で伝えた</button></div></td></tr>`).join("")}
    </tbody></table></div>` : `<p class="note">届かなかった連絡はありません。</p>`}`;
};

let reqFilter = "pending";
VIEWS.requests = () => {
  const tabs = [["pending", "承認待ち"], ["confirmed", "入金待ち"], ["paid", "入金済み"], ["closed", "お断り・キャンセル"], ["all", "すべて"]];
  const rows = REQ.filter((r) => reqFilter === "all" || r.status === reqFilter || (reqFilter === "closed" && (r.status === "declined" || r.status === "cancelled")));
  return `
    <h1>レンタルの申込み</h1>
    <div class="row" style="margin-bottom:16px">${tabs.map(([k, l]) => `<button class="btn ${reqFilter === k ? "primary" : ""}" data-rf="${k}">${l}（${REQ.filter((r) => k === "all" || r.status === k || (k === "closed" && (r.status === "declined" || r.status === "cancelled"))).length}）</button>`).join("")}</div>
    ${rows.length ? `<div class="tbl"><table class="t"><thead><tr><th>受付番号</th><th>受付日時</th><th>お名前</th><th>目的・人数</th><th>日時</th><th>金額</th><th>状態</th></tr></thead><tbody>
      ${rows.map((r) => { const c = r.choices[isHeld(r) || r.status === "cancelled" ? r.pick : 0]; return `<tr class="click" data-open="${r.no}"><td>${r.no}</td><td>${recvAt(r.recvH)}</td><td>${r.name} 様</td><td>${r.purpose}・${r.people}名</td><td>${isHeld(r) || r.status === "cancelled" ? "" : "第1希望 "}${choiceText(c)}${r.choices.length > 1 && r.status === "pending" ? `<br><span class="note">ほか${r.choices.length - 1}件の希望</span>` : ""}</td><td class="num">${yen(PRICE[c.h])}</td><td>${chip(r.status)} ${waitNote(r)}</td></tr>`; }).join("")}
    </tbody></table></div>` : `<p class="note">この状態の申込みはありません。</p>`}
    <p class="note">行を押すと詳しい内容が開きます。承認すると、お客様に確定のお知らせとお振込みのご案内が自動で届きます。</p>`;
};

let bookFilter = "all";
VIEWS.bookings = () => {
  const rows = BOOK.map((b) => ({ ...b, s: slotById(b.slot) })).filter((b) => b.s && (bookFilter === "all" || b.s.kind === bookFilter)).sort((a, b) => a.s.day - b.s.day || toMin(a.s.start) - toMin(b.s.start));
  return `
    <h1>レッスン・イベントの予約</h1>
    <p class="note">レッスンとイベントは、空きがあればその場で予約が確定します。承認はいりません。</p>
    <div class="row" style="margin-bottom:16px">${[["all", "すべて"], ["lesson", "レッスン"], ["event", "イベント"]].map(([k, l]) => `<button class="btn ${bookFilter === k ? "primary" : ""}" data-bf="${k}">${l}</button>`).join("")}</div>
    <div class="tbl"><table class="t"><thead><tr><th>日時</th><th>種類</th><th>内容</th><th>お名前</th><th>初回体験</th><th>状態</th><th></th></tr></thead><tbody>
      ${rows.map((b) => `<tr><td>${md(b.s.day)} ${span(b.s.start, b.s.min)}</td><td><span class="chip ${b.s.kind}">${b.s.kind === "lesson" ? "レッスン" : "イベント"}</span></td><td>${b.s.name}</td><td>${b.name} 様</td><td>${b.trial ? "初回" : ""}</td><td>${b.status === "confirmed" ? '<span class="chip confirmed">確定</span>' : '<span class="chip cancelled">キャンセル</span>'}</td><td>${b.status === "confirmed" ? `<button class="btn" data-bcancel="${b.id}">キャンセルにする</button>` : ""}</td></tr>`).join("")}
    </tbody></table></div>`;
};

let weekStart = 0;
VIEWS.calendar = () => {
  const days = [...Array(7)].map((_, i) => weekStart + i);
  const items = busy();
  REQ.filter((r) => r.status === "pending").forEach((r) => r.choices.forEach((c, i) => items.push({ day: c.day, s: toMin(c.start), e: toMin(c.start) + c.h * 60, kind: "rental", pending: true, label: `第${i + 1}希望 ${r.name} 様`, no: r.no })));
  const px = (min) => ((Math.min(Math.max(min, 540), 1260) - 540) / 60) * 52;
  const col = (d) => {
    const closed = CLOSED.find((c) => c.day === d);
    const evs = items.filter((b) => b.day === d && b.kind !== "closed").map((b) => {
      const style = `top:${px(b.s)}px;height:${Math.max(px(b.e) - px(b.s), 18)}px;${b.pending ? "left:42%;" : ""}`;
      return `<div class="ev ${b.kind}${b.pending ? " pending" : ""}" style="${style}" ${b.no ? `data-open="${b.no}" role="button" tabindex="0"` : ""}><b>${toTime(b.s)}</b> ${b.label}</div>`;
    }).join("");
    return `<div class="col${closed ? " off" : ""}">${closed ? `<div class="ev" style="top:8px;height:auto;border-color:var(--c-ink-muted)">休業日<br>${esc(closed.reason)}</div>` : ""}${evs}</div>`;
  };
  return `
    <h1>カレンダー</h1>
    <div class="row" style="margin-bottom:16px">
      <button class="btn" data-week="-7">前の週</button><button class="btn" data-week="0">今日から</button><button class="btn" data-week="7">次の週</button>
      <span class="note" style="margin-left:8px">${md(days[0])}〜${md(days[6])}</span>
    </div>
    <div class="legend"><span><span class="chip rental">レンタル</span></span><span><span class="chip lesson">レッスン</span></span><span><span class="chip event">イベント</span></span><span>点線＝承認待ちの希望</span><span>斜線＝休業日</span></div>
    <div class="tbl" style="border:0">
      <div class="cal">
        <div class="h"></div>${days.map((d) => `<div class="h">${md(d)}</div>`).join("")}
        <div class="times">${[...Array(13)].map((_, i) => `<span style="top:${i * 52}px">${9 + i}:00</span>`).join("")}</div>
        ${days.map(col).join("")}
      </div>
    </div>
    <p class="note">レンタルの枠を押すと、申込みの内容が開きます。</p>`;
};

const dayOptions = (n, sel) => [...Array(n)].map((_, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${md(i)}</option>`).join("");
const timeOptions = (from, to, sel) => { let o = ""; for (let m = from * 60; m <= to * 60; m += 30) o += `<option ${toTime(m) === sel ? "selected" : ""}>${toTime(m)}</option>`; return o; };

VIEWS.slots = () => {
  const list = [...SLOTS].sort((a, b) => a.day - b.day || toMin(a.start) - toMin(b.start));
  return `
    <h1>枠と休業日</h1>
    <h2 style="margin-top:0">レッスン・イベントの枠</h2>
    <div class="tbl"><table class="t"><thead><tr><th>日時</th><th>種類</th><th>名前</th><th>定員</th><th>予約</th><th></th></tr></thead><tbody>
      ${list.map((s) => { const n = booked(s.id); return `<tr><td>${md(s.day)} ${span(s.start, s.min)}</td><td><span class="chip ${s.kind}">${s.kind === "lesson" ? "レッスン" : "イベント"}</span></td><td>${esc(s.name)}</td><td>${s.cap}名</td><td>${n}名${n >= s.cap ? "（満席）" : ""}</td><td><button class="btn danger" data-delslot="${s.id}" ${n ? "disabled title=\"予約が入っている枠は消せません\"" : ""}>消す</button></td></tr>`; }).join("")}
    </tbody></table></div>
    <p class="note">予約が入っている枠は消せません。お客様に連絡して、予約をキャンセルにしてから消します。</p>

    <div class="panel" style="margin-top:16px">
      <p style="margin:0 0 12px;font-weight:700">枠を足す</p>
      <div class="grid4">
        <div><label class="f" for="ns-kind">種類</label><select id="ns-kind"><option value="semi">セミパーソナル（60分・定員5名）</option><option value="personal">パーソナル（50分・1名）</option><option value="event">イベント（120分）</option></select></div>
        <div><label class="f" for="ns-day">日付</label><select id="ns-day">${dayOptions(30, 3)}</select></div>
        <div><label class="f" for="ns-start">開始</label><select id="ns-start">${timeOptions(9, 19, "10:00")}</select></div>
        <div><button class="btn primary" id="ns-add" type="button">この枠を足す</button></div>
      </div>
      <p class="note hidden" id="ns-err" style="color:var(--c-danger)"></p>
    </div>

    <h2>休業日</h2>
    <div class="panel"><ul class="list">
      ${CLOSED.length ? [...CLOSED].sort((a, b) => a.day - b.day).map((c) => `<li><span class="time">${md(c.day)}</span><span>${esc(c.reason)}</span><button class="btn" style="margin-left:auto" data-delclosed="${c.day}">取り消す</button></li>`).join("") : "<li>登録された休業日はありません</li>"}
    </ul>
    <div class="grid4" style="margin-top:16px">
      <div><label class="f" for="nc-day">日付</label><select id="nc-day">${dayOptions(60, 14)}</select></div>
      <div style="grid-column: span 2"><label class="f" for="nc-reason">理由（お客様には「お休み」とだけ表示します）</label><input id="nc-reason" value="私用のため"></div>
      <div><button class="btn primary" id="nc-add" type="button">休業日にする</button></div>
    </div>
    <p class="note hidden" id="nc-err" style="color:var(--c-danger)"></p>
    <p class="note">定休日（毎週の休み）があるかどうかは <span style="color:var(--c-danger)">※要確認</span></p></div>`;
};

VIEWS.news = () => `
  <h1>お知らせとInstagram</h1>
  <div class="panel">
    <p style="margin:0 0 8px;font-weight:700">Instagramとのつながり（表示例）</p>
    <table class="t"><tbody>
      <tr><th style="width:12em">アカウント</th><td>@sui_musubiya</td></tr>
      <tr><th>状態</th><td><span class="chip paid">つながっています</span></td></tr>
      <tr><th>最後に取り込んだ時刻</th><td>${md(0)} 6:00（1時間ごとに取り込みます）</td></tr>
      <tr><th>つなぐための鍵の期限</th><td>あと41日。期限の前に自動で更新します。更新できなかったときは、ここに赤字で出て、オーナー様にメールが届きます。</td></tr>
    </tbody></table>
    <div class="row" style="margin-top:12px"><button class="btn" id="ig-sync" type="button">いま取り込む</button>
      <label style="display:flex;gap:8px;align-items:center;width:auto">トップに出す数 <select id="ig-count" style="width:auto"><option>3</option><option selected>6</option></select></label></div>
    <p class="note">取り込めなかったときは、前回取り込んだ投稿をそのまま表示します。サイトの表示が空になることはありません。Instagramはプロアカウント（ビジネスかクリエイター）への切り替えが必要です。<span style="color:var(--c-danger)">※いまの種類を確認中</span></p>
  </div>

  <h2>サイトに出す投稿</h2>
  <div class="tbl"><table class="t"><thead><tr><th>投稿（表示例）</th><th style="width:9em">サイトに出す</th></tr></thead><tbody>
    ${IG.map((p) => `<tr><td>${p.cap}</td><td><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" style="width:auto" data-ig="${p.id}" ${p.show ? "checked" : ""}> 出す</label></td></tr>`).join("")}
  </tbody></table></div>
  <p class="note">お客様の写った投稿など、サイトに出したくないものはチェックを外します。</p>

  <h2>お知らせを書く</h2>
  <div class="panel">
    <div class="grid2">
      <div><label class="f" for="nw-title">タイトル</label><input id="nw-title" placeholder="例：年末年始のお休みについて"></div>
      <div><label class="f" for="nw-status">公開</label><select id="nw-status"><option>公開</option><option>下書き</option></select></div>
    </div>
    <label class="f" for="nw-body" style="margin-top:12px">本文</label><textarea id="nw-body" rows="4"></textarea>
    <div class="row" style="margin-top:12px"><button class="btn primary" id="nw-add" type="button">保存する</button><span class="note hidden" id="nw-err" style="color:var(--c-danger)">タイトルを入れてください。</span></div>
  </div>
  <div class="tbl"><table class="t"><thead><tr><th>日付</th><th>タイトル</th><th>状態</th><th></th></tr></thead><tbody>
    ${NEWS.map((n) => `<tr><td>${n.date}</td><td>${esc(n.title)}</td><td>${n.status === "公開" ? '<span class="chip paid">公開</span>' : '<span class="chip cancelled">下書き</span>'}</td><td><button class="btn danger" data-delnews="${n.id}">消す</button></td></tr>`).join("")}
  </tbody></table></div>`;

VIEWS.settings = () => `
  <h1>料金と設定</h1>
  <div class="panel">
    <p style="margin:0 0 12px;font-weight:700">レンタルの料金（税込の総額）</p>
    <div class="grid4">${Object.entries(PRICE).map(([h, p]) => `<div><label class="f" for="pr-${h}">${h}時間</label><input id="pr-${h}" type="number" step="100" value="${p}"></div>`).join("")}</div>
    <p class="note">いまの料金は、2027年3月31日までのお申込みのキャンペーン価格です。4月からの料金は <span style="color:var(--c-danger)">※要確認</span>。撮影の料金を分けるかも <span style="color:var(--c-danger)">※要確認</span></p>
    <button class="btn primary" type="button" data-save>料金を保存する</button>
  </div>

  <div class="panel">
    <p style="margin:0 0 12px;font-weight:700">受付のきまり</p>
    <div class="grid2">
      <div><label class="f" for="st-open">ご利用時間</label><div class="row"><select id="st-open" style="width:auto">${timeOptions(7, 12, "9:00")}</select>〜<select style="width:auto" aria-label="ご利用時間の終わり">${timeOptions(17, 23, "21:00")}</select></div></div>
      <div><label class="f" for="st-dead">レンタルの申込みの締め切り</label><select id="st-dead"><option>利用日の2日前まで</option><option selected>利用日の3日前まで</option><option>利用日の7日前まで</option></select></div>
      <div><label class="f" for="st-reply">お返事の目安（お客様に表示）</label><select id="st-reply"><option selected>24時間以内</option><option>48時間以内</option></select></div>
      <div><label class="f" for="st-cancel">レンタルのキャンセル料</label><select id="st-cancel"><option selected>利用日の7日前から全額</option><option>利用日の3日前から全額</option></select></div>
    </div>
    <p class="note">レッスンとイベントのキャンセル料、お支払い方法は <span style="color:var(--c-danger)">※要確認</span></p>
    <button class="btn primary" type="button" data-save>保存する</button>
  </div>

  <div class="panel">
    <p style="margin:0 0 12px;font-weight:700">オーナー様への連絡</p>
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto" checked> 新しい申込みが来たら、LINEでお知らせする</label>
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto" checked> 毎朝7時に、今日の予定と承認待ちの数をLINEで送る</label>
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto" checked> お客様への連絡が届かなかったら、メールでお知らせする</label>
    <button class="btn primary" type="button" data-save style="margin-top:12px">保存する</button>
  </div>

  <div class="panel">
    <p style="margin:0 0 8px;font-weight:700">ログインとお客様の情報</p>
    <p class="note" style="margin:0">本番では、ログインにパスワードとスマホの認証アプリ（2段階認証）を使います。ログインできるのはオーナー様だけです。お客様の名前や連絡先を残しておく期間は <span style="color:var(--c-danger)">※要確認</span>（例：ご利用日から1年で消す）。</p>
  </div>`;

// ---- 申込みの詳しい内容（右から出る） ------------------------------------
let openNo = null;
let declining = false;
let cancelling = false;
function renderDetail() {
  let box = document.querySelector(".detail");
  if (!openNo) { if (box) box.remove(); return; }
  if (!box) { box = document.createElement("aside"); box.className = "detail"; box.setAttribute("aria-label", "申込みの内容"); document.body.appendChild(box); }
  const r = reqBy(openNo);
  const choices = r.choices.map((c, i) => {
    const hit = conflictOf(c.day, c.start, c.h * 60, r.no);
    const chosen = isHeld(r) || r.status === "cancelled" ? r.pick === i : false;
    const action = r.status === "pending"
      ? `<button class="btn ${hit ? "" : "primary"}" data-approve="${i}" ${hit ? "disabled" : ""}>この日で承認</button>`
      : chosen ? '<span class="chip confirmed">この日で承認済み</span>' : "";
    return `<div class="choice"><div>第${i + 1}希望　${choiceText(c)}　${yen(PRICE[c.h])}
      ${r.status === "pending" ? (hit ? `<span class="conflict">${hit.label}と重なります</span>` : '<span class="free">空いています</span>') : ""}</div>${action}</div>`;
  }).join("");
  const held = isHeld(r) ? r.choices[r.pick] : null;
  const until = held ? (held.day === 0 ? "今日がご利用日です。" : `ご利用日まであと${held.day}日です。`) : "";
  const fee = held ? until + (held.day <= 7 ? `7日前からなので、キャンセル料は全額（${yen(PRICE[held.h])}）です。` : "いまならキャンセル料はかかりません。") : "";
  box.innerHTML = `
    <button class="btn close" type="button" data-close>閉じる</button>
    <p style="margin:0">${chip(r.status)} ${waitNote(r)}</p>
    <h3>${r.name} 様</h3>
    <dl>
      <dt>受付番号</dt><dd>${r.no}（${recvAt(r.recvH)} 受付）</dd>
      <dt>ふりがな</dt><dd>${r.kana}</dd>
      <dt>電話</dt><dd>${r.tel}</dd>
      <dt>メール</dt><dd>${r.mail}</dd>
      <dt>目的・人数</dt><dd>${r.purpose}・${r.people}名</dd>
      <dt>あてはまる</dt><dd>${r.flags.length ? r.flags.join("、") : "なし"}</dd>
      <dt>内容</dt><dd>${r.note}</dd>
      <dt>知ったきっかけ</dt><dd>${r.found}</dd>
      <dt>LINEで連絡</dt><dd>${r.line ? "希望する" : "希望しない（メールで連絡）"}</dd>
      ${r.reason ? `<dt>お断りの理由</dt><dd>${esc(r.reason)}</dd>` : ""}
    </dl>
    <p style="font-weight:700;margin:0 0 8px">希望の日時</p>
    ${choices}
    ${r.status === "pending" ? `<p class="note">重なっている希望は承認できません（二重予約を防ぐため）。承認すると、ほかの希望は自動で外れます。</p>
      ${declining ? `<div class="panel"><label class="f" for="dc-reason">お断りの理由（お客様へのメールに入ります）</label>
        <select id="dc-reason"><option>ご希望の日時がすべて埋まってしまったため</option><option>ご利用の内容がこの場所に合わないため</option><option>定員を超えるため</option></select>
        <div class="row" style="margin-top:12px"><button class="btn danger" data-decline-send>お断りを送る</button><button class="btn" data-decline-cancel>やめる</button></div></div>`
      : `<div class="row"><button class="btn danger" data-decline>お断りする</button></div>`}` : ""}
    ${r.status === "confirmed" ? `<div class="row" style="margin-top:8px"><button class="btn primary" data-paid>入金を記録する</button></div><p class="note">お振込みの期限は ○ <span style="color:var(--c-danger)">※要確認</span></p>` : ""}
    ${isHeld(r) ? (cancelling ? `<div class="panel"><p style="margin:0 0 8px">${fee}</p><div class="row"><button class="btn danger" data-cancel-send>キャンセルにする</button><button class="btn" data-cancel-stop>やめる</button></div></div>`
      : `<div class="row" style="margin-top:8px"><button class="btn" data-cancel>キャンセルにする</button></div>`) : ""}
    <label class="f" for="memo" style="margin-top:16px">メモ（お客様には見えません）</label>
    <textarea id="memo" rows="3">${esc(r.memo || "")}</textarea>`;
  $("memo").addEventListener("input", (e) => { r.memo = e.target.value; });
}
function openReq(no) { openNo = no; declining = false; cancelling = false; renderDetail(); }

// ---- 動き --------------------------------------------------------------
function render() {
  const view = (location.hash || "#dashboard").slice(1);
  const v = VIEWS[view] ? view : "dashboard";
  document.querySelectorAll(".side a").forEach((a) => a.classList.toggle("on", a.dataset.view === v));
  $("main").innerHTML = VIEWS[v]();
  updateBadge();
  renderDetail();
}
window.addEventListener("hashchange", () => { openNo = null; render(); });

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, [data-open]");
  if (!t) return;
  const d = t.dataset;
  const r = openNo ? reqBy(openNo) : null;

  if (d.open) return openReq(d.open);
  if ("close" in d) { openNo = null; return renderDetail(); }

  if (d.approve !== undefined) {
    const c = r.choices[Number(d.approve)];
    const hit = conflictOf(c.day, c.start, c.h * 60, r.no);
    if (hit) return toast(`${hit.label}と重なるので承認できません。`);
    r.status = "confirmed"; r.pick = Number(d.approve);
    toast(`第${r.pick + 1}希望で承認しました。${r.name} 様に確定のお知らせとお振込みのご案内を送りました（モック）`);
    return render();
  }
  if ("decline" in d) { declining = true; return renderDetail(); }
  if ("declineCancel" in d) { declining = false; return renderDetail(); }
  if ("declineSend" in d) {
    r.status = "declined"; r.reason = $("dc-reason").value; declining = false;
    toast(`${r.name} 様にお断りのメールを送りました（モック）`);
    return render();
  }
  if ("paid" in d) { r.status = "paid"; toast("入金を記録しました。お客様に入金確認のお知らせを送りました（モック）"); return render(); }
  if ("cancel" in d) { cancelling = true; return renderDetail(); }
  if ("cancelStop" in d) { cancelling = false; return renderDetail(); }
  if ("cancelSend" in d) { r.status = "cancelled"; cancelling = false; toast("キャンセルにしました。お客様にお知らせを送りました（モック）"); return render(); }

  if (d.resend || d.phoned) {
    FAILED = FAILED.filter((f) => f.id !== (d.resend || d.phoned));
    toast(d.resend ? "送り直しました（モック）" : "電話で伝えた、と記録しました");
    return render();
  }
  if (d.rf) { reqFilter = d.rf; return render(); }
  if (d.bf) { bookFilter = d.bf; return render(); }
  if (d.bcancel) {
    const b = BOOK.find((x) => x.id === d.bcancel);
    b.status = "cancelled";
    toast(`${b.name} 様の予約をキャンセルにしました。お客様にお知らせを送りました（モック）`);
    return render();
  }
  if (d.week !== undefined) { weekStart = Number(d.week) === 0 ? 0 : weekStart + Number(d.week); return render(); }

  if (t.id === "ns-add") {
    const kinds = { semi: ["lesson", "セミパーソナル", 60, 5], personal: ["lesson", "パーソナル", 50, 1], event: ["event", "イベント（名前は後で）", 120, 8] };
    const [kind, name, min, cap] = kinds[$("ns-kind").value];
    const day = Number($("ns-day").value), start = $("ns-start").value;
    const err = $("ns-err");
    if (toMin(start) + min > 21 * 60) { err.textContent = "21:00を過ぎてしまいます。"; return err.classList.remove("hidden"); }
    const hit = conflictOf(day, start, min);
    if (hit) { err.textContent = `${md(day)} は ${hit.label} と重なります。`; return err.classList.remove("hidden"); }
    SLOTS.push({ id: `S${Date.now()}`, kind, day, start, min, name, cap });
    toast(`${md(day)} ${start} の枠を足しました。ご予約のページにすぐ出ます（モック）`);
    return render();
  }
  if (d.delslot) { SLOTS = SLOTS.filter((s) => s.id !== d.delslot); toast("枠を消しました"); return render(); }
  if (t.id === "nc-add") {
    const day = Number($("nc-day").value);
    const reason = $("nc-reason").value.trim() || "お休み";
    const err = $("nc-err");
    const hit = busy().find((b) => b.day === day);
    if (hit) { err.textContent = `${md(day)} には ${hit.label} が入っています。先にお客様と調整してください。`; return err.classList.remove("hidden"); }
    CLOSED.push({ day, reason });
    toast(`${md(day)} を休業日にしました`);
    return render();
  }
  if (d.delclosed) { CLOSED = CLOSED.filter((c) => c.day !== Number(d.delclosed)); toast("休業日を取り消しました"); return render(); }

  if (t.id === "ig-sync") return toast("Instagramから取り込みました（モック）");
  if (t.id === "nw-add") {
    const title = $("nw-title").value.trim();
    $("nw-err").classList.toggle("hidden", !!title);
    if (!title) return;
    const now = new Date();
    NEWS.unshift({ id: Date.now(), date: `${now.getMonth() + 1}/${now.getDate()}`, title, status: $("nw-status").value });
    toast("お知らせを保存しました（モック）");
    return render();
  }
  if (d.delnews) { NEWS = NEWS.filter((n) => String(n.id) !== d.delnews); toast("お知らせを消しました"); return render(); }
  if ("save" in d) return toast("保存しました（モック）");
});
document.addEventListener("change", (e) => {
  if (e.target.dataset.ig) {
    const p = IG.find((x) => x.id === e.target.dataset.ig);
    p.show = e.target.checked;
    toast(p.show ? "サイトに出します" : "サイトに出さないようにしました");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && openNo) { openNo = null; renderDetail(); }
  if (e.key === "Enter" && e.target.matches("[data-open]")) openReq(e.target.dataset.open);
});

// ---- ログイン（モック） ----------------------------------------------------
function enter() { $("login").classList.add("hidden"); $("app").classList.remove("hidden"); render(); }
$("lg-go").addEventListener("click", () => { try { sessionStorage.setItem("sui-admin", "1"); } catch (_) {} enter(); });
$("logout").addEventListener("click", () => {
  try { sessionStorage.removeItem("sui-admin"); } catch (_) {}
  openNo = null; renderDetail();
  $("app").classList.add("hidden"); $("login").classList.remove("hidden");
});
try { if (sessionStorage.getItem("sui-admin") === "1") enter(); } catch (_) {}

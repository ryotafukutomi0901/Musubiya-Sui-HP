// ご予約ページのモックの動き。データはすべて画面の中だけの表示例で、どこにも送らない。

const PRICE = { 2: 2000, 3: 3000, 4: 3600, 5: 4500, 6: 5400, 7: 5600, 8: 6400, 9: 7200, 10: 7500, 11: 7700, 12: 8400 };
const WD = ["日", "月", "火", "水", "木", "金", "土"];
const yen = (n) => n.toLocaleString("ja-JP") + "円";
const fmt = (d) => `${d.getMonth() + 1}月${d.getDate()}日（${WD[d.getDay()]}）`;
const $ = (id) => document.getElementById(id);

// 申込みは利用日の3日前まで → 3日後から14日分を並べる
const days = [];
const base = new Date(); base.setHours(0, 0, 0, 0);
for (let i = 3; i < 17; i++) { const d = new Date(base); d.setDate(base.getDate() + i); days.push(d); }

// 空き状況（表示例。日付から決まる見本の値）
function mark(d, part) {
  const n = (d.getDate() * 7 + part * 3) % 10;
  return n < 2 ? "×" : n < 4 ? "△" : "○";
}
(function renderAvail() {
  const parts = ["午前 9-12", "午後 12-17", "夜 17-21"];
  let html = "<thead><tr><th></th>" + days.slice(0, 7).map((d) => `<th>${fmt(d)}</th>`).join("") + "</tr></thead><tbody>";
  parts.forEach((p, i) => {
    html += `<tr><th>${p}</th>` + days.slice(0, 7).map((d) => { const m = mark(d, i); return `<td class="${m === "×" ? "full" : ""}">${m}</td>`; }).join("") + "</tr>";
  });
  $("avail").innerHTML = html + "</tbody>";
})();

// 第1〜第3希望
const startTimes = [];
for (let h = 9; h <= 19; h++) { startTimes.push(`${h}:00`); if (h < 19) startTimes.push(`${h}:30`); }
let choiceCount = 0;
function addChoice() {
  if (choiceCount >= 3) return;
  choiceCount++;
  const i = choiceCount;
  const el = document.createElement("div");
  el.className = "choice";
  el.innerHTML = `
    <div class="ttl">第${i}希望</div>
    <div><label class="f" for="c${i}-day">日付</label><select id="c${i}-day">${days.map((d, k) => `<option value="${k}">${fmt(d)}</option>`).join("")}</select></div>
    <div><label class="f" for="c${i}-start">開始</label><select id="c${i}-start">${startTimes.map((t) => `<option ${t === "10:00" ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    <div><label class="f" for="c${i}-hours">ご利用時間</label><select id="c${i}-hours">${Object.keys(PRICE).map((h) => `<option value="${h}" ${h === "3" ? "selected" : ""}>${h}時間</option>`).join("")}</select></div>
    <p class="total" id="c${i}-total"></p>`;
  $("choices").appendChild(el);
  ["day", "start", "hours"].forEach((k) => $(`c${i}-${k}`).addEventListener("change", () => updateTotal(i)));
  updateTotal(i);
  if (choiceCount >= 3) $("add-choice").disabled = true;
}
function choiceInfo(i) {
  const d = days[Number($(`c${i}-day`).value)];
  const [h, m] = $(`c${i}-start`).value.split(":").map(Number);
  const hours = Number($(`c${i}-hours`).value);
  const endMin = h * 60 + m + hours * 60;
  const over = endMin > 21 * 60;
  const end = `${Math.floor(endMin / 60)}:${String(endMin % 60).padStart(2, "0")}`;
  return { d, start: $(`c${i}-start`).value, end, hours, price: PRICE[hours], over };
}
function updateTotal(i) {
  const c = choiceInfo(i);
  $(`c${i}-total`).innerHTML = c.over
    ? `<span class="err">21:00を過ぎてしまいます。開始を早めるか、時間を短くしてください。</span>`
    : `${fmt(c.d)} ${c.start}〜${c.end}（${c.hours}時間）　総額 <b>${yen(c.price)}</b>（税込）`;
}
$("add-choice").addEventListener("click", addChoice);
addChoice();

function setStep(n) {
  [...$("r-steps").children].forEach((li, k) => li.classList.toggle("on", k < n));
}
["r-name", "r-kana", "r-tel", "r-mail"].forEach((id) => $(id).addEventListener("focus", () => setStep(3)));

$("r-confirm").addEventListener("click", () => {
  const missing = [];
  if (!$("r-name").value.trim()) missing.push("お名前");
  if (!$("r-kana").value.trim()) missing.push("ふりがな");
  if (!$("r-tel").value.trim()) missing.push("電話番号");
  if (!$("r-mail").value.trim()) missing.push("メールアドレス");
  if (!$("r-purpose").value) missing.push("ご利用の目的");
  const overs = [...Array(choiceCount)].map((_, k) => choiceInfo(k + 1)).some((c) => c.over);
  const err = $("r-err");
  if (missing.length || overs || !$("r-agree").checked) {
    const msgs = [];
    if (missing.length) msgs.push(`${missing.join("、")}を入れてください。`);
    if (overs) msgs.push("21:00を過ぎる希望があります。");
    if (!$("r-agree").checked) msgs.push("利用規約への同意が必要です。");
    err.textContent = msgs.join(" ");
    err.classList.remove("hidden");
    return;
  }
  err.classList.add("hidden");
  const rows = [...Array(choiceCount)].map((_, k) => {
    const c = choiceInfo(k + 1);
    return `<tr><th scope="row">第${k + 1}希望</th><td>${fmt(c.d)} ${c.start}〜${c.end}（${c.hours}時間）</td><td class="num">${yen(c.price)}</td></tr>`;
  }).join("");
  $("r-summary").innerHTML = `<table class="t"><tbody>${rows}
    <tr><th scope="row">お名前</th><td colspan="2">${$("r-name").value}（${$("r-kana").value}）</td></tr>
    <tr><th scope="row">ご連絡先</th><td colspan="2">${$("r-tel").value}／${$("r-mail").value}</td></tr>
    <tr><th scope="row">目的と人数</th><td colspan="2">${$("r-purpose").value}、${$("r-people").value}名</td></tr></tbody></table>
    <p class="note" style="margin-top:12px">承認したときの希望の料金をお支払いいただきます。ご利用日の7日前からのキャンセルは、料金の全額をいただきます。</p>`;
  $("r-form").classList.add("hidden");
  $("r-check").classList.remove("hidden");
  setStep(4);
  $("rental").scrollIntoView();
});
$("r-back").addEventListener("click", () => { $("r-check").classList.add("hidden"); $("r-form").classList.remove("hidden"); setStep(3); });
$("r-submit").addEventListener("click", () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let no = ""; for (let i = 0; i < 8; i++) no += chars[Math.floor(Math.random() * chars.length)];
  $("r-no").textContent = no;
  $("r-check").classList.add("hidden");
  $("r-done").classList.remove("hidden");
  setStep(5);
  $("rental").scrollIntoView();
});

// ヨガ・ピラティスの時間割（表示例）
const SLOTS = [
  { day: 1, time: "10:00〜11:00", name: "セミパーソナル", left: 3, price: "2,000円（初回体験 1,000円）" },
  { day: 2, time: "19:00〜19:50", name: "パーソナル", left: 1, price: "3,500円（初回体験 2,000円）" },
  { day: 4, time: "10:00〜10:50", name: "パーソナル", left: 0, price: "3,500円" },
  { day: 6, time: "14:00〜15:00", name: "セミパーソナル", left: 5, price: "2,000円（初回体験 1,000円）" },
  { day: 8, time: "10:00〜11:00", name: "セミパーソナル", left: 2, price: "2,000円（初回体験 1,000円）" },
];
let chosen = null;
$("slots").innerHTML = SLOTS.map((s, k) => {
  const d = new Date(base); d.setDate(base.getDate() + s.day);
  return `<li><div><span class="chip lesson">${s.name}</span> <span class="when">${fmt(d)} ${s.time}</span></div>
    <span class="left">${s.left ? `あと${s.left}名` : "満席"}</span>
    <button class="btn" type="button" data-slot="${k}" ${s.left ? "" : "disabled"}>${s.left ? "選ぶ" : "満席"}</button></li>`;
}).join("");
document.querySelectorAll("[data-slot]").forEach((b) => b.addEventListener("click", () => {
  chosen = SLOTS[Number(b.dataset.slot)];
  const d = new Date(base); d.setDate(base.getDate() + chosen.day);
  chosen.label = `${chosen.name}　${fmt(d)} ${chosen.time}`;
  $("l-ttl").textContent = chosen.label;
  $("l-price").textContent = `${chosen.price}、お支払い方法は ○`;
  $("l-form").classList.remove("hidden");
  $("l-done").classList.add("hidden");
  $("l-form").scrollIntoView({ block: "center" });
}));
$("l-submit").addEventListener("click", () => {
  const ok = ["l-name", "l-kana", "l-tel", "l-mail"].every((id) => $(id).value.trim());
  $("l-err").textContent = "お名前、ふりがな、電話番号、メールアドレスを入れてください。";
  $("l-err").classList.toggle("hidden", ok);
  if (!ok) return;
  $("l-form").classList.add("hidden");
  $("l-done-txt").textContent = `${chosen.label} のご予約が確定しました。確定のお知らせをメールでお送りしました（モック）。`;
  $("l-done").classList.remove("hidden");
});
document.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll("[data-tab]").forEach((x) => x.classList.toggle("on", x === b));
  $("tab-pilates").classList.toggle("hidden", b.dataset.tab !== "pilates");
  $("tab-yoga").classList.toggle("hidden", b.dataset.tab !== "yoga");
  $("l-form").classList.add("hidden");
}));

// イベント
document.querySelectorAll("[data-event]").forEach((b) => b.addEventListener("click", () => $("e-done").classList.remove("hidden")));

// お申込み状況（受付番号と電話番号の両方が要る。違うときのメッセージは1種類だけ）
$("s-go").addEventListener("click", () => {
  const ok = $("s-no").value.trim().length === 8 && $("s-tel").value.trim().length >= 10;
  $("s-err").classList.toggle("hidden", ok);
  $("s-result").classList.toggle("hidden", !ok);
});
$("s-cancel").addEventListener("click", () => {
  $("s-result").innerHTML = `<p><span class="chip" style="color:var(--c-ink-muted)">キャンセル</span></p><p>お申込みを取り消しました。キャンセル料はかかりません。受付のお知らせをメールでお送りしました（モック）。</p>`;
});

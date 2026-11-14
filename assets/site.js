// 結び家SUI モック 共通部品（メニュー、フッター）
// 各ページの <div data-include="header"></div> と <div data-include="footer"></div> に差し込む。

const NAV = [
  ["index.html", "ホーム"],
  ["about.html", "結び家SUIとは"],
  ["yoga.html", "ヨガについて"],
  ["pilates.html", "ピラティスについて"],
  ["news.html", "お知らせ"],
  ["reserve.html", "ご予約"],
  ["contact.html", "お問い合わせ"],
];
const IG_URL = "https://www.instagram.com/sui_musubiya/";
// フッターの Instagram カードに出す投稿（いまは 2026-11-14 に見た新しい6件。本番は自動で取り込む）
const IG_TILES = ["DfcEiLHGvTW", "DfWBV_NGq1J", "DfKJiANmpR-", "DfBBvKOk40o", "DfBswfVtsW6", "De2xdJBTn5W"];
const LINE_URL = "https://lin.ee/OCzLIhO";

const ICON_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>';
const ICON_LINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4C7 4 3 7.2 3 11.2c0 3.5 3.1 6.4 7.3 7l-.6 2.6 3.4-2.5c4.8-.4 7.9-3.4 7.9-7.1C21 7.2 17 4 12 4Z"/></svg>';

// ヘッダーに並べるページ（ホームはロゴ、ご予約はボタンにするので外す）
const HEADER_NAV = [
  ["about.html", "結び家SUIとは"],
  ["yoga.html", "ヨガ"],
  ["pilates.html", "ピラティス"],
  ["news.html", "お知らせ"],
  ["contact.html", "お問い合わせ"],
];

function header() {
  const items = NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("");
  const here = location.pathname.split("/").pop() || "index.html";
  const links = HEADER_NAV.map(([href, label]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `
  <header class="site-header">
    <a class="sh-logo" href="index.html"><small>古民家レンタルスペース</small>結び家SUI</a>
    <nav class="sh-nav" aria-label="主なページ">${links}</nav>
    <a class="btn primary sh-reserve" href="reserve.html">ご予約</a>
  </header>
  <button class="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false"><span></span></button>
  <nav class="nav-overlay" aria-label="サイト内のページ">
    <ul>${items}</ul>
    <div class="nav-sns">
      <a href="${IG_URL}" target="_blank" rel="noopener">${ICON_IG}<span>Instagram</span></a>
      <a href="${LINE_URL}" target="_blank" rel="noopener">${ICON_LINE}<span>公式LINE</span></a>
    </div>
  </nav>`;
}

function footer() {
  const nav = NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("");
  return `
  <footer>
    <div class="f-cta">
      <div class="ph darker ph-bg photo" style="background-image:linear-gradient(rgba(43,37,34,.6),rgba(43,37,34,.6)),url(assets/img/ceiling-fan.jpg)" data-label="写真：外観（撮影予定）"></div>
      <div class="f-cta-inner">
        <section>
          <h2>お問い合わせ</h2>
          <p class="small" style="margin:0">公式LINE</p>
          <p class="big">@661nckdf</p>
          <p class="small">こんな使い方はできる？というご相談も、お気軽にどうぞ。</p>
          <div class="btns">
            <a class="btn white" href="contact.html">フォームからお問い合わせ</a>
          </div>
        </section>
        <section>
          <h2>ネットからのお申し込み</h2>
          <div class="btns">
            <a class="btn white" href="reserve.html#rental">レンタルスペースのお申し込み</a>
            <a class="btn white" href="reserve.html#lesson">ヨガ・ピラティスのご予約</a>
            <a class="btn white" href="reserve.html#status">お申込み状況の確認</a>
          </div>
        </section>
      </div>
    </div>
    <div class="f-inner">
      <a class="page-top" href="#top" aria-label="ページの先頭へ">︿</a>
      <div>
        <p class="f-logo"><small>古民家レンタルスペース</small>結び家SUI</p>
        <p class="f-address">静岡県富士宮市（富士宮駅南口から徒歩圏・無料駐車場あり）<br>詳しい住所は、ご予約が確定した方にお知らせしています。<br>suimusubiya2026@gmail.com</p>
        <ul class="f-links">
          <li><a href="#">利用規約</a></li>
          <li><a href="#">プライバシーポリシー</a></li>
          <li><a href="#">特定商取引法に基づく表記</a></li>
        </ul>
        <div class="f-sns">
          <a href="${IG_URL}" target="_blank" rel="noopener">${ICON_IG}Instagram</a>
          <a href="${LINE_URL}" target="_blank" rel="noopener">${ICON_LINE}公式LINE</a>
        </div>
      </div>
      <ul class="f-nav">${nav}</ul>
      <div class="f-cards">
        <a class="f-ig" href="${IG_URL}" target="_blank" rel="noopener">
          <span class="head">${ICON_IG}<span>@sui_musubiya</span></span>
          <span class="grid">${IG_TILES.map((c) => `<img src="assets/img/ig/${c}.jpg" alt="" loading="lazy">`).join("")}</span>
          <span class="note" style="display:block">催しの予定や、部屋の様子をInstagramでお届けしています。</span>
          <span class="go">Instagramで見る →</span>
        </a>
        <a class="f-ig f-line" href="${LINE_URL}" target="_blank" rel="noopener">
          <span class="head">${ICON_LINE}<span>公式LINE　@661nckdf</span></span>
          <span class="note" style="display:block;margin-top:8px">ご予約の確定やお知らせを、LINEで受け取れます。ご相談もLINEからどうぞ。</span>
          <span class="go">友だち追加する →</span>
        </a>
      </div>
    </div>
    <p class="copyright">© 古民家レンタルスペース 結び家SUI</p>
  </footer>`;
}

document.querySelectorAll('[data-include="header"]').forEach((el) => (el.outerHTML = header()));
document.querySelectorAll('[data-include="footer"]').forEach((el) => (el.outerHTML = footer()));

const btn = document.querySelector(".menu-btn");
if (btn) {
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  });
  document.querySelectorAll(".nav-overlay a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("nav-open"); });
}

// ヘッダーはスクロールした量に合わせて背景の色だけが透けていく。文字とボタンは残り、押せる。
// FADE_PX だけ下がると背景は完全に透明になり、文字には写真の上でも読めるよう薄いふちが付く。
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const FADE_PX = 240;
  let ticking = false;
  const fadeHeader = () => {
    const t = Math.min(window.scrollY / FADE_PX, 1);
    siteHeader.style.setProperty("--sh-a", (0.94 * (1 - t)).toFixed(3));
    siteHeader.style.setProperty("--sh-halo", (0.9 * t).toFixed(3));
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(fadeHeader); }
  }, { passive: true });
  fadeHeader();
}

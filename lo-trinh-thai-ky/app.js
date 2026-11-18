// Ngày dự sinh: 02/03/2027 (năm, tháng 1-12, ngày)
const DUE = new Date(2027, 2, 2);
const DAY = 86400000;
const TOTAL_DAYS = 280; // 40 tuần
const LMP = new Date(DUE.getFullYear(), DUE.getMonth(), DUE.getDate() - TOTAL_DAYS);

const fmt = d => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const $ = id => document.getElementById(id);

function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// Tuần N: từ LMP + 7N ngày đến LMP + 7N + 6 ngày
function card(w, cur) {
  const [fruit, len, wt, note] = WEEKS[w - 1];
  const start = addDays(LMP, w * 7);
  const end = addDays(start, 6);
  const cls = w < cur ? "past" : w === cur ? "current" : "future";
  const range = w === 40 ? fmt(start) + " (ngày dự sinh)" : fmt(start) + " – " + fmt(end);
  const size = len ? '<p class="size">~' + len + " cm" + (wt ? " · " + wt + " g" : "") + "</p>" : "";
  const tag = cls === "current" ? '<span class="badge">Hiện tại</span>'
    : cls === "past" ? '<span class="check">✓</span>'
    : '<span class="in">' + (w - cur) + " tuần nữa</span>";
  return '<article class="card ' + cls + '">' +
    '<div class="card-head"><span class="wk">Tuần ' + w + "</span>" + tag + "</div>" +
    '<p class="date">' + range + "</p>" +
    '<p class="fruit">' + fruit + "</p>" + size +
    '<p class="desc">' + note + "</p></article>";
}

function render() {
  const t = today();
  const days = Math.round((t - LMP) / DAY);
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  const left = Math.round((DUE - t) / DAY);

  $("dueText").textContent = fmt(DUE);

  if (days < 0) {
    $("weekBig").textContent = "Chưa bắt đầu";
    $("weekSub").textContent = "Thai kỳ tính từ " + fmt(LMP);
  } else {
    $("weekBig").textContent = "Tuần " + weeks;
    $("weekSub").textContent = "+ " + rem + " ngày (" + weeks + " tuần " + rem + " ngày)";
  }

  // 1 tháng = 4 tuần = 28 ngày
  const d0 = Math.max(0, days);
  const m = Math.floor(d0 / 28);
  const mw = Math.floor((d0 % 28) / 7);
  const md = d0 % 7;
  $("monthVal").textContent = m + " tháng " + mw + " tuần " + md + " ngày";
  $("monthNote").textContent = "Đang ở tháng thứ " + (m + 1);

  if (left > 0) $("leftVal").textContent = left + " ngày";
  else if (left === 0) $("leftVal").textContent = "Hôm nay!";
  else $("leftVal").textContent = "Quá " + (-left) + " ngày";

  const tri = weeks < 13 ? "3 tháng đầu" : weeks < 27 ? "3 tháng giữa" : "3 tháng cuối";
  $("triVal").textContent = days < 0 ? "-" : tri;

  const pct = Math.min(100, Math.max(0, (days / TOTAL_DAYS) * 100));
  $("barFill").style.width = pct.toFixed(1) + "%";
  $("barLabel").textContent = pct.toFixed(1) + "% hành trình (" + d0 + "/" + TOTAL_DAYS + " ngày)";

  const cur = Math.min(40, Math.max(1, weeks));

  // Tuần hiện tại + 8 tuần tiếp theo
  let up = "";
  for (let w = cur; w <= Math.min(40, cur + 8); w++) up += card(w, cur);
  $("upcoming").innerHTML = up;

  // Toàn bộ 40 tuần, gom theo tháng
  let all = "";
  for (let mo = 0; mo < 10; mo++) {
    all += '<section class="month"><h3>Tháng ' + (mo + 1) + " <small>Tuần " + (mo * 4 + 1) + "–" + (mo * 4 + 4) + '</small></h3><div class="list">';
    for (let w = mo * 4 + 1; w <= mo * 4 + 4; w++) all += card(w, cur);
    all += "</div></section>";
  }
  $("timeline").innerHTML = all;
}

render();
// Cập nhật khi sang ngày mới mà trang vẫn mở
setInterval(render, 30 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });

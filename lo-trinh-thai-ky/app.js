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
function card(w, cur, withId) {
  const [fruit, len, wt, note, tip] = WEEKS[w - 1];
  const start = addDays(LMP, w * 7);
  const end = addDays(start, 6);
  const cls = w < cur ? "past" : w === cur ? "current" : "future";
  const range = w === 40 ? fmt(start) + " (ngày dự sinh)" : fmt(start) + " – " + fmt(end);
  const size = len ? '<p class="size">~' + len + " cm" + (wt ? " · " + wt + " g" : "") + "</p>" : "";
  const tag = cls === "current" ? '<span class="badge">Hiện tại</span>'
    : cls === "past" ? '<span class="check">✓</span>'
    : '<span class="in">' + (w - cur) + " tuần nữa</span>";
  return '<article class="card ' + cls + '"' + (withId ? ' id="w' + w + '"' : "") + ">" +
    '<div class="card-head"><span class="wk">Tuần ' + w + "</span>" + tag + "</div>" +
    '<p class="date">' + range + "</p>" +
    '<p class="fruit">' + fruit + "</p>" + size +
    '<p class="desc">' + note + "</p>" +
    '<p class="tip"><b>💡 Lưu ý:</b> ' + tip + "</p></article>";
}

// ----- Thông tin mẹ bầu & cân nặng gợi ý (theo khuyến nghị IOM 2009, nội suy tuyến tính) -----
const kg = x => x.toFixed(1).replace(".", ",");

// Tổng mức tăng cân khuyến nghị cả thai kỳ theo BMI trước mang thai
function gainRange(bmi) {
  if (bmi < 18.5) return { name: "thiếu cân", total: [12.5, 18] };
  if (bmi < 25) return { name: "bình thường", total: [11.5, 16] };
  if (bmi < 30) return { name: "thừa cân", total: [7, 11.5] };
  return { name: "béo phì", total: [5, 9] };
}

// Mức tăng cân (kg) khuyến nghị tới tuần w: 3 tháng đầu tăng 0,5–2 kg, sau đó tăng đều tới tổng khuyến nghị
function gainAt(w, total) {
  const [lo, hi] = total;
  if (w <= 13) return [(0.5 * w) / 13, (2 * w) / 13];
  const f = (w - 13) / 27;
  return [0.5 + (lo - 0.5) * f, 2 + (hi - 2) * f];
}

function renderProfile(cur, t) {
  const P = PROFILE;
  const bmi = P.preWeightKg / Math.pow(P.heightCm / 100, 2);
  const g = gainRange(bmi);
  const age = t.getFullYear() - P.birthYear;
  const row = (k, v) => '<div class="pf-row"><span>' + k + "</span><b>" + v + "</b></div>";

  let h = '<div class="pf-card">' +
    row("Mẹ bầu", P.name) +
    row("Năm sinh", P.birthYear + " (" + age + " tuổi)") +
    row("Chiều cao", (P.heightCm / 100).toFixed(2).replace(".", ",") + " m") +
    row("Cân nặng trước mang thai", kg(P.preWeightKg) + " kg") +
    row("BMI trước mang thai", kg(bmi) + " (" + g.name + ")") +
    row("Nên tăng cả thai kỳ", kg(g.total[0]) + " – " + kg(g.total[1]) + " kg") +
    row("Cân nặng mục tiêu tuần 40", kg(P.preWeightKg + g.total[0]) + " – " + kg(P.preWeightKg + g.total[1]) + " kg") +
    "</div>";

  if (bmi >= 18.5 && bmi < 19.5) {
    h += '<p class="pf-note">BMI đang sát ngưỡng thiếu cân (18,5). Bác sĩ có thể khuyên tăng nhiều hơn, khoảng 12,5–18 kg cả thai kỳ.</p>';
  }

  // Cân nặng mới nhất so với khuyến nghị
  const log = P.weights.slice().sort((a, b) => a[0] - b[0]);
  if (log.length) {
    const [lw, lkg] = log[log.length - 1];
    const [lo, hi] = gainAt(lw, g.total).map(x => P.preWeightKg + x);
    const gained = lkg - P.preWeightKg;
    let cls, msg;
    if (lkg < lo - 0.05) {
      cls = "low";
      msg = "Thấp hơn khuyến nghị khoảng " + kg(lo - lkg) + " kg. Nên trao đổi với bác sĩ ở lần khám tới: ăn đủ đạm, năng lượng, thêm bữa phụ và theo dõi cân đều mỗi tuần.";
    } else if (lkg > hi + 0.05) {
      cls = "high";
      msg = "Cao hơn khuyến nghị khoảng " + kg(lkg - hi) + " kg. Nên hạn chế đồ ngọt, nhiều dầu mỡ và hỏi bác sĩ về chế độ ăn.";
    } else {
      cls = "ok";
      msg = "Đang nằm trong khoảng khuyến nghị. Hãy duy trì chế độ ăn và vận động nhẹ.";
    }
    h += '<div class="pf-status ' + cls + '"><b>Tuần ' + lw + ": " + kg(lkg) + " kg (" + (gained >= 0 ? "+" : "") + kg(gained) + " kg)</b>" +
      "<span>Khuyến nghị tuần " + lw + ": " + kg(lo) + " – " + kg(hi) + " kg</span><p>" + msg + "</p></div>";
  }

  // Bảng cân nặng gợi ý theo mốc
  const actual = {};
  log.forEach(([w, x]) => { actual[w] = x; });
  h += '<table class="wt"><thead><tr><th>Tuần</th><th>Nên tăng</th><th>Cân nặng gợi ý</th><th>Thực tế</th></tr></thead><tbody>';
  [13, 20, 25, 28, 32, 36, 40].forEach(w => {
    const [a, b] = gainAt(w, g.total);
    const real = actual[w] !== undefined ? kg(actual[w]) + " kg" : "–";
    h += "<tr" + (w === cur ? ' class="now"' : "") + "><td>" + w + "</td><td>" + kg(a) + "–" + kg(b) + " kg</td><td><b>" +
      kg(P.preWeightKg + a) + "–" + kg(P.preWeightKg + b) + " kg</b></td><td>" + real + "</td></tr>";
  });
  h += "</tbody></table>" +
    '<p class="pf-note">Mức gợi ý được ước tính từ khuyến nghị chung (IOM 2009) theo BMI trước mang thai, chỉ để tham khảo. Mỗi người tăng cân khác nhau, hãy theo tư vấn của bác sĩ.</p>';

  $("profile").innerHTML = h;
}

// ----- Lịch âm & kỳ nghỉ -----
const WD_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const toDate = a => new Date(a[0], a[1] - 1, a[2]);

function pregAt(d) { // tuần + ngày thai tại ngày d
  const n = Math.round((d - LMP) / DAY);
  return "tuần " + Math.floor(n / 7) + " + " + (n % 7) + " ngày";
}

function renderCalendar(t) {
  const start = toDate(CAL_START), leaveFrom = toDate(LEAVE.from), leaveTo = toDate(LEAVE.to);
  const hFrom = toDate(HUSBAND_LEAVE.from), hTo = toDate(HUSBAND_LEAVE.to);
  const end = new Date(DUE.getFullYear(), DUE.getMonth() + 1, 0); // hết tháng chứa ngày dự sinh
  const nDays = (a, b) => Math.round((b - a) / DAY) + 1;
  const ovFrom = hFrom > leaveFrom ? hFrom : leaveFrom, ovTo = hTo < leaveTo ? hTo : leaveTo;
  const k = '<div class="pf-status ok"><b>Vợ nghỉ: ' + fmt(leaveFrom) + " → " + fmt(leaveTo) + "</b><span>" + nDays(leaveFrom, leaveTo) + " ngày · từ " +
    pregAt(leaveFrom) + " đến " + pregAt(leaveTo) + "</span></div>" +
    '<div class="pf-status hl"><b>Chồng nghỉ: ' + fmt(hFrom) + " → " + fmt(hTo) + "</b><span>" + nDays(hFrom, hTo) + " ngày liên tục" +
    (ovFrom <= ovTo ? " · cả hai cùng nghỉ " + nDays(ovFrom, ovTo) + " ngày (" + fmt(ovFrom) + " → " + fmt(ovTo) + ")" : "") + "</span></div>";
  $("keydays").innerHTML = k;

  // Lưới lịch theo tháng
  let h = '<div class="legend"><i class="lg leave"></i>Vợ nghỉ <i class="lg hleave"></i>Chồng nghỉ <i class="lg due"></i>Dự sinh</div>';
  for (let m = new Date(start.getFullYear(), start.getMonth(), 1); m <= end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
    const last = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const lead = (m.getDay() + 6) % 7; // tuần bắt đầu từ thứ 2
    h += '<details class="tri"' + (m.getMonth() < 2 ? " open" : "") + "><summary>Tháng " + (m.getMonth() + 1) + "/" + m.getFullYear() + '</summary><div class="cal">';
    WD_SHORT.forEach(x => { h += '<div class="cw">' + x + "</div>"; });
    for (let i = 0; i < lead; i++) h += "<div></div>";
    for (let day = 1; day <= last; day++) {
      const d = new Date(m.getFullYear(), m.getMonth(), day);
      if (d < start) { h += "<div></div>"; continue; }
      const [ld, lm, , leap] = solarToLunar(day, m.getMonth() + 1, m.getFullYear());
      let c = "cd";
      if (d >= leaveFrom && d <= leaveTo) c += " leave";
      if (d >= hFrom && d <= hTo) c += " hleave";
      if (+d === +DUE) c += " due";
      if (+d === +t) c += " today";
      if (ld === 1) c += " first";
      h += '<div class="' + c + '"><b>' + day + "</b><small>" + (ld === 1 ? "1/" + lm + (leap ? "n" : "") : ld) + "</small></div>";
    }
    h += "</div></details>";
  }
  $("calendar").innerHTML = h;
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

  // Tuần hiện tại + 4 tuần tiếp theo
  let up = "";
  for (let w = cur; w <= Math.min(40, cur + 4); w++) up += card(w, cur);
  $("upcoming").innerHTML = up;

  // Mốc khám quan trọng
  let ms = "";
  for (const [from, to, title] of MILESTONES) {
    const label = from === to ? "Tuần " + from : "Tuần " + from + "–" + to;
    let st;
    if (to < cur) st = '<span class="check">✓ Đã qua</span>';
    else if (from <= cur) st = '<span class="badge">Đang diễn ra</span>';
    else st = '<span class="in">còn ' + (from - cur) + " tuần</span>";
    ms += '<button type="button" class="mile" data-week="' + from + '"><span><b>' + label + "</b> " + title + "</span>" + st + "</button>";
  }
  $("milestones").innerHTML = ms;

  renderProfile(cur, t);
  renderCalendar(t);

  // Toàn bộ 40 tuần, chia 3 tam cá nguyệt (bấm vào mới mở)
  const TRI = [
    ["Tam cá nguyệt 1 (3 tháng đầu)", 1, 13],
    ["Tam cá nguyệt 2 (3 tháng giữa)", 14, 27],
    ["Tam cá nguyệt 3 (3 tháng cuối)", 28, 40],
  ];
  const wasOpen = [...document.querySelectorAll(".tri")].map(d => d.open); // giữ trạng thái mở khi tự cập nhật
  let all = "";
  TRI.forEach(([name, from, to], i) => {
    all += '<details class="tri" id="tri' + (i + 1) + '"' + (wasOpen[i] ? " open" : "") + "><summary>" + name + " <small>Tuần " + from + "–" + to + '</small></summary><div class="list">';
    for (let w = from; w <= to; w++) all += card(w, cur, true);
    all += "</div></details>";
  });
  $("timeline").innerHTML = all;
}

const WD = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const pad = n => String(n).padStart(2, "0");
let shownDay = "";

function tick() {
  const n = new Date();
  $("clockTime").textContent = pad(n.getHours()) + ":" + pad(n.getMinutes()) + ":" + pad(n.getSeconds());
  const day = n.getFullYear() + "-" + n.getMonth() + "-" + n.getDate();
  if (day !== shownDay) { // sang ngày mới (hoặc lần đầu) thì tính lại tuần
    shownDay = day;
    $("clockDate").textContent = WD[n.getDay()] + ", " + fmt(n);
    render();
  }
}

// ----- Menu điều hướng -----
const drawer = $("drawer"), backdrop = $("backdrop"), menuBtn = $("menuBtn");

function setMenu(open) {
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  backdrop.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
}

function scrollToEl(el) {
  const y = el.getBoundingClientRect().top + window.scrollY - 70; // chừa chỗ cho nút menu
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

function openTriOf(week) {
  $("all").open = true;
  const i = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  $("tri" + i).open = true;
}

function jumpWeek(w) {
  openTriOf(w);
  const el = $("w" + w);
  if (!el) return;
  scrollToEl(el);
  el.classList.remove("flash");
  void el.offsetWidth; // chạy lại hiệu ứng
  el.classList.add("flash");
}

function go(target) {
  if (target === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else if (target === "upcoming") scrollToEl($("upcomingTitle"));
  else if (target === "milestones") scrollToEl($("milestonesTitle"));
  else if (target === "profile") scrollToEl($("profileTitle"));
  else if (target === "calendar") scrollToEl($("calendarTitle"));
  else if (target.startsWith("tri")) {
    $("all").open = true;
    const d = $(target);
    d.open = true;
    scrollToEl(d);
  }
}

menuBtn.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
backdrop.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
drawer.addEventListener("click", e => {
  const a = e.target.closest("[data-go]");
  if (!a) return;
  e.preventDefault();
  setMenu(false);
  setTimeout(() => go(a.dataset.go), 50); // chờ khóa cuộn được gỡ rồi mới cuộn
});
$("milestones").addEventListener("click", e => {
  const b = e.target.closest("[data-week]");
  if (b) jumpWeek(+b.dataset.week);
});

// Nút cuộn về đầu trang: chỉ hiện khi đã cuộn xuống
const toTop = $("toTop");
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 300; }, { passive: true });

tick();
setInterval(tick, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });

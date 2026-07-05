/* ===== สัปดาห์ 3: Vibe Coding ทั้งโปรเจกต์ — วิดเจ็ตอินเทอร์แอกทีฟ =====
   ทำงานเฉพาะหน้า week03.html (ทุกส่วนเช็กว่ามี element ก่อนเริ่ม) */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1) เครื่องวัดความซับซ้อนของไอเดียเว็บ ---------- */
  var dhList = document.getElementById("dhList");
  if (dhList) {
    var dhFill = document.getElementById("dhFill");
    var dhScore = document.getElementById("dhScore");
    var dhVerdict = document.getElementById("dhVerdict");

    var DH_ITEMS = [
      { t: "มีมากกว่า 1 หน้า / หลายส่วนใหญ่ ๆ", w: 2 },
      { t: "มีฟอร์มให้ผู้ใช้กรอกข้อมูล", w: 1 },
      { t: "ต้อง “จำ” ข้อมูลของผู้ใช้ไว้ (ตะกร้า, รายการโปรด)", w: 3 },
      { t: "ดึงข้อมูลจากบริการอื่น (เช่น สภาพอากาศ, แผนที่)", w: 3 },
      { t: "มีสมัครสมาชิก / ล็อกอิน", w: 5 },
      { t: "มีการจ่ายเงินจริง", w: 5 },
      { t: "หลายคนใช้พร้อมกัน / มีหน้าแอดมินของร้าน", w: 5 }
    ];

    function dhEval() {
      var total = 0;
      dhList.querySelectorAll("input").forEach(function (b, i) {
        if (b.checked) total += DH_ITEMS[i].w;
        b.closest(".ws-item").classList.toggle("done", b.checked);
      });
      var max = DH_ITEMS.reduce(function (s, it) { return s + it.w; }, 0);
      var pct = Math.min(100, Math.round(total / max * 100));
      if (dhFill) {
        dhFill.style.width = pct + "%";
        dhFill.style.background = total <= 2 ? "#3fb950" : total <= 7 ? "#f0c000" : "#ff4d6d";
      }
      if (dhScore) dhScore.textContent = total + " คะแนน";
      if (dhVerdict) {
        if (total === 0) {
          dhVerdict.innerHTML = "ยังไม่ได้ติ๊กอะไรเลย — เว็บแสดงผลอย่างเดียว = <b>เคสง่ายแน่นอน</b> ลุยแบบเคสที่ 1 ได้เลย";
        } else if (total <= 2) {
          dhVerdict.innerHTML = "<b>เคสง่าย</b> — สั่งต่อเนื่องทีละส่วนแบบเคสที่ 1 จบได้ในเซสชันเดียว ไม่ต้องทำ SPEC ก็ไหว";
        } else if (total <= 7) {
          dhVerdict.innerHTML = "<b>ปานกลาง–ซับซ้อน</b> — ควรเดินแบบเคสที่ 2: ทำ SPEC กับ AI ก่อน แล้วแบ่งเป็น Milestone, commit ทุกด่านที่ผ่าน";
        } else {
          dhVerdict.innerHTML = "<b>ซับซ้อนจริง</b> — ระดับนี้ต้องทั้งวางแผนละเอียด, ใช้เครื่องมือเอเจนต์ และมีพื้นฐานพอตัว บางส่วน (เช่น จ่ายเงิน, ระบบสมาชิกจริง) เป็นงานระดับมืออาชีพ — แต่หลักคิด 4 Milestone เดียวกันนี้ยังใช้ได้เสมอ";
        }
      }
    }

    DH_ITEMS.forEach(function (it) {
      var label = document.createElement("label");
      label.className = "ws-item";
      var input = document.createElement("input");
      input.type = "checkbox";
      var check = document.createElement("span");
      check.className = "ws-check";
      var text = document.createElement("span");
      text.className = "ws-text";
      text.innerHTML = it.t + ' <span class="ws-min">+' + it.w + '</span>';
      label.appendChild(input); label.appendChild(check); label.appendChild(text);
      input.addEventListener("change", dhEval);
      dhList.appendChild(label);
    });
    dhEval();
  }

  /* ---------- 2) โรงละครสร้างเว็บทั้งหน้า (เคสที่ 1: ร้านกาแฟ) ---------- */
  var bt = document.getElementById("bt");
  if (bt) {
    var btMsgs = document.getElementById("btMsgs");
    var btEmpty = document.getElementById("btEmpty");
    var btCode = document.getElementById("btCode");
    var btPreview = document.getElementById("btPreview");
    var btTurn = document.getElementById("btTurn");
    var btVer = document.getElementById("btVer");
    var btLesson = document.getElementById("btLesson");
    var btDots = document.getElementById("btDots");
    var btStart = document.getElementById("btStart");
    var btNext = document.getElementById("btNext");
    var btReset = document.getElementById("btReset");

    var BT_V1 = [
      '<!doctype html>',
      '<html lang="th">',
      '<head><meta charset="utf-8">',
      '<title>บ้านกาแฟ</title>',
      '<style>',
      'body{margin:0;font-family:sans-serif;background:#fff8f0;color:#3b2a20}',
      '.hero{padding:60px 20px;text-align:center;',
      '  background:linear-gradient(135deg,#6f4e37,#c89f7c);color:#fff}',
      '.hero h1{font-size:40px;margin:0 0 8px}',
      '</style></head>',
      '<body>',
      '<header class="hero">',
      '  <h1>บ้านกาแฟ</h1>',
      '  <p>กาแฟคั่วเอง หอมถึงบ้าน</p>',
      '</header>',
      '</body></html>'
    ];

    var BT_V2 = [
      '<!doctype html>',
      '<html lang="th">',
      '<head><meta charset="utf-8">',
      '<title>บ้านกาแฟ</title>',
      '<style>',
      'body{margin:0;font-family:sans-serif;background:#fff8f0;color:#3b2a20}',
      '.hero{padding:60px 20px;text-align:center;',
      '  background:linear-gradient(135deg,#6f4e37,#c89f7c);color:#fff}',
      '.hero h1{font-size:40px;margin:0 0 8px}',
      '.menu{max-width:860px;margin:36px auto;padding:0 20px}',
      '.menu h2{text-align:center;color:#6f4e37}',
      '.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}',
      '.card{background:#fff;border-radius:14px;padding:16px;',
      '  box-shadow:0 6px 18px rgba(111,78,55,.15)}',
      '.price{color:#c0392b;font-weight:bold}',
      '</style></head>',
      '<body>',
      '<header class="hero">',
      '  <h1>บ้านกาแฟ</h1>',
      '  <p>กาแฟคั่วเอง หอมถึงบ้าน</p>',
      '</header>',
      '<section class="menu">',
      '  <h2>เมนูแนะนำ</h2>',
      '  <div class="cards">',
      '    <div class="card"><h3>ลาเต้ร้อน</h3><p>นุ่มละมุน หอมนมสด</p><p class="price">55.-</p></div>',
      '    <div class="card"><h3>เอสเพรสโซเย็น</h3><p>เข้มถึงใจ สดชื่นทั้งวัน</p><p class="price">60.-</p></div>',
      '    <div class="card"><h3>โกโก้ภูเขาไฟ</h3><p>หวานกำลังดี ท็อปวิปครีม</p><p class="price">65.-</p></div>',
      '  </div>',
      '</section>',
      '</body></html>'
    ];

    var BT_V3 = [
      '<!doctype html>',
      '<html lang="th">',
      '<head><meta charset="utf-8">',
      '<title>บ้านกาแฟ</title>',
      '<style>',
      'body{margin:0;font-family:sans-serif;background:#fff8f0;color:#3b2a20}',
      '.hero{padding:60px 20px;text-align:center;',
      '  background:linear-gradient(135deg,#6f4e37,#c89f7c);color:#fff}',
      '.hero h1{font-size:40px;margin:0 0 8px}',
      '.menu{max-width:860px;margin:36px auto;padding:0 20px}',
      '.menu h2{text-align:center;color:#6f4e37}',
      '.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}',
      '.card{background:#fff;border-radius:14px;padding:16px;',
      '  box-shadow:0 6px 18px rgba(111,78,55,.15)}',
      '.price{color:#c0392b;font-weight:bold}',
      '.reviews{background:#f3e7db;padding:28px 20px;text-align:center}',
      '.quote{max-width:520px;margin:12px auto;background:#fff;',
      '  border-radius:12px;padding:13px 18px;font-style:italic}',
      '.contact{text-align:center;padding:28px;color:#6f4e37}',
      '</style></head>',
      '<body>',
      '<header class="hero">',
      '  <h1>บ้านกาแฟ</h1>',
      '  <p>กาแฟคั่วเอง หอมถึงบ้าน</p>',
      '</header>',
      '<section class="menu">',
      '  <h2>เมนูแนะนำ</h2>',
      '  <div class="cards">',
      '    <div class="card"><h3>ลาเต้ร้อน</h3><p>นุ่มละมุน หอมนมสด</p><p class="price">55.-</p></div>',
      '    <div class="card"><h3>เอสเพรสโซเย็น</h3><p>เข้มถึงใจ สดชื่นทั้งวัน</p><p class="price">60.-</p></div>',
      '    <div class="card"><h3>โกโก้ภูเขาไฟ</h3><p>หวานกำลังดี ท็อปวิปครีม</p><p class="price">65.-</p></div>',
      '  </div>',
      '</section>',
      '<section class="reviews">',
      '  <h2>ลูกค้าพูดถึงเรา</h2>',
      '  <div class="quote">"กาแฟหอมมาก บรรยากาศน่านั่งทั้งวัน" — คุณน้ำ</div>',
      '  <div class="quote">"โกโก้ภูเขาไฟคือที่สุด ต้องกลับมาอีก!" — คุณเจมส์</div>',
      '</section>',
      '<footer class="contact">',
      '  <h2>ติดต่อร้าน</h2>',
      '  <p>ถนนริมโขง นครพนม · โทร 08x-xxx-xxxx</p>',
      '  <p>เปิดทุกวัน 07:00 – 17:00</p>',
      '</footer>',
      '</body></html>'
    ];

    var BT_V4 = [
      '<!doctype html>',
      '<html lang="th">',
      '<head><meta charset="utf-8">',
      '<title>บ้านกาแฟ</title>',
      '<style>',
      'body{margin:0;font-family:sans-serif;background:#fff8f0;color:#3b2a20}',
      '.hero{padding:60px 20px;text-align:center;',
      '  background:linear-gradient(135deg,#6f4e37,#c89f7c);color:#fff}',
      '.hero h1{font-size:40px;margin:0 0 8px}',
      '.btn{display:inline-block;margin-top:14px;background:#fff;color:#6f4e37;',
      '  padding:10px 28px;border-radius:999px;font-weight:bold;text-decoration:none}',
      '.menu{max-width:860px;margin:36px auto;padding:0 20px}',
      '.menu h2{text-align:center;color:#6f4e37}',
      '.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}',
      '.card{background:#fff;border-radius:14px;padding:16px;',
      '  box-shadow:0 6px 18px rgba(111,78,55,.15);transition:transform .2s}',
      '.card:hover{transform:translateY(-6px)}',
      '.price{color:#c0392b;font-weight:bold}',
      '.reviews{background:#f3e7db;padding:28px 20px;text-align:center}',
      '.quote{max-width:520px;margin:12px auto;background:#fff;',
      '  border-radius:12px;padding:13px 18px;font-style:italic}',
      '.contact{text-align:center;padding:28px;color:#6f4e37}',
      '@media(max-width:640px){.cards{grid-template-columns:1fr}}',
      '</style></head>',
      '<body>',
      '<header class="hero">',
      '  <h1>บ้านกาแฟ</h1>',
      '  <p>กาแฟคั่วเอง หอมถึงบ้าน</p>',
      '  <a class="btn" href="#">สั่งเลย</a>',
      '</header>',
      '<section class="menu">',
      '  <h2>เมนูแนะนำ</h2>',
      '  <div class="cards">',
      '    <div class="card"><h3>ลาเต้ร้อน</h3><p>นุ่มละมุน หอมนมสด</p><p class="price">55.-</p></div>',
      '    <div class="card"><h3>เอสเพรสโซเย็น</h3><p>เข้มถึงใจ สดชื่นทั้งวัน</p><p class="price">60.-</p></div>',
      '    <div class="card"><h3>โกโก้ภูเขาไฟ</h3><p>หวานกำลังดี ท็อปวิปครีม</p><p class="price">65.-</p></div>',
      '  </div>',
      '</section>',
      '<section class="reviews">',
      '  <h2>ลูกค้าพูดถึงเรา</h2>',
      '  <div class="quote">"กาแฟหอมมาก บรรยากาศน่านั่งทั้งวัน" — คุณน้ำ</div>',
      '  <div class="quote">"โกโก้ภูเขาไฟคือที่สุด ต้องกลับมาอีก!" — คุณเจมส์</div>',
      '</section>',
      '<footer class="contact">',
      '  <h2>ติดต่อร้าน</h2>',
      '  <p>ถนนริมโขง นครพนม · โทร 08x-xxx-xxxx</p>',
      '  <p>เปิดทุกวัน 07:00 – 17:00</p>',
      '</footer>',
      '</body></html>'
    ];

    var BT_TURNS = [
      {
        user: "สร้างหน้าเว็บร้านกาแฟชื่อ “บ้านกาแฟ” มีส่วนหัวโทนน้ำตาลไล่สี ชื่อร้านตัวใหญ่ กับสโลแกน",
        ai: "ได้เลยครับ เริ่มจากโครงหน้ากับส่วนหัวก่อน — เปิดดูได้เลย",
        code: BT_V1, changed: null, ver: "คำสั่งที่ 1",
        lesson: "<b>ขั้นที่ 1 — เริ่มจากโครง:</b> ยังไม่ต้องครบทุกส่วน ขอแค่หน้าเปิดได้และมี “กระดูกสันหลัง” ก่อน เห็นของจริงเร็ว กำลังใจมา แถมมีฐานให้สั่งต่อ"
      },
      {
        user: "เพิ่มส่วน “เมนูแนะนำ” ใต้ส่วนหัว เป็นการ์ด 3 ใบ มีชื่อเมนู คำอธิบายสั้น ๆ และราคา",
        ai: "เพิ่มส่วนเมนูเป็นการ์ด 3 ใบเรียบร้อยครับ",
        code: BT_V2, changed: [9, 10, 11, 12, 13, 14, 21, 22, 23, 24, 25, 26, 27, 28], ver: "คำสั่งที่ 2",
        lesson: "<b>ขั้นที่ 2 — เติมทีละส่วน:</b> สังเกตคำว่า “ใต้ส่วนหัว” — การอ้างถึงของที่มีอยู่ ทำให้ AI “ต่อยอด” ไม่ใช่รื้อทำใหม่ โค้ดเดิมไม่ถูกแตะเลย (ดูบรรทัดที่ไม่ไฮไลต์)"
      },
      {
        user: "ต่อด้วยส่วนรีวิวลูกค้า 2 กล่องคำพูด และส่วนติดต่อท้ายหน้า มีที่อยู่ เบอร์โทร เวลาเปิด",
        ai: "จัดให้ครับ รีวิวกับส่วนติดต่ออยู่ท้ายหน้าแล้ว",
        code: BT_V3, changed: [15, 16, 17, 18, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], ver: "คำสั่งที่ 3",
        lesson: "<b>ขั้นที่ 3 — จังหวะคือหัวใจ:</b> ทุกขั้นเรา “เปิดดูผลก่อน แล้วค่อยสั่งต่อ” ถ้าขั้นไหนเพี้ยน ให้แก้จนจบก่อนเพิ่มของใหม่ — อย่าทับถมปัญหา"
      },
      {
        user: "ขัดเงาหน่อย: การ์ดเมนูเอาเมาส์ชี้แล้วลอยขึ้น เพิ่มปุ่ม “สั่งเลย” ในส่วนหัว และให้ดูดีบนจอมือถือ",
        ai: "เพิ่มลูกเล่น ปุ่ม และรองรับมือถือแล้วครับ — เว็บพร้อมเสิร์ฟ!",
        code: BT_V4, changed: [9, 10, 15, 16, 22, 28], ver: "คำสั่งที่ 4",
        lesson: "<b>ขั้นที่ 4 — ขัดเงาท้ายสุด:</b> ความสวยมาหลังโครงสร้างเสมอ ครบ 4 คำสั่ง ได้เว็บทั้งหน้า — <b>ลองเอาเมาส์ชี้การ์ดเมนูในพรีวิวดูสิ ลอยขึ้นจริง!</b> เคสง่ายจบแค่นี้ ที่เหลือคือ push ขึ้น GitHub Pages"
      }
    ];

    var btIdx = 0, btTimers = [];
    function btClear() { btTimers.forEach(clearTimeout); btTimers = []; }
    function btLater(fn, ms) { btTimers.push(setTimeout(fn, ms)); }

    function btAddMsg(who, text) {
      var m = document.createElement("div");
      m.className = "vs2-m " + (who === "user" ? "vs2-user" : "vs2-ai");
      var label = document.createElement("span");
      label.className = "vs2-who";
      label.textContent = who === "user" ? "คุณ" : "AI";
      var bubble = document.createElement("div");
      bubble.className = "vs2-bubble";
      bubble.textContent = text;
      m.appendChild(label); m.appendChild(bubble);
      btMsgs.appendChild(m);
      btMsgs.scrollTop = btMsgs.scrollHeight;
      return m;
    }

    function btAddThinking() {
      var m = document.createElement("div");
      m.className = "vs2-m vs2-ai";
      m.innerHTML = '<span class="vs2-who">AI</span>' +
        '<div class="vs2-bubble vs2-think"><span class="td"></span><span class="td"></span><span class="td"></span></div>';
      btMsgs.appendChild(m);
      btMsgs.scrollTop = btMsgs.scrollHeight;
      return m;
    }

    function btRenderCode(turn) {
      btCode.innerHTML = "";
      turn.code.forEach(function (line, i) {
        var el = document.createElement("div");
        el.className = "vs2-line" + (turn.changed && turn.changed.indexOf(i) !== -1 ? " chg" : "");
        var num = document.createElement("span");
        num.className = "vs2-ln";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "vs2-lt";
        txt.textContent = line === "" ? " " : line;
        el.appendChild(num); el.appendChild(txt);
        btCode.appendChild(el);
      });
      btVer.textContent = turn.ver;
      var firstChg = btCode.querySelector(".chg");
      if (firstChg) btCode.scrollTop = Math.max(0, firstChg.offsetTop - 60);
      else btCode.scrollTop = 0;
    }

    function btRenderDots() {
      btDots.innerHTML = "";
      BT_TURNS.forEach(function (_, i) {
        var d = document.createElement("span");
        d.className = "vs2-dot" + (i < btIdx ? " done" : "");
        btDots.appendChild(d);
      });
    }

    function btPlayTurn() {
      if (btIdx >= BT_TURNS.length) return;
      var turn = BT_TURNS[btIdx];
      btStart.disabled = true; btNext.disabled = true;
      if (btEmpty) btEmpty.style.display = "none";
      btTurn.textContent = "คำสั่งที่ " + (btIdx + 1) + " / " + BT_TURNS.length;

      btAddMsg("user", turn.user);
      btLater(function () {
        var think = btAddThinking();
        btLater(function () {
          think.remove();
          btAddMsg("ai", turn.ai);
          btRenderCode(turn);
          btLater(function () {
            btPreview.srcdoc = turn.code.join("\n");
            btPreview.classList.add("show");
            btLesson.innerHTML = turn.lesson;
            btLesson.classList.remove("flash");
            void btLesson.offsetWidth;
            btLesson.classList.add("flash");
            btIdx++;
            btRenderDots();
            if (btIdx < BT_TURNS.length) {
              btNext.disabled = false;
            } else {
              btTurn.textContent = "เสร็จสมบูรณ์ — 4 คำสั่ง 1 เว็บ";
            }
          }, 500);
        }, 1100);
      }, 550);
    }

    function btResetAll() {
      btClear();
      btIdx = 0;
      btMsgs.innerHTML = "";
      if (btEmpty) { btMsgs.appendChild(btEmpty); btEmpty.style.display = ""; }
      btCode.innerHTML = '<div class="vs2-code-idle">โค้ดทั้งไฟล์จะอยู่ที่นี่ · บรรทัดใหม่ไฮไลต์สีเขียว</div>';
      btVer.textContent = "";
      btPreview.classList.remove("show");
      btPreview.srcdoc = "";
      btTurn.textContent = "ยังไม่เริ่ม";
      btLesson.innerHTML = "บทเรียนของแต่ละขั้นจะสรุปให้ตรงนี้";
      btLesson.classList.remove("flash");
      btStart.disabled = false; btNext.disabled = true;
      btRenderDots();
    }

    btStart.addEventListener("click", btPlayTurn);
    btNext.addEventListener("click", btPlayTurn);
    btReset.addEventListener("click", btResetAll);
    btRenderDots();
  }

  /* ---------- 3) Accordion (แผน Milestone) ---------- */
  document.querySelectorAll(".acc .acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var acc = item.parentElement;
      var wasOpen = item.classList.contains("open");
      acc.querySelectorAll(".acc-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- 4) เช็กลิสต์เวิร์กช็อป 2 แทร็ก (จำสถานะแยกกัน) ---------- */
  document.querySelectorAll(".ws[data-ws-key]").forEach(function (ws) {
    var key = ws.getAttribute("data-ws-key");
    var fill = ws.querySelector(".ws-fill");
    var count = ws.querySelector(".ws-count");
    var done = ws.querySelector(".ws-done");
    var boxes = ws.querySelectorAll("input[type=checkbox]");

    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { saved = []; }

    function update() {
      var n = 0, state = [];
      boxes.forEach(function (b) {
        if (b.checked) n++;
        state.push(b.checked);
        b.closest(".ws-item").classList.toggle("done", b.checked);
      });
      if (fill) fill.style.width = (n / boxes.length * 100) + "%";
      if (count) count.textContent = n + " / " + boxes.length;
      if (done) done.hidden = n !== boxes.length;
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) { /* ใช้ต่อได้แม้ไม่มี storage */ }
    }

    boxes.forEach(function (b, i) {
      if (saved[i]) b.checked = true;
      b.addEventListener("change", update);
    });
    update();
  });

  /* ---------- 5) แบบทดสอบท้ายบท (สัปดาห์ 3) ---------- */
  var quiz3 = document.getElementById("quiz3Container");
  if (quiz3) {
    var QUIZ3 = [
      {
        q: "ทำไมไม่ควรสั่ง AI “ทำเว็บทั้งหมด” ในคำสั่งเดียว?",
        options: [
          "เพราะ AI คิดเงินแพงขึ้นตามความยาวคำสั่ง",
          "เพราะจะได้โค้ดก้อนใหญ่ที่ตรวจไม่ไหว ผิดหลายจุดพร้อมกัน และ AI ต้องเดารายละเอียดเองเกือบหมด",
          "เพราะ AI ถูกห้ามเขียนโค้ดยาว",
          "จริง ๆ แล้วควรสั่งทีเดียว จะได้เสร็จเร็ว"
        ],
        answer: 1
      },
      {
        q: "โปรเจกต์ซับซ้อน ควรเริ่มจากขั้นไหนก่อน?",
        options: [
          "เขียนโค้ดหน้าแรกทันที เดี๋ยวแผนตามมาเอง",
          "เลือกสีและฟอนต์ให้เสร็จก่อน",
          "คุยขอบเขตกับ AI ให้ได้แผน (หน้า/ข้อมูล/ลำดับงาน) แล้วบันทึกเป็น SPEC — โดยยังไม่เขียนโค้ด",
          "สมัครโดเมนเนมก่อน"
        ],
        answer: 2
      },
      {
        q: "ฟีเจอร์ใดทำให้เว็บ “ซับซ้อนขึ้น” มากที่สุด?",
        options: [
          "เปลี่ยนสีพื้นหลังเป็นไล่สี",
          "เพิ่มรูปภาพหลาย ๆ รูป",
          "มีระบบสมาชิกและต้องจำข้อมูลของผู้ใช้แต่ละคน",
          "เปลี่ยนฟอนต์เป็นตัวหนา"
        ],
        answer: 2
      },
      {
        q: "ควร git commit ตอนไหนในโปรเจกต์แบบ Milestone?",
        options: [
          "ครั้งเดียวตอนจบโปรเจกต์ พอแล้ว",
          "ทุกครั้งที่ผ่านด่านและทดสอบแล้วว่าใช้งานได้ — เหมือนเซฟพอยต์ของเกม",
          "เฉพาะตอนที่โค้ดพัง",
          "ไม่จำเป็นต้อง commit ถ้าใช้ AI"
        ],
        answer: 1
      },
      {
        q: "บทสนทนายาวมากจน AI เริ่ม “ลืม” รายละเอียดโปรเจกต์ ควรทำอย่างไร?",
        options: [
          "พิมพ์ซ้ำคำเดิมหลาย ๆ รอบให้มันจำ",
          "ดุ AI ให้ตั้งใจมากขึ้น",
          "เก็บแผนไว้ในไฟล์ SPEC.md แล้วเปิดแชตใหม่พร้อมวาง SPEC ให้อ่าน",
          "เลิกใช้ AI กลางโปรเจกต์"
        ],
        answer: 2
      },
      {
        q: "ในเคสซับซ้อน ด่านไหนควร “ทดสอบหนักที่สุด”?",
        options: [
          "ด่านวางแผน เพราะเป็นด่านแรก",
          "ด่านโครงเว็บ เพราะมีหลายหน้า",
          "ด่านฟีเจอร์หัวใจ (เช่น ตะกร้า) เพราะบั๊กชอบซ่อนตรงข้อมูลข้ามหน้า",
          "ด่านขัดเงา เพราะเป็นด่านสุดท้าย"
        ],
        answer: 2
      }
    ];

    var q3Score = document.getElementById("quiz3Score");
    var q3Answered = 0, q3Points = 0;

    QUIZ3.forEach(function (item, qi) {
      var qDiv = document.createElement("div");
      qDiv.className = "quiz-q";
      var title = document.createElement("h4");
      title.textContent = (qi + 1) + ". " + item.q;
      qDiv.appendChild(title);

      var feedback = document.createElement("div");
      feedback.className = "quiz-feedback";

      item.options.forEach(function (opt, oi) {
        var btn = document.createElement("button");
        btn.className = "quiz-opt";
        btn.textContent = opt;
        btn.addEventListener("click", function () {
          var optionBtns = qDiv.querySelectorAll(".quiz-opt");
          optionBtns.forEach(function (b) { b.disabled = true; });
          var iconSvg = function (id) {
            return '<svg class="icon"><use href="#' + id + '"></use></svg> ';
          };
          if (oi === item.answer) {
            btn.classList.add("correct");
            feedback.innerHTML = iconSvg("i-check") + "ถูกต้อง!";
            feedback.style.color = "var(--accent)";
            q3Points++;
          } else {
            btn.classList.add("wrong");
            optionBtns[item.answer].classList.add("correct");
            feedback.innerHTML = iconSvg("i-x") + "ยังไม่ถูก — คำตอบที่ถูกถูกไฮไลต์ไว้แล้ว";
            feedback.style.color = "#f85149";
          }
          q3Answered++;
          if (q3Answered === QUIZ3.length && q3Score) {
            q3Score.textContent = "คะแนนของคุณ: " + q3Points + " / " + QUIZ3.length +
              (q3Points === QUIZ3.length ? " — เต็ม! พร้อมคุมโปรเจกต์จริงแล้ว" : " — ข้อที่พลาด เลื่อนกลับไปทบทวนหัวข้อนั้นได้เลย");
          }
        });
        qDiv.appendChild(btn);
      });

      qDiv.appendChild(feedback);
      quiz3.appendChild(qDiv);
    });
  }

});

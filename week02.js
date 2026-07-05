/* ===== Vibe Coding (สัปดาห์ 2) — วิดเจ็ตอินเทอร์แอกทีฟ =====
   ทำงานเฉพาะหน้า week02.html (ทุกส่วนเช็กว่ามี element ก่อนเริ่ม) */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1) ซิมูเลเตอร์ Vibe Coding ---------- */
  var PRESETS = [
    {
      label: "ปุ่มไล่สีกดเด้ง",
      code:
"<button class=\"btn\">กดฉันสิ</button>\n" +
"<style>\n" +
".btn{\n" +
"  padding:16px 42px; border:none;\n" +
"  border-radius:999px; font-size:18px;\n" +
"  color:#fff; cursor:pointer;\n" +
"  background:linear-gradient(90deg,#6e5cff,#00c2ff);\n" +
"  box-shadow:0 12px 30px rgba(110,92,255,.55);\n" +
"  transition:transform .15s ease;\n" +
"}\n" +
".btn:hover{ transform:translateY(-4px); }\n" +
".btn:active{ transform:scale(.9); }\n" +
"</style>"
    },
    {
      label: "การ์ดเรืองแสงตอนชี้",
      code:
"<div class=\"card\">Hover ฉันดูสิ</div>\n" +
"<style>\n" +
".card{\n" +
"  width:190px; height:120px; display:grid;\n" +
"  place-items:center; border-radius:18px;\n" +
"  color:#e6edf3; font-size:16px;\n" +
"  background:#1c2230; border:1px solid #2d333b;\n" +
"  transition:.3s ease;\n" +
"}\n" +
".card:hover{\n" +
"  transform:translateY(-8px);\n" +
"  border-color:#6e5cff;\n" +
"  box-shadow:0 0 40px rgba(110,92,255,.7);\n" +
"}\n" +
"</style>"
    },
    {
      label: "หัวใจเต้นตุบ ๆ",
      code:
"<div class=\"heart\"></div>\n" +
"<style>\n" +
".heart{\n" +
"  width:80px; height:80px; position:relative;\n" +
"  transform:rotate(-45deg);\n" +
"  animation:beat .8s infinite;\n" +
"}\n" +
".heart, .heart::before, .heart::after{\n" +
"  background:#ff4d6d; border-radius:8px;\n" +
"}\n" +
".heart::before, .heart::after{\n" +
"  content:''; width:80px; height:80px;\n" +
"  position:absolute;\n" +
"}\n" +
".heart::before{ top:-40px; left:0; border-radius:50%; }\n" +
".heart::after{ left:40px; top:0; border-radius:50%; }\n" +
"@keyframes beat{ 0%,100%{transform:rotate(-45deg) scale(1)}\n" +
"  50%{transform:rotate(-45deg) scale(1.2)} }\n" +
"</style>"
    },
    {
      label: "ข้อความไล่สีรุ้ง",
      code:
"<h1 class=\"rainbow\">Vibe Coding</h1>\n" +
"<style>\n" +
".rainbow{\n" +
"  font-size:44px; font-weight:800;\n" +
"  background:linear-gradient(90deg,\n" +
"    #ff4d6d,#f0c000,#3fb950,#00c2ff,#6e5cff,#ff4d6d);\n" +
"  background-size:300% 100%;\n" +
"  -webkit-background-clip:text;\n" +
"  background-clip:text; color:transparent;\n" +
"  animation:flow 4s linear infinite;\n" +
"}\n" +
"@keyframes flow{ to{ background-position:300% 0; } }\n" +
"</style>"
    },
    {
      label: "สปินเนอร์หมุนโหลด",
      code:
"<div class=\"spin\"></div>\n" +
"<style>\n" +
".spin{\n" +
"  width:74px; height:74px; border-radius:50%;\n" +
"  border:8px solid #2d333b;\n" +
"  border-top-color:#00c2ff;\n" +
"  border-right-color:#6e5cff;\n" +
"  animation:rot .9s linear infinite;\n" +
"}\n" +
"@keyframes rot{ to{ transform:rotate(360deg); } }\n" +
"</style>"
    }
  ];

  var simChips = document.getElementById("simChips");
  var simCode = document.getElementById("simCode");
  var simPreview = document.getElementById("simPreview");
  var simThinking = document.getElementById("simThinking");
  var simIdle = document.getElementById("simIdle");
  var simLive = document.getElementById("simLive");

  if (simChips && simCode && simPreview) {
    var typingTimer = null;
    var simEditBtn = document.getElementById("simEditBtn");
    var simEditor = document.getElementById("simEditor");
    var simPre = simCode.parentElement; /* <pre class="sim-code"> */
    var currentCode = "";
    var editMode = false;

    function exitEditMode() {
      editMode = false;
      if (simEditor) simEditor.hidden = true;
      if (simPre) simPre.style.display = "";
      if (simEditBtn) {
        simEditBtn.hidden = true;
        simEditBtn.classList.remove("running");
        simEditBtn.textContent = "แก้โค้ดเอง";
      }
    }

    function wrapDoc(code) {
      return "<!doctype html><html><head><meta charset='utf-8'>" +
        "<style>html,body{height:100%;margin:0}" +
        "body{display:grid;place-items:center;" +
        "background:#0d1117;font-family:'IBM Plex Sans Thai',system-ui,sans-serif;" +
        "color:#e6edf3;overflow:hidden}</style></head><body>" +
        code + "</body></html>";
    }

    function runPreset(preset, chip) {
      if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
      exitEditMode();

      /* ไฮไลต์ชิปที่เลือก */
      simChips.querySelectorAll(".sim-chip").forEach(function (c) {
        c.classList.toggle("active", c === chip);
      });

      if (simIdle) simIdle.style.display = "none";
      simCode.textContent = "";
      simPreview.classList.remove("show");
      if (simLive) { simLive.textContent = "กำลังสร้าง…"; simLive.classList.remove("ready"); }

      /* ขั้นที่ 1: AI "กำลังคิด" */
      if (simThinking) simThinking.classList.add("show");

      setTimeout(function () {
        if (simThinking) simThinking.classList.remove("show");

        /* ขั้นที่ 2: พิมพ์โค้ดออกมาทีละตัว (typewriter) */
        var text = preset.code;
        var i = 0;
        typingTimer = setInterval(function () {
          i += 3; /* พิมพ์ทีละ ~3 ตัวอักษรให้ลื่นตา */
          simCode.textContent = text.slice(0, i);
          simCode.scrollTop = simCode.scrollHeight;
          if (i >= text.length) {
            clearInterval(typingTimer); typingTimer = null;
            simCode.textContent = text;

            /* ขั้นที่ 3: เรนเดอร์ผลจริงลง iframe */
            simPreview.srcdoc = wrapDoc(text);
            setTimeout(function () {
              simPreview.classList.add("show");
              if (simLive) { simLive.textContent = "เรนเดอร์แล้ว"; simLive.classList.add("ready"); }
              /* เปิดโหมด "แก้โค้ดเอง" ให้กดได้ */
              currentCode = text;
              if (simEditBtn && simEditor) simEditBtn.hidden = false;
            }, 120);
          }
        }, 16);
      }, 650);
    }

    PRESETS.forEach(function (preset, idx) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sim-chip";
      chip.textContent = preset.label;
      chip.addEventListener("click", function () { runPreset(preset, chip); });
      simChips.appendChild(chip);
      if (idx === 0) chip._first = true;
    });

    /* ปุ่ม "แก้โค้ดเอง" — กดครั้งแรกเปิดช่องแก้ กดอีกครั้งรันโค้ดที่แก้ */
    if (simEditBtn && simEditor) {
      simEditBtn.addEventListener("click", function () {
        if (!editMode) {
          editMode = true;
          simEditor.value = currentCode;
          simEditor.hidden = false;
          if (simPre) simPre.style.display = "none";
          simEditBtn.classList.add("running");
          simEditBtn.textContent = "รันโค้ดที่แก้";
          simEditor.focus();
          if (simLive) { simLive.textContent = "กำลังแก้เอง…"; simLive.classList.remove("ready"); }
        } else {
          currentCode = simEditor.value;
          simPreview.srcdoc = wrapDoc(currentCode);
          if (simLive) { simLive.textContent = "เรนเดอร์ฉบับแก้เองแล้ว"; simLive.classList.add("ready"); }
        }
      });
    }
  }

  /* ---------- 2) วงจรการทำงาน (Vibe Loop) ---------- */
  var vloop = document.getElementById("vloop");
  if (vloop) {
    var vnodes = vloop.querySelectorAll(".vnode");
    var vdetail = document.getElementById("vloopDetail");
    var vplay = document.getElementById("vloopPlay");
    var DETAILS = [
      "<b>1 · บอกความต้องการ</b> — อธิบายเป็นภาษาคนว่าอยากได้อะไร ยิ่งชัดยิ่งดี เช่น “ทำฟอร์มล็อกอิน มีช่องอีเมล รหัสผ่าน และปุ่มสีฟ้า”",
      "<b>2 · AI สร้างโค้ด</b> — โมเดล AI แปลงคำสั่งของเราเป็นโค้ดที่รันได้จริง อาจได้มาหลายไฟล์ในครั้งเดียว",
      "<b>3 · รันดูผล</b> — เอาโค้ดไปรัน/เปิดดูในเบราว์เซอร์ เพื่อดูว่าออกมาหน้าตาและทำงานอย่างไร",
      "<b>4 · สังเกต / ทดสอบ</b> — ลองกดลองใช้ ดูว่าตรงใจไหม มีจุดผิดพลาด (bug) หรือช่องโหว่หรือเปล่า",
      "<b>5 · ปรับแก้ แล้ววนซ้ำ</b> — บอก AI ว่าอยากแก้อะไร เช่น “ทำให้ปุ่มใหญ่ขึ้นและเป็นธีมมืด” แล้วกลับไปขั้นที่ 2 อีกครั้ง"
    ];
    var loopTimers = [];
    function clearLoop() { loopTimers.forEach(clearTimeout); loopTimers = []; }

    function selectNode(i) {
      vnodes.forEach(function (n, k) { n.classList.toggle("active", k === i); });
      if (vdetail) vdetail.innerHTML = DETAILS[i];
    }

    vnodes.forEach(function (n) {
      var i = parseInt(n.getAttribute("data-i"), 10);
      n.addEventListener("click", function () { clearLoop(); selectNode(i); });
      n.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clearLoop(); selectNode(i); }
      });
    });

    function playLoop() {
      clearLoop();
      vnodes.forEach(function (n) { n.classList.remove("active"); });
      vnodes.forEach(function (n, i) {
        loopTimers.push(setTimeout(function () { selectNode(i); }, 700 * i));
      });
      /* หมุนกลับไปเริ่มใหม่ให้เห็นว่าเป็น "วงวน" */
      loopTimers.push(setTimeout(function () {
        vnodes.forEach(function (n) { n.classList.add("pulse"); });
        setTimeout(function () { vnodes.forEach(function (n) { n.classList.remove("pulse"); }); }, 600);
      }, 700 * vnodes.length));
    }
    if (vplay) vplay.addEventListener("click", playLoop);

    /* เล่นครั้งเดียวเมื่อเลื่อนมาเห็น (ไม่รกตา) */
    if ("IntersectionObserver" in window) {
      var played = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !played) { played = true; playLoop(); }
        });
      }, { threshold: 0.4 });
      io.observe(vloop);
    }
  }

  /* ---------- 3) Prompt Coach — วัดความชัดเจนของคำสั่ง ---------- */
  var coachInput = document.getElementById("coachInput");
  if (coachInput) {
    var coachFill = document.getElementById("coachFill");
    var coachScore = document.getElementById("coachScore");
    var coachChecks = document.getElementById("coachChecks");

    var RULES = {
      len:     function (t) { return t.trim().length >= 40; },
      what:    function (t) { return /(ปุ่ม|การ์ด|ฟอร์ม|เมนู|ตาราง|รูป|หน้าเว็บ|เว็บ|กล่อง|แถบ|ช่อง|รายการ|นาฬิกา|ข้อความ|โปรไฟล์|button|card|form)/i.test(t); },
      look:    function (t) { return /(สี|ขนาด|ใหญ่|เล็ก|มน|เหลี่ยม|เงา|ไล่สี|ธีม|กว้าง|สูง|ฟอนต์|ตัวอักษร|พื้นหลัง|โทน|วงกลม)/i.test(t); },
      behave:  function (t) { return /(คลิก|กด|ชี้|hover|เลื่อน|โหลด|เมื่อ|ตอน|เด้ง|ขยับ|เคลื่อน|อนิเมชัน|ลอย|เปลี่ยน|หมุน)/i.test(t); },
      context: function (t) { return /(ใช้กับ|สำหรับ|บนมือถือ|มือถือ|ห้าม|อย่า|ต้อง|โดยใช้|รองรับ|responsive|เหมือน|ภาษา|จอ)/i.test(t); }
    };

    function setCheck(li, ok) {
      li.classList.toggle("ok", ok);
      var use = li.querySelector("use");
      if (use) use.setAttribute("href", ok ? "#i-check" : "#i-x");
    }

    function evaluate() {
      var t = coachInput.value;
      var score = 0;
      coachChecks.querySelectorAll("li").forEach(function (li) {
        var k = li.getAttribute("data-k");
        var ok = RULES[k] ? RULES[k](t) : false;
        if (ok) score += 20;
        setCheck(li, ok);
      });
      if (coachFill) {
        coachFill.style.width = score + "%";
        var color = score >= 80 ? "#3fb950" : score >= 40 ? "#f0c000" : "#ff4d6d";
        coachFill.style.background = color;
      }
      if (coachScore) coachScore.textContent = score + " / 100";
    }

    var EXAMPLES = {
      bad: "ทำเว็บให้หน่อย",
      good: "ช่วยทำการ์ดโปรไฟล์สำหรับหน้าเว็บ มีรูปวงกลม ชื่อ และปุ่มติดตามสีฟ้าขอบมน พื้นหลังไล่สีม่วง-ฟ้า ตอนเอาเมาส์ชี้การ์ดให้ลอยขึ้นเล็กน้อยแบบนุ่มนวล ใช้บนมือถือได้"
    };
    document.querySelectorAll(".coach-ex").forEach(function (b) {
      b.addEventListener("click", function () {
        coachInput.value = EXAMPLES[b.getAttribute("data-ex")] || "";
        evaluate();
        coachInput.focus();
      });
    });

    coachInput.addEventListener("input", evaluate);
    evaluate();
  }

  /* ---------- 4) การ์ดเครื่องมือ (พลิกดูรายละเอียด) ---------- */
  document.querySelectorAll(".tool-card").forEach(function (card) {
    function flip() { card.classList.toggle("flipped"); }
    card.addEventListener("click", flip);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
  });

  /* ---------- 5) สมอง AI — ทำนาย "คำถัดไป" ทีละขั้น ---------- */
  var brainWidget = document.getElementById("brainWidget");
  if (brainWidget) {
    var bSentence = document.getElementById("brainSentence");
    var bBars = document.getElementById("brainBars");
    var bLabel = document.getElementById("brainBoardLabel");
    var bStep = document.getElementById("brainStep");
    var bAuto = document.getElementById("brainAuto");
    var bReset = document.getElementById("brainReset");

    var B_START = ["นักศึกษา"];
    /* แต่ละขั้น: ผู้สมัครคำถัดไป [คำ, ความน่าจะเป็น%] — ตัวแรกคือคำที่ชนะ */
    var B_STEPS = [
      { cands: [["เขียน", 42], ["เรียน", 28], ["ชอบ", 15], ["กิน", 8], ["บิน", 1]] },
      { cands: [["โค้ด", 47], ["โปรแกรม", 26], ["รายงาน", 12], ["เพลง", 6], ["จดหมาย", 3]] },
      { cands: [["ด้วย", 54], ["ทุกวัน", 20], ["เก่งมาก", 10], ["ไม่เป็น", 7], ["บนดวงจันทร์", 2]] },
      { cands: [["AI", 46], ["Python", 30], ["Excel", 8], ["ดินสอ", 6], ["ความรู้สึก", 4]] },
      { cands: [["ได้เร็วขึ้น", 52], ["อย่างสนุก", 18], ["ทุกคืน", 12], ["ไม่ไหวแล้ว", 5], ["ในความฝัน", 3]] }
    ];

    var bIdx = 0, bBusy = false, bAutoOn = false, bTimers = [];
    function bLater(fn, ms) { bTimers.push(setTimeout(fn, ms)); }
    function bClearTimers() { bTimers.forEach(clearTimeout); bTimers = []; }

    function bRenderSentence(popLast) {
      bSentence.innerHTML = "";
      var toks = B_START.slice();
      for (var i = 0; i < bIdx; i++) toks.push(B_STEPS[i].cands[0][0]);
      toks.forEach(function (t, k) {
        var s = document.createElement("span");
        s.className = "brain-tok" + (popLast && k === toks.length - 1 ? " pop" : "");
        s.textContent = t;
        bSentence.appendChild(s);
      });
      if (bIdx < B_STEPS.length) {
        var c = document.createElement("span");
        c.className = "brain-caret";
        bSentence.appendChild(c);
      }
    }

    function bSetButtons() {
      var done = bIdx >= B_STEPS.length;
      bStep.disabled = bBusy || done || bAutoOn;
      bAuto.disabled = bBusy || done || bAutoOn;
      bReset.disabled = bBusy && !bAutoOn;
    }

    function bDoStep(onDone) {
      if (bBusy || bIdx >= B_STEPS.length) return;
      bBusy = true; bSetButtons();
      var step = B_STEPS[bIdx];
      var sum = 0;
      bBars.innerHTML = "";
      step.cands.forEach(function (c) { sum += c[1]; });
      var rows = step.cands.map(function (c) { return { w: c[0], p: c[1] }; });
      rows.push({ w: "คำอื่น ๆ รวมกัน", p: Math.max(0, 100 - sum), dim: true });

      var rowEls = rows.map(function (r) {
        var row = document.createElement("div");
        row.className = "brain-bar" + (r.dim ? " dim" : "");
        row.innerHTML =
          '<span class="bb-word"></span>' +
          '<span class="bb-track"><span class="bb-fill" style="width:0%"></span></span>' +
          '<span class="bb-pct">' + r.p + '%</span>';
        row.querySelector(".bb-word").textContent = r.w;
        bBars.appendChild(row);
        return row;
      });

      /* อนิเมชันแท่งความน่าจะเป็นค่อย ๆ วิ่ง */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          rowEls.forEach(function (el, k) {
            el.querySelector(".bb-fill").style.width = rows[k].p + "%";
          });
        });
      });

      /* คำที่ความน่าจะเป็นสูงสุดชนะ แล้วถูกต่อเข้าประโยค */
      bLater(function () {
        rowEls[0].classList.add("win");
        bLater(function () {
          bIdx++;
          bRenderSentence(true);
          bBusy = false;
          if (bIdx >= B_STEPS.length) {
            bLabel.textContent = "จบประโยค — โมเดลทำนายว่า “จุดจบข้อความ” มีความน่าจะเป็นสูงสุด จึงหยุดเอง";
          } else {
            bLabel.textContent = "ความน่าจะเป็นของ “คำถัดไป” (ขั้นที่ " + (bIdx + 1) + "/" + B_STEPS.length + ")";
          }
          bSetButtons();
          if (onDone) onDone();
        }, 620);
      }, 1000);
    }

    function bAutoPlay() {
      if (bIdx >= B_STEPS.length) { bAutoOn = false; bSetButtons(); return; }
      bDoStep(function () { bLater(bAutoPlay, 420); });
    }

    bStep.addEventListener("click", function () { bDoStep(); });
    bAuto.addEventListener("click", function () {
      if (bAutoOn) return;
      bAutoOn = true; bSetButtons(); bAutoPlay();
    });
    bReset.addEventListener("click", function () {
      bClearTimers();
      bIdx = 0; bBusy = false; bAutoOn = false;
      bRenderSentence(false);
      bBars.innerHTML = '<div class="brain-hint">กด “ทำนายคำถัดไป” เพื่อเริ่ม</div>';
      bLabel.textContent = "ความน่าจะเป็นของ “คำถัดไป”";
      bSetButtons();
    });

    bRenderSentence(false);
    bSetButtons();
  }

  /* ---------- 6) ห้องจำลอง Vibe Session (4 รอบสนทนา + โค้ด diff + พรีวิวสด) ---------- */
  var vs2 = document.getElementById("vs2");
  if (vs2) {
    var vsMsgs = document.getElementById("vs2Msgs");
    var vsEmpty = document.getElementById("vs2Empty");
    var vsCode = document.getElementById("vs2Code");
    var vsPreview = document.getElementById("vs2Preview");
    var vsTurn = document.getElementById("vs2Turn");
    var vsVer = document.getElementById("vs2Ver");
    var vsLesson = document.getElementById("vs2Lesson");
    var vsDots = document.getElementById("vs2Dots");
    var vsStart = document.getElementById("vs2Start");
    var vsNext = document.getElementById("vs2Next");
    var vsReset = document.getElementById("vs2Reset");

    var VS_V1 = [
      '<div class="card">',
      '  <h2>สมชาย ใจดี</h2>',
      '  <p>นักศึกษาวิศวกรรมคอมพิวเตอร์</p>',
      '</div>',
      '<style>',
      '.card{ padding:28px 38px; border-radius:16px;',
      '  background:#ffffff; color:#222222;',
      '  font-family:sans-serif; text-align:center; }',
      '</style>'
    ];
    var VS_V2 = [
      '<div class="card">',
      '  <h2>สมชาย ใจดี</h2>',
      '  <p>นักศึกษาวิศวกรรมคอมพิวเตอร์</p>',
      '</div>',
      '<style>',
      '.card{ padding:28px 38px; border-radius:16px;',
      '  background:linear-gradient(135deg,#6e5cff,#00c2ff);',
      '  color:#ffffff; font-family:sans-serif; text-align:center;',
      '  box-shadow:0 18px 44px rgba(110,92,255,.5); }',
      '</style>'
    ];
    var VS_V3 = [
      '<div class="card">',
      '  <h2>สมชาย ใจดี</h2>',
      '  <p>นักศึกษาวิศวกรรมคอมพิวเตอร์</p>',
      '  <p>ผู้ติดตาม: <span id="num">120</span> คน</p>',
      '  <button id="fb" class="fbtn">+ ติดตาม</button>',
      '</div>',
      '<style>',
      '.card{ padding:28px 38px; border-radius:16px;',
      '  background:linear-gradient(135deg,#6e5cff,#00c2ff);',
      '  color:#ffffff; font-family:sans-serif; text-align:center;',
      '  box-shadow:0 18px 44px rgba(110,92,255,.5); }',
      '.fbtn{ padding:10px 26px; border:none; border-radius:999px;',
      '  background:#ffffff; color:#6e5cff; font-weight:bold;',
      '  cursor:pointer; transition:transform .15s; }',
      '.fbtn:active{ transform:scale(.85); }',
      '</style>',
      '<script>',
      'var n = document.getElementById("num");',
      'document.getElementById("fb").onclick = function () {',
      '  n.textContent = n.textContent + 1;',
      '};',
      '<\/script>'
    ];
    var VS_V4 = VS_V3.slice(0, 17).concat([
      'var n = document.getElementById("num");',
      'var count = Number(n.textContent);',
      'document.getElementById("fb").onclick = function () {',
      '  count = count + 1;',
      '  n.textContent = count;',
      '};',
      '<\/script>'
    ]);

    var VS_TURNS = [
      {
        user: "ช่วยทำการ์ดโปรไฟล์ มีชื่อกับสาขาที่เรียน",
        ai: "ได้เลยครับ นี่การ์ดเวอร์ชันแรกแบบเรียบ ๆ ลองดูก่อน",
        code: VS_V1, changed: null, ver: "เวอร์ชัน 1",
        lesson: "<b>รอบที่ 1 — เริ่มจากง่าย:</b> สั่งสั้น ๆ ให้ได้โครงก่อน ยังไม่ต้องสวยก็ได้ เดี๋ยวค่อยปรับทีละรอบ"
      },
      {
        user: "สวยขึ้นอีกหน่อย อยากได้พื้นหลังไล่สีม่วง-ฟ้า ตัวหนังสือสีขาว มีเงาลอย ๆ",
        ai: "จัดให้ครับ ปรับพื้นหลังเป็นไล่สี เปลี่ยนสีตัวอักษร และเพิ่มเงาแล้ว",
        code: VS_V2, changed: [6, 7, 8], ver: "เวอร์ชัน 2",
        lesson: "<b>รอบที่ 2 — บอก “หน้าตา” ให้ชัด:</b> สี รูปทรง เงา — สังเกตว่า AI แก้เฉพาะบรรทัดที่เกี่ยวข้อง (ไฮไลต์สีเขียว)"
      },
      {
        user: "เพิ่มปุ่ม “ติดตาม” กดแล้วยอดผู้ติดตามเพิ่มขึ้นทีละ 1",
        ai: "เพิ่มปุ่มและสคริปต์นับยอดให้แล้วครับ ลองกดดูได้เลย",
        code: VS_V3, changed: [3, 4, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21], ver: "เวอร์ชัน 3",
        warn: true,
        lesson: "<b>รอบที่ 3 — ทดสอบเองเสมอ:</b> ลองกดปุ่ม “+ ติดตาม” ในผลลัพธ์ด้านขวาดูสิ… 120 กลายเป็น <b>1201</b>?! AI มั่นใจว่าเสร็จแล้ว แต่โค้ดมีบั๊กซ่อนอยู่ — ถ้าเราไม่กดลองเอง ก็จะไม่มีวันรู้"
      },
      {
        user: "กดแล้วเลขกลายเป็น 1201 แทนที่จะเป็น 121 ช่วยแก้ด้วย",
        ai: "ขอโทษครับ ผมเผลอเอา “ข้อความ” มาต่อกันแทนที่จะบวกเลข แก้โดยแปลงเป็นตัวเลขก่อนบวกแล้วครับ",
        code: VS_V4, changed: [18, 20, 21], ver: "เวอร์ชัน 4",
        lesson: "<b>รอบที่ 4 — รายงานอาการให้ชัด:</b> บอก “สิ่งที่เห็น” (1201) เทียบกับ “สิ่งที่ควรเป็น” (121) AI จะหาสาเหตุได้ตรงจุด — เท่านี้ก็ครบวงจร Vibe Loop เต็มหนึ่งรอบ ลองกดปุ่มซ้ำดู คราวนี้นับถูกแล้ว"
      }
    ];

    var vsIdx = 0, vsTimers = [];
    function vsClearTimers() { vsTimers.forEach(clearTimeout); vsTimers = []; }
    function vsLater(fn, ms) { vsTimers.push(setTimeout(fn, ms)); }

    function vsWrap(lines) {
      return "<!doctype html><html><head><meta charset='utf-8'>" +
        "<style>html,body{height:100%;margin:0}" +
        "body{display:grid;place-items:center;background:#0d1117;" +
        "font-family:'IBM Plex Sans Thai',system-ui,sans-serif}</style></head><body>" +
        lines.join("\n") + "</body></html>";
    }

    function vsAddMsg(who, text) {
      var m = document.createElement("div");
      m.className = "vs2-m " + (who === "user" ? "vs2-user" : "vs2-ai");
      var label = document.createElement("span");
      label.className = "vs2-who";
      label.textContent = who === "user" ? "คุณ" : "AI";
      var bubble = document.createElement("div");
      bubble.className = "vs2-bubble";
      bubble.textContent = text;
      m.appendChild(label); m.appendChild(bubble);
      vsMsgs.appendChild(m);
      vsMsgs.scrollTop = vsMsgs.scrollHeight;
      return m;
    }

    function vsAddThinking() {
      var m = document.createElement("div");
      m.className = "vs2-m vs2-ai vs2-thinking-m";
      m.innerHTML = '<span class="vs2-who">AI</span>' +
        '<div class="vs2-bubble vs2-think"><span class="td"></span><span class="td"></span><span class="td"></span></div>';
      vsMsgs.appendChild(m);
      vsMsgs.scrollTop = vsMsgs.scrollHeight;
      return m;
    }

    function vsRenderCode(turn) {
      vsCode.innerHTML = "";
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
        vsCode.appendChild(el);
      });
      vsVer.textContent = turn.ver;
      /* เลื่อนไปให้เห็นบรรทัดแรกที่เปลี่ยน */
      var firstChg = vsCode.querySelector(".chg");
      if (firstChg) vsCode.scrollTop = Math.max(0, firstChg.offsetTop - 60);
      else vsCode.scrollTop = 0;
    }

    function vsRenderDots() {
      vsDots.innerHTML = "";
      VS_TURNS.forEach(function (_, i) {
        var d = document.createElement("span");
        d.className = "vs2-dot" + (i < vsIdx ? " done" : "");
        vsDots.appendChild(d);
      });
    }

    function vsPlayTurn() {
      if (vsIdx >= VS_TURNS.length) return;
      var turn = VS_TURNS[vsIdx];
      vsStart.disabled = true; vsNext.disabled = true;
      if (vsEmpty) vsEmpty.style.display = "none";
      vsTurn.textContent = "รอบที่ " + (vsIdx + 1) + " / " + VS_TURNS.length;

      vsAddMsg("user", turn.user);
      vsLater(function () {
        var think = vsAddThinking();
        vsLater(function () {
          think.remove();
          vsAddMsg("ai", turn.ai);
          vsRenderCode(turn);
          vsLater(function () {
            vsPreview.srcdoc = vsWrap(turn.code);
            vsPreview.classList.add("show");
            vsLesson.innerHTML = turn.lesson;
            vsLesson.classList.toggle("warn", !!turn.warn);
            vsLesson.classList.remove("flash");
            void vsLesson.offsetWidth; /* รีสตาร์ตอนิเมชัน */
            vsLesson.classList.add("flash");
            vsIdx++;
            vsRenderDots();
            if (vsIdx < VS_TURNS.length) {
              vsNext.disabled = false;
            } else {
              vsTurn.textContent = "จบเซสชัน — ครบ 4 รอบ";
            }
          }, 500);
        }, 1100);
      }, 550);
    }

    function vsResetAll() {
      vsClearTimers();
      vsIdx = 0;
      vsMsgs.innerHTML = "";
      if (vsEmpty) { vsMsgs.appendChild(vsEmpty); vsEmpty.style.display = ""; }
      vsCode.innerHTML = '<div class="vs2-code-idle">โค้ดจะปรากฏที่นี่ · บรรทัดที่เพิ่งเปลี่ยนจะไฮไลต์สีเขียว</div>';
      vsVer.textContent = "";
      vsPreview.classList.remove("show");
      vsPreview.srcdoc = "";
      vsTurn.textContent = "ยังไม่เริ่ม";
      vsLesson.innerHTML = "บทเรียนของแต่ละรอบจะสรุปให้ตรงนี้";
      vsLesson.classList.remove("warn", "flash");
      vsStart.disabled = false; vsNext.disabled = true;
      vsRenderDots();
    }

    vsStart.addEventListener("click", vsPlayTurn);
    vsNext.addEventListener("click", vsPlayTurn);
    vsReset.addEventListener("click", vsResetAll);
    vsRenderDots();
  }

  /* ---------- 7) เครื่องประกอบ Prompt ---------- */
  var pbGroups = document.getElementById("pbGroups");
  if (pbGroups) {
    var pbOut = document.getElementById("pbOut");
    var pbSend = document.getElementById("pbSend");
    var PB_DATA = [
      { key: "what", cls: "pb-c1", name: "1 · อยากได้อะไร", items: ["ทำการ์ดโปรไฟล์", "ทำนาฬิกาจับเวลาถอยหลัง", "ทำแกลเลอรีรูปภาพ", "ทำฟอร์มสมัครสมาชิก"] },
      { key: "look", cls: "pb-c2", name: "2 · หน้าตาเป็นยังไง", items: ["โทนม่วง-ฟ้า พื้นหลังไล่สี", "ธีมมืด ขอบมน มีเงานุ่ม ๆ", "สไตล์มินิมอล สีพาสเทล", "โทนสดใส ตัวอักษรใหญ่อ่านง่าย"] },
      { key: "behave", cls: "pb-c3", name: "3 · ทำงานยังไง", items: ["ตอนเอาเมาส์ชี้ให้ลอยขึ้นเล็กน้อย", "กดปุ่มแล้วมีอนิเมชันเด้งตอบสนอง", "เปิดหน้าแล้วค่อย ๆ เฟดปรากฏขึ้น", "เลื่อนหน้าจอแล้วเนื้อหาโผล่ทีละส่วน"] },
      { key: "ctx", cls: "pb-c4", name: "4 · ข้อจำกัด / บริบท", items: ["ใช้บนมือถือได้ (responsive)", "รวมทุกอย่างเป็นไฟล์ HTML ไฟล์เดียว", "ห้ามใช้ไลบรารีภายนอก", "มีคอมเมนต์อธิบายโค้ดเป็นภาษาไทย"] }
    ];
    var pbSel = {};

    function pbCompose() {
      pbOut.innerHTML = "";
      var any = false;
      PB_DATA.forEach(function (g, gi) {
        var v = pbSel[g.key];
        if (!v) return;
        any = true;
        if (g.key === "what") {
          var pre = document.createElement("span");
          pre.textContent = "ช่วย";
          pbOut.appendChild(pre);
        }
        var seg = document.createElement("span");
        seg.className = "pb-seg " + g.cls;
        seg.textContent = v;
        pbOut.appendChild(seg);
        pbOut.appendChild(document.createTextNode(" "));
      });
      if (!any) {
        pbOut.innerHTML = '<span class="pb-placeholder">เลือกชิ้นส่วนด้านบน แล้วประโยคคำสั่งจะประกอบขึ้นตรงนี้…</span>';
      }
      pbSend.disabled = !any;
    }

    PB_DATA.forEach(function (g) {
      var box = document.createElement("div");
      box.className = "pb-group";
      var name = document.createElement("div");
      name.className = "pb-gname " + g.cls;
      name.textContent = g.name;
      box.appendChild(name);
      var chips = document.createElement("div");
      chips.className = "pb-chips";
      g.items.forEach(function (it) {
        var c = document.createElement("button");
        c.type = "button";
        c.className = "pb-chip " + g.cls;
        c.textContent = it;
        c.addEventListener("click", function () {
          var wasActive = c.classList.contains("active");
          chips.querySelectorAll(".pb-chip").forEach(function (x) { x.classList.remove("active"); });
          if (wasActive) { delete pbSel[g.key]; }
          else { c.classList.add("active"); pbSel[g.key] = it; }
          pbCompose();
        });
        chips.appendChild(c);
      });
      box.appendChild(chips);
      pbGroups.appendChild(box);
    });
    pbCompose();

    pbSend.addEventListener("click", function () {
      var parts = [];
      PB_DATA.forEach(function (g) { if (pbSel[g.key]) parts.push(pbSel[g.key]); });
      if (!parts.length) return;
      var text = (pbSel.what ? "ช่วย" : "") + parts.join(" ");
      var coach = document.getElementById("coachInput");
      if (coach) {
        coach.value = text;
        coach.dispatchEvent(new Event("input"));
        var coachBox = document.querySelector(".coach");
        if (coachBox) coachBox.scrollIntoView({ behavior: "smooth", block: "center" });
        coach.classList.remove("glow");
        void coach.offsetWidth;
        coach.classList.add("glow");
      }
    });
  }

  /* ---------- 8) เกมจับผิดโค้ดของ AI ---------- */
  var bugGame = document.getElementById("bugGame");
  if (bugGame) {
    var BUG_LEVELS = [
      {
        title: "ด่านที่ 1 · ปุ่มเงียบกริบ",
        brief: "สั่ง AI ว่า “ทำปุ่มกดแล้วทักทาย” — โค้ดดูเรียบร้อยดี แต่พอกดปุ่มแล้วเงียบ ไม่มีอะไรเกิดขึ้นเลย",
        q: "บรรทัดไหนคือต้นเหตุ?",
        lines: [
          '<button onclick="sayHi()">ทักทาย</button>',
          '<script>',
          'function sayHello() {',
          '  alert("สวัสดีครับ!");',
          '}',
          '<\/script>'
        ],
        bug: [0, 2],
        why: "ปุ่มเรียกฟังก์ชันชื่อ sayHi() แต่ AI ประกาศฟังก์ชันชื่อ sayHello() — ชื่อไม่ตรงกัน เบราว์เซอร์เลยหาฟังก์ชันไม่เจอ",
        lesson: "AI พลาดเรื่อง “ความสม่ำเสมอเล็ก ๆ” แบบนี้บ่อยมาก เพราะมันเดาทีละคำ — เช็กชื่อให้ตรงกันทุกครั้ง",
        hint: "ลองเทียบ “ชื่อ” ที่ปุ่มเรียก กับชื่อฟังก์ชันที่ประกาศไว้ข้างล่าง"
      },
      {
        title: "ด่านที่ 2 · ทำงานได้… แต่อันตราย",
        brief: "สั่ง AI ว่า “ดึงข้อมูลสภาพอากาศมาแสดง” — โค้ดรันได้จริง ไม่มี error ใด ๆ",
        q: "แต่มีบรรทัดหนึ่งที่ห้ามปล่อยขึ้น GitHub สาธารณะเด็ดขาด — บรรทัดไหน?",
        lines: [
          '// ดึงข้อมูลสภาพอากาศวันนี้',
          'var API_KEY = "sk-live-Xk29fj3aQ77k";',
          'fetch("https://api.weather.com/v1?key=" + API_KEY)',
          '  .then(function (r) { return r.json(); })',
          '  .then(function (d) { showWeather(d); });'
        ],
        bug: [1],
        why: "คีย์ลับ (API key) ถูกฝังไว้ในโค้ดตรง ๆ — ถ้า push ขึ้น GitHub สาธารณะ ใครก็คัดลอกไปใช้ได้ อาจเสียเงินหรือข้อมูลรั่ว",
        lesson: "โค้ดที่ “รันผ่าน” ไม่ได้แปลว่า “ปลอดภัย” — ก่อน push ต้องกวาดหารหัสผ่าน/คีย์ลับทุกครั้ง",
        hint: "มองหาสิ่งที่เป็น “ความลับ” ซึ่งไม่ควรมีใครเห็น"
      },
      {
        title: "ด่านที่ 3 · ไวยากรณ์ถูก แต่ตรรกะพัง",
        brief: "สั่ง AI ว่า “สินค้าราคา 500 บาท ลด 20% คิดราคาที่ต้องจ่าย” — โค้ดรันได้ แสดงผลว่า “ราคาที่ต้องจ่าย: 100 บาท”",
        q: "ถูกจริงหรือ? บรรทัดไหนตรรกะพัง?",
        lines: [
          '// สินค้าราคา 500 บาท ลด 20%',
          'var price = 500;',
          'var discount = 20;',
          'var total = price * discount / 100;',
          'console.log("ราคาที่ต้องจ่าย: " + total + " บาท");'
        ],
        bug: [3],
        why: "สูตรนี้คำนวณได้ “จำนวนเงินส่วนลด” (100 บาท) ไม่ใช่ “ราคาหลังหักส่วนลด” — ที่ถูกคือ price - (price * discount / 100) = 400 บาท",
        lesson: "โค้ดไม่มี error ก็ผิดได้ — ตรวจงาน AI ด้วยการลองแทนค่าจริงแล้วคิดเลขตามทุกครั้ง",
        hint: "ลด 20% จากราคา 500 บาท ควรจ่ายเท่าไหร่? ลองคิดตามโค้ดทีละบรรทัด"
      }
    ];

    var bgLevel = 0, bgScore = 0;

    function bgIcon(id) {
      return '<svg class="icon"><use href="#' + id + '"></use></svg>';
    }

    function bgRenderSummary() {
      var max = BUG_LEVELS.length * 2;
      var rank =
        bgScore >= max ? "เพอร์เฟกต์! สายตาระดับนักตรวจโค้ดมือโปร" :
        bgScore >= max - 2 ? "เยี่ยมมาก! สายตาเฉียบใช้ได้เลย" :
        "ไม่เป็นไร — ตายิ่งฝึกยิ่งคม ลองอีกรอบสิ";
      bugGame.innerHTML =
        '<div class="bug-summary">' +
        '<div class="bug-summary-ico">' + bgIcon("i-award") + '</div>' +
        '<div class="bug-summary-score">' + bgScore + ' / ' + max + ' คะแนน</div>' +
        '<div class="bug-summary-rank"></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="bugReplay">' + bgIcon("i-refresh") + ' เล่นอีกครั้ง</button>' +
        '</div>';
      bugGame.querySelector(".bug-summary-rank").textContent = rank;
      document.getElementById("bugReplay").addEventListener("click", function () {
        bgLevel = 0; bgScore = 0; bgRenderLevel();
      });
    }

    function bgRenderLevel() {
      var lv = BUG_LEVELS[bgLevel];
      var attempts = 0, solved = false;
      bugGame.innerHTML = "";

      var head = document.createElement("div");
      head.className = "bug-head";
      head.innerHTML = '<span class="bug-title"></span><span class="bug-score">คะแนน: ' + bgScore + '</span>';
      head.querySelector(".bug-title").textContent = lv.title;
      bugGame.appendChild(head);

      var brief = document.createElement("p");
      brief.className = "bug-brief";
      brief.textContent = lv.brief;
      bugGame.appendChild(brief);

      var q = document.createElement("p");
      q.className = "bug-q";
      q.textContent = lv.q + " (คลิกที่บรรทัด)";
      bugGame.appendChild(q);

      var codeBox = document.createElement("div");
      codeBox.className = "bug-code";
      lv.lines.forEach(function (line, i) {
        var row = document.createElement("div");
        row.className = "bug-line";
        row.setAttribute("tabindex", "0");
        row.setAttribute("role", "button");
        var num = document.createElement("span");
        num.className = "bug-ln";
        num.textContent = i + 1;
        var txt = document.createElement("span");
        txt.className = "bug-lt";
        txt.textContent = line;
        row.appendChild(num); row.appendChild(txt);

        function pick() {
          if (solved) return;
          if (lv.bug.indexOf(i) !== -1) {
            solved = true;
            codeBox.querySelectorAll(".bug-line").forEach(function (r, k) {
              if (lv.bug.indexOf(k) !== -1) r.classList.add("found");
            });
            var pts = attempts === 0 ? 2 : 1;
            bgScore += pts;
            feedback.className = "bug-feedback good";
            feedback.innerHTML =
              '<div class="bug-fb-title">' + bgIcon("i-check") + ' ใช่เลย! +' + pts + ' คะแนน' + (attempts === 0 ? " (ถูกตั้งแต่ครั้งแรก)" : "") + '</div>' +
              '<p class="bug-why"></p><p class="bug-lesson"><b>บทเรียน:</b> <span></span></p>';
            feedback.querySelector(".bug-why").textContent = lv.why;
            feedback.querySelector(".bug-lesson span").textContent = lv.lesson;
            head.querySelector(".bug-score").textContent = "คะแนน: " + bgScore;
            nextBtn.hidden = false;
          } else {
            attempts++;
            row.classList.add("shake");
            setTimeout(function () { row.classList.remove("shake"); }, 450);
            feedback.className = "bug-feedback bad";
            feedback.innerHTML = '<div class="bug-fb-title">' + bgIcon("i-x") + ' ยังไม่ใช่บรรทัดนี้ ลองใหม่</div>' +
              (attempts >= 2 ? '<p class="bug-hint">คำใบ้: <span></span></p>' : "");
            if (attempts >= 2) feedback.querySelector(".bug-hint span").textContent = lv.hint;
          }
        }
        row.addEventListener("click", pick);
        row.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
        });
        codeBox.appendChild(row);
      });
      bugGame.appendChild(codeBox);

      var feedback = document.createElement("div");
      feedback.className = "bug-feedback";
      bugGame.appendChild(feedback);

      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn btn-primary btn-sm";
      nextBtn.hidden = true;
      nextBtn.innerHTML = bgLevel < BUG_LEVELS.length - 1 ? "ด่านถัดไป →" : bgIcon("i-award") + " ดูสรุปผล";
      nextBtn.addEventListener("click", function () {
        bgLevel++;
        if (bgLevel < BUG_LEVELS.length) bgRenderLevel();
        else bgRenderSummary();
      });
      bugGame.appendChild(nextBtn);
    }

    bgRenderLevel();
  }

  /* ---------- 9) แบบทดสอบท้ายบท (สัปดาห์ 2) ---------- */
  var quiz2 = document.getElementById("quiz2Container");
  if (quiz2) {
    var QUIZ2 = [
      {
        q: "หัวใจของ Vibe Coding คือข้อใด?",
        options: [
          "ให้ AI ทำทุกอย่างแทนโดยเราไม่ต้องดูอะไรเลย",
          "บอกความต้องการเป็นภาษาคน ให้ AI เขียนโค้ด แล้วเรารัน-ตรวจ-สั่งปรับวนซ้ำ",
          "การท่องจำไวยากรณ์ของทุกภาษาโปรแกรม",
          "การคัดลอกโค้ดจากอินเทอร์เน็ตมาต่อกัน"
        ],
        answer: 1
      },
      {
        q: "โมเดลภาษาขนาดใหญ่ (LLM) สร้างโค้ดออกมาด้วยวิธีใด?",
        options: [
          "ค้นหาโค้ดสำเร็จรูปจากฐานข้อมูลแล้วส่งคืนทั้งก้อน",
          "รันโปรแกรมจริงเพื่อหาคำตอบก่อนตอบ",
          "ทำนายคำ (token) ถัดไปทีละตัวจากความน่าจะเป็น",
          "สุ่มตัวอักษรจนกว่าจะได้โค้ดที่รันผ่าน"
        ],
        answer: 2
      },
      {
        q: "“hallucination” ของ AI หมายถึงอะไร?",
        options: [
          "AI ทำงานช้าลงเมื่อใช้งานติดต่อกันนาน ๆ",
          "AI ตอบอย่างมั่นใจ แต่เนื้อหาหรือโค้ดนั้นผิดหรือไม่มีอยู่จริง",
          "AI ปฏิเสธไม่ยอมตอบคำถาม",
          "AI จำบทสนทนาเก่าไม่ได้"
        ],
        answer: 1
      },
      {
        q: "AI เขียนโค้ดมาให้ชุดหนึ่งที่เราอ่านไม่เข้าใจ ควรทำอย่างไรก่อน “รัน”?",
        options: [
          "รันทันที เพราะ AI ไม่เคยผิด",
          "ลบทิ้งทั้งหมดแล้วเขียนเองตั้งแต่ต้น",
          "ถาม AI ให้อธิบายทีละส่วนจนเข้าใจ โดยเฉพาะคำสั่งที่ยุ่งกับไฟล์หรือระบบ",
          "ส่งให้เพื่อนรันแทนเรา"
        ],
        answer: 2
      },
      {
        q: "prompt ข้อใด “ชัดเจนที่สุด”?",
        options: [
          "ทำเว็บให้หน่อย",
          "ทำปุ่มสวย ๆ",
          "ทำการ์ดสินค้า พื้นหลังขาว ขอบมน มีรูป ชื่อ ราคา ปุ่มสีส้ม ชี้แล้วการ์ดลอยขึ้นเล็กน้อย ใช้บนมือถือได้",
          "ช่วยหน่อย ด่วนมาก"
        ],
        answer: 2
      },
      {
        q: "ทำไม Git/GitHub (สัปดาห์ 1) ยิ่งสำคัญเมื่อใช้ Vibe Coding?",
        options: [
          "เพราะ AI ใช้งานไม่ได้ถ้าไม่มี GitHub",
          "เพราะเก็บประวัติไว้ทุกเวอร์ชัน ถ้า AI แก้แล้วพังก็ย้อนกลับได้",
          "เพราะ GitHub เขียนโค้ดแทน AI ได้",
          "ไม่เกี่ยวข้องกัน แค่บังเอิญเรียนติดกัน"
        ],
        answer: 1
      }
    ];

    var q2Score = document.getElementById("quiz2Score");
    var q2Answered = 0, q2Points = 0;

    QUIZ2.forEach(function (item, qi) {
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
            q2Points++;
          } else {
            btn.classList.add("wrong");
            optionBtns[item.answer].classList.add("correct");
            feedback.innerHTML = iconSvg("i-x") + "ยังไม่ถูก — คำตอบที่ถูกถูกไฮไลต์ไว้แล้ว";
            feedback.style.color = "#f85149";
          }
          q2Answered++;
          if (q2Answered === QUIZ2.length && q2Score) {
            q2Score.textContent = "คะแนนของคุณ: " + q2Points + " / " + QUIZ2.length +
              (q2Points === QUIZ2.length ? " — เต็ม! พร้อมเป็นนัก Vibe Coding แล้ว" : " — ข้อที่พลาด ลองเลื่อนกลับไปทบทวนหัวข้อนั้นดู");
          }
        });
        qDiv.appendChild(btn);
      });

      qDiv.appendChild(feedback);
      quiz2.appendChild(qDiv);
    });
  }

  /* ---------- 10) Accordion (เทคนิค 6 ท่า + FAQ) ---------- */
  document.querySelectorAll(".acc .acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var acc = item.parentElement;
      var wasOpen = item.classList.contains("open");
      /* เปิดได้ทีละอัน จะได้ไม่รก */
      acc.querySelectorAll(".acc-item.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ---------- 11) ไทม์ไลน์ประวัติ — ค่อย ๆ โผล่เมื่อเลื่อนถึง ---------- */
  var htl = document.getElementById("htl");
  if (htl && "IntersectionObserver" in window) {
    var htlItems = htl.querySelectorAll(".htl-item");
    var htlIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("shown");
          htlIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    htlItems.forEach(function (it, i) {
      it.style.transitionDelay = (i % 2) * 0.12 + "s";
      htlIO.observe(it);
    });
  } else if (htl) {
    htl.querySelectorAll(".htl-item").forEach(function (it) { it.classList.add("shown"); });
  }

  /* ---------- 12) เช็กลิสต์โจทย์ใหญ่ (จำสถานะไว้ในเครื่อง) ---------- */
  var wsList = document.getElementById("wsList");
  if (wsList) {
    var wsFill = document.getElementById("wsFill");
    var wsCount = document.getElementById("wsCount");
    var wsDone = document.getElementById("wsDone");
    var wsBoxes = wsList.querySelectorAll("input[type=checkbox]");
    var WS_KEY = "w2workshop";

    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(WS_KEY) || "[]"); } catch (e) { saved = []; }

    function wsUpdate() {
      var done = 0, state = [];
      wsBoxes.forEach(function (b) {
        if (b.checked) done++;
        state.push(b.checked);
        b.closest(".ws-item").classList.toggle("done", b.checked);
      });
      if (wsFill) wsFill.style.width = (done / wsBoxes.length * 100) + "%";
      if (wsCount) wsCount.textContent = done + " / " + wsBoxes.length;
      if (wsDone) wsDone.hidden = done !== wsBoxes.length;
      try { localStorage.setItem(WS_KEY, JSON.stringify(state)); } catch (e) { /* โหมดไม่รับ storage ก็ยังใช้ได้ */ }
    }

    wsBoxes.forEach(function (b, i) {
      if (saved[i]) b.checked = true;
      b.addEventListener("change", wsUpdate);
    });
    wsUpdate();
  }

});

/* =====================================================================
   BRAIN 3D — โครงข่ายประสาทเทียมแบบ 3 มิติ (section #brain3d)
   วาดด้วย canvas 2D + ฉายภาพ 3 มิติเอง ไม่ใช้ไลบรารีภายนอก
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("b3dCanvas");
  if (!canvas) return;

  var stage = document.getElementById("b3dStage");
  var ctx = canvas.getContext("2d");
  var tokensEl = document.getElementById("b3dTokens");
  var candsEl = document.getElementById("b3dCands");
  var candListEl = document.getElementById("b3dCandList");
  var outEl = document.getElementById("b3dOut");
  var presetsEl = document.getElementById("b3dPresets");
  var runBtn = document.getElementById("b3dRun");
  var resetBtn = document.getElementById("b3dReset");
  var OUT_PLACEHOLDER = '<span class="b3d-placeholder">คำตอบของ AI จะค่อย ๆ ประกอบขึ้นตรงนี้ทีละ token…</span>';

  /* ---------- พรีเซ็ตคำสั่ง: แต่ละ step = สัญญาณวิ่งครบโครงข่าย 1 รอบ ได้ 1 token ---------- */
  var PRESETS = [
    {
      label: "ทำปุ่มไล่สี กดแล้วเด้ง",
      tokens: ["ทำ", "ปุ่ม", "ไล่สี", "กดแล้ว", "เด้ง"],
      steps: [
        { out: "<button", cands: [["<button", 74], ["<div", 17], ["<a", 9]] },
        { out: " class=", cands: [[" class=", 68], [" id=", 21], [" style=", 11]] },
        { out: '"btn-glow"', cands: [['"btn-glow"', 57], ['"button1"', 28], ['"b"', 15]] },
        { out: ">", cands: [[">", 88], [" disabled>", 8], [" type=", 4]] },
        { out: "กดเลย", cands: [["กดเลย", 49], ["คลิก", 33], ["ตกลง", 18]] },
        { out: "</button>", cands: [["</button>", 93], ["</div>", 5], ["<span>", 2]] }
      ]
    },
    {
      label: "หัวเว็บแนะนำตัว",
      tokens: ["ทำ", "หัวเว็บ", "แนะนำตัว", "นักศึกษา", "วิศวะคอมฯ"],
      steps: [
        { out: "<h1>", cands: [["<h1>", 66], ["<header>", 24], ["<p>", 10]] },
        { out: "สวัสดีครับ", cands: [["สวัสดีครับ", 52], ["ยินดีต้อนรับ", 36], ["Hello", 12]] },
        { out: " ผมคือ", cands: [[" ผมคือ", 58], [" นี่คือ", 27], [" ฉันชื่อ", 15]] },
        { out: "ว่าที่วิศวกรคอมพิวเตอร์", cands: [["ว่าที่วิศวกรคอมพิวเตอร์", 61], ["นักศึกษา", 30], ["โปรแกรมเมอร์", 9]] },
        { out: "</h1>", cands: [["</h1>", 90], ["</div>", 7], ["<br>", 3]] }
      ]
    },
    {
      label: "ฟังก์ชันบวกเลข",
      tokens: ["เขียน", "ฟังก์ชัน", "บวก", "เลข", "สองตัว"],
      steps: [
        { out: "function", cands: [["function", 71], ["const", 22], ["let", 7]] },
        { out: " add(a, b)", cands: [[" add(a, b)", 64], [" sum(x, y)", 26], [" plus()", 10]] },
        { out: " {", cands: [[" {", 92], [" =>", 6], [";", 2]] },
        { out: " return", cands: [[" return", 81], [" console.log", 13], [" let", 6]] },
        { out: " a + b;", cands: [[" a + b;", 77], [" a - b;", 12], [" a * b;", 11]] },
        { out: " }", cands: [[" }", 95], [" };", 4], [")", 1]] }
      ]
    }
  ];

  /* ---------- สร้างโครงข่าย: 5 ชั้น เรียงเป็นวงในระนาบ y-z ---------- */
  var LAYERS = [7, 12, 14, 12, 8];
  var GAP = 1.12;
  var nodes = [], edges = [], layerStart = [0];
  (function build() {
    var li, i;
    for (li = 1; li < LAYERS.length; li++) layerStart[li] = layerStart[li - 1] + LAYERS[li - 1];
    for (li = 0; li < LAYERS.length; li++) {
      var n = LAYERS[li];
      var cx = (li - (LAYERS.length - 1) / 2) * GAP;
      for (i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2 + li * 0.7;
        var r = (li === 0 || li === LAYERS.length - 1) ? 0.6 : 0.88;
        /* jitter แบบ deterministic เพื่อให้รูปทรงนิ่งทุกครั้งที่โหลด */
        r += Math.sin(i * 12.9898 + li * 78.233) * 0.08;
        nodes.push({
          layer: li,
          x: cx + Math.sin(i * 91.7 + li) * 0.05,
          y: Math.cos(ang) * r,
          z: Math.sin(ang) * r,
          act: 0,
          tw: Math.sin(i * 3.7 + li * 1.3) * Math.PI
        });
      }
    }
    for (li = 0; li < LAYERS.length - 1; li++) {
      for (i = 0; i < LAYERS[li]; i++) {
        for (var k = 0; k < 3; k++) {
          edges.push({
            a: layerStart[li] + i,
            b: layerStart[li + 1] + ((i * 5 + k * 7 + li * 3) % LAYERS[li + 1]),
            layer: li,
            pulses: []
          });
        }
      }
    }
  })();

  /* ---------- กล้อง + ฉายภาพ 3 มิติ ---------- */
  var yaw = -0.5, pitch = 0.18;
  var W = 0, H = 0, dpr = 1, scale = 1;

  function resize() {
    var w = stage.clientWidth || 600;
    var h = Math.max(280, Math.min(430, Math.round(w * 0.52)));
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + "px";
    W = w; H = h;
    scale = Math.min(w / 5.6, h / 2.5);
  }
  resize();
  window.addEventListener("resize", resize);

  function project(p) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var x = p.x * cy + p.z * sy;
    var z1 = -p.x * sy + p.z * cy;
    var y = p.y * cp - z1 * sp;
    var z = p.y * sp + z1 * cp;
    var s = 3.4 / (3.4 + z);
    return { x: W / 2 + x * s * scale, y: H / 2 + y * s * scale, s: s };
  }

  /* สีไล่จากม่วง (ชั้นแรก) ไปฟ้า (ชั้นสุดท้าย) ตามธีมของเว็บ */
  function layerColor(li, alpha) {
    var t = li / (LAYERS.length - 1);
    var r = Math.round(110 - 110 * t);
    var g = Math.round(92 + 102 * t);
    return "rgba(" + r + "," + g + ",255," + alpha + ")";
  }

  /* ---------- ลูปวาดภาพ ---------- */
  var running = false, rafId = 0, lastT = 0, busy = false, idlePulseT = 0;
  var dragging = false, lastX = 0, lastY = 0;

  function frame(t) {
    if (!running) return;
    var dt = lastT ? Math.min(50, t - lastT) : 16;
    lastT = t;
    if (!dragging) yaw += dt * 0.00016;

    /* ตอนว่าง: ปล่อยประกายสุ่มให้โครงข่ายดู "มีชีวิต" */
    if (!busy) {
      idlePulseT -= dt;
      if (idlePulseT <= 0) {
        idlePulseT = 380;
        var e = edges[(Math.random() * edges.length) | 0];
        e.pulses.push({ t0: t, dur: 900, soft: true });
        nodes[e.a].act = Math.max(nodes[e.a].act, 0.5);
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var pts = new Array(nodes.length), i, j, k;
    for (i = 0; i < nodes.length; i++) pts[i] = project(nodes[i]);

    /* เส้นเชื่อม */
    ctx.lineWidth = 1;
    for (j = 0; j < edges.length; j++) {
      var ed = edges[j], pa = pts[ed.a], pb = pts[ed.b];
      ctx.strokeStyle = layerColor(ed.layer, 0.05 + nodes[ed.a].act * 0.25);
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }

    /* พัลส์สัญญาณ + เซลล์ วาดแบบเรืองแสง */
    ctx.globalCompositeOperation = "lighter";
    for (j = 0; j < edges.length; j++) {
      ed = edges[j];
      if (!ed.pulses.length) continue;
      pa = pts[ed.a]; pb = pts[ed.b];
      for (k = ed.pulses.length - 1; k >= 0; k--) {
        var pu = ed.pulses[k];
        var tt = (t - pu.t0) / pu.dur;
        if (tt >= 1) {
          nodes[ed.b].act = Math.min(1, nodes[ed.b].act + (pu.soft ? 0.45 : 1));
          ed.pulses.splice(k, 1);
          continue;
        }
        if (tt < 0) continue;
        var px = pa.x + (pb.x - pa.x) * tt;
        var py = pa.y + (pb.y - pa.y) * tt;
        var rad = (pu.soft ? 5 : 9) * (pa.s + (pb.s - pa.s) * tt);
        var grd = ctx.createRadialGradient(px, py, 0, px, py, rad);
        grd.addColorStop(0, layerColor(ed.layer, pu.soft ? 0.5 : 0.95));
        grd.addColorStop(1, layerColor(ed.layer, 0));
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (i = 0; i < nodes.length; i++) {
      var nd = nodes[i], p = pts[i];
      var breathe = 0.5 + 0.5 * Math.sin(t * 0.0012 + nd.tw);
      var base = (2 + breathe * 0.5) * p.s;
      if (nd.act > 0.02) {
        var rr = base + 10 * nd.act * p.s;
        var g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
        g2.addColorStop(0, layerColor(nd.layer, 0.85 * nd.act));
        g2.addColorStop(1, layerColor(nd.layer, 0));
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = layerColor(nd.layer, 0.5 + 0.5 * nd.act);
      ctx.beginPath(); ctx.arc(p.x, p.y, base, 0, Math.PI * 2); ctx.fill();
      nd.act *= Math.pow(0.994, dt);
    }
    ctx.globalCompositeOperation = "source-over";

    rafId = requestAnimationFrame(frame);
  }

  /* วาดเฉพาะตอน section อยู่ในจอ ประหยัดเครื่อง */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        if (!running) { running = true; lastT = 0; rafId = requestAnimationFrame(frame); }
      } else {
        running = false;
        cancelAnimationFrame(rafId);
      }
    });
  }, { threshold: 0.05 });
  io.observe(stage);

  /* ---------- ลากเพื่อหมุน (รองรับทั้งเมาส์และนิ้ว) ---------- */
  canvas.addEventListener("pointerdown", function (e) {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* เบราว์เซอร์เก่าบางตัวไม่มี */ }
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    yaw += (e.clientX - lastX) * 0.006;
    pitch = Math.max(-1.1, Math.min(1.1, pitch + (e.clientY - lastY) * 0.005));
    lastX = e.clientX; lastY = e.clientY;
  });
  ["pointerup", "pointercancel"].forEach(function (ev) {
    canvas.addEventListener(ev, function () { dragging = false; });
  });

  /* ---------- ยิงสัญญาณครบโครงข่าย 1 รอบ = คิด 1 token ---------- */
  var HOP = 220;

  function fireLayer(li) {
    var i;
    for (i = layerStart[li]; i < layerStart[li] + LAYERS[li]; i++) nodes[i].act = 1;
    for (i = 0; i < edges.length; i++) {
      if (edges[i].layer === li) {
        edges[i].pulses.push({ t0: performance.now() + Math.random() * 80, dur: HOP * 0.95 });
      }
    }
  }

  function firePass(done) {
    for (var li = 0; li < LAYERS.length; li++) {
      (function (l) { setTimeout(function () { fireLayer(l); }, l * HOP); })(li);
    }
    setTimeout(done, (LAYERS.length - 1) * HOP + 260);
  }

  /* ---------- ส่วนควบคุม ---------- */
  var current = null;

  function chipsDisabled(dis) {
    presetsEl.querySelectorAll(".b3d-chip").forEach(function (b) { b.disabled = dis; });
  }

  function renderTokens() {
    tokensEl.innerHTML = "";
    current.tokens.forEach(function (tk) {
      var s = document.createElement("span");
      s.className = "b3d-tok";
      s.textContent = tk;
      tokensEl.appendChild(s);
    });
  }

  function selectPreset(idx) {
    current = PRESETS[idx];
    presetsEl.querySelectorAll(".b3d-chip").forEach(function (b, i) {
      b.classList.toggle("sel", i === idx);
    });
    renderTokens();
    outEl.innerHTML = OUT_PLACEHOLDER;
    candsEl.hidden = true;
    resetBtn.hidden = true;
  }

  function flashTokens() {
    tokensEl.querySelectorAll(".b3d-tok").forEach(function (tk, i) {
      setTimeout(function () { tk.classList.add("on"); }, i * 70);
      setTimeout(function () { tk.classList.remove("on"); }, i * 70 + 620);
    });
  }

  function showCands(step, done) {
    candListEl.innerHTML = "";
    var rows = step.cands.map(function (c) {
      var row = document.createElement("div");
      row.className = "b3d-cand";
      var tok = document.createElement("span"); tok.className = "b3d-cand-tok"; tok.textContent = c[0];
      var track = document.createElement("span"); track.className = "b3d-cand-track";
      var bar = document.createElement("span"); bar.className = "b3d-cand-bar";
      track.appendChild(bar);
      var pct = document.createElement("span"); pct.className = "b3d-cand-pct"; pct.textContent = "0%";
      row.appendChild(tok); row.appendChild(track); row.appendChild(pct);
      candListEl.appendChild(row);
      return { row: row, bar: bar, pct: pct };
    });
    candsEl.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        step.cands.forEach(function (c, i) {
          rows[i].bar.style.width = c[1] + "%";
          rows[i].pct.textContent = c[1] + "%";
        });
      });
    });
    setTimeout(function () { rows[0].row.classList.add("win"); }, 680);
    setTimeout(function () { candsEl.hidden = true; done(); }, 1250);
  }

  function appendTok(tok) {
    var prev = outEl.querySelector(".b3d-newtok");
    if (prev) prev.classList.remove("b3d-newtok");
    var s = document.createElement("span");
    s.className = "b3d-newtok";
    s.textContent = tok;
    outEl.appendChild(s);
  }

  function run() {
    if (busy || !current) return;
    busy = true;
    runBtn.disabled = true;
    chipsDisabled(true);
    resetBtn.hidden = true;
    outEl.innerHTML = "";
    candsEl.hidden = true;
    var stepIdx = 0;

    function doStep() {
      flashTokens();
      firePass(function () {
        showCands(current.steps[stepIdx], function () {
          appendTok(current.steps[stepIdx].out);
          stepIdx++;
          if (stepIdx < current.steps.length) setTimeout(doStep, 380);
          else {
            busy = false;
            runBtn.disabled = false;
            chipsDisabled(false);
            resetBtn.hidden = false;
          }
        });
      });
    }
    doStep();
  }

  PRESETS.forEach(function (p, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "b3d-chip";
    b.textContent = p.label;
    b.addEventListener("click", function () { if (!busy) selectPreset(i); });
    presetsEl.appendChild(b);
  });
  selectPreset(0);

  runBtn.addEventListener("click", run);
  resetBtn.addEventListener("click", function () {
    outEl.innerHTML = OUT_PLACEHOLDER;
    candsEl.hidden = true;
    resetBtn.hidden = true;
  });
});

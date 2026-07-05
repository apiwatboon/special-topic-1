/* ===== สื่อการสอน GitHub 101 - script.js ===== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---- Mobile sidebar toggle ---- */
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("overlay");

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });
  overlay.addEventListener("click", closeSidebar);

  /* ---- Nav links: active state + close on mobile ---- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* ---- Scroll spy: highlight current section ---- */
  function onScroll() {
    const scrollPos = window.scrollY + 120;
    let current = "";
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });

    /* progress bar */
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    document.getElementById("progressBar").style.width = pct + "%";

    /* back to top */
    document.getElementById("backTop").classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---- Back to top ---- */
  document.getElementById("backTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- Tabs (upload section) ---- */
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");
    });
  });

  /* ---- Copy code buttons ---- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const code = btn.parentElement.querySelector("code").innerText;
      navigator.clipboard.writeText(code).then(function () {
        const original = btn.innerText;
        btn.innerText = "คัดลอกแล้ว ✓";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.innerText = original;
          btn.classList.remove("copied");
        }, 1800);
      });
    });
  });

  /* ---- Jargon tooltips: wrap technical terms with hover/tap explanations ---- */
  var GLOSSARY = {
    "CI/CD": "ระบบทดสอบและส่งมอบโค้ดอัตโนมัติทุกครั้งที่โค้ดเปลี่ยน (Continuous Integration / Continuous Delivery)",
    "CI": "Continuous Integration — รวมและทดสอบโค้ดอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง",
    "CD": "Continuous Delivery/Deployment — นำโค้ดที่ผ่านการทดสอบขึ้นใช้งานจริงแบบอัตโนมัติ",
    "SSO": "Single Sign-On — ล็อกอินครั้งเดียวใช้ได้หลายระบบ (ระบบยืนยันตัวตนรวมขององค์กร)",
    "VCS": "Version Control System — ระบบควบคุมเวอร์ชันที่คอยเก็บประวัติการแก้โค้ด (เช่น Git)",
    "Kanban": "กระดานจัดการงานแบบมีคอลัมน์ เช่น To do / In progress / Done",
    "diff": "ส่วนต่างของโค้ดระหว่างสองเวอร์ชัน — บรรทัดที่เพิ่ม (เขียว) หรือถูกลบ (แดง)",
    "deployment": "การนำโค้ด/เว็บขึ้นไปใช้งานจริงบนเซิร์ฟเวอร์",
    "deploy": "การนำโค้ด/เว็บขึ้นไปใช้งานจริงบนเซิร์ฟเวอร์",
    "command line": "การสั่งงานคอมพิวเตอร์ด้วยการพิมพ์คำสั่ง แทนการคลิกเมาส์",
    "CLI": "Command Line Interface — การสั่งงานด้วยการพิมพ์คำสั่ง",
    "prompt": "คำสั่ง/คำอธิบายที่เราพิมพ์บอก AI ว่าต้องการอะไร ยิ่งชัดยิ่งได้ผลดี",
    "LLM": "Large Language Model — โมเดลภาษาขนาดใหญ่ที่ AI ใช้เข้าใจภาษาคนและสร้างข้อความ/โค้ด",
    "IDE": "Integrated Development Environment — โปรแกรมสำหรับเขียนโค้ดที่รวมเครื่องมือครบในที่เดียว เช่น VS Code",
    "token": "หน่วยย่อยของข้อความที่ AI ใช้นับและประมวลผล (อาจเป็นคำหรือชิ้นส่วนของคำ)",
    "hallucination": "อาการที่ AI สร้างคำตอบที่ฟังดูน่าเชื่อ แต่จริง ๆ ผิดหรือไม่มีอยู่จริง ต้องตรวจสอบเสมอ",
    "autocomplete": "ระบบเติมข้อความ/โค้ดให้อัตโนมัติขณะที่เรากำลังพิมพ์",
    "sandbox": "พื้นที่ทดลองแยกส่วนที่รันโค้ดได้อย่างปลอดภัย ไม่กระทบระบบจริง",
    "refactor": "การปรับโครงสร้างโค้ดให้อ่านง่าย/ดีขึ้น โดยผลลัพธ์ยังทำงานเหมือนเดิม",
    "debug": "การไล่หาและแก้จุดผิดพลาด (bug) ในโปรแกรม",
    "neural network": "โครงข่ายประสาทเทียม — โครงสร้างคณิตศาสตร์เลียนแบบเซลล์สมอง ประกอบด้วย \"เซลล์\" หลายชั้นที่ส่งสัญญาณต่อกัน เป็นหัวใจของ AI ยุคปัจจุบัน",
    "activation": "ค่าความ \"ตื่นตัว\" ของเซลล์ในโครงข่ายประสาทเทียม ยิ่งสูงยิ่งส่งสัญญาณแรงไปชั้นถัดไป"
  };
  var glossaryRe = null;
  try {
    var gterms = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
    var gesc = gterms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); });
    glossaryRe = new RegExp("(?<![\\w/])(" + gesc.join("|") + ")(?![\\w])", "g");
  } catch (e) { glossaryRe = null; }

  function walkGlossary(root) {
    if (!glossaryRe || !root) return;
    var skip = "pre,code,script,style,svg,button,a,.tip,.canim,.ghp,.mock,.pr-card,.diff,.code-block,.sidebar,.gh-menu,.ghp-legend,.cmd-row,h1,h2,h3";
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var targets = [], node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      if (node.parentElement && node.parentElement.closest(skip)) continue;
      glossaryRe.lastIndex = 0;
      if (glossaryRe.test(node.nodeValue)) targets.push(node);
    }
    targets.forEach(function (tn) {
      var text = tn.nodeValue, frag = document.createDocumentFragment(), last = 0, m;
      glossaryRe.lastIndex = 0;
      while ((m = glossaryRe.exec(text))) {
        var term = m[1];
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var span = document.createElement("span");
        span.className = "tip"; span.setAttribute("tabindex", "0");
        span.setAttribute("data-tip", GLOSSARY[term] || ""); span.textContent = term;
        frag.appendChild(span);
        last = m.index + term.length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    });
  }
  walkGlossary(document.querySelector(".content"));

  /* ---- Click any card/box on the page to toggle a highlight ---- */
  var HL_SELECTOR = ".vs-box, .gh-node, .feature:not(.benefit-card):not(.feature-card), .term, .cmd-row:not(.cmd-head), " +
    ".flow-step, .stat, .callout, .tl-item, .steps li, .link-list li";
  var HL_SKIP = "a, button, input, textarea, .person, .quiz-opt, .copy-btn, .tab-btn";
  document.querySelectorAll(HL_SELECTOR).forEach(function (box) {
    box.setAttribute("tabindex", "0");
    box.setAttribute("role", "button");
    box.setAttribute("aria-pressed", "false");
    function toggle() {
      var on = box.classList.toggle("active");
      box.setAttribute("aria-pressed", on ? "true" : "false");
    }
    box.addEventListener("click", function (e) {
      if (e.target.closest(HL_SKIP)) return; /* อย่ากดทับลิงก์/ปุ่ม/รูปคน */
      toggle();
    });
    box.addEventListener("keydown", function (e) {
      if (e.target !== box) return; /* เฉพาะตอนโฟกัสที่กล่องเอง */
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ---- Language switch (C / Python) in the hands-on section ---- */
  var langBtns = document.querySelectorAll(".lang-btn");
  if (langBtns.length) {
    var setLang = function (lang) {
      langBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === lang); });
      document.querySelectorAll(".lang-block, .lang-text").forEach(function (el) {
        el.classList.toggle("show", el.getAttribute("data-lang") === lang);
      });
    };
    langBtns.forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    setLang("c");
  }

  /* ---- Fill the mock contribution graph (profile section) ---- */
  var ghpGraph = document.getElementById("ghpGraph");
  if (ghpGraph) {
    var levels = ["", "l1", "l2", "l3", "l4"];
    var weeks = 30;
    for (var i = 0; i < weeks * 7; i++) {
      var sq = document.createElement("span");
      var lv = (i * 37) % 5; /* รูปแบบไล่ระดับสีแบบคงที่ */
      if (lv) sq.className = levels[lv];
      ghpGraph.appendChild(sq);
    }
  }

  /* ---- Marker highlight: trigger when scrolled into view ---- */
  var hlEls = document.querySelectorAll(".hl");
  if ("IntersectionObserver" in window) {
    var hlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("hl-show");
          hlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.9 });
    hlEls.forEach(function (el) { hlObserver.observe(el); });
  } else {
    hlEls.forEach(function (el) { el.classList.add("hl-show"); });
  }

  /* ---- Person modal (timeline) ---- */
  var people = {
    torvalds: {
      name: "Linus Torvalds",
      th: "ลินุส ทอร์วัลด์ส",
      user: "@torvalds",
      role: "ผู้สร้าง Git และ Linux",
      bio: "ปัจจุบันยังเป็นหัวหน้าผู้ดูแล (lead maintainer) ของ Linux kernel ในฐานะ Fellow ของ Linux Foundation",
      link: "https://en.wikipedia.org/wiki/Linus_Torvalds"
    },
    mojombo: {
      name: "Tom Preston-Werner",
      th: "ทอม เพรสตัน-เวอร์เนอร์",
      user: "@mojombo",
      role: "ผู้ร่วมก่อตั้ง GitHub (ผู้ใช้คนแรกของเว็บ)",
      bio: "ปัจจุบันเป็นนักลงทุนผ่าน Preston-Werner Ventures และเป็นหนึ่งในผู้สร้างเฟรมเวิร์ก RedwoodJS",
      link: "https://tom.preston-werner.com/"
    },
    defunkt: {
      name: "Chris Wanstrath",
      th: "คริส วานสตราธ",
      user: "@defunkt",
      role: "อดีต CEO และผู้ร่วมก่อตั้ง GitHub",
      bio: "ปัจจุบันสนับสนุนเบราว์เซอร์โอเพนซอร์ส Ladybird และทำสำนักพิมพ์เกมอินดี้ Null Games",
      link: "https://github.com/defunkt"
    },
    pjhyett: {
      name: "P.J. Hyett",
      th: "พี.เจ. ไฮเอตต์",
      user: "@pjhyett",
      role: "ผู้ร่วมก่อตั้ง GitHub",
      bio: "ปัจจุบันก่อตั้งทีมแข่งรถ AO Racing และลงแข่งรายการระดับโลกอย่าง 24 Hours of Le Mans ควบคู่กับการลงทุนในสตาร์ทอัพ",
      link: "https://en.wikipedia.org/wiki/P._J._Hyett"
    },
    schacon: {
      name: "Scott Chacon",
      th: "สก็อตต์ ชาคอน",
      user: "@schacon",
      role: "ผู้ร่วมก่อตั้ง GitHub และผู้เขียนหนังสือ Pro Git",
      bio: "ปัจจุบันเป็นผู้ร่วมก่อตั้งและซีอีโอของ GitButler เครื่องมือจัดการเวอร์ชันยุคใหม่",
      link: "https://scottchacon.com/"
    },
    nat: {
      name: "Nat Friedman",
      th: "แนท ฟรีดแมน",
      user: "@nat",
      role: "อดีต CEO ของ GitHub (2018–2021)",
      bio: "ปัจจุบันเป็นนักลงทุนด้าน AI และในปี 2025 ได้เข้าร่วมทีมพัฒนา AI ของ Meta",
      link: "https://nat.org/"
    },
    ashtom: {
      name: "Thomas Dohmke",
      th: "โทมัส ดอมเคอ",
      user: "@ashtom",
      role: "ซีอีโอ GitHub ปี 2021–2025",
      bio: "ผู้นำการเปิดตัว GitHub Copilot ลาออกปลายปี 2025 เพื่อไปก่อตั้งสตาร์ทอัพใหม่",
      link: "https://github.com/ashtom"
    }
  };

  /* generic modal open/close (with entrance + exit animation) */
  function openModal(m) {
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    if (!m.classList.contains("open") || m.classList.contains("closing")) return;
    var box = m.querySelector(".modal-box");
    m.classList.add("closing");
    box.addEventListener("animationend", function handler() {
      m.classList.remove("open", "closing");
      m.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }, { once: true });
  }

  /* -- person modal -- */
  var personModal = document.getElementById("personModal");
  var mImg = document.getElementById("modalImg");
  var mName = document.getElementById("modalName");
  var mTh = document.getElementById("modalTh");
  var mUser = document.getElementById("modalUser");
  var mRole = document.getElementById("modalRole");
  var mBio = document.getElementById("modalBio");
  var mLink = document.getElementById("modalLink");

  function openPerson(user) {
    var p = people[user];
    if (!p) return;
    mImg.src = "https://github.com/" + user + ".png?size=400";
    mImg.alt = p.name;
    mName.textContent = p.name;
    mTh.textContent = p.th;
    mUser.textContent = p.user;
    mUser.href = "https://github.com/" + user;
    mRole.textContent = p.role;
    mBio.textContent = p.bio;
    mLink.href = p.link;
    openModal(personModal);
  }
  document.querySelectorAll(".person").forEach(function (el) {
    el.addEventListener("click", function () { openPerson(el.getAttribute("data-user")); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPerson(el.getAttribute("data-user")); }
    });
  });

  /* -- benefit detail modal -- */
  var benefits = {
    clock: {
      icon: "i-clock", title: "ย้อนเวลาได้",
      meaning: "Git บันทึก \"ประวัติ\" ทุกครั้งที่เราบันทึกงาน (commit) จึงดูย้อนหลังได้ว่าโค้ดเปลี่ยนอะไร เมื่อไหร่ ใครเป็นคนแก้ และย้อนกลับไปเวอร์ชันก่อนหน้าได้เมื่อทำพัง",
      example: "เขียนโค้ดเพิ่มฟีเจอร์วันนี้แล้วโปรแกรมพังทั้งหมด — สั่งย้อนกลับไปเวอร์ชันเมื่อวานที่ยังทำงานได้ด้วยคำสั่งเดียว โดยไม่ต้องนั่งแก้ทีละบรรทัด"
    },
    users: {
      icon: "i-users", title: "ทำงานเป็นทีม",
      meaning: "หลายคนแก้โปรเจกต์เดียวกันพร้อมกันได้ ต่างคนต่างทำในส่วนของตัวเอง (branch) แล้วค่อยรวมงานเข้าด้วยกัน (merge) โดยไม่เขียนทับงานของกันและกัน",
      example: "ทำโปรเจกต์กลุ่ม 4 คน คนหนึ่งทำหน้า Login อีกคนทำหน้า Profile ต่างคน push งานขึ้น repo เดียวกัน แล้วระบบรวมเป็นเว็บเดียวให้"
    },
    cloud: {
      icon: "i-cloud", title: "สำรองข้อมูล",
      meaning: "โค้ดถูกเก็บสำเนาไว้บนคลาวด์ของ GitHub ไม่ได้อยู่แค่ในเครื่องเรา ถ้าเครื่องพัง หาย หรือถูกฟอร์แมต ก็ดึงโค้ดกลับมาได้จากทุกที่",
      example: "โน้ตบุ๊กเสียตอนใกล้ส่งงาน — ยืมเครื่องเพื่อนแล้ว clone repo จาก GitHub ก็ได้โค้ดล่าสุดกลับมาครบทุกไฟล์"
    },
    folder: {
      icon: "i-folder", title: "พอร์ตโฟลิโอ",
      meaning: "หน้าโปรไฟล์ GitHub เปรียบเหมือนแฟ้มสะสมผลงานสาธารณะ บริษัทและผู้สัมภาษณ์มักเข้ามาดูเพื่อประเมินทักษะจริงจากโค้ดและผลงานที่เราเคยทำ",
      example: "ตอนสมัครฝึกงาน แนบลิงก์ GitHub ที่มีโปรเจกต์ของเรา ให้ผู้สัมภาษณ์เห็นโค้ดจริงและประวัติการพัฒนาอย่างต่อเนื่อง"
    },
    globe: {
      icon: "i-globe", title: "โอเพนซอร์ส",
      meaning: "โปรเจกต์โอเพนซอร์สดัง ๆ ระดับโลกจำนวนมากอยู่บน GitHub เราเข้าไปอ่านโค้ดเพื่อเรียนรู้ นำมาใช้ต่อ หรือช่วยพัฒนา/แก้บั๊ก (contribute) ได้",
      example: "อยากรู้ว่าไลบรารี React ทำงานอย่างไร ก็เปิดซอร์สโค้ดจริงบน GitHub มาอ่าน หรือถ้าเจอบั๊กก็ส่ง Pull Request ไปช่วยแก้ได้"
    },
    cpu: {
      icon: "i-cpu", title: "เครื่องมือครบ",
      meaning: "GitHub ไม่ได้มีแค่ที่เก็บโค้ด แต่รวมเครื่องมือสำหรับนักพัฒนาไว้ในที่เดียว เช่น ระบบทดสอบ/deploy อัตโนมัติ (Actions), โฮสต์เว็บฟรี (Pages) และผู้ช่วย AI (Copilot)",
      example: "ตั้งค่าให้ทุกครั้งที่ push โค้ด ระบบรันเทสต์อัตโนมัติด้วย GitHub Actions แล้ว deploy เว็บขึ้น GitHub Pages ให้เองโดยไม่ต้องทำมือ"
    }
  };

  var benefitModal = document.getElementById("benefitModal");
  var bUse = document.getElementById("bUse");
  var bTitle = document.getElementById("bTitle");
  var bMeaning = document.getElementById("bMeaning");
  var bExample = document.getElementById("bExample");

  function openBenefit(key) {
    var b = benefits[key];
    if (!b) return;
    bUse.setAttribute("href", "#" + b.icon);
    bTitle.textContent = b.title;
    bMeaning.textContent = b.meaning;
    bExample.textContent = b.example;
    walkGlossary(bMeaning.parentElement);
    walkGlossary(bExample.parentElement);
    openModal(benefitModal);
  }
  document.querySelectorAll(".benefit-card").forEach(function (el) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("click", function () { openBenefit(el.getAttribute("data-benefit")); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBenefit(el.getAttribute("data-benefit")); }
    });
  });

  /* -- feature example modal (with mock visuals) -- */
  var featureData = {
    issues: {
      icon: "i-bug", title: "Issues",
      html:
        '<p class="feat-ex">ตัวอย่าง: เพื่อนเจอบั๊กในเว็บ จึงเปิด Issue ไว้ให้ทีมตามแก้ — ระบุหัวข้อ รายละเอียด และมอบหมายผู้รับผิดชอบได้</p>' +
        '<div class="mock mock-issues">' +
          '<div class="mock-issue"><span class="mdot open"></span><b>ปุ่ม Login กดแล้วไม่ทำงานบน Safari</b><span class="mmeta">#12 · open</span></div>' +
          '<div class="mock-issue"><span class="mdot open"></span><b>เพิ่มหน้า About</b><span class="mmeta">#11 · open</span></div>' +
          '<div class="mock-issue"><span class="mdot closed"></span><b>แก้ typo หน้าแรก</b><span class="mmeta">#9 · closed</span></div>' +
        '</div>'
    },
    pr: {
      icon: "i-pr", title: "Pull Requests",
      html:
        '<p class="feat-ex">ตัวอย่าง: สมหญิงทำฟีเจอร์เสร็จใน branch ของตัวเอง แล้วเปิด PR ให้ทีมรีวิวก่อนรวมเข้า main</p>' +
        '<div class="pr-card" style="margin:0">' +
          '<div class="pr-head"><span class="pr-badge pr-merged">Merged</span><strong>เพิ่มฟังก์ชันบอกลา</strong></div>' +
          '<div class="pr-sub"><b>somying</b> รวม <code>feature-goodbye</code> เข้าสู่ <code>main</code> แล้ว</div>' +
          '<div class="pr-files"><div class="pr-file"><span>hello.py</span><span class="pr-stat"><span class="add">+3</span> <span class="del">-0</span></span></div></div>' +
        '</div>' +
        '<p class="pr-legend"><span class="add">+3</span> = เพิ่ม 3 บรรทัด · <span class="del">−0</span> = ลบ 0 บรรทัด</p>'
    },
    actions: {
      icon: "i-settings", title: "Actions (CI/CD)",
      html:
        '<p class="feat-ex">ตัวอย่าง: ตั้งค่าให้ทุกครั้งที่ push โค้ด ระบบรันทดสอบและ deploy ให้อัตโนมัติ — ผลรันจะขึ้นแบบนี้</p>' +
        '<div class="mock mock-run">' +
          '<div class="mrun-head"><svg class="icon mok"><use href="#i-check"></use></svg> CI · build &amp; test — <b>passed</b></div>' +
          '<div class="mstep"><svg class="icon mok"><use href="#i-check"></use></svg> Set up job</div>' +
          '<div class="mstep"><svg class="icon mok"><use href="#i-check"></use></svg> Build</div>' +
          '<div class="mstep"><svg class="icon mok"><use href="#i-check"></use></svg> Run tests <span class="mmeta">12 passed</span></div>' +
          '<div class="mstep"><svg class="icon mok"><use href="#i-check"></use></svg> Deploy</div>' +
        '</div>'
    },
    pages: {
      icon: "i-globe", title: "Pages",
      html:
        '<p class="feat-ex">ตัวอย่าง: เปิด GitHub Pages ให้ repo แล้วเว็บจะออนไลน์จริงที่ URL ของเรา (เหมือนเว็บสื่อการสอนนี้)</p>' +
        '<div class="mock mock-browser">' +
          '<div class="mb-bar"><span class="mb-dot"></span><span class="mb-dot"></span><span class="mb-dot"></span><span class="mb-url">somchai.github.io/hello</span></div>' +
          '<div class="mb-body"><strong>Hello, GitHub!</strong><span>เว็บของคุณออนไลน์แล้ว</span></div>' +
        '</div>'
    },
    copilot: {
      icon: "i-cpu", title: "Copilot (AI)",
      html:
        '<p class="feat-ex">ตัวอย่าง: พิมพ์ชื่อฟังก์ชันหรือคอมเมนต์ Copilot จะ "เดา" โค้ดที่เหลือมาให้ (ข้อความสีจางคือสิ่งที่ AI แนะนำ กด Tab เพื่อรับ)</p>' +
        '<div class="mock mock-editor">' +
          '<div class="mline"><span class="mc-key">def</span> <span class="mc-fn">add</span>(a, b):</div>' +
          '<div class="mline ghost">&nbsp;&nbsp;&nbsp;&nbsp;return a + b</div>' +
        '</div>'
    },
    projects: {
      icon: "i-board", title: "Projects",
      html:
        '<p class="feat-ex">ตัวอย่าง: กระดาน Kanban ของทีม ลากการ์ดงานข้ามคอลัมน์ตามสถานะได้</p>' +
        '<div class="mock mock-kanban">' +
          '<div class="mk-col"><div class="mk-h">To do</div><div class="mk-card">ทำหน้า Login</div><div class="mk-card">เขียน README</div></div>' +
          '<div class="mk-col"><div class="mk-h">In progress</div><div class="mk-card">ออกแบบฐานข้อมูล</div></div>' +
          '<div class="mk-col"><div class="mk-h">Done</div><div class="mk-card">ตั้งค่าโปรเจกต์</div></div>' +
        '</div>'
    }
  };

  var featureModal = document.getElementById("featureModal");
  var fUse = document.getElementById("fUse");
  var fTitle = document.getElementById("fTitle");
  var fBody = document.getElementById("fBody");

  function openFeature(key) {
    var f = featureData[key];
    if (!f) return;
    fUse.setAttribute("href", "#" + f.icon);
    fTitle.textContent = f.title;
    fBody.innerHTML = f.html;
    walkGlossary(fBody);
    openModal(featureModal);
  }
  document.querySelectorAll(".feature-card").forEach(function (el) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("click", function () { openFeature(el.getAttribute("data-feature")); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFeature(el.getAttribute("data-feature")); }
    });
  });

  /* close handlers for every modal */
  document.querySelectorAll(".modal").forEach(function (m) {
    m.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", function () { closeModal(m); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(function (m) { closeModal(m); });
    }
  });

  /* ---- Quiz ---- */
  const quizData = [
    {
      q: "ข้อใดอธิบาย GitHub ได้ถูกต้องที่สุด?",
      options: [
        "บริการออนไลน์สำหรับเก็บและจัดการซอร์สโค้ดบนคลาวด์",
        "ภาษาโปรแกรมชนิดหนึ่ง",
        "ระบบปฏิบัติการสำหรับเซิร์ฟเวอร์",
        "โปรแกรมตัดต่อวิดีโอ"
      ],
      answer: 0
    },
    {
      q: "Git กับ GitHub แตกต่างกันอย่างไร?",
      options: [
        "เหมือนกันทุกอย่าง เป็นชื่อเรียกแทนกันได้",
        "Git คือเครื่องมือ/โปรแกรมในเครื่อง ส่วน GitHub คือบริการออนไลน์ที่เก็บ repo",
        "Git ใช้ฟรี แต่ GitHub เสียเงินเสมอ",
        "Git ใช้บนมือถือ GitHub ใช้บนคอม"
      ],
      answer: 1
    },
    {
      q: "คำสั่งใดใช้ 'ส่ง' โค้ดจากเครื่องเราขึ้นไปยัง GitHub?",
      options: ["git pull", "git clone", "git push", "git status"],
      answer: 2
    },
    {
      q: "'commit' หมายถึงอะไร?",
      options: [
        "การลบไฟล์ทั้งหมด",
        "การบันทึกการเปลี่ยนแปลง ณ จุดหนึ่งพร้อมข้อความอธิบาย",
        "การสร้างบัญชีผู้ใช้ใหม่",
        "การปิดโปรเจกต์"
      ],
      answer: 1
    },
    {
      q: "ฟีเจอร์ใดของ GitHub ใช้เผยแพร่เว็บไซต์ได้ฟรี?",
      options: ["GitHub Issues", "GitHub Actions", "GitHub Pages", "GitHub Copilot"],
      answer: 2
    }
  ];

  const quizContainer = document.getElementById("quizContainer");
  const scoreEl = document.getElementById("quizScore");
  let answered = 0;
  let score = 0;

  if (quizContainer) quizData.forEach(function (item, qi) {
    const qDiv = document.createElement("div");
    qDiv.className = "quiz-q";
    const title = document.createElement("h4");
    title.textContent = (qi + 1) + ". " + item.q;
    qDiv.appendChild(title);

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";

    item.options.forEach(function (opt, oi) {
      const btn = document.createElement("button");
      btn.className = "quiz-opt";
      btn.textContent = opt;
      btn.addEventListener("click", function () {
        const optionBtns = qDiv.querySelectorAll(".quiz-opt");
        optionBtns.forEach(function (b) { b.disabled = true; });
        var iconSvg = function (id) {
          return '<svg class="icon"><use href="#' + id + '"></use></svg> ';
        };
        if (oi === item.answer) {
          btn.classList.add("correct");
          feedback.innerHTML = iconSvg("i-check") + "ถูกต้อง!";
          feedback.style.color = "var(--accent)";
          score++;
        } else {
          btn.classList.add("wrong");
          optionBtns[item.answer].classList.add("correct");
          feedback.innerHTML = iconSvg("i-x") + "ยังไม่ถูก — คำตอบที่ถูกถูกไฮไลต์ไว้แล้ว";
          feedback.style.color = "#f85149";
        }
        answered++;
        if (answered === quizData.length) {
          scoreEl.textContent = "คะแนนของคุณ: " + score + " / " + quizData.length;
        }
      });
      qDiv.appendChild(btn);
    });

    qDiv.appendChild(feedback);
    quizContainer.appendChild(qDiv);
  });

});

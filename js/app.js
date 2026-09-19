/* ==========================================================================
   تمام اطلاعات را اینجا تغییر بده — بقیه صفحه از همینجا خوانده می‌شود.
   ========================================================================== */
const contactInfo = {
  companyFa: "بنیامین ترابر پارسیان",
  companyEn: "BENYAMIN TARABAR PARSIAN",
  companyEnSub: "TRANSPORT & LOGISTICS COMPANY",
  tagline: "شرکت حمل و نقل بزرگ مقیاس",

  contactName: "فایق رحیمی",
  contactNameEn: "Fayegh Rahimi",
  phoneDisplay: "0914 977 5687",
  phone: "+989149775687",

  whatsapp: "989149775687",
  website: "https://example.com",
  mapUrl: "https://nshn.ir/ba_bWQP2PANfp5", // موقعیت دفتر (نشان)
  instagram: "https://instagram.com/rahimi_benyamin_tarabar",
};

function buildVCard(d){
  return [
    "BEGIN:VCARD","VERSION:3.0",
    `N:${d.contactName};;;;`,
    `FN:${d.contactName} (${d.contactNameEn})`,
    `ORG:${d.companyFa}`,
    `TEL;TYPE=CELL:${d.phone}`,
    `URL:${d.website}`,
    "END:VCARD",
  ].join("\r\n");
}
function downloadVCard(d){
  const blob = new Blob([buildVCard(d)], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${d.contactName.replace(/\s+/g,"-")}.vcf`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 4000);
}
function showToast(msg){
  const t = document.getElementById("toast");
  t.innerHTML = msg; t.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(()=>t.classList.remove("is-visible"), 2400);
}

document.getElementById("link-website").href = contactInfo.website;
document.getElementById("link-map").href = contactInfo.mapUrl;
document.getElementById("link-social").href = contactInfo.instagram;
document.getElementById("link-instagram").href = contactInfo.instagram;
document.getElementById("link-whatsapp").href = `https://wa.me/${contactInfo.whatsapp}`;
document.getElementById("link-phone").href = `tel:${contactInfo.phone}`;

const saveBtn = document.getElementById("btn-save");
saveBtn.addEventListener("click", () => {
  downloadVCard(contactInfo);
  showToast("فایل مخاطب دانلود شد<small>Contact file downloaded</small>");
  if (navigator.vibrate) navigator.vibrate(12);
  setSaved(true);
  clearTimeout(setSaved._t);
  setSaved._t = setTimeout(() => setSaved(false), 2600);
});
function setSaved(on){
  saveBtn.classList.toggle("is-done", on);
  saveBtn.querySelectorAll("[data-idle]").forEach(el => {
    el.textContent = on ? el.dataset.done : el.dataset.idle;
  });
}


/* ==========================================================================
   Life & motion — everything below is decorative and safely skipped when the
   visitor prefers reduced motion.
   ========================================================================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Touch / click ripple on interactive elements */
if (!reduceMotion){
  document.querySelectorAll(".save-btn, .social-btn, .ring--sm").forEach(el => {
    el.classList.add("ripple-host");
    el.addEventListener("pointerdown", e => {
      const r = el.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.setProperty("--s", Math.max(r.width, r.height) * 1.6 + "px");
      dot.style.setProperty("--x", e.clientX - r.left + "px");
      dot.style.setProperty("--y", e.clientY - r.top + "px");
      el.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    });
  });
}

/* Hero: pointer parallax on the photo */
(function parallax(){
  if (reduceMotion) return;
  const hero = document.querySelector(".hero");
  const img = document.querySelector(".hero__media img");
  if (!hero || !img) return;
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  function loop(){
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    img.style.setProperty("--px", cx.toFixed(2) + "px");
    img.style.setProperty("--py", cy.toFixed(2) + "px");
    raf = (Math.abs(tx - cx) > .05 || Math.abs(ty - cy) > .05) ? requestAnimationFrame(loop) : 0;
  }
  function aim(e){
    const w = window.innerWidth, h = window.innerHeight;
    tx = -((e.clientX / w) - .5) * 14;
    ty = -((e.clientY / h) - .5) * 8;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  window.addEventListener("pointermove", aim, {passive:true});
  // phones: tilt the device (Android / browsers without a permission prompt)
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== "function"){
    window.addEventListener("deviceorientation", e => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25)) * -7;
      ty = Math.max(-1, Math.min(1, (e.beta - 55) / 30)) * -4;
      if (!raf) raf = requestAnimationFrame(loop);
    }, {passive:true});
  }
})();

/* Hero: drifting gold dust (a few dozen soft particles) */
(function dust(){
  const cv = document.getElementById("dust");
  if (!cv || reduceMotion) return;
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, parts = [], running = true, last = 0;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(34, Math.max(16, W * H / 9000)));
    parts = Array.from({length:n}, () => spawn(true));
  }
  function spawn(anywhere){
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 8,
      r: .5 + Math.random() * 1.5,
      vy: 5 + Math.random() * 12,          // px / second upward
      vx: -2 - Math.random() * 5,          // gentle drift toward the sun side
      ph: Math.random() * Math.PI * 2,
      sp: .6 + Math.random() * 1.2,
      a: .25 + Math.random() * .55
    };
  }
  function frame(t){
    if (!running) return;
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts){
      p.y -= p.vy * dt; p.x += (p.vx + Math.sin(t / 1000 * p.sp + p.ph) * 6) * dt;
      if (p.y < -8 || p.x < -8){ Object.assign(p, spawn(false)); p.x = Math.random() * W; }
      const tw = .55 + .45 * Math.sin(t / 700 * p.sp + p.ph);
      const fade = Math.min(1, p.y / (H * .35), (H - p.y) / 30 + .2);   // fade near top
      ctx.globalAlpha = Math.max(0, p.a * tw * fade);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
      g.addColorStop(0, "rgba(255,232,170,1)"); g.addColorStop(1, "rgba(240,200,120,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.2832); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  new ResizeObserver(resize).observe(cv);
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running){ last = performance.now(); requestAnimationFrame(frame); }
  });
  resize(); requestAnimationFrame(frame);
})();

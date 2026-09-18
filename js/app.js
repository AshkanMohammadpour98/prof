/* ==========================================================================
   تمام اطلاعات را اینجا تغییر بده — بقیه صفحه از همینجا خوانده می‌شود.
   ========================================================================== */
const contactInfo = {
  companyFa: "بنیامین ترابر پارسیان",
  companyEn: "BENYAMIN TARABAR PARSIAN",
  companyEnSub: "TRANSPORT & LOGISTICS COMPANY",
  tagline: "شرکت حمل و نقل بزرگ مقیاس",

  contactName: "فایق رحیمی",
  contactNameEn: "Rahimi",
  phoneDisplay: "0914 977 5687",
  phone: "+989149775687",

  whatsapp: "989149775687",
  website: "https://example.com",
  mapUrl: "https://nshn.ir/ba_bWQP2PANfp5", // موقعیت دفتر (نشان)
  social: "https://instagram.com/example", // TODO: replace with real social profile / link-in-bio
};

function buildVCard(d){
  return [
    "BEGIN:VCARD","VERSION:3.0",
    `N:${d.contactName};;;;`,
    `FN:${d.contactName}`,
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
  t.textContent = msg; t.classList.add("is-visible");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(()=>t.classList.remove("is-visible"), 2400);
}

document.getElementById("link-website").href = contactInfo.website;
document.getElementById("link-map").href = contactInfo.mapUrl;
document.getElementById("link-social").href = contactInfo.social;

document.getElementById("btn-save").addEventListener("click", () => {
  downloadVCard(contactInfo);
  showToast("فایل مخاطب دانلود شد");
});

/* ==========================================================================
   Fit-to-screen: scales the whole card down (never up) so every section is
   visible in one view with no scrolling, on any phone height.
   ========================================================================== */
(function fitToScreen(){
  const stage = document.getElementById("stage");
  const card = document.getElementById("card");
  if (!stage || !card) return;

  const MIN_SCALE = 0.62;

  function apply(){
    // transforms don't affect layout size, so natural size is always readable
    const availH = stage.clientHeight;
    const availW = stage.clientWidth;
    const naturalH = card.scrollHeight;
    const naturalW = card.scrollWidth;
    if (!naturalH || !naturalW) return;

    let scale = Math.min(availH / naturalH, availW / naturalW, 1);
    scale = Math.max(scale, MIN_SCALE);
    card.style.transform = `scale(${scale})`;

    // if even the minimum scale can't fit, allow the stage to scroll as a
    // last-resort safety net instead of clipping content
    stage.style.overflowY = (naturalH * MIN_SCALE > availH) ? "auto" : "hidden";
  }

  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
  window.addEventListener("load", apply);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);

  const ro = new ResizeObserver(apply);
  ro.observe(card);

  apply();
})();

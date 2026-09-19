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

document.getElementById("btn-save").addEventListener("click", () => {
  downloadVCard(contactInfo);
  showToast("فایل مخاطب دانلود شد<small>Contact file downloaded</small>");
});

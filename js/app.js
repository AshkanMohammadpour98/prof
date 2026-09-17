/* ==========================================================================
   Digital Business Card — Config
   تمام اطلاعات شخص را فقط اینجا تغییر بده؛ بقیه‌ی صفحه خودکار به‌روز می‌شود.
   ========================================================================== */

const contactInfo = {
  name: "اشکان محمدپور",
  title: "طراح و توسعه‌دهنده وب",
  description:
    "می‌سازم تا وب‌سایت‌ها سریع، تمیز و به‌یادماندنی باشند — با تمرکز روی تجربه‌ی کاربر و جزئیات کوچک.",

  // شماره‌ی نمایشی (فرمت خوانا) و شماره‌ی خالص برای لینک‌ها
  phoneDisplay: "0912 XXX XXXX",
  phone: "+98912XXXXXXX", // برای tel: و vCard

  whatsapp: "98912XXXXXXX", // بدون + و بدون فاصله
  whatsappMessage: "سلام، از طریق کارت ویزیت دیجیتال با شما تماس گرفتم.",

  telegram: "example", // یوزرنیم بدون @

  email: "example@example.com",

  website: "https://example.com",
  websiteDisplay: "example.com",

  address: "ارومیه، ایران",
  mapUrl: "https://maps.google.com/?q=Urmia,Iran",

  profileImage: "assets/profile.svg",

  social: [
    { name: "اینستاگرام", url: "https://instagram.com/example", icon: "instagram" },
    { name: "لینکدین", url: "https://linkedin.com/in/example", icon: "linkedin" },
    { name: "تلگرام", url: "https://t.me/example", icon: "telegram" },
    { name: "واتساپ", url: "https://wa.me/98912XXXXXXX", icon: "whatsapp" },
    { name: "وب‌سایت", url: "https://example.com", icon: "website" },
  ],
};

/* ==========================================================================
   SVG icon set for social links (inline, no extra requests)
   ========================================================================== */

const SOCIAL_ICONS = {
  instagram:
    '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5v6M8 7.8v.1M12 16.5v-3.7c0-1.3.8-2.3 2.2-2.3 1.3 0 2 .9 2 2.3v3.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 12.4 19.8 5.9c.7-.3 1.4.3 1.1 1l-2.8 12.9c-.2.9-1.2 1.2-1.9.6l-3.7-2.9-1.9 1.8c-.2.2-.5.3-.8.1l.3-3.4 6.6-6-8 5-3.4-1c-.8-.2-.8-1.2.2-1.6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  website:
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5Z" stroke="currentColor" stroke-width="1.6"/></svg>',
};

/* ==========================================================================
   Populate DOM from config
   ========================================================================== */

function populatePage(data) {
  // Hero
  document.title = `${data.name} | کارت ویزیت دیجیتال`;
  document.querySelector(".hero__name").textContent = data.name;
  document.querySelector(".hero__title").textContent = data.title;
  document.querySelector(".hero__bio").textContent = data.description;
  const avatar = document.querySelector(".hero__avatar img");
  avatar.src = data.profileImage;
  avatar.alt = `تصویر پروفایل ${data.name}`;

  // Contact rows
  const phoneRow = document.getElementById("row-phone");
  phoneRow.href = `tel:${data.phone}`;
  document.getElementById("val-phone").textContent = data.phoneDisplay;

  const emailRow = document.getElementById("row-email");
  emailRow.href = `mailto:${data.email}`;
  document.getElementById("val-email").textContent = data.email;

  const addressRow = document.getElementById("row-address");
  addressRow.href = data.mapUrl;
  document.getElementById("val-address").textContent = data.address;

  const websiteRow = document.getElementById("row-website");
  websiteRow.href = data.website;
  document.getElementById("val-website").textContent = data.websiteDisplay;

  // Primary + secondary actions
  document.getElementById("btn-call").href = `tel:${data.phone}`;

  const waText = encodeURIComponent(data.whatsappMessage || "");
  document.getElementById(
    "btn-whatsapp"
  ).href = `https://wa.me/${data.whatsapp}${waText ? `?text=${waText}` : ""}`;

  document.getElementById("btn-telegram").href = `https://t.me/${data.telegram}`;
  document.getElementById("btn-map").href = data.mapUrl;

  // Social icons
  const socialList = document.getElementById("social-list");
  socialList.innerHTML = data.social
    .map(
      (item) => `
      <a class="social__link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}">
        ${SOCIAL_ICONS[item.icon] || SOCIAL_ICONS.website}
      </a>`
    )
    .join("");
}

/* ==========================================================================
   vCard (.vcf) generation — "ذخیره در مخاطبین"
   ========================================================================== */

function buildVCard(data) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.name};;;;`,
    `FN:${data.name}`,
    `TITLE:${data.title}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `ADR;TYPE=WORK:;;${data.address};;;;`,
    `URL:${data.website}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

function downloadVCard(data) {
  const vcf = buildVCard(data);
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.name.replace(/\s+/g, "-")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // آزادسازی حافظه پس از دانلود
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ==========================================================================
   Toast feedback
   ========================================================================== */

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

/* ==========================================================================
   Init
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  populatePage(contactInfo);

  document.getElementById("btn-save").addEventListener("click", () => {
    downloadVCard(contactInfo);
    showToast("فایل مخاطب دانلود شد");
  });
});

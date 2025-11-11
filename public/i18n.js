/**
 * TinyURL Internationalization (i18n)
 * Supported languages: Thai (th), English (en)
 */

const translations = {
  th: {
    // Login
    "login.welcome": "ยินดีต้อนรับ",
    "login.pleaseLogin": "กรุณาเข้าสู่ระบบเพื่อใช้งาน TinyURL",

    // Buttons
    "button.loginGoogle": "เข้าสู่ระบบด้วย Google",
    "button.logout": "ออกจากระบบ",
    "button.createLink": "สร้างลิงก์",
    "button.save": "บันทึก",
    "button.cancel": "ยกเลิก",
    "button.delete": "ลบ",
    "button.edit": "แก้ไข",
    "button.copy": "คัดลอก",
    "button.close": "ปิด",
    "button.download": "ดาวน์โหลด",
    "button.refresh": "🔄 Refresh",
    "button.exportCSV": "📥 CSV",
    "button.exportJSON": "📥 JSON",
    "button.confirm": "ยืนยัน",

    // Navigation
    "nav.home": "🏠 หน้าแรก",
    "nav.myUrls": "🔗 URL ของฉัน",
    "nav.admin": "📊 Admin",

    // Home page
    "home.title": "สร้างลิงก์สั้น",
    "home.customCodeHint":
      "💡 ว่างไว้ = สร้างรหัสอัตโนมัติ | กำหนดเอง = ใช้ตัวอักษรและตัวเลข 3-20 ตัว",

    // Placeholders
    "placeholder.enterUrl": "กรอกลิงก์ยาวที่นี่...",
    "placeholder.customCode":
      "รหัสสั้นที่ต้องการ (ตัวเลือก) เช่น: meeting, docs2024",
    "placeholder.memo":
      "บันทึก note (ตัวเลือก) เช่น: ลิงก์โปรโมชั่น, เอกสารโปรเจค",
    "placeholder.search": "🔍 ค้นหา URL หรือรหัส...",

    // Expiry options
    "expiry.permanent": "⏰ ไม่มีวันหมดอายุ (ถาวร)",
    "expiry.1day": "หมดอายุใน 1 วัน",
    "expiry.7days": "หมดอายุใน 7 วัน",
    "expiry.30days": "หมดอายุใน 30 วัน",
    "expiry.90days": "หมดอายุใน 90 วัน",
    "expiry.1year": "หมดอายุใน 1 ปี",

    // My URLs page
    "myUrls.title": "🔗 จัดการ URL ของฉัน",
    "myUrls.loginDescription": "กรุณาเข้าสู่ระบบเพื่อจัดการ URL ของคุณ",

    // Stats
    "stats.totalUrls": "URL ของฉันทั้งหมด",
    "stats.createdToday": "สร้างวันนี้",
    "stats.totalClicks": "👁️ คลิกทั้งหมด",
    "stats.avgClicks": "📊 ค่าเฉลี่ย/URL",
    "stats.topUrl": "🔥 มาแรงที่สุด",
    "stats.expiringSoon": "⏰ หมดอายุเร็วๆ นี้",

    // Messages
    "message.loading": "⏳ กำลังโหลดข้อมูล...",

    // Modal
    "modal.editTitle": "✏️ แก้ไข URL",
    "modal.qrTitle": "📱 QR Code",

    // Labels
    "label.shortCode": "รหัสสั้น",
    "label.targetUrl": "URL เป้าหมาย",
    "label.memo": "บันทึก (ตัวเลือก)",

    // Hints
    "hint.codeFormat": "ใช้ตัวอักษรและตัวเลขเท่านั้น (3-20 ตัวอักษร)",

    // Admin
    "admin.title": "📊 Admin Panel - TinyURL",
    "admin.loginDescription": "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้า Admin",
    "admin.urlManagement": "🔗 URL Management",
    "admin.userManagement": "👥 User Management",
    "admin.totalUrls": "จำนวน URL ทั้งหมด",
    "admin.totalUsers": "ผู้ใช้งานทั้งหมด",
    "admin.activeUsers": "Active Users",
    "admin.admins": "Admins",
    "admin.searchUrl": "🔍 ค้นหา URL, รหัส, หรือผู้สร้าง...",
    "admin.searchUser": "🔍 ค้นหาผู้ใช้...",
    "admin.changeRole": "เปลี่ยน Role",
    "admin.user": "ผู้ใช้:",
    "admin.newRole": "Role ใหม่:",
  },

  en: {
    // Login
    "login.welcome": "Welcome",
    "login.pleaseLogin": "Please login to use TinyURL",

    // Buttons
    "button.loginGoogle": "Login with Google",
    "button.logout": "Logout",
    "button.createLink": "Create Link",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.delete": "Delete",
    "button.edit": "Edit",
    "button.copy": "Copy",
    "button.close": "Close",
    "button.download": "Download",
    "button.refresh": "🔄 Refresh",
    "button.exportCSV": "📥 CSV",
    "button.exportJSON": "📥 JSON",
    "button.confirm": "Confirm",

    // Navigation
    "nav.home": "🏠 Home",
    "nav.myUrls": "🔗 My URLs",
    "nav.admin": "📊 Admin",

    // Home page
    "home.title": "Create Short Link",
    "home.customCodeHint":
      "💡 Leave blank = Auto-generate | Custom = Use 3-20 alphanumeric characters",

    // Placeholders
    "placeholder.enterUrl": "Enter your long URL here...",
    "placeholder.customCode": "Custom code (optional) e.g.: meeting, docs2024",
    "placeholder.memo": "Memo (optional) e.g.: Promotion link, Project docs",
    "placeholder.search": "🔍 Search URLs or codes...",

    // Expiry options
    "expiry.permanent": "⏰ No expiration (Permanent)",
    "expiry.1day": "Expires in 1 day",
    "expiry.7days": "Expires in 7 days",
    "expiry.30days": "Expires in 30 days",
    "expiry.90days": "Expires in 90 days",
    "expiry.1year": "Expires in 1 year",

    // My URLs page
    "myUrls.title": "🔗 Manage My URLs",
    "myUrls.loginDescription": "Please login to manage your URLs",

    // Stats
    "stats.totalUrls": "Total URLs",
    "stats.createdToday": "Created Today",
    "stats.totalClicks": "👁️ Total Clicks",
    "stats.avgClicks": "📊 Avg/URL",
    "stats.topUrl": "🔥 Top URL",
    "stats.expiringSoon": "⏰ Expiring Soon",

    // Messages
    "message.loading": "⏳ Loading data...",

    // Modal
    "modal.editTitle": "✏️ Edit URL",
    "modal.qrTitle": "📱 QR Code",

    // Labels
    "label.shortCode": "Short Code",
    "label.targetUrl": "Target URL",
    "label.memo": "Memo (optional)",

    // Hints
    "hint.codeFormat": "Use alphanumeric characters only (3-20 characters)",

    // Admin
    "admin.title": "📊 Admin Panel - TinyURL",
    "admin.loginDescription": "Please login to access Admin panel",
    "admin.urlManagement": "🔗 URL Management",
    "admin.userManagement": "👥 User Management",
    "admin.totalUrls": "Total URLs",
    "admin.totalUsers": "Total Users",
    "admin.activeUsers": "Active Users",
    "admin.admins": "Admins",
    "admin.searchUrl": "🔍 Search URLs, codes, or creators...",
    "admin.searchUser": "🔍 Search users...",
    "admin.changeRole": "Change Role",
    "admin.user": "User:",
    "admin.newRole": "New Role:",
  },
};

// i18n Manager
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem("lang") || "th";
    this.translations = translations;
  }

  // Get translation
  t(key) {
    return this.translations[this.currentLang][key] || key;
  }

  // Switch language
  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("lang", lang);
      this.updatePage();
    }
  }

  // Get current language
  getLang() {
    return this.currentLang;
  }

  // Update page with current language
  updatePage() {
    // Update text content
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.t(key);
      element.textContent = translation;
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translation = this.t(key);
      element.placeholder = translation;
    });

    // Trigger custom event for complex updates
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { lang: this.currentLang },
      }),
    );
  }
}

// Global i18n instance
window.i18n = new I18n();

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  window.i18n.updatePage();
});

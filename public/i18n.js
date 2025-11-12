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
    "nav.create": "✨ สร้างลิงก์",
    "nav.myUrls": "🔗 URL ของฉัน",
    "nav.chat": "💬 แชท",
    "nav.admin": "📊 Admin",

    // Home page
    "home.title": "สร้างลิงก์สั้น",
    "home.customCodeHint":
      "💡 ว่างไว้ = สร้างรหัสอัตโนมัติ | กำหนดเอง = ใช้ตัวอักษรและตัวเลข 3-20 ตัว",
    "home.createLink": "สร้างลิงก์",
    "message.enterUrl": "⚠️ กรุณาใส่ URL ก่อน",
    "message.creatingLink": "⏳ กำลังสร้างลิงก์...",
    "message.linkReady": "✅ ลิงก์สั้นของคุณ:",
    "message.clickTest": "👆 คลิกเพื่อทดสอบ หรือ",
    "button.close": "ปิด",
    "button.download": "💾 ดาวน์โหลด",
    "label.targetUrl": "URL เป้าหมาย",
    "status.expired": "❌ หมดอายุแล้ว",
    "status.lessThanOneDay": "⚠️ เหลือ < 1 วัน",
    "status.daysRemaining": "⏰ เหลือ {n} วัน",
    "status.daysRemainingNeutral": "⏳ เหลือ {n} วัน",
    "time.justNow": "เมื่อสักครู่",
    "time.minutesAgo": "{n} นาทีที่แล้ว",
    "time.hoursAgo": "{n} ชั่วโมงที่แล้ว",
    "time.daysAgo": "{n} วันที่แล้ว",
    "validation.required": "กรุณากรอกข้อมูลให้ครบถ้วน",
    "validation.error": "เกิดข้อผิดพลาด",
    "validation.connectionError": "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    "message.downloadSuccess": "✅ ดาวน์โหลดแล้ว!",
    "label.memo": "บันทึก (ตัวเลือก)",
    "label.status": "⏰ สถานะ",
    "label.createdAt": "วันที่สร้าง",
    "label.manage": "จัดการ",
    "status.active": "✅ ถาวร",

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

    // Guest Mode
    "guest.benefitsTitle": "🎁 สมัครสมาชิกเพื่อรับสิทธิพิเศษ!",
    "guest.benefit1": "✅ สร้างลิงก์ไม่จำกัด",
    "guest.benefit2": "✨ กำหนดชื่อลิงก์เองได้",
    "guest.benefit3": "📝 แก้ไข ลบ และเพิ่ม memo ได้",
    "guest.benefit4": "⏰ กำหนดวันหมดอายุเองได้",
    "guest.benefit5": "📊 ดูสถิติการคลิก",
    "guest.signup": "สมัครสมาชิกฟรี",
    "guest.signupButton": "สมัครสมาชิกฟรี",
    "guest.remaining": "เหลืออีก",
    "guest.timesPerDay": "ครั้ง/วัน",
    "guest.quotaExhausted":
      "⚠️ คุณใช้ quota หมดแล้ว สมัครฟรีเพื่อรับสิทธิพิเศษ:",
    "guest.limitExceeded":
      "คุณใช้งานครบ 3 ครั้งต่อวันแล้ว กรุณาสมัครสมาชิกเพื่อใช้งานไม่จำกัด",

    // Show Link page
    "showlink.title": "ลิงก์ของคุณพร้อมใช้งาน - DUDX URL Shortener",
    "showlink.success": "ลิงก์สั้นของคุณพร้อมใช้งานแล้ว!",
    "showlink.qrTitle": "QR Code",
    "showlink.downloadQR": "💾 ดาวน์โหลด QR Code",
    "showlink.linkTitle": "ลิงก์สั้นของคุณ",
    "showlink.copy": "📋 คัดลอก",
    "showlink.copied": "✅ คัดลอกแล้ว!",
    "showlink.createNew": "➕ สร้าง Link ใหม่",
    "showlink.details": "รายละเอียด",
    "showlink.targetUrl": "URL เป้าหมาย",
    "showlink.expiresAt": "หมดอายุ",
    "showlink.memo": "บันทึก",
    "showlink.noExpiry": "ไม่มีวันหมดอายุ",
    "showlink.errorLoading": "ไม่สามารถโหลดข้อมูลลิงก์ได้",

    // My URLs page
    "myUrls.title": "🔗 จัดการ URL ของฉัน",
    "myUrls.loginDescription": "กรุณาเข้าสู่ระบบเพื่อจัดการ URL ของคุณ",

    // Chat page
    "chat.title": "💬 แชทกับ AI",
    "chat.welcome": "สวัสดีครับ! ผมคือ AI Assistant พร้อมช่วยเหลือคุณแล้วครับ",
    "chat.inputPlaceholder": "พิมพ์ข้อความของคุณที่นี่...",
    "chat.send": "ส่ง",

    // Stats
    "stats.totalUrls": "URL ของฉันทั้งหมด",
    "stats.createdToday": "สร้างวันนี้",
    "stats.totalClicks": "👁️ คลิกทั้งหมด",
    "stats.avgClicks": "📊 ค่าเฉลี่ย/URL",
    "stats.topUrl": "🔥 มาแรงที่สุด",
    "stats.expiringSoon": "⏰ หมดอายุเร็วๆ นี้",

    // Messages
    "message.loading": "⏳ กำลังโหลดข้อมูล...",
    "message.loadError": "❌ ไม่สามารถโหลดข้อมูลได้",
    "message.error": "❌ เกิดข้อผิดพลาดในการโหลดข้อมูล",
    "message.noUrls": "ไม่พบข้อมูล URL",
    "message.noUsers": "ไม่พบข้อมูลผู้ใช้",
    "message.roleChangeSuccess": "✅ เปลี่ยน Role สำเร็จ",
    "message.actionSuccess": "✅ {action}สำเร็จ",
    "message.actionError": "❌ เกิดข้อผิดพลาด",
    "message.confirmAction": "คุณต้องการ{action}ผู้ใช้นี้หรือไม่?",
    "message.linkCopied": "✅ คัดลอกลิงก์แล้ว!",

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

    // Table headers
    "table.shortLink": "Short Link",
    "table.targetUrl": "URL เป้าหมาย",
    "table.memo": "บันทึก",
    "table.clicks": "👁️ Clicks",
    "table.creator": "ผู้สร้าง",
    "table.createdAt": "วันที่สร้าง",
    "table.actions": "จัดการ",
    "table.copy": "คัดลอก",
    "table.name": "ชื่อ",
    "table.email": "อีเมล",
    "table.role": "Role",
    "table.status": "สถานะ",
    "table.lastLogin": "เข้าสู่ระบบล่าสุด",
    "table.manage": "การจัดการ",

    // User Management buttons
    "button.changeRole": "เปลี่ยน Role",
    "button.deactivate": "ปิดใช้งาน",
    "button.activate": "เปิดใช้งาน",

    // User status
    "status.active": "✅ Active",
    "status.inactive": "❌ Inactive",

    // User roles
    "role.superAdmin": "Super Admin",
    "role.admin": "Admin",
    "role.user": "User",

    // Time ago
    "time.justNow": "เมื่อสักครู่",
    "time.minutesAgo": "{n} นาทีที่แล้ว",
    "time.hoursAgo": "{n} ชั่วโมงที่แล้ว",
    "time.daysAgo": "{n} วันที่แล้ว",
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
    "nav.create": "✨ Create Link",
    "nav.myUrls": "🔗 My URLs",
    "nav.chat": "💬 Chat",
    "nav.admin": "📊 Admin",

    // Home page
    "home.title": "Create Short Link",
    "home.customCodeHint":
      "💡 Leave blank = Auto-generate | Custom = Use 3-20 alphanumeric characters",
    "home.createLink": "Create Link",
    "message.enterUrl": "⚠️ Please enter a URL",
    "message.creatingLink": "⏳ Creating link...",
    "message.linkReady": "✅ Your short link:",
    "message.clickTest": "👆 Click to test or",
    "message.error": "❌ An error occurred",
    "message.loadError": "❌ Failed to load",

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

    // Guest Mode
    "guest.benefitsTitle": "🎁 Sign Up for Premium Benefits!",
    "guest.benefit1": "✅ Unlimited URL creation",
    "guest.benefit2": "✨ Custom link names",
    "guest.benefit3": "📝 Edit, delete and add memo",
    "guest.benefit4": "⏰ Custom expiration dates",
    "guest.benefit5": "📊 View click statistics",
    "guest.signup": "Sign Up Free",
    "guest.signupButton": "Sign Up Free",
    "guest.remaining": "Remaining",
    "guest.timesPerDay": "times/day",
    "guest.quotaExhausted":
      "⚠️ You've used all your quota. Sign up free for premium benefits:",
    "guest.limitExceeded":
      "You've reached the 3 URLs per day limit. Please sign up for unlimited access!",

    // Show Link page
    "showlink.title": "Your Link is Ready - DUDX URL Shortener",
    "showlink.success": "Your short link is ready!",
    "showlink.qrTitle": "QR Code",
    "showlink.downloadQR": "💾 Download QR Code",
    "showlink.linkTitle": "Your Short Link",
    "showlink.copy": "📋 Copy",
    "showlink.copied": "✅ Copied!",
    "showlink.createNew": "➕ Create New Link",
    "showlink.details": "Details",
    "showlink.targetUrl": "Target URL",
    "showlink.expiresAt": "Expires At",
    "showlink.memo": "Memo",
    "showlink.noExpiry": "No expiration",
    "showlink.errorLoading": "Failed to load link data",

    // My URLs page
    "myUrls.title": "🔗 Manage My URLs",
    "myUrls.loginDescription": "Please login to manage your URLs",

    // Chat page
    "chat.title": "💬 Chat with AI",
    "chat.welcome": "Hello! I'm your AI Assistant, ready to help you!",
    "chat.inputPlaceholder": "Type your message here...",
    "chat.send": "Send",

    // Stats
    "stats.totalUrls": "Total URLs",
    "stats.createdToday": "Created Today",
    "stats.totalClicks": "👁️ Total Clicks",
    "stats.avgClicks": "📊 Avg/URL",
    "stats.topUrl": "🔥 Top URL",
    "stats.expiringSoon": "⏰ Expiring Soon",

    // Messages
    "message.loading": "⏳ Loading data...",
    "message.loadError": "❌ Unable to load data",
    "message.error": "❌ Error loading data",
    "message.noUrls": "No URLs found",
    "message.noUsers": "No users found",
    "message.roleChangeSuccess": "✅ Role changed successfully",
    "message.actionSuccess": "✅ {action} successful",
    "message.actionError": "❌ An error occurred",
    "message.confirmAction": "Do you want to {action} this user?",
    "message.linkCopied": "✅ Link copied!",

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

    // Table headers
    "table.shortLink": "Short Link",
    "table.targetUrl": "Target URL",
    "table.memo": "Memo",
    "table.clicks": "👁️ Clicks",
    "table.creator": "Creator",
    "table.createdAt": "Created At",
    "table.actions": "Actions",
    "table.copy": "Copy",
    "table.name": "Name",
    "table.email": "Email",
    "table.role": "Role",
    "table.status": "Status",
    "table.lastLogin": "Last Login",
    "table.manage": "Manage",

    // User Management buttons
    "button.changeRole": "Change Role",
    "button.deactivate": "Deactivate",
    "button.activate": "Activate",

    // User status
    "status.active": "✅ Active",
    "status.inactive": "❌ Inactive",

    // User roles
    "role.superAdmin": "Super Admin",
    "role.admin": "Admin",
    "role.user": "User",

    // Time ago
    "time.justNow": "just now",
    "time.minutesAgo": "{n} minutes ago",
    "time.hoursAgo": "{n} hours ago",
    "time.daysAgo": "{n} days ago",
  },
};

// i18n Manager
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem("lang") || "th";
    this.translations = translations;
  }

  // Get translation
  t(key, params = {}) {
    let translation = this.translations[this.currentLang][key] || key;

    // Replace placeholders like {n}, {name}, etc.
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });

    return translation;
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

      // Check if element has child nodes (like img, svg, span)
      // If it has only one text node or is empty, safe to update
      const hasOnlyText =
        element.childNodes.length === 0 ||
        (element.childNodes.length === 1 &&
          element.childNodes[0].nodeType === 3);

      if (hasOnlyText) {
        element.textContent = translation;
      } else {
        // For elements with children, update only text nodes
        // Find direct text nodes and update them
        element.childNodes.forEach((node) => {
          if (node.nodeType === 3) {
            // Text node
            node.textContent = translation;
          }
        });
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const translation = this.t(key);
      element.placeholder = translation;
    });

    // Update language button active states
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to current language buttons
    const activeLang = this.currentLang;
    document
      .querySelectorAll(`[id^="langBtn${activeLang === "th" ? "Th" : "En"}"]`)
      .forEach((btn) => {
        btn.classList.add("active");
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

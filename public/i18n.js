/**
 * TinyURL Internationalization (i18n)
 * Supported languages: Thai (th), English (en)
 */

const translations = {
  th: {
    // Common
    "app.name": "TinyURL",
    "btn.login": "เข้าสู่ระบบด้วย Google",
    "btn.logout": "ออกจากระบบ",
    "btn.create": "สร้างลิงก์",
    "btn.save": "บันทึก",
    "btn.cancel": "ยกเลิก",
    "btn.delete": "ลบ",
    "btn.edit": "แก้ไข",
    "btn.copy": "คัดลอก",
    "btn.close": "ปิด",
    "btn.download": "ดาวน์โหลด",
    "btn.refresh": "Refresh",
    "btn.export_csv": "CSV",
    "btn.export_json": "JSON",

    // Navigation
    "nav.home": "หน้าแรก",
    "nav.my_urls": "URL ของฉัน",
    "nav.admin": "Admin",

    // Homepage
    "home.title": "ย่อลิงก์ให้สั้นและจดจำได้ง่าย",
    "home.subtitle": "สร้างลิงก์สั้นที่ใช้งานง่าย แชร์ได้สะดวก และติดตามสถิติได้แบบเรียลไทม์",
    "home.url_placeholder": "กรอกลิงก์ยาวที่นี่...",
    "home.custom_code_placeholder": "รหัสสั้นที่ต้องการ (ตัวเลือก) เช่น: meeting, docs2024",
    "home.custom_code_hint": "💡 ว่างไว้ = สร้างรหัสอัตโนมัติ | กำหนดเอง = ใช้ตัวอักษรและตัวเลข 3-20 ตัว",
    "home.expiry_none": "⏰ ไม่มีวันหมดอายุ (ถาวร)",
    "home.expiry_1day": "หมดอายุใน 1 วัน",
    "home.expiry_7days": "หมดอายุใน 7 วัน",
    "home.expiry_30days": "หมดอายุใน 30 วัน",
    "home.expiry_90days": "หมดอายุใน 90 วัน",
    "home.expiry_1year": "หมดอายุใน 1 ปี",
    "home.memo_placeholder": "บันทึก note (ตัวเลือก) เช่น: ลิงก์โปรโมชั่น, เอกสารโปรเจค",
    "home.welcome": "ยินดีต้อนรับ",
    "home.please_login": "กรุณาเข้าสู่ระบบเพื่อใช้งาน",

    // Messages
    "msg.url_required": "⚠️ กรุณาใส่ URL ก่อน",
    "msg.creating": "⏳ กำลังสร้างลิงก์...",
    "msg.success": "✅ ลิงก์สั้นของคุณ:",
    "msg.click_to_test": "👆 คลิกเพื่อทดสอบ หรือ",
    "msg.failed": "❌ สร้างไม่สำเร็จ",
    "msg.error": "❌ เกิดข้อผิดพลาด",
    "msg.copied": "✅ คัดลอกลิงก์แล้ว!",
    "msg.loading": "⏳ กำลังโหลดข้อมูล...",
    "msg.no_data": "ไม่พบข้อมูล URL",
    "msg.create_first": "สร้าง URL แรกของคุณ",
    "msg.delete_confirm": "คุณแน่ใจหรือไม่ที่จะลบ URL นี้?",
    "msg.delete_success": "✅ ลบสำเร็จ!",
    "msg.update_success": "✅ แก้ไขสำเร็จ!",

    // My URLs Page
    "myurls.title": "URL ของฉันทั้งหมด",
    "myurls.search_placeholder": "🔍 ค้นหา URL หรือรหัส...",
    "myurls.stats.total": "URL ของฉันทั้งหมด",
    "myurls.stats.today": "สร้างวันนี้",
    "myurls.stats.clicks": "👁️ คลิกทั้งหมด",
    "myurls.stats.avg_clicks": "📊 ค่าเฉลี่ย/URL",
    "myurls.stats.top_url": "🔥 มาแรงที่สุด",
    "myurls.stats.expiring_soon": "⏰ หมดอายุเร็วๆ นี้",

    // Table Headers
    "table.short_link": "Short Link",
    "table.target_url": "URL เป้าหมาย",
    "table.memo": "บันทึก",
    "table.clicks": "👁️ Clicks",
    "table.status": "⏰ สถานะ",
    "table.created_at": "วันที่สร้าง",
    "table.manage": "จัดการ",
    "table.creator": "ผู้สร้าง",

    // Status
    "status.permanent": "✅ ถาวร",
    "status.expired": "❌ หมดอายุแล้ว",
    "status.expiring_soon": "⚠️ เหลือ < 1 วัน",
    "status.days_left": "วัน",

    // Modals
    "modal.edit_title": "✏️ แก้ไข URL",
    "modal.qr_title": "📱 QR Code",
    "modal.edit.code": "รหัสสั้น",
    "modal.edit.code_hint": "ใช้ตัวอักษรและตัวเลขเท่านั้น (3-20 ตัวอักษร)",
    "modal.edit.target": "URL เป้าหมาย",
    "modal.edit.memo": "บันทึก (ตัวเลือก)",

    // Admin Panel
    "admin.title": "📊 Admin Panel - TinyURL",
    "admin.tab.urls": "🔗 URL Management",
    "admin.tab.users": "👥 User Management",
    "admin.stats.total_urls": "จำนวน URL ทั้งหมด",
    "admin.stats.today_urls": "สร้างวันนี้",
    "admin.stats.total_users": "ผู้ใช้งานทั้งหมด",
    "admin.stats.active_users": "Active Users",
    "admin.stats.admins": "Admins",

    // Time
    "time.just_now": "เมื่อสักครู่",
    "time.minutes_ago": "นาทีที่แล้ว",
    "time.hours_ago": "ชั่วโมงที่แล้ว",
    "time.days_ago": "วันที่แล้ว",
  },

  en: {
    // Common
    "app.name": "TinyURL",
    "btn.login": "Login with Google",
    "btn.logout": "Logout",
    "btn.create": "Create Link",
    "btn.save": "Save",
    "btn.cancel": "Cancel",
    "btn.delete": "Delete",
    "btn.edit": "Edit",
    "btn.copy": "Copy",
    "btn.close": "Close",
    "btn.download": "Download",
    "btn.refresh": "Refresh",
    "btn.export_csv": "CSV",
    "btn.export_json": "JSON",

    // Navigation
    "nav.home": "Home",
    "nav.my_urls": "My URLs",
    "nav.admin": "Admin",

    // Homepage
    "home.title": "Shorten Your URLs with Ease",
    "home.subtitle": "Create short, memorable links that are easy to share and track in real-time",
    "home.url_placeholder": "Enter your long URL here...",
    "home.custom_code_placeholder": "Custom code (optional) e.g.: meeting, docs2024",
    "home.custom_code_hint": "💡 Leave blank = Auto-generate | Custom = Use 3-20 alphanumeric characters",
    "home.expiry_none": "⏰ No expiration (Permanent)",
    "home.expiry_1day": "Expires in 1 day",
    "home.expiry_7days": "Expires in 7 days",
    "home.expiry_30days": "Expires in 30 days",
    "home.expiry_90days": "Expires in 90 days",
    "home.expiry_1year": "Expires in 1 year",
    "home.memo_placeholder": "Memo (optional) e.g.: Promotion link, Project docs",
    "home.welcome": "Welcome",
    "home.please_login": "Please login to use the service",

    // Messages
    "msg.url_required": "⚠️ Please enter a URL",
    "msg.creating": "⏳ Creating link...",
    "msg.success": "✅ Your short link:",
    "msg.click_to_test": "👆 Click to test or",
    "msg.failed": "❌ Failed to create",
    "msg.error": "❌ An error occurred",
    "msg.copied": "✅ Link copied!",
    "msg.loading": "⏳ Loading data...",
    "msg.no_data": "No URLs found",
    "msg.create_first": "Create your first URL",
    "msg.delete_confirm": "Are you sure you want to delete this URL?",
    "msg.delete_success": "✅ Deleted successfully!",
    "msg.update_success": "✅ Updated successfully!",

    // My URLs Page
    "myurls.title": "All My URLs",
    "myurls.search_placeholder": "🔍 Search URLs or codes...",
    "myurls.stats.total": "Total URLs",
    "myurls.stats.today": "Created Today",
    "myurls.stats.clicks": "👁️ Total Clicks",
    "myurls.stats.avg_clicks": "📊 Avg/URL",
    "myurls.stats.top_url": "🔥 Top URL",
    "myurls.stats.expiring_soon": "⏰ Expiring Soon",

    // Table Headers
    "table.short_link": "Short Link",
    "table.target_url": "Target URL",
    "table.memo": "Memo",
    "table.clicks": "👁️ Clicks",
    "table.status": "⏰ Status",
    "table.created_at": "Created At",
    "table.manage": "Manage",
    "table.creator": "Creator",

    // Status
    "status.permanent": "✅ Permanent",
    "status.expired": "❌ Expired",
    "status.expiring_soon": "⚠️ < 1 day left",
    "status.days_left": "days left",

    // Modals
    "modal.edit_title": "✏️ Edit URL",
    "modal.qr_title": "📱 QR Code",
    "modal.edit.code": "Short Code",
    "modal.edit.code_hint": "Use alphanumeric characters only (3-20 characters)",
    "modal.edit.target": "Target URL",
    "modal.edit.memo": "Memo (optional)",

    // Admin Panel
    "admin.title": "📊 Admin Panel - TinyURL",
    "admin.tab.urls": "🔗 URL Management",
    "admin.tab.users": "👥 User Management",
    "admin.stats.total_urls": "Total URLs",
    "admin.stats.today_urls": "Created Today",
    "admin.stats.total_users": "Total Users",
    "admin.stats.active_users": "Active Users",
    "admin.stats.admins": "Admins",

    // Time
    "time.just_now": "just now",
    "time.minutes_ago": "minutes ago",
    "time.hours_ago": "hours ago",
    "time.days_ago": "days ago",
  }
};

// i18n Manager
class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'th';
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
      localStorage.setItem('lang', lang);
      this.updatePage();
    }
  }

  // Get current language
  getLang() {
    return this.currentLang;
  }

  // Update page with current language
  updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      // Check if it's an input placeholder
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Trigger custom event for complex updates
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }
}

// Global i18n instance
const i18n = new I18n();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  i18n.updatePage();
});

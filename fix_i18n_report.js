// fix_i18n_report.js - Targeted I18N Fix Reporter
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thai text detection
const containsThai = (text) => {
  const thaiRegex = /[\u0E00-\u0E7F]/;
  return thaiRegex.test(text);
};

// Get HTML content
function getHtmlContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ Cannot read ${filePath}:`, error.message);
    return "";
  }
}

// Extract Thai text that needs i18n
function extractThaiIssues(htmlContent, fileName) {
  const lines = htmlContent.split("\n");
  const issues = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Skip CSS and comments
    if (line.trim().startsWith("/*") ||
        line.trim().startsWith(".") ||
        line.trim().startsWith("    .") ||
        line.trim().startsWith("        .") ||
        line.trim().startsWith("    /*") ||
        line.trim().startsWith("            .")) {
      return;
    }

    // Find Thai text in HTML tags
    const tagMatch = line.match(/<[^>]*>([^<]+)<\/[^>]*>/);
    if (tagMatch && containsThai(tagMatch[1])) {
      const text = tagMatch[1].trim();
      if (text && !line.includes("data-i18n=")) {
        issues.push({
          line: lineNum,
          text: text,
          originalLine: line.trim(),
          type: "element_content",
          fix: `Add data-i18n attribute to element containing: "${text}"`
        });
      }
    }

    // Find Thai text in button/h2/h3/etc.
    const elementMatch = line.match(/<(\w+)[^>]*>([^<]+)<\/\1>/);
    if (elementMatch && containsThai(elementMatch[2])) {
      const text = elementMatch[2].trim();
      if (text && !line.includes("data-i18n=")) {
        issues.push({
          line: lineNum,
          text: text,
          originalLine: line.trim(),
          type: "html_element",
          element: elementMatch[1],
          fix: `Replace <${elementMatch[1]}>${text}</${elementMatch[1]}> with <${elementMatch[1]} data-i18n="KEY"></${elementMatch[1]}>`
        });
      }
    }

    // Find Thai text in option elements
    const optionMatch = line.match(/<option[^>]*>([^<]+)<\/option>/);
    if (optionMatch && containsThai(optionMatch[1])) {
      const text = optionMatch[1].trim();
      if (text && !line.includes("data-i18n=")) {
        issues.push({
          line: lineNum,
          text: text,
          originalLine: line.trim(),
          type: "option",
          fix: `Replace with <option data-i18n="KEY"></option>`
        });
      }
    }

    // Find standalone Thai text
    const textOnly = line.replace(/<[^>]*>/g, "").trim();
    if (textOnly && containsThai(textOnly) &&
        textOnly.length > 0 &&
        !line.match(/^\s*\/\//) && // not comment
        !line.includes("data-i18n=") &&
        !line.includes("console.log") &&
        !line.includes("alert(") &&
        !line.includes("confirm(")) {
      issues.push({
        line: lineNum,
        text: textOnly,
        originalLine: line.trim(),
        type: "standalone_text",
        fix: `Wrap in HTML element with data-i18n: <span data-i18n="KEY">${textOnly}</span>`
      });
    }
  });

  return issues;
}

// Generate fix suggestions
function generateFixSuggestions(issues) {
  const suggestions = {};

  issues.forEach(issue => {
    const key = generateI18nKey(issue.text);
    if (!suggestions[key]) {
      suggestions[key] = {
        thai: issue.text,
        english: generateEnglishTranslation(issue.text),
        usage: []
      };
    }
    suggestions[key].usage.push({
      file: issue.file,
      line: issue.line,
      type: issue.type,
      fix: issue.fix
    });
  });

  return suggestions;
}

// Generate i18n key from text
function generateI18nKey(text) {
  // Simple key generation - could be improved
  if (text.includes("สร้างลิงก์")) return "button.createLink";
  if (text.includes("สร้างวันนี้")) return "stats.createdToday";
  if (text.includes("URL ของฉันทั้งหมด")) return "stats.totalUrls";
  if (text.includes("คลิกทั้งหมด")) return "stats.totalClicks";
  if (text.includes("มาแรงที่สุด")) return "stats.topUrl";
  if (text.includes("หมดอายุเร็วๆ นี้")) return "stats.expiringSoon";
  if (text.includes("ว่างไว้") && text.includes("สร้างรหัส")) return "home.customCodeHint";
  if (text.includes("ใช้ตัวอักษรและตัวเลข")) return "hint.codeFormat";
  if (text.includes("บันทึก")) return "button.save";
  if (text.includes("ปิด")) return "button.close";
  if (text.includes("ดาวน์โหลด")) return "button.download";
  if (text.includes("สถานะ")) return "label.status";
  if (text.includes("วันที่สร้าง")) return "label.createdAt";
  if (text.includes("จัดการ")) return "table.manage";

  // Default: convert to camelCase
  return "custom." + text
    .toLowerCase()
    .replace(/[^\w\s\u0E00-\u0E7F]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);
}

// Generate English translation (simple)
function generateEnglishTranslation(thaiText) {
  const translations = {
    "สร้างลิงก์สั้น": "Create Short Link",
    "สร้างลิงก์": "Create Link",
    "สร้างวันนี้": "Created Today",
    "URL ของฉันทั้งหมด": "My Total URLs",
    "👁️ คลิกทั้งหมด": "👁️ Total Clicks",
    "📊 ค่าเฉลี่ย/URL": "📊 Avg/URL",
    "🔥 มาแรงที่สุด": "🔥 Top URL",
    "⏰ หมดอายุเร็วๆ นี้": "⏰ Expiring Soon",
    "💡 ว่างไว้ = สร้างรหัสอัตโนมัติ | กำหนดเอง =": "💡 Leave blank = Auto-generate | Custom =",
    "ใช้ตัวอักษรและตัวเลข 3-20 ตัว": "Use alphanumeric 3-20 characters",
    "ยินดีต้อนรับ": "Welcome",
    "ปิด": "Close",
    "💾 ดาวน์โหลด": "💾 Download",
    "บันทึก": "Save",
    "⏰ สถานะ": "⏰ Status",
    "วันที่สร้าง": "Created Date",
    "จัดการ": "Manage"
  };

  return translations[thaiText] || "[NEEDS TRANSLATION]";
}

// Main analysis
function analyzeHtmlFiles() {
  const publicDir = path.join(__dirname, "public");
  const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

  console.log("🎯 TARGETED I18N ANALYSIS");
  console.log("=" .repeat(60));

  let allIssues = [];

  htmlFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    const content = getHtmlContent(filePath);
    const issues = extractThaiIssues(content, file);

    issues.forEach(issue => {
      issue.file = file;
      allIssues.push(issue);
    });
  });

  // Group by file and show fixes
  const issuesByFile = {};
  allIssues.forEach(issue => {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  });

  // Show detailed fixes
  Object.keys(issuesByFile).forEach(file => {
    console.log(`\n📁 FILE: ${file}`);
    console.log("-".repeat(50));

    issuesByFile[file].forEach(issue => {
      console.log(`\n📍 Line ${issue.line}: ${issue.type}`);
      console.log(`   Text: "${issue.text}"`);
      console.log(`   Original: ${issue.originalLine}`);
      console.log(`   🔧 Fix: ${issue.fix}`);
    });
  });

  // Generate i18n suggestions
  const suggestions = generateFixSuggestions(allIssues);

  console.log("\n\n🌐 I18N KEY SUGGESTIONS");
  console.log("=".repeat(60));

  Object.keys(suggestions).forEach(key => {
    const suggestion = suggestions[key];
    console.log(`\n🔑 KEY: "${key}"`);
    console.log(`   🇹🇭 Thai: "${suggestion.thai}"`);
    console.log(`   🇺🇸 English: "${suggestion.english}"`);
    console.log(`   📍 Used in ${suggestion.usage.length} places:`);
    suggestion.usage.forEach(usage => {
      console.log(`      - ${usage.file}:${usage.line} (${usage.type})`);
    });
  });

  // Summary
  console.log("\n\n📊 SUMMARY");
  console.log("=".repeat(30));
  console.log(`Total Thai text issues found: ${allIssues.length}`);
  console.log(`Files affected: ${Object.keys(issuesByFile).length}`);
  console.log(`New i18n keys needed: ${Object.keys(suggestions).length}`);

  // Quick fix commands
  console.log("\n\n🚀 QUICK FIX COMMANDS");
  console.log("=".repeat(50));
  console.log("Add these to i18n.js th section:");
  Object.keys(suggestions).forEach(key => {
    const suggestion = suggestions[key];
    console.log(`  "${key}": "${suggestion.thai}",`);
  });

  console.log("\nAdd these to i18n.js en section:");
  Object.keys(suggestions).forEach(key => {
    const suggestion = suggestions[key];
    console.log(`  "${key}": "${suggestion.english}",`);
  });

  return { issues: allIssues, suggestions, issuesByFile };
}

// Run analysis
analyzeHtmlFiles();

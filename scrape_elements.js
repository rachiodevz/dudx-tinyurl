// scrape_elements.js - Systematic HTML Element & Text Analyzer
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

// English text detection
const containsEnglish = (text) => {
  const englishRegex = /[a-zA-Z]/;
  return englishRegex.test(text);
};

// Clean and normalize text
const cleanText = (text) => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[\r\n\t]/g, " ")
    .trim();
};

// Extract elements with text from HTML
function extractElements(htmlContent, filePath) {
  console.log(`\n🔍 Analyzing: ${filePath}`);
  console.log("=".repeat(50));

  const lines = htmlContent.split("\n");
  const results = [];
  let lineNumber = 0;

  // Track elements we find
  const elements = [];

  for (let line of lines) {
    lineNumber++;

    // Find elements with text content or attributes
    const elementMatches = line.match(/<[^>]*>/g);
    if (elementMatches) {
      elementMatches.forEach((element, index) => {
        // Get text between tags or inside element
        let textMatch = "";

        // Check for text content in same line
        const textAfterElement = line.substring(
          line.indexOf(element) + element.length,
        );
        const directText = textAfterElement.match(/>([^<]*)/);
        if (directText && directText[1]) {
          textMatch = cleanText(directText[1]);
        }

        // Check for attributes with i18n
        const i18nMatch = element.match(/data-i18n="([^"]*)"/);
        const placeholderMatch = element.match(
          /data-i18n-placeholder="([^"]*)"/,
        );

        // Check for text inside element tags
        const titleMatch = element.match(/title="([^"]*)"/);
        const altMatch = element.match(/alt="([^"]*)"/);
        const valueMatch = element.match(/>([^<]*)/);

        let allTexts = [];
        if (textMatch) allTexts.push({ type: "content", text: textMatch });
        if (titleMatch && titleMatch[1])
          allTexts.push({ type: "title", text: titleMatch[1] });
        if (altMatch && altMatch[1])
          allTexts.push({ type: "alt", text: altMatch[1] });
        if (valueMatch && valueMatch[1])
          allTexts.push({ type: "value", text: cleanText(valueMatch[1]) });

        allTexts.forEach((item) => {
          if (item.text && item.text.length > 0) {
            elements.push({
              line: lineNumber,
              element: element,
              text: item.text,
              type: item.type,
              hasThai: containsThai(item.text),
              hasEnglish: containsEnglish(item.text),
              i18nKey: i18nMatch ? i18nMatch[1] : null,
              placeholderKey: placeholderMatch ? placeholderMatch[1] : null,
            });
          }
        });
      });
    }

    // Also check for standalone text (likely needs i18n)
    const textOnly = line.replace(/<[^>]*>/g, "").trim();
    if (textOnly && textOnly.length > 0 && !line.match(/^\s*\/\//)) {
      // ignore comments
      elements.push({
        line: lineNumber,
        element: "TEXT_ONLY",
        text: textOnly,
        type: "standalone",
        hasThai: containsThai(textOnly),
        hasEnglish: containsEnglish(textOnly),
        i18nKey: null,
        placeholderKey: null,
        needsI18n: true,
      });
    }
  }

  return elements;
}

// Find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main analysis function
function analyzeAllHtmlFiles() {
  const publicDir = path.join(__dirname, "public");
  const htmlFiles = findHtmlFiles(publicDir);

  console.log("🚀 Starting Systematic HTML Analysis");
  console.log("=".repeat(60));

  let allIssues = [];
  let thaiOnlyElements = [];
  let englishOnlyElements = [];
  let mixedElements = [];
  let missingI18n = [];

  htmlFiles.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const elements = extractElements(content, filePath);

      elements.forEach((elem) => {
        if (elem.hasThai && !elem.hasEnglish) {
          thaiOnlyElements.push({ ...elem, file: filePath });
          if (
            !elem.i18nKey &&
            !elem.placeholderKey &&
            elem.element !== "TEXT_ONLY"
          ) {
            missingI18n.push({ ...elem, file: filePath });
          }
        }
        if (elem.hasEnglish && !elem.hasThai) {
          englishOnlyElements.push({ ...elem, file: filePath });
        }
        if (elem.hasThai && elem.hasEnglish) {
          mixedElements.push({ ...elem, file: filePath });
        }
        if (elem.needsI18n && elem.hasThai) {
          missingI18n.push({ ...elem, file: filePath });
        }
      });
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
    }
  });

  // Generate detailed reports
  generateReports({
    thaiOnlyElements,
    englishOnlyElements,
    mixedElements,
    missingI18n,
  });
}

function generateReports(data) {
  console.log("\n\n📊 ANALYSIS REPORTS");
  console.log("=".repeat(60));

  // Report 1: Thai Text Only (should be in i18n)
  console.log("\n🇹🇭 THAI TEXT ONLY (Should be internationalized)");
  console.log("-".repeat(50));
  data.thaiOnlyElements.forEach((elem) => {
    console.log(`📁 ${path.basename(elem.file)}:${elem.line}`);
    console.log(`   Element: ${elem.element.substring(0, 50)}...`);
    console.log(`   Text: "${elem.text}"`);
    console.log(`   Type: ${elem.type}`);
    if (elem.i18nKey) console.log(`   ✅ Has i18n: ${elem.i18nKey}`);
    else console.log(`   ❌ Missing i18n attribute`);
    console.log("");
  });

  // Report 2: English Text Only
  console.log("\n🇺🇸 ENGLISH TEXT ONLY");
  console.log("-".repeat(50));
  data.englishOnlyElements.forEach((elem) => {
    console.log(`📁 ${path.basename(elem.file)}:${elem.line}`);
    console.log(`   Text: "${elem.text}"`);
    console.log("");
  });

  // Report 3: Missing i18n
  console.log("\n❌ MISSING I18N ATTRIBUTES");
  console.log("-".repeat(50));
  data.missingI18n.forEach((elem) => {
    console.log(`📁 ${path.basename(elem.file)}:${elem.line}`);
    console.log(`   Element: ${elem.element.substring(0, 50)}...`);
    console.log(`   Text: "${elem.text}"`);
    console.log(`   Suggested fix: Add data-i18n="KEY_HERE"`);
    console.log("");
  });

  // Summary statistics
  console.log("\n📈 SUMMARY STATISTICS");
  console.log("-".repeat(50));
  console.log(`🇹🇭 Thai text elements: ${data.thaiOnlyElements.length}`);
  console.log(`🇺🇸 English text elements: ${data.englishOnlyElements.length}`);
  console.log(`🌐 Mixed language elements: ${data.mixedElements.length}`);
  console.log(`❌ Missing i18n attributes: ${data.missingI18n.length}`);

  // Generate fix suggestions
  console.log("\n🔧 QUICK FIX SUGGESTIONS");
  console.log("-".repeat(50));
  console.log("1. Add data-i18n attributes to Thai text elements");
  console.log("2. Add corresponding translations to i18n.js");
  console.log(
    '3. Use empty elements with i18n only: <span data-i18n="key"></span>',
  );
  console.log("4. Remove hardcoded text from options and placeholders");
}

// Run the analysis
analyzeAllHtmlFiles();

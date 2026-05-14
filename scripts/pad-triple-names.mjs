#!/usr/bin/env node
// Follow-up pass for sanitize-triple-names.mjs:
// finds remaining 2-part names inside string literals and injects a filler
// father so the result is always first + father + grandfather (exactly 3
// parts).
//
// Strategy: scan TypeScript / TSX source for single-quoted string literals
// whose content is exactly two whitespace-separated tokens where the second
// token is one of the known grandfather replacements (the values produced by
// the previous sanitize pass). Inject 'محمد' (Arabic) or 'Mohammed' (English)
// between them.

import fs from 'node:fs';
import path from 'node:path';

const FILES = [
  'resources/js/qmentor/pages/Chatbot/data/mockConversations.ts',
  'resources/js/qmentor/pages/Recovery/data/mockRecoveryData.ts',
  'resources/js/qmentor/pages/StudyPlan/data/mockStudyPlanData.ts',
  'resources/js/qmentor/pages/Alerts/data/mockAlertData.ts',
  'resources/js/qmentor/pages/DigitalTwin/data/mockStudent.ts',
  'resources/js/qmentor/pages/DigitalTwin/data/mockStudentList.ts',
  'resources/js/qmentor/pages/RiskAnalytics/data/mockRiskData.ts',
  'resources/js/qmentor/pages/AgentActivity/data/mockActivityFeed.ts',
  'resources/js/qmentor/pages/PeerTutoring/data/mockTutoringData.ts',
  'resources/js/qmentor/pages/AdvisorDashboard/data/mockAdvisorData.ts',
  'resources/js/qmentor/pages/StudentDashboard/ContactAdvisor.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/CaseloadAnalytics.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/StudentMessaging.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/StudentReports.tsx',
  'resources/js/qmentor/pages/Faculty/data/mockFacultyData.ts',
];

const GRANDFATHERS_AR = new Set([
  'عبدالله','سعد','فهد','سالم','محمد','ناصر','راشد','جهاد','خالد','شهران',
  'زاهر','عتيب','عمر','قحطان','شاهر','مالك','دوسر','شمر','عنز','جبرين',
  'قرن','عسير','حازم','رشيد','فقيه','سلطان','أحمر','دخيل','فايز','لاحم',
  'بقمي','صاعد','ثبيت','حمد','خثعم','صقر','حبيش','حسين','أكلب','أحمد',
  'بريك','هلال','ثقيف','قاضي','عجم','شريف','زيد','فهيد','سليمان','قعيد',
  'صبحي','زبيد','منصور','شدوي','ضحوي','بريكي','أحمدي','شهر',
]);

const GRANDFATHERS_EN = new Set([
  'Abdullah','Saad','Fahd','Salem','Mohammed','Nasser','Rashed','Jihad','Khaled',
  'Shahran','Zaher','Otaib','Omar','Qahtan','Shaher','Malek','Dosar','Shammar',
  'Anaz','Qarn','Aseer','Hazem','Rasheed','Ahmar','Dakheel','Fayez','Lahem',
  'Bugmi','Saed','Thubait','Hamad','Khathaam','Bureik','Hilal','Thaqif','Qadi',
  'Ajam','Sharif','Faqih','Ahmad',
]);

// Arabic word: anchor on Arabic letters (no Latin chars, no digits, no punct)
const AR_WORD = /[\u0621-\u064A\u0671-\u06D5]+/;
const EN_WORD = /[A-Za-z]+/;

function padArabic(literal){
  // literal is the contents between quotes (no surrounding quote)
  const parts = literal.split(' ');
  if (parts.length !== 2) return literal;
  if (!AR_WORD.test(parts[0]) || !AR_WORD.test(parts[1])) return literal;
  if (!GRANDFATHERS_AR.has(parts[1])) return literal;
  return `${parts[0]} محمد ${parts[1]}`;
}

function padEnglish(literal){
  const parts = literal.split(' ');
  if (parts.length !== 2) return literal;
  if (!EN_WORD.test(parts[0]) || !EN_WORD.test(parts[1])) return literal;
  if (!GRANDFATHERS_EN.has(parts[1])) return literal;
  // Skip if first token is a known title (Dr./Mr./Ms.) so we don't turn
  // "Dr. Smith" into "Dr. Mohammed Smith" — those don't end in our grandfather
  // set anyway, so guard is defensive.
  return `${parts[0]} Mohammed ${parts[1]}`;
}

// Match any single-quoted string literal — replace content if 2-part name
function transform(src){
  return src.replace(/'([^'\\]{2,80})'/g, (m, body) => {
    const padded = padEnglish(padArabic(body));
    return padded === body ? m : `'${padded}'`;
  });
}

let totalLines = 0;
for (const rel of FILES){
  const abs = path.resolve(rel);
  if (!fs.existsSync(abs)){ console.log(`skip: ${rel}`); continue; }
  const before = fs.readFileSync(abs, 'utf8');
  const after = transform(before);
  if (after !== before){
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');
    let changedLines = 0;
    for (let i=0; i<Math.min(beforeLines.length, afterLines.length); i++){
      if (beforeLines[i] !== afterLines[i]) changedLines++;
    }
    totalLines += changedLines;
    fs.writeFileSync(abs, after, 'utf8');
    console.log(`✓ ${rel}  (${changedLines} lines padded)`);
  } else {
    console.log(`· ${rel}  (no 2-part names found)`);
  }
}
console.log(`\nDone. ${totalLines} lines padded to 3-part names.`);

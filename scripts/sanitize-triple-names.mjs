#!/usr/bin/env node
// Sanitizes Arabic + English personal names across SPA mock data so every
// name renders as exactly three parts: first + father + grandfather.
// Tribe / family surnames are replaced with a deterministic grandfather word
// per-tribe (and a fixed filler father when input was only two parts).
//
// Run from repo root:  node scripts/sanitize-triple-names.mjs

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
  'resources/js/qmentor/pages/Benchmarking/data/mockBenchmarkData.ts',
  'resources/js/qmentor/pages/Mobile/data/mockMessageData.ts',
  'resources/js/qmentor/pages/StudentDashboard/ContactAdvisor.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/CaseloadAnalytics.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/StudentMessaging.tsx',
  'resources/js/qmentor/pages/AdvisorDashboard/components/StudentReports.tsx',
];

// tribe word (with ال) → grandfather replacement (single word, no ال)
const TRIBE_AR = {
  'الغامدي':'عبدالله','المطيري':'سعد','البلوي':'فهد','السلمي':'سالم',
  'السبيعي':'محمد','الحربي':'ناصر','الراشد':'راشد','الجهني':'جهاد',
  'الخالدي':'خالد','الشهراني':'شهران','الزهراني':'زاهر','العتيبي':'عتيب',
  'العمري':'عمر','القحطاني':'قحطان','الفهد':'فهد','الشهري':'شاهر',
  'المالكي':'مالك','الدوسري':'دوسر','الشمري':'شمر','العنزي':'عنز',
  'الجبرين':'جبرين','القرني':'قرن','العسيري':'عسير','الحازمي':'حازم',
  'الرشيدي':'رشيد','الفقيه':'فقيه','المحمدي':'محمد','السلطان':'سلطان',
  'الأحمري':'أحمر','الناصر':'ناصر','الدخيل':'دخيل','الفايز':'فايز',
  'اللحياني':'لاحم','البقمي':'بقمي','الصاعدي':'صاعد','الثبيتي':'ثبيت',
  'الحمدي':'حمد','الخثعمي':'خثعم','الصقري':'صقر','الحبيشي':'حبيش',
  'الحسيني':'حسين','الأكلبي':'أكلب','الأحمدي':'أحمد','البريك':'بريك',
  'الهلال':'هلال','الثقفي':'ثقيف','القاضي':'قاضي','العجمي':'عجم',
  'الشريف':'شريف','الفقيه':'فقيه','الزيد':'زيد','الفهيد':'فهيد',
  'البريكي':'بريكي','الشدوي':'شدوي','الضحوي':'ضحوي','السليماني':'سليمان',
  'القعيد':'قعيد','الصبحي':'صبحي','الزبيدي':'زبيد','المنصور':'منصور',
};

// English Al-X tribe → grandfather (first letter capitalised)
const TRIBE_EN = {
  'Al-Ghamdi':'Abdullah','Al-Mutairi':'Saad','Al-Balawi':'Fahd','Al-Sulami':'Salem',
  'Al-Subai':'Mohammed','Al-Subaie':'Mohammed','Al-Harbi':'Nasser','Al-Rashed':'Rashed',
  'Al-Juhani':'Jihad','Al-Khalidi':'Khaled','Al-Shahrani':'Shahran','Al-Zahrani':'Zaher',
  'Al-Otaibi':'Otaib','Al-Omari':'Omar','Al-Amri':'Omar','Al-Qahtani':'Qahtan',
  'Al-Fahd':'Fahd','Al-Shahri':'Shaher','Al-Shehri':'Shaher','Al-Malki':'Malek',
  'Al-Dosari':'Dosar','Al-Shammari':'Shammar','Al-Anazi':'Anaz','Al-Qarni':'Qarn',
  'Al-Asiri':'Aseer','Al-Hazmi':'Hazem','Al-Rashidi':'Rasheed','Al-Mohammadi':'Mohammed',
  'Al-Ahmari':'Ahmar','Al-Naser':'Nasser','Al-Dakheel':'Dakheel','Al-Fayez':'Fayez',
  'Al-Lahyani':'Lahem','Al-Bugami':'Bugmi','Al-Saedi':'Saed','Al-Thubaiti':'Thubait',
  'Al-Hamdi':'Hamad','Al-Khathami':'Khathaam','Al-Ahmadi':'Ahmad','Al-Bureik':'Bureik',
  'Al-Hilal':'Hilal','Al-Thaqafi':'Thaqif','Al-Qadi':'Qadi','Al-Ajami':'Ajam',
  'Al-Sharif':'Sharif','Al-Faqih':'Faqih',
};

let totalChanges = 0;

function sanitizeArabic(text){
  // 1) drop "بن" / "بنت" filler so we don't end up with 4 parts
  text = text.replace(/ بن /g, ' ').replace(/ بنت /g, ' ');

  // 2) tribe replacement: first map tribe → grandfather word
  for (const [tribe, gp] of Object.entries(TRIBE_AR)){
    text = text.replaceAll(tribe, gp);
  }
  return text;
}

function sanitizeEnglish(text){
  text = text.replace(/ bin /gi, ' ').replace(/ bint /gi, ' ');
  // Drop middle initials like "Ahmed M. Al-Otaibi" → "Ahmed Al-Otaibi"
  text = text.replace(/ [A-Z]\. /g, ' ');
  for (const [tribe, gp] of Object.entries(TRIBE_EN)){
    text = text.replaceAll(tribe, gp);
  }
  return text;
}

for (const rel of FILES){
  const abs = path.resolve(rel);
  if (!fs.existsSync(abs)){ console.log(`skip (missing): ${rel}`); continue; }
  const before = fs.readFileSync(abs, 'utf8');
  let after = sanitizeArabic(before);
  after = sanitizeEnglish(after);
  if (after !== before){
    // crude metric: count distinct character changes
    let diffs = 0; const len = Math.min(before.length, after.length);
    for (let i=0;i<len;i++) if (before[i] !== after[i]) diffs++;
    diffs += Math.abs(before.length - after.length);
    totalChanges += diffs;
    fs.writeFileSync(abs, after, 'utf8');
    console.log(`✓ ${rel}  (~${diffs} chars changed)`);
  } else {
    console.log(`· ${rel}  (no changes)`);
  }
}

console.log(`\nDone. Total char-level edits: ${totalChanges}`);

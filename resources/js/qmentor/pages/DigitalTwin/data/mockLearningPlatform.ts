import type { Course, StudentProfile } from '../types';
import type {
  QSparkSummary,
  QSparkWeakQuestion,
  QSparkSetting,
  AgentDecisionRow,
} from '../../../hooks/useAgentCore';

/**
 * منصة التعلم والتجربة الأكاديمية for the twins that are not فيصل.
 *
 * Only فيصل has a real play history behind /api/qmentor/agent-core; every
 * other student in the roster is a fixture, and the platform tab used to tell
 * them all the same thing — «لم يلعب أي اختبار». That is honest but useless
 * for reading the board, and worse, the shape of the answer never depended on
 * who was selected.
 *
 * So a fixture student gets a fixture platform board, built from THEIR
 * programme: the courses below are the ones their department actually teaches,
 * the learning objectives are those courses' own material, and the numbers are
 * derived from their student id and academic standing — a 2.45 student misses
 * more, and on harder objectives, than a 4.55 one. Deterministic, so the board
 * does not reshuffle between renders.
 *
 * فيصل is untouched: her tab reads the API, and this module is never consulted
 * for a live student.
 */

interface ProgramCourse {
  code: string;
  name: string;
  /** The course material a quiz is generated from — the agent's unit of decision. */
  objectives: string[];
}

/**
 * One catalogue per department in mockStudentList, keyed by the Arabic name
 * the profile carries. Courses are level-appropriate for the students holding
 * them, and the objectives are chapter-level material, not exam titles.
 */
export const programCourses: Record<string, ProgramCourse[]> = {
  'علوم الحاسب': [
    { code: 'CS340', name: 'خوارزميات وتراكيب بيانات', objectives: ['الأشجار المتوازنة', 'تعقيد الخوارزميات'] },
    { code: 'CS361', name: 'نظم التشغيل', objectives: ['جدولة المعالج', 'إدارة الذاكرة الافتراضية'] },
    { code: 'CS372', name: 'قواعد البيانات', objectives: ['التطبيع حتى الصيغة الثالثة', 'استعلامات SQL المتداخلة'] },
    { code: 'CS385', name: 'شبكات الحاسب', objectives: ['طبقة النقل TCP', 'العنونة الفرعية IPv4'] },
  ],
  'هندسة البرمجيات': [
    { code: 'SWE331', name: 'هندسة المتطلبات', objectives: ['نمذجة حالات الاستخدام', 'المتطلبات غير الوظيفية'] },
    { code: 'SWE352', name: 'تصميم البرمجيات', objectives: ['أنماط التصميم البنائية', 'مبادئ SOLID'] },
    { code: 'SWE364', name: 'اختبار البرمجيات', objectives: ['اختبار الوحدة', 'تغطية المسارات'] },
    { code: 'SWE377', name: 'هندسة البرمجيات الرشيقة', objectives: ['تخطيط السبرنت', 'التكامل المستمر'] },
  ],
  'نظم المعلومات': [
    { code: 'IS330', name: 'تحليل وتصميم النظم', objectives: ['مخططات تدفق البيانات', 'دراسة الجدوى'] },
    { code: 'IS345', name: 'إدارة قواعد البيانات', objectives: ['نمذجة الكيان والعلاقة', 'الفهرسة والأداء'] },
    { code: 'IS368', name: 'أمن المعلومات', objectives: ['التحكم في الوصول', 'التشفير المتماثل'] },
    { code: 'IS381', name: 'نظم تخطيط موارد المؤسسة', objectives: ['دورة الشراء إلى السداد', 'تكامل الوحدات'] },
  ],
  'الهندسة الكهربائية': [
    { code: 'EE311', name: 'تحليل الدوائر الكهربائية (2)', objectives: ['استجابة الدوائر RLC', 'تحليل الطور والتردد'] },
    { code: 'EE324', name: 'الآلات الكهربائية', objectives: ['المحرك التأثيري', 'المحولات ثلاثية الطور'] },
    { code: 'EE337', name: 'الإلكترونيات التماثلية', objectives: ['مكبرات العمليات', 'انحياز الترانزستور'] },
    { code: 'EE348', name: 'أنظمة التحكم', objectives: ['استقرار النظام', 'المتحكم التناسبي التكاملي'] },
  ],
  'الهندسة المدنية': [
    { code: 'CE321', name: 'ميكانيكا التربة', objectives: ['تصنيف التربة', 'إجهاد التربة الفعّال'] },
    { code: 'CE334', name: 'تحليل المنشآت', objectives: ['العزوم في الجوائز المستمرة', 'الإطارات غير المحددة'] },
    { code: 'CE345', name: 'خرسانة مسلحة', objectives: ['تصميم الجوائز للانحناء', 'تصميم الأعمدة'] },
    { code: 'CE358', name: 'هندسة النقل', objectives: ['تصميم التقاطعات', 'السعة المرورية'] },
  ],
  'الهندسة الميكانيكية': [
    { code: 'ME312', name: 'الديناميكا الحرارية (2)', objectives: ['دورات القدرة البخارية', 'دورات التبريد'] },
    { code: 'ME327', name: 'ميكانيكا الموائع', objectives: ['معادلة برنولي', 'الجريان في الأنابيب'] },
    { code: 'ME339', name: 'انتقال الحرارة', objectives: ['التوصيل العابر', 'الحمل القسري'] },
    { code: 'ME352', name: 'تصميم عناصر الآلات', objectives: ['تصميم الأعمدة', 'اختيار المحامل'] },
  ],
  'المحاسبة': [
    { code: 'ACCT350', name: 'المحاسبة المتوسطة (2)', objectives: ['الأصول الثابتة والإهلاك', 'الالتزامات طويلة الأجل'] },
    { code: 'ACCT353', name: 'نظم المعلومات المحاسبية', objectives: ['دورة الإيرادات', 'الضبط الداخلي'] },
    { code: 'ACCT362', name: 'المحاسبة الإدارية', objectives: ['تحليل التعادل', 'الموازنات التقديرية'] },
    { code: 'ACCT371', name: 'المراجعة', objectives: ['أدلة المراجعة', 'تقرير المراجع'] },
  ],
  'إدارة الأعمال': [
    { code: 'MGT341', name: 'السلوك التنظيمي', objectives: ['نظريات الدافعية', 'ديناميكيات الفريق'] },
    { code: 'MGT356', name: 'إدارة العمليات', objectives: ['إدارة المخزون', 'جدولة الإنتاج'] },
    { code: 'MGT368', name: 'الإدارة الاستراتيجية', objectives: ['تحليل البيئة التنافسية', 'صياغة الاستراتيجية'] },
    { code: 'FIN340', name: 'الإدارة المالية', objectives: ['القيمة الزمنية للنقود', 'تكلفة رأس المال'] },
  ],
  'التسويق': [
    { code: 'MKT331', name: 'سلوك المستهلك', objectives: ['عملية اتخاذ القرار الشرائي', 'المؤثرات الثقافية'] },
    { code: 'MKT344', name: 'بحوث التسويق', objectives: ['تصميم الاستبانة', 'المعاينة الاحتمالية'] },
    { code: 'MKT357', name: 'التسويق الرقمي', objectives: ['قياس أداء الحملات', 'تحسين محركات البحث'] },
    { code: 'MKT366', name: 'إدارة العلامة التجارية', objectives: ['تموضع العلامة', 'قيمة العلامة'] },
  ],
  'الرياضيات': [
    { code: 'MATH311', name: 'التحليل الحقيقي', objectives: ['التقارب المنتظم', 'الاتصال والتكامل'] },
    { code: 'MATH324', name: 'الجبر الخطي (2)', objectives: ['القيم والمتجهات الذاتية', 'الفضاءات الجزئية'] },
    { code: 'MATH337', name: 'المعادلات التفاضلية', objectives: ['معادلات الرتبة الثانية', 'تحويل لابلاس'] },
    { code: 'STAT341', name: 'الاستدلال الإحصائي', objectives: ['اختبار الفرضيات', 'فترات الثقة'] },
  ],
  'الفيزياء': [
    { code: 'PHYS321', name: 'الميكانيكا الكلاسيكية', objectives: ['ميكانيكا لاجرانج', 'الحركة الدورانية'] },
    { code: 'PHYS334', name: 'الكهرومغناطيسية', objectives: ['قانون جاوس', 'معادلات ماكسويل'] },
    { code: 'PHYS345', name: 'فيزياء الكم', objectives: ['معادلة شرودنجر', 'بئر الجهد'] },
    { code: 'PHYS356', name: 'الفيزياء الحرارية', objectives: ['التوزيع الإحصائي', 'القانون الثاني'] },
  ],
  'الكيمياء': [
    { code: 'CHEM321', name: 'الكيمياء العضوية (2)', objectives: ['تفاعلات الاستبدال', 'الأطياف وتحديد البنية'] },
    { code: 'CHEM334', name: 'الكيمياء التحليلية', objectives: ['المعايرات الحجمية', 'التحليل الطيفي'] },
    { code: 'CHEM347', name: 'الكيمياء الفيزيائية', objectives: ['حركية التفاعل', 'الاتزان الكيميائي'] },
    { code: 'CHEM358', name: 'الكيمياء غير العضوية', objectives: ['المركبات التناسقية', 'الجدول الدوري والاتجاهات'] },
  ],
  'اللغة الإنجليزية': [
    { code: 'ENG331', name: 'علم اللغة التطبيقي', objectives: ['الصرف والاشتقاق', 'التحليل الصوتي'] },
    { code: 'ENG342', name: 'الأدب الإنجليزي الحديث', objectives: ['الرواية الحداثية', 'الشعر الرومانسي'] },
    { code: 'ENG355', name: 'الترجمة التحريرية', objectives: ['الترجمة الاصطلاحية', 'ترجمة النص التخصصي'] },
    { code: 'ENG364', name: 'الكتابة الأكاديمية', objectives: ['بنية الحجة', 'التوثيق والاقتباس'] },
  ],
  'التربية الخاصة': [
    { code: 'SPED321', name: 'صعوبات التعلم', objectives: ['تشخيص عسر القراءة', 'استراتيجيات التدخل'] },
    { code: 'SPED334', name: 'اضطراب طيف التوحد', objectives: ['التواصل البديل', 'تعديل السلوك'] },
    { code: 'SPED345', name: 'الخطة التربوية الفردية', objectives: ['صياغة الأهداف السلوكية', 'قياس التقدم'] },
    { code: 'SPED356', name: 'الإعاقة الفكرية', objectives: ['المهارات التكيفية', 'التقييم النمائي'] },
  ],
  'رياض الأطفال': [
    { code: 'KIND311', name: 'نمو الطفل', objectives: ['مراحل بياجيه', 'النمو اللغوي المبكر'] },
    { code: 'KIND324', name: 'مناهج الطفولة المبكرة', objectives: ['التعلم باللعب', 'تخطيط الوحدات'] },
    { code: 'KIND337', name: 'أدب الأطفال', objectives: ['اختيار القصة', 'رواية القصة تفاعلياً'] },
    { code: 'KIND348', name: 'القياس في الطفولة المبكرة', objectives: ['ملف الإنجاز', 'الملاحظة المنظمة'] },
  ],
};

/** A department with no catalogue of its own reads on general university courses. */
const fallbackProgram: ProgramCourse[] = [
  { code: 'GS301', name: 'مهارات البحث العلمي', objectives: ['صياغة سؤال البحث', 'مراجعة الأدبيات'] },
  { code: 'GS312', name: 'التفكير الناقد', objectives: ['المغالطات المنطقية', 'تقييم الأدلة'] },
  { code: 'ARAB103', name: 'التحرير العربي', objectives: ['الإملاء والترقيم', 'بناء الفقرة'] },
];

export function coursesForProfile(profile: StudentProfile): ProgramCourse[] {
  return programCourses[profile.department] ?? fallbackProgram;
}

// ── The board itself ────────────────────────────────────────────────────

/** Deterministic per student: the same id always draws the same board. */
function seedOf(studentId: string): () => number {
  let seed = 0;
  for (const ch of studentId) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  return () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
}

const difficulties = ['easy', 'medium', 'hard'];

/**
 * The question stems a weak objective produces. Kept generic on purpose: the
 * objective and the course carry the meaning, and inventing four specific exam
 * questions per objective would read as a real question bank when it is not.
 */
function stemFor(objective: string, i: number): string {
  const shapes = [
    `أي العبارات التالية يصف ${objective} وصفاً صحيحاً؟`,
    `في سياق ${objective}، ما الخطوة التالية الصحيحة؟`,
    `ما النتيجة المتوقعة عند تطبيق ${objective}؟`,
    `أيٌّ مما يلي لا يُعد من ${objective}؟`,
  ];
  return shapes[i % shapes.length];
}

/**
 * A fixture platform board for one student: their own courses, their own
 * objectives, and figures that follow their standing.
 */
export function buildMockQSparkSummary(profile: StudentProfile): QSparkSummary {
  const rand = seedOf(profile.studentId);
  const courses = coursesForProfile(profile);

  // A struggling student plays as much but lands less: accuracy tracks their
  // GPA on the same 5-point scale, and what they leave unanswered tracks the
  // gap. 4.55 → ~0.85 accurate; 2.45 → ~0.50.
  const standing = Math.min(1, Math.max(0, profile.gpa / profile.gpaScale));
  const accuracy = Math.round((0.35 + standing * 0.55) * 100) / 100;
  const timeoutRate = Math.round((0.22 - standing * 0.16) * 100) / 100;

  const weak: QSparkWeakQuestion[] = [];
  const settings: QSparkSetting[] = [];
  const recent: AgentDecisionRow[] = [];
  let questionId = 4100;
  let decisionId = 900;
  let served = 0;

  // The weaker the student, the more objectives carry a failing question, and
  // the harder those questions are.
  const shakyObjectives = standing < 0.6 ? 5 : standing < 0.8 ? 3 : 2;
  const flat = courses.flatMap(c => c.objectives.map(o => ({ course: c, objective: o })));

  flat.forEach(({ course, objective }, index) => {
    const attachmentKey = `${course.code}_${objective}`;
    const objectiveServed = 12 + Math.floor(rand() * 20);
    served += objectiveServed;

    if (index >= shakyObjectives) return;

    const questions = 1 + Math.floor(rand() * 2);
    for (let q = 0; q < questions; q++) {
      const difficulty = difficulties[Math.min(2, (standing < 0.6 ? 1 : 0) + Math.floor(rand() * 2))];
      const wrongRate = Math.round((0.45 + rand() * 0.4) * 100) / 100;
      weak.push({
        question_id: questionId++,
        course_code: course.code,
        attachment_key: attachmentKey,
        difficulty,
        question: stemFor(objective, index + q),
        served: 4 + Math.floor(rand() * 8),
        wrong_rate: wrongRate,
        timeout_rate: Math.round(rand() * 0.3 * 100) / 100,
        decision: q === 0
          ? { code: 'QS-RETIRE', title: 'سحب السؤال من التوليد حتى تُراجع صياغته', status: 'proposed', auto: false }
          : null,
      });
    }

    // The agent's answer to a shaky objective: an easier mix and more time.
    const applied = index < 2;
    settings.push({
      course_code: course.code,
      attachment_key: attachmentKey,
      questions_per_difficulty: standing < 0.6
        ? { easy: 4, medium: 3, hard: 1 }
        : { easy: 3, medium: 3, hard: 2 },
      starting_difficulty: standing < 0.6 ? 'easy' : 'medium',
      question_time_limit: standing < 0.6 ? 90 : 60,
      decided_by: 'agent',
      reason: `نسبة الخطأ على «${objective}» تجاوزت الحد — خُفّض مستوى البدء ومُدّد زمن السؤال`,
      applied_at: applied ? daysAgo(2 + index) : null,
    });

    recent.push({
      id: decisionId++,
      code: 'QS-RETUNE',
      subject_type: 'attachment',
      subject_key: attachmentKey,
      course_code: course.code,
      student_id: profile.studentId,
      title: `إعادة ضبط اختبار «${objective}» في ${course.code}`,
      detail: `${course.name} — خُفّض مستوى البدء ومُدّد زمن السؤال بعد تعثّر متكرر على هذا الهدف`,
      status: applied ? 'applied' : 'proposed',
      auto: applied,
      decided_at: daysAgo(2 + index),
      applied_at: applied ? daysAgo(2 + index) : null,
      evidence: { wrong_rate: weak[weak.length - 1]?.wrong_rate ?? null, objective },
      action: { starting_difficulty: standing < 0.6 ? 'easy' : 'medium' },
    });
  });

  const appliedCount = recent.filter(d => d.status === 'applied').length;

  return {
    enabled: true,
    last_run_at: daysAgo(1),
    sessions: 6 + Math.floor(rand() * 10),
    students: 1,
    questions_served: served,
    accuracy,
    timeout_rate: timeoutRate,
    courses: courses.length,
    attachments: flat.length,
    decisions: { applied: appliedCount, proposed: recent.length - appliedCount, dismissed: 0 },
    weak_questions: weak,
    settings,
    recent,
    by_code: { 'QS-RETUNE': { applied: appliedCount, proposed: recent.length - appliedCount } },
    student: {
      student_id: profile.studentId,
      label: profile.name,
      courses: courses.map(c => ({
        course_code: c.code,
        course_name: c.name,
        in_plan: true,
        served: Math.round(served / courses.length),
        accuracy,
        wrong_rate: Math.round((1 - accuracy) * 100) / 100,
        timeout_rate: timeoutRate,
        last_played_at: daysAgo(1 + Math.floor(rand() * 6)),
      })),
      program: {
        key: profile.department,
        name: profile.department,
        code: null,
        matched: courses.length,
      },
    } as QSparkSummary['student'],
    scoped_student_id: profile.studentId,
    scope_empty: false,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ── The courses tab, from the same catalogue ────────────────────────────

/** A handful of names to attach to the fixture sections, rotated by course. */
const instructors = [
  { name: 'د. خالد العتيبي', nameEn: 'Dr. Khalid Al-Otaibi', email: 'k.otaibi@qu.edu.sa' },
  { name: 'د. سارة المطيري', nameEn: 'Dr. Sara Al-Mutairi', email: 's.mutairi@qu.edu.sa' },
  { name: 'د. فهد الحربي', nameEn: 'Dr. Fahd Al-Harbi', email: 'f.harbi@qu.edu.sa' },
  { name: 'د. عبدالله الشهري', nameEn: 'Dr. Abdullah Al-Shehri', email: 'a.shehri@qu.edu.sa' },
];

/** Letter grades that sit around the student's own standing. */
function gradeFor(standing: number, offset: number): { grade: string; points: number } {
  const ladder = [
    { grade: 'A+', points: 5.0 }, { grade: 'A', points: 4.75 },
    { grade: 'B+', points: 4.5 }, { grade: 'B', points: 4.0 },
    { grade: 'C+', points: 3.5 }, { grade: 'C', points: 3.0 },
    { grade: 'D+', points: 2.5 }, { grade: 'D', points: 2.0 },
  ];
  const centre = Math.round((1 - standing) * (ladder.length - 2));
  return ladder[Math.min(ladder.length - 1, Math.max(0, centre + offset))];
}

/**
 * المقررات for a fixture student — the same catalogue their platform board is
 * built from, so the two tabs cannot name different courses. English keeps the
 * course code as its name: these are fixtures, and a fabricated English title
 * would read as a real catalogue entry.
 */
export function mockCoursesForProfile(profile: StudentProfile): Course[] {
  const standing = Math.min(1, Math.max(0, profile.gpa / profile.gpaScale));

  return coursesForProfile(profile).map((c, i) => {
    const { grade, points } = gradeFor(standing, (i % 3) - 1);
    const teacher = instructors[i % instructors.length];
    return {
      code: c.code,
      name: c.name,
      nameEn: c.code,
      creditHours: 3,
      grade,
      gradePoints: points,
      bbGrade: `${Math.round(points * 19)}/100`,
      status: 'in-progress' as const,
      instructor: teacher.name,
      instructorEn: teacher.nameEn,
      instructorEmail: teacher.email,
      contentPreview: c.objectives.join('، '),
    };
  });
}

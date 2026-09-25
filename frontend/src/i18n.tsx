import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LOCALES = ["en", "zh-CN", "zh-TW", "he", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Translation {
  languageName: string;
  nav: { dashboard: string; prompts: string; language: string };
  dashboard: {
    eyebrow: string; title: string; subtitle: string; statsLabel: string;
    total: string; notStarted: string; inProgress: string; completed: string;
    dismiss: string; newGoal: string; addCourse: string; roadmap: string;
    courses: string; refresh: string; loading: string; emptyTitle: string;
    emptyBody: string; editCourse: string; saveChanges: string;
    deleteConfirm: (name: string) => string;
    loadError: string; createError: string; updateError: string; deleteError: string;
  };
  form: {
    name: string; namePlaceholder: string; description: string;
    descriptionPlaceholder: string; targetDate: string; status: string;
    cancel: string; saving: string; add: string;
  };
  card: { target: string; edit: string; delete: string };
  statuses: Record<"Not Started" | "In Progress" | "Completed", string>;
  modal: { close: string };
  prompts: {
    eyebrow: string; title: string; subtitle: string; stages: string;
    humanDirected: string; evidenceDriven: string; approach: string;
    approachTitle: string; approachBody: string; library: string;
    libraryTitle: string; editHint: string; promptLabel: string;
    promptNumber: string; takeaway: string; quote: string;
    principles: Array<[string, string, string]>;
  };
}

const en: Translation = {
  languageName: "English",
  nav: { dashboard: "Dashboard", prompts: "Prompt journey", language: "Language" },
  dashboard: {
    eyebrow: "Developer learning hub", title: "Build skills with intention.", subtitle: "Plan your next course, stay focused, and see your learning momentum at a glance.", statsLabel: "Learning statistics",
    total: "Total courses", notStarted: "Not started", inProgress: "In progress", completed: "Completed", dismiss: "Dismiss", newGoal: "New goal", addCourse: "Add a course", roadmap: "Your roadmap", courses: "Learning courses", refresh: "Refresh", loading: "Loading courses…", emptyTitle: "No courses yet", emptyBody: "Add your first learning goal above.", editCourse: "Edit course", saveChanges: "Save changes", deleteConfirm: (name) => `Delete “${name}”? This cannot be undone.`, loadError: "Unable to load courses", createError: "Unable to create course", updateError: "Unable to update course", deleteError: "Unable to delete course",
  },
  form: { name: "Course name", namePlaceholder: "e.g. Advanced TypeScript", description: "Description", descriptionPlaceholder: "What do you want to learn?", targetDate: "Target date", status: "Status", cancel: "Cancel", saving: "Saving…", add: "Add course" },
  card: { target: "Target", edit: "Edit", delete: "Delete" },
  statuses: { "Not Started": "Not Started", "In Progress": "In Progress", Completed: "Completed" },
  modal: { close: "Close dialog" },
  prompts: {
    eyebrow: "Prompt engineering case study", title: "The prompts behind the product.", subtitle: "A transparent record of how I used AI as a development partner—from product framing and interface generation to testing, debugging, and deployment.", stages: "prompt stages", humanDirected: "Human-directed workflow", evidenceDriven: "Evidence-driven iteration", approach: "My approach", approachTitle: "Vibe coding with structure.", approachBody: "The quality of an AI-built product depends on the quality of its context and feedback loops. These three principles shaped every prompt in this project.", library: "Prompt library", libraryTitle: "From idea to deployment.", editHint: "Prompt content is maintained in frontend/src/content/prompts.ts.", promptLabel: "The prompt", promptNumber: "PROMPT", takeaway: "The takeaway", quote: "“AI accelerated the implementation. Clear intent, critical review, and repeated verification shaped the product.”",
    principles: [["01", "Give context", "Define the product goal, audience, constraints, and current project state."], ["02", "Create feedback loops", "Ask AI to build, test, inspect evidence, and improve—not only generate code."], ["03", "Keep human judgment", "Review trade-offs, reject weak suggestions, and make the final product decisions."]],
  },
};

const translations: Record<Locale, Translation> = {
  en,
  "zh-CN": {
    ...en, languageName: "简体中文",
    nav: { dashboard: "学习面板", prompts: "Prompt 之旅", language: "语言" },
    dashboard: { ...en.dashboard, eyebrow: "开发者学习中心", title: "有目标地构建技能。", subtitle: "规划下一门课程，保持专注，一目了然地掌握学习进度。", statsLabel: "学习统计", total: "课程总数", notStarted: "未开始", inProgress: "进行中", completed: "已完成", dismiss: "关闭", newGoal: "新目标", addCourse: "添加课程", roadmap: "你的学习路线", courses: "学习课程", refresh: "刷新", loading: "正在加载课程…", emptyTitle: "还没有课程", emptyBody: "在上方添加你的第一个学习目标。", editCourse: "编辑课程", saveChanges: "保存更改", deleteConfirm: (name) => `确定删除“${name}”吗？此操作无法撤销。`, loadError: "无法加载课程", createError: "无法创建课程", updateError: "无法更新课程", deleteError: "无法删除课程" },
    form: { name: "课程名称", namePlaceholder: "例如：进阶 TypeScript", description: "课程描述", descriptionPlaceholder: "你想学习什么？", targetDate: "目标日期", status: "状态", cancel: "取消", saving: "正在保存…", add: "添加课程" },
    card: { target: "目标日期", edit: "编辑", delete: "删除" }, statuses: { "Not Started": "未开始", "In Progress": "进行中", Completed: "已完成" }, modal: { close: "关闭对话框" },
    prompts: { ...en.prompts, eyebrow: "Prompt 工程案例", title: "产品背后的 Prompts。", subtitle: "透明记录我如何将 AI 作为开发伙伴——从产品定义和界面生成，到测试、调试与部署。", stages: "个 Prompt 阶段", humanDirected: "人工主导的工作流", evidenceDriven: "以证据驱动迭代", approach: "我的方法", approachTitle: "有结构的 Vibe Coding。", approachBody: "AI 产品的质量取决于上下文与反馈循环的质量。以下三个原则贯穿本项目的每一条 Prompt。", library: "Prompt 资料库", libraryTitle: "从想法到部署。", editHint: "Prompt 内容统一维护在 frontend/src/content/prompts.ts。", promptLabel: "Prompt 内容", promptNumber: "PROMPT", takeaway: "核心体会", quote: "“AI 加速了实现；清晰的意图、批判性审查与反复验证塑造了最终产品。”", principles: [["01", "提供上下文", "明确产品目标、受众、限制条件以及项目当前状态。"], ["02", "建立反馈循环", "让 AI 构建、测试、检查证据并继续改进，而不只是生成代码。"], ["03", "保留人的判断", "审视取舍、拒绝薄弱建议，并由人做出最终产品决策。"]] },
  },
  "zh-TW": {
    ...en, languageName: "繁體中文",
    nav: { dashboard: "學習面板", prompts: "Prompt 旅程", language: "語言" },
    dashboard: { ...en.dashboard, eyebrow: "開發者學習中心", title: "有目標地培養技能。", subtitle: "規劃下一門課程、保持專注，並一目了然地掌握學習進度。", statsLabel: "學習統計", total: "課程總數", notStarted: "尚未開始", inProgress: "進行中", completed: "已完成", dismiss: "關閉", newGoal: "新目標", addCourse: "新增課程", roadmap: "你的學習路線", courses: "學習課程", refresh: "重新整理", loading: "正在載入課程…", emptyTitle: "尚無課程", emptyBody: "請在上方新增第一個學習目標。", editCourse: "編輯課程", saveChanges: "儲存變更", deleteConfirm: (name) => `確定刪除「${name}」嗎？此操作無法復原。`, loadError: "無法載入課程", createError: "無法建立課程", updateError: "無法更新課程", deleteError: "無法刪除課程" },
    form: { name: "課程名稱", namePlaceholder: "例如：進階 TypeScript", description: "課程描述", descriptionPlaceholder: "你想學習什麼？", targetDate: "目標日期", status: "狀態", cancel: "取消", saving: "正在儲存…", add: "新增課程" },
    card: { target: "目標日期", edit: "編輯", delete: "刪除" }, statuses: { "Not Started": "尚未開始", "In Progress": "進行中", Completed: "已完成" }, modal: { close: "關閉對話框" },
    prompts: { ...en.prompts, eyebrow: "Prompt 工程案例", title: "產品背後的 Prompts。", subtitle: "透明記錄我如何將 AI 作為開發夥伴——從產品定義與介面生成，到測試、除錯及部署。", stages: "個 Prompt 階段", humanDirected: "人工主導的工作流程", evidenceDriven: "以證據驅動迭代", approach: "我的方法", approachTitle: "有結構的 Vibe Coding。", approachBody: "AI 產品的品質取決於上下文與回饋循環的品質。以下三個原則貫穿本專案的每一條 Prompt。", library: "Prompt 資料庫", libraryTitle: "從想法到部署。", editHint: "Prompt 內容統一維護於 frontend/src/content/prompts.ts。", promptLabel: "Prompt 內容", promptNumber: "PROMPT", takeaway: "核心體會", quote: "“AI 加速了實作；清晰的意圖、批判性審查與反覆驗證塑造了最終產品。”", principles: [["01", "提供上下文", "明確產品目標、受眾、限制條件以及專案目前狀態。"], ["02", "建立回饋循環", "讓 AI 建構、測試、檢查證據並持續改進，而不只是產生程式碼。"], ["03", "保留人的判斷", "審視取捨、拒絕薄弱建議，並由人做出最終產品決策。"]] },
  },
  he: {
    ...en, languageName: "עברית",
    nav: { dashboard: "לוח למידה", prompts: "מסע הפרומפטים", language: "שפה" },
    dashboard: { ...en.dashboard, eyebrow: "מרכז למידה למפתחים", title: "בונים מיומנויות עם כוונה.", subtitle: "תכננו את הקורס הבא, הישארו ממוקדים וראו את תנופת הלמידה במבט אחד.", statsLabel: "סטטיסטיקות למידה", total: "סך הקורסים", notStarted: "טרם התחיל", inProgress: "בתהליך", completed: "הושלם", dismiss: "סגירה", newGoal: "יעד חדש", addCourse: "הוספת קורס", roadmap: "מפת הדרך שלך", courses: "קורסי למידה", refresh: "רענון", loading: "הקורסים נטענים…", emptyTitle: "אין קורסים עדיין", emptyBody: "הוסיפו את יעד הלמידה הראשון למעלה.", editCourse: "עריכת קורס", saveChanges: "שמירת שינויים", deleteConfirm: (name) => `למחוק את „${name}”? לא ניתן לבטל פעולה זו.`, loadError: "לא ניתן לטעון קורסים", createError: "לא ניתן ליצור קורס", updateError: "לא ניתן לעדכן קורס", deleteError: "לא ניתן למחוק קורס" },
    form: { name: "שם הקורס", namePlaceholder: "לדוגמה TypeScript מתקדם", description: "תיאור", descriptionPlaceholder: "מה תרצו ללמוד?", targetDate: "תאריך יעד", status: "סטטוס", cancel: "ביטול", saving: "שומר…", add: "הוספת קורס" },
    card: { target: "יעד", edit: "עריכה", delete: "מחיקה" }, statuses: { "Not Started": "טרם התחיל", "In Progress": "בתהליך", Completed: "הושלם" }, modal: { close: "סגירת חלון" },
    prompts: { ...en.prompts, eyebrow: "מקרה בוחן בהנדסת פרומפטים", title: "הפרומפטים שמאחורי המוצר.", subtitle: "תיעוד שקוף של השימוש שלי ב-AI כשותף לפיתוח — מהגדרת המוצר ויצירת הממשק ועד בדיקות, ניפוי שגיאות ופריסה.", stages: "שלבי פרומפט", humanDirected: "תהליך עבודה בהכוונה אנושית", evidenceDriven: "איטרציה מבוססת ראיות", approach: "הגישה שלי", approachTitle: "Vibe coding עם מבנה.", approachBody: "האיכות של מוצר שנבנה בעזרת AI תלויה באיכות ההקשר ולולאות המשוב. שלושת העקרונות האלה הנחו כל פרומפט בפרויקט.", library: "ספריית פרומפטים", libraryTitle: "מרעיון לפריסה.", editHint: "תוכן הפרומפטים מנוהל בקובץ frontend/src/content/prompts.ts.", promptLabel: "הפרומפט (באנגלית)", promptNumber: "PROMPT", takeaway: "המסקנה", quote: "“ה-AI האיץ את המימוש. כוונה ברורה, בחינה ביקורתית ואימות חוזר עיצבו את המוצר.”", principles: [["01", "תנו הקשר", "הגדירו את מטרת המוצר, הקהל, המגבלות ומצב הפרויקט."], ["02", "צרו לולאות משוב", "בקשו מה-AI לבנות, לבדוק, לבחון ראיות ולשפר — לא רק לייצר קוד."], ["03", "שמרו על שיקול דעת אנושי", "בחנו פשרות, דחו הצעות חלשות וקבלו את החלטות המוצר הסופיות."]] },
  },
  ar: {
    ...en, languageName: "العربية",
    nav: { dashboard: "لوحة التعلّم", prompts: "رحلة الأوامر", language: "اللغة" },
    dashboard: { ...en.dashboard, eyebrow: "مركز تعلّم المطورين", title: "طوّر مهاراتك بوضوح.", subtitle: "خطط لدورتك القادمة، حافظ على تركيزك، وتابع تقدمك التعليمي بنظرة واحدة.", statsLabel: "إحصاءات التعلّم", total: "إجمالي الدورات", notStarted: "لم تبدأ", inProgress: "قيد التقدم", completed: "مكتملة", dismiss: "إغلاق", newGoal: "هدف جديد", addCourse: "إضافة دورة", roadmap: "خارطة طريقك", courses: "دورات التعلّم", refresh: "تحديث", loading: "جارٍ تحميل الدورات…", emptyTitle: "لا توجد دورات بعد", emptyBody: "أضف أول هدف تعليمي أعلاه.", editCourse: "تعديل الدورة", saveChanges: "حفظ التغييرات", deleteConfirm: (name) => `هل تريد حذف «${name}»؟ لا يمكن التراجع عن ذلك.`, loadError: "تعذر تحميل الدورات", createError: "تعذر إنشاء الدورة", updateError: "تعذر تحديث الدورة", deleteError: "تعذر حذف الدورة" },
    form: { name: "اسم الدورة", namePlaceholder: "مثال: TypeScript المتقدم", description: "الوصف", descriptionPlaceholder: "ماذا تريد أن تتعلم؟", targetDate: "التاريخ المستهدف", status: "الحالة", cancel: "إلغاء", saving: "جارٍ الحفظ…", add: "إضافة دورة" },
    card: { target: "الموعد", edit: "تعديل", delete: "حذف" }, statuses: { "Not Started": "لم تبدأ", "In Progress": "قيد التقدم", Completed: "مكتملة" }, modal: { close: "إغلاق النافذة" },
    prompts: { ...en.prompts, eyebrow: "دراسة حالة في هندسة الأوامر", title: "الأوامر وراء المنتج.", subtitle: "سجل شفاف لكيفية استخدامي للذكاء الاصطناعي كشريك تطوير — من صياغة المنتج وإنشاء الواجهة إلى الاختبار والتصحيح والنشر.", stages: "مراحل للأوامر", humanDirected: "سير عمل يقوده الإنسان", evidenceDriven: "تحسين قائم على الأدلة", approach: "منهجي", approachTitle: "Vibe coding بمنهجية.", approachBody: "تعتمد جودة المنتج المبني بالذكاء الاصطناعي على جودة السياق وحلقات التغذية الراجعة. وجّهت هذه المبادئ الثلاثة كل أمر في المشروع.", library: "مكتبة الأوامر", libraryTitle: "من الفكرة إلى النشر.", editHint: "تتم إدارة محتوى الأوامر في frontend/src/content/prompts.ts.", promptLabel: "الأمر (بالإنجليزية)", promptNumber: "PROMPT", takeaway: "الخلاصة", quote: "“سرّع الذكاء الاصطناعي التنفيذ، وشكّلت النية الواضحة والمراجعة النقدية والتحقق المتكرر المنتج.”", principles: [["01", "قدّم السياق", "حدّد هدف المنتج والجمهور والقيود وحالة المشروع الحالية."], ["02", "أنشئ حلقات تغذية راجعة", "اطلب من الذكاء الاصطناعي البناء والاختبار وفحص الأدلة والتحسين، لا توليد الشيفرة فقط."], ["03", "حافظ على الحكم البشري", "راجع المفاضلات وارفض الاقتراحات الضعيفة واتخذ قرارات المنتج النهائية."]] },
  },
};

const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: Translation } | null>(null);

function getInitialLocale(): Locale {
  const saved = localStorage.getItem("codecrafthub-locale");
  if (LOCALES.includes(saved as Locale)) return saved as Locale;
  const browser = navigator.language;
  if (browser.startsWith("zh-TW") || browser.startsWith("zh-HK")) return "zh-TW";
  if (browser.startsWith("zh")) return "zh-CN";
  if (browser.startsWith("he")) return "he";
  if (browser.startsWith("ar")) return "ar";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  useEffect(() => {
    localStorage.setItem("codecrafthub-locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
    document.title = window.location.pathname.replace(/\/$/, "") === "/prompts"
      ? `${translations[locale].nav.prompts} | CodeCraftHub`
      : `CodeCraftHub | ${translations[locale].nav.dashboard}`;
  }, [locale]);
  return <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}

export function localeForDates(locale: Locale) {
  return locale === "zh-CN" ? "zh-CN" : locale === "zh-TW" ? "zh-TW" : locale;
}

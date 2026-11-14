const lessons = [
  {
    title: "اطبع أول رسالة",
    language: "Python",
    level: "مبتدئ",
    topic: "الأساسيات",
    summary: "تعرّف على الدالة print واستخدمها لعرض نص في الطرفية.",
    goal: "بنهاية الدرس، ستتمكن من طباعة رسالة بسيطة.",
    code: 'print("مرحبًا بالعالم!")',
    tags: "طباعة بداية مخرجات"
  },
  {
    title: "احفظ قيمة في متغير",
    language: "Python",
    level: "مبتدئ",
    topic: "المتغيرات",
    summary: "استخدم اسمًا واضحًا لتخزين قيمة وإعادة استخدامها.",
    goal: "جرّب تغيير قيمة المتغير ولاحظ اختلاف الناتج.",
    code: `name = "سارة"
print("أهلًا", name)`,
    tags: "متغير نص string"
  },
  {
    title: "اتخذ قرارًا باستخدام if",
    language: "Python",
    level: "مبتدئ",
    topic: "الشروط",
    summary: "اجعل البرنامج ينفذ تعليمات مختلفة حسب تحقق شرط.",
    goal: "غيّر قيمة age ولاحظ كيف يتغير النص المطبوع.",
    code: `age = 18
if age >= 18:
    print("بالغ")
else:
    print("أقل من 18")`,
    tags: "شرط مقارنة if else"
  },
  {
    title: "كرّر خطوة باستخدام for",
    language: "Python",
    level: "مبتدئ",
    topic: "الحلقات",
    summary: "استخدم حلقة for لتنفيذ تعليمة مرة لكل عنصر في مجموعة.",
    goal: "جرّب إضافة اسم جديد إلى القائمة.",
    code: `for name in ["ليلى", "عمر", "نور"]:
    print("مرحبًا", name)`,
    tags: "تكرار حلقة قائمة"
  },
  {
    title: "اكتب عنوانًا وفقرة في HTML",
    language: "HTML",
    level: "مبتدئ",
    topic: "بنية الصفحة",
    summary: "استخدم عناصر HTML الدلالية لعرض عنوان وفقرة.",
    goal: "بدّل النصوص ولاحظ كيف تظهر داخل المتصفح.",
    code: `<h1>صفحتي الأولى</h1>
<p>أتعلم بناء صفحات الويب.</p>`,
    tags: "ويب عناصر وسوم صفحة"
  },
  {
    title: "أضف رابطًا إلى صفحة",
    language: "HTML",
    level: "مبتدئ",
    topic: "الروابط",
    summary: "أنشئ رابطًا باستخدام العنصر a والخاصية href.",
    goal: "استبدل قيمة href بعنوان موثوق وجرب الرابط.",
    code: '<a href="https://example.com">افتح الموقع</a>',
    tags: "ويب رابط href"
  }
];

const searchInput = document.querySelector("#search");
const languageFilter = document.querySelector("#language-filter");
const levelFilter = document.querySelector("#level-filter");
const resetButton = document.querySelector("#reset-filters");
const lessonList = document.querySelector("#lesson-list");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");

function normalizeText(value) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ar")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي");
}

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createLessonCard(lesson) {
  const card = document.createElement("article");
  card.className = "lesson-card";

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.append(
    createTextElement("span", "badge", lesson.language),
    createTextElement("span", "badge level", lesson.level),
    createTextElement("span", "badge", lesson.topic)
  );

  const title = createTextElement("h3", "", lesson.title);
  const summary = createTextElement("p", "", lesson.summary);
  const goal = createTextElement("p", "goal", lesson.goal);
  const code = document.createElement("pre");
  const codeElement = document.createElement("code");
  codeElement.textContent = lesson.code;
  code.append(codeElement);

  card.append(meta, title, summary, goal, code);
  return card;
}

function renderLessons() {
  const query = normalizeText(searchInput.value.trim());
  const language = languageFilter.value;
  const level = levelFilter.value;
  const filtered = lessons.filter((lesson) => {
    const searchable = normalizeText(
      [lesson.title, lesson.language, lesson.level, lesson.topic, lesson.summary, lesson.goal, lesson.tags, lesson.code].join(" ")
    );
    return (!query || searchable.includes(query))
      && (!language || lesson.language === language)
      && (!level || lesson.level === level);
  });

  lessonList.replaceChildren(...filtered.map(createLessonCard));
  resultCount.textContent = `عرض ${filtered.length} من ${lessons.length} دروس`;
  emptyState.hidden = filtered.length !== 0;
}

addOptions(languageFilter, [...new Set(lessons.map((lesson) => lesson.language))]);
addOptions(levelFilter, [...new Set(lessons.map((lesson) => lesson.level))]);

searchInput.addEventListener("input", renderLessons);
languageFilter.addEventListener("change", renderLessons);
levelFilter.addEventListener("change", renderLessons);
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  languageFilter.value = "";
  levelFilter.value = "";
  renderLessons();
  searchInput.focus();
});

renderLessons();

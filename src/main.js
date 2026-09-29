import DOMPurify from "dompurify";
import { marked } from "marked";
import { loadLessons, searchLessons } from "./data/lessons.js";
import "./styles.css";

const languageNames = {
  go: "Go",
  python: "Python",
  rust: "Rust",
};
const difficultyNames = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};
const app = document.querySelector("#app");
const lessons = loadLessons();

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function createSelect(id, label, options, emptyLabel) {
  const wrapper = element("label", "filter");
  wrapper.htmlFor = id;
  wrapper.append(element("span", "", label));

  const select = element("select");
  select.id = id;
  select.append(new Option(emptyLabel, ""));
  for (const [value, name] of options) select.append(new Option(name, value));
  wrapper.append(select);
  return wrapper;
}

function renderCard(lesson) {
  const card = element("article", "lesson-card");
  const heading = element("h2");
  const openLink = element("a", "", lesson.title);
  openLink.href = `#lesson/${encodeURIComponent(lesson.id)}`;
  heading.append(openLink);
  card.append(heading);
  card.append(element("p", "lesson-summary", lesson.summary));

  const metadata = element("div", "lesson-metadata");
  metadata.append(
    element(
      "span",
      "badge language",
      languageNames[lesson.language] ?? lesson.language,
    ),
  );
  metadata.append(
    element(
      "span",
      "badge",
      difficultyNames[lesson.difficulty] ?? lesson.difficulty,
    ),
  );
  card.append(metadata);

  const tags = element("ul", "tag-list");
  for (const tag of lesson.tags) tags.append(element("li", "", tag));
  card.append(tags);
  return card;
}

function renderList() {
  const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const query = params.get("q") ?? "";
  const language = params.get("language") ?? "";
  const difficulty = params.get("difficulty") ?? "";

  app.replaceChildren();
  const shell = element("main", "page-shell");
  const header = element("header", "hero");
  header.append(element("p", "eyebrow", "مساحة عربية لتعلّم البرمجة"));
  header.append(element("h1", "", "تعلّم البرمجة خطوة بخطوة"));
  header.append(
    element("p", "hero-copy", "ابحث بين الدروس واختر ما يناسب مستواك."),
  );
  shell.append(header);

  const controls = element("section", "controls");
  controls.setAttribute("aria-label", "البحث والتصفية");
  const searchLabel = element("label", "search-field");
  searchLabel.htmlFor = "lesson-search";
  searchLabel.append(element("span", "", "ابحث في الدروس"));
  const searchInput = element("input");
  searchInput.id = "lesson-search";
  searchInput.type = "search";
  searchInput.placeholder = "مثال: المتغيرات أو Python";
  searchInput.value = query;
  searchLabel.append(searchInput);
  controls.append(searchLabel);
  controls.append(
    createSelect(
      "language-filter",
      "اللغة",
      [...new Set(lessons.map(({ language: value }) => value))]
        .sort()
        .map((value) => [value, languageNames[value] ?? value]),
      "كل اللغات",
    ),
  );
  controls.append(
    createSelect(
      "difficulty-filter",
      "المستوى",
      Object.entries(difficultyNames),
      "كل المستويات",
    ),
  );
  shell.append(controls);

  const results = element("section", "results");
  const filtered = searchLessons(lessons, query).filter(
    (lesson) =>
      (!language || lesson.language === language) &&
      (!difficulty || lesson.difficulty === difficulty),
  );
  const resultsHeading = element(
    "h2",
    "results-heading",
    `${filtered.length} ${filtered.length === 1 ? "درس" : "دروس"}`,
  );
  results.append(resultsHeading);

  if (filtered.length) {
    const grid = element("div", "lesson-grid");
    for (const lesson of filtered) grid.append(renderCard(lesson));
    results.append(grid);
  } else {
    results.append(
      element(
        "p",
        "empty-state",
        "لا توجد دروس مطابقة. جرّب تغيير البحث أو الفلاتر.",
      ),
    );
  }

  shell.append(results);
  app.append(shell);

  const updateHash = () => {
    const nextParams = new URLSearchParams();
    if (searchInput.value.trim()) nextParams.set("q", searchInput.value.trim());
    const selectedLanguage = shell.querySelector("#language-filter").value;
    const selectedDifficulty = shell.querySelector("#difficulty-filter").value;
    if (selectedLanguage) nextParams.set("language", selectedLanguage);
    if (selectedDifficulty) nextParams.set("difficulty", selectedDifficulty);
    const queryString = nextParams.toString();
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${queryString ? `#?${queryString}` : ""}`,
    );
    renderList();
    const input = app.querySelector("#lesson-search");
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  };

  shell.querySelector("#language-filter").value = language;
  shell.querySelector("#difficulty-filter").value = difficulty;
  searchInput.addEventListener("input", updateHash);
  shell
    .querySelector("#language-filter")
    .addEventListener("change", updateHash);
  shell
    .querySelector("#difficulty-filter")
    .addEventListener("change", updateHash);
}

function renderLesson(lesson) {
  app.replaceChildren();
  const shell = element("main", "page-shell detail-shell");
  const backLink = element("a", "back-link", "→ العودة إلى قائمة الدروس");
  backLink.href = "#";
  shell.append(backLink);

  const article = element("article", "lesson-detail");
  article.append(
    element("p", "eyebrow", languageNames[lesson.language] ?? lesson.language),
  );
  article.append(element("h1", "", lesson.title));
  article.append(element("p", "lesson-summary", lesson.summary));
  const metadata = element("div", "lesson-metadata");
  metadata.append(
    element(
      "span",
      "badge language",
      languageNames[lesson.language] ?? lesson.language,
    ),
  );
  metadata.append(
    element(
      "span",
      "badge",
      difficultyNames[lesson.difficulty] ?? lesson.difficulty,
    ),
  );
  article.append(metadata);

  const body = element("div", "markdown-body");
  body.innerHTML = DOMPurify.sanitize(marked.parse(lesson.content));
  article.append(body);
  shell.append(article);
  app.append(shell);
}

function render() {
  const match = window.location.hash.match(/^#lesson\/([^?]+)/);
  if (!match) {
    renderList();
    return;
  }

  const lessonId = decodeURIComponent(match[1]);
  const lesson = lessons.find(({ id }) => id === lessonId);
  if (lesson) renderLesson(lesson);
  else {
    window.location.hash = "";
    renderList();
  }
}

window.addEventListener("hashchange", render);
render();

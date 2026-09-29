import { parseLesson } from "./lesson-utils.js";

export { parseLesson, searchLessons } from "./lesson-utils.js";

const lessonFiles = import.meta.glob("../../content/lessons/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export function loadLessons() {
  const lessons = Object.entries(lessonFiles).map(([filePath, markdown]) =>
    parseLesson(markdown, filePath),
  );
  const ids = new Set();

  for (const lesson of lessons) {
    if (ids.has(lesson.id))
      throw new Error(`Duplicate lesson id: ${lesson.id}`);
    ids.add(lesson.id);
  }

  return lessons.sort((first, second) =>
    first.title.localeCompare(second.title, "ar"),
  );
}

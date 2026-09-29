import Fuse from "fuse.js";
import { parse as parseYaml } from "yaml";

const requiredFields = [
  "id",
  "title",
  "language",
  "category",
  "tags",
  "difficulty",
  "summary",
  "created_at",
  "updated_at",
];
const validDifficulties = ["beginner", "intermediate", "advanced"];

export function parseLesson(markdown, filePath = "lesson.md") {
  const frontmatter = markdown.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
  );
  if (!frontmatter)
    throw new Error(`${filePath}: YAML frontmatter is required`);

  let data;
  try {
    data = parseYaml(frontmatter[1]);
  } catch (error) {
    throw new Error(`${filePath}: invalid YAML frontmatter: ${error.message}`);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${filePath}: frontmatter must be a YAML mapping`);
  }

  const missingFields = requiredFields.filter((field) => data[field] == null);
  if (missingFields.length) {
    throw new Error(
      `${filePath}: missing required fields: ${missingFields.join(", ")}`,
    );
  }

  if (
    !Array.isArray(data.tags) ||
    !data.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error(`${filePath}: tags must be a list of strings`);
  }

  if (!validDifficulties.includes(data.difficulty)) {
    throw new Error(
      `${filePath}: difficulty must be beginner, intermediate, or advanced`,
    );
  }

  for (const field of [
    "id",
    "title",
    "language",
    "category",
    "summary",
    "created_at",
    "updated_at",
  ]) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error(`${filePath}: ${field} must be a non-empty string`);
    }
  }

  return {
    ...data,
    content: markdown.slice(frontmatter[0].length).trim(),
    filePath,
  };
}

export function searchLessons(lessons, query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return lessons;

  const fuse = new Fuse(lessons, {
    keys: ["title", "summary", "tags", "content", "category"],
    threshold: 0.35,
    ignoreLocation: true,
  });

  return fuse.search(normalizedQuery).map(({ item }) => item);
}

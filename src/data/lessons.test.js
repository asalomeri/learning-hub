import assert from "node:assert/strict";
import test from "node:test";
import { parseLesson, searchLessons } from "./lesson-utils.js";

const sample = `---
id: variables
title: المتغيرات
language: python
category: basics
tags: [Python, متغيرات]
difficulty: beginner
summary: مقدمة عن المتغيرات
created_at: 2026-09-29
updated_at: 2026-09-29
---

المتغير يخزن قيمة.`;

test("parses lesson frontmatter and keeps Markdown content for search", () => {
  const lesson = parseLesson(sample, "python/variables.md");

  assert.equal(lesson.id, "variables");
  assert.deepEqual(lesson.tags, ["Python", "متغيرات"]);
  assert.match(lesson.content, /المتغير يخزن قيمة/);
  assert.equal(lesson.filePath, "python/variables.md");
});

test("rejects lessons missing required frontmatter fields", () => {
  assert.throws(() => parseLesson("---\ntitle: ناقص\n---\nنص", "broken.md"), {
    message: /broken\.md: missing required fields/,
  });
});

test("searches title, tags, and lesson content and returns all on an empty query", () => {
  const lesson = parseLesson(sample);
  const lessons = [lesson];

  assert.deepEqual(searchLessons(lessons, "متغيرات"), lessons);
  assert.deepEqual(searchLessons(lessons, "يخزن"), lessons);
  assert.deepEqual(searchLessons(lessons, "   "), lessons);
  assert.deepEqual(searchLessons(lessons, "rust"), []);
});

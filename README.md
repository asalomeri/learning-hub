# learning-hub

نظام بحث وفهرس تفاعلي للدروس العربية في البرمجة. تطبيق واجهة أمامية بسيط مبني باستخدام JavaScript وVite؛ تُخزّن الدروس كملفات Markdown محلية، ولا يحتاج المشروع إلى backend أو قاعدة بيانات.

## التشغيل بالعربية

### المتطلبات

- Node.js 22 أو أحدث
- npm

### التثبيت والتشغيل

```bash
npm install
npm run dev
```

افتح عنوان Vite المحلي الذي يظهر في الطرفية. لتشغيل التحقق والاختبارات والبناء:

```bash
npm run lint
npm test
npm run build
npm run preview
```

يتحقق `npm run format:check` من تنسيق الملفات باستخدام Prettier.

## صيغة الدروس

يوضع كل درس في ملف Markdown مستقل داخل `content/lessons/<language>/`. يجب أن يبدأ الملف بـ YAML frontmatter. المثال التالي يوضح الحقول المطلوبة:

```md
---
id: python-first-steps
title: خطواتك الأولى مع Python
language: python
category: basics
tags:
  - Python
  - البداية
difficulty: beginner
summary: تعرّف على المتغيرات والطباعة في Python.
created_at: 2026-09-29
updated_at: 2026-09-29
author: فريق مركز التعلّم
---

محتوى الدرس بصيغة Markdown.
```

### نموذج البيانات

| الحقل           | مطلوب؟ | الوصف                                                                                     |
| --------------- | ------ | ----------------------------------------------------------------------------------------- |
| `id`            | نعم    | معرّف فريد ثابت، يُفضّل أن يكون بصيغة kebab-case وأحرف لاتينية، مثل `python-first-steps`. |
| `title`         | نعم    | عنوان الدرس، ويدعم العربية.                                                               |
| `language`      | نعم    | رمز اللغة، مثل `python` أو `go` أو `rust`.                                                |
| `category`      | نعم    | تصنيف مختصر مثل `basics` أو `web`.                                                        |
| `tags`          | نعم    | قائمة نصية من الوسوم؛ استخدم تسميات واضحة ومتسقة مثل `Python` و`المتغيرات`.               |
| `difficulty`    | نعم    | المستوى: `beginner` أو `intermediate` أو `advanced`.                                      |
| `summary`       | نعم    | ملخص قصير يظهر في بطاقة الدرس ويُستخدم في البحث.                                          |
| `created_at`    | نعم    | تاريخ الإنشاء بصيغة `YYYY-MM-DD`.                                                         |
| `updated_at`    | نعم    | تاريخ آخر تحديث بصيغة `YYYY-MM-DD`.                                                       |
| `author`        | لا     | اسم الكاتب أو الفريق.                                                                     |
| `source`        | لا     | رابط أو مرجع مصدر الدرس.                                                                  |
| `series`        | لا     | اسم السلسلة التي ينتمي إليها الدرس.                                                       |
| `prerequisites` | لا     | قائمة بمعرّفات الدروس السابقة.                                                            |

متن Markdown بعد الـ frontmatter هو محتوى الدرس، ويُفهرس ضمن البحث. يعرض التطبيق Markdown بعد تنقيته قبل إدراجه في الصفحة.

## هيكل المشروع

```text
content/lessons/       دروس Markdown مرتبة حسب اللغة
src/data/lessons.js    تحميل الدروس والتحقق من بياناتها والبحث
src/main.js            واجهة القائمة والتفاصيل والفلاتر
src/styles.css         الأنماط العربية وRTL
.github/workflows/ci.yml  فحوصات CI
```

## الاختبارات والجودة

- ESLint: `npm run lint`
- اختبارات تحميل/بحث البيانات: `npm test`
- تنسيق Prettier: `npm run format:check`
- بناء الإنتاج: `npm run build`

يشغّل GitHub Actions lint والاختبارات وبناء Vite عند كل push أو pull request.

## English

An Arabic-first, RTL programming lesson index and search app built with JavaScript and Vite. Lessons are local Markdown files with YAML frontmatter. There is no backend or database.

### Requirements and commands

Use Node.js 22 or newer with npm.

```bash
npm install
npm run dev
npm run lint
npm test
npm run format:check
npm run build
npm run preview
```

### Lesson format

Add one Markdown file under `content/lessons/<language>/`. Required frontmatter fields are `id`, `title`, `language`, `category`, `tags`, `difficulty`, `summary`, `created_at`, and `updated_at`. Optional fields are `author`, `source`, `series`, and `prerequisites`. Use a unique kebab-case ID, an array of readable tags, `YYYY-MM-DD` dates, and one of `beginner`, `intermediate`, or `advanced` for difficulty. The Markdown body is searchable and rendered after sanitization.

The app provides local Fuse.js search across lesson titles, summaries, tags, categories, and Markdown body, plus language and difficulty filters. GitHub Actions runs lint, tests, and a production build.

---
id: go-first-steps
title: بداية البرمجة بلغة Go
language: go
category: basics
tags:
  - Go
  - البداية
  - الدوال
difficulty: beginner
summary: اكتب برنامج Go صغيرًا وتعرّف على الدالة main وطباعة النصوص.
created_at: 2026-09-29
updated_at: 2026-09-29
author: فريق مركز التعلّم
---

# أول برنامج Go

تبدأ البرامج التنفيذية في Go بالدالة `main`. المثال التالي يطبع رسالة في الطرفية:

```go
package main

import "fmt"

func main() {
    fmt.Println("مرحبًا من Go")
}
```

## تشغيل البرنامج

احفظ المثال في ملف `main.go` وشغّله باستخدام `go run main.go`. الحزمة `fmt` توفر أدوات تنسيق وطباعة النصوص.

---
id: rust-first-steps
title: أول خطواتك في Rust
language: rust
category: basics
tags:
  - Rust
  - البداية
  - المتغيرات
difficulty: beginner
summary: تعرّف على الدالة main والمتغيرات غير القابلة للتغيير في Rust.
created_at: 2026-09-29
updated_at: 2026-09-29
author: فريق مركز التعلّم
---

# أهلًا بلغة Rust

تبدأ نقطة تشغيل البرنامج في Rust بالدالة `main`. استخدم `println!` لطباعة رسالة:

```rust
fn main() {
    let greeting = "مرحبًا من Rust";
    println!("{greeting}");
}
```

## المتغيرات

تكون المتغيرات غير قابلة للتغيير افتراضيًا عند استخدام `let`. هذا يجعل التغييرات غير المقصودة أوضح. إذا احتجت إلى تغيير القيمة، أضف `mut`:

```rust
let mut count = 1;
count += 1;
```

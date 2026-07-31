---
title: "회고 미발행 초안"
date: 2026-07-31
category: "retrospective"
tags: ["회고", "초안"]
published: false
description: "리스트에서 제외되는 회고 초안 포스트입니다."
---

# 회고 초안 제목

## 공개 전 검토 포인트

### 배포 전 체크

현재 글은 `published: false` 이므로 목록에서 노출되지 않아야 합니다.

- 초안 상태 점검
  - 제목
  - 카테고리
  - 공개 여부
- 공개 전 정리 항목

1. 문장 다듬기
2. 오탈자 수정
3. 발행 상태 전환

```typescript
const isPublished = false;
if (!isPublished) {
  throw new Error('아직 공개되지 않은 초안입니다.');
}
```

[내부 링크](https://example.com/retro)

> 이 글은 목록에 노출되면 안 됩니다.

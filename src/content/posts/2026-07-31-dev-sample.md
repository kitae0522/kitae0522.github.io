---
title: "개발 샘플 글"
date: 2026-07-31
category: "dev"
tags: ["개발", "테스트"]
published: true
description: "개발 카테고리 테스트용 샘플 글입니다."
---

# 개발 샘플 제목

## 코드와 테스트

### 예시 코드

실제 개발 작업에서 자주 쓰는 타입 정의 예시입니다.

- TypeScript 타입 정리
- 에디터 자동완성 확인
  - strict 모드에서의 타입 좁히기
  - 유니언 타입 사용
- CI/CD 점검

1. 준비 단계
2. 검증 단계
3. 배포 단계

```typescript
type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  return theme === 'light' ? '기본 테마' : '선택 테마';
}
```

[개발 도구 문서](https://developer.mozilla.org)

> 개발자는 반복 가능한 결과를 추적 가능한 코드로 남겨야 합니다.

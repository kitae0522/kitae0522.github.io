# Orca 글 작성

Orca에서 이 블로그 워크스페이스를 열고 Terminal을 연 뒤 실행합니다.

```sh
npm run post:new
```

제목, 카테고리, 태그, 목록 설명을 입력하면 `src/content/posts/YYYY-MM-DD-001.md` 형식의 draft가 생성되고 Orca 편집기로 열립니다.

카테고리: `dev`, `review`, `retrospective`, `investment`, `daily`, `thought`, `career`, `other`.

이미지는 `src/content/images/`에 넣고 본문에서 상대 Markdown 링크로 사용합니다. 글을 공개할 때만 `published: true`로 바꿉니다.

비대화형 실행도 가능합니다.

```sh
npm run post:new -- --title "글 제목" --category review --tags "개발,기록" --description "글 목록 설명"
```

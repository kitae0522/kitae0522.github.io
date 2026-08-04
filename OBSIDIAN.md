# Obsidian 글 작성

이 저장소 폴더(`/Users/ted/Developer/blog`)를 Obsidian vault로 엽니다. 커뮤니티 플러그인은 사용하지 않습니다.

## 새 글

Obsidian Settings → Core plugins에서 `Templates`만 켭니다. Templates 설정의 `Template folder location`은 `templates`로 지정합니다.

`Cmd + N`으로 새 글을 만듭니다. 파일 이름을 글 제목으로 바꾼 뒤 `Cmd + P` → `Templates: Insert template` → `post`를 고릅니다. 원하면 `Templates: Insert template`에 단축키를 직접 연결합니다.

유효한 카테고리: `dev`, `review`, `retrospective`, `investment`, `daily`, `thought`, `career`, `other`.

## 이미지와 발행

본문에 이미지를 드래그하면 `src/content/images/`에 저장되고 상대 Markdown 링크가 삽입됩니다.

본문을 작성한 뒤 공개할 때만 `published: true`로 바꿉니다. 발행은 자동이 아닙니다. Git으로 commit/push한 뒤 Pages 배포를 확인합니다.

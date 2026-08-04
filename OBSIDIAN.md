# Obsidian 글 작성

이 저장소 폴더(`/Users/ted/Developer/blog`)를 Obsidian vault로 엽니다. 커뮤니티 플러그인은 사용하지 않습니다.

## 새 글

Raycast Settings → Script Commands → Add Script Directory에서 이 저장소의 `raycast/` 폴더를 한 번 추가합니다.

Raycast에서 `새 블로그 글`을 실행하면 제목, 카테고리, 태그, 목록 설명을 입력받고 `src/content/posts/`에 초안을 만든 뒤 Obsidian으로 엽니다. 명령에 단축키도 연결할 수 있습니다.

유효한 카테고리: `dev`, `review`, `retrospective`, `investment`, `daily`, `thought`, `career`, `other`.

## 이미지와 발행

본문에 이미지를 드래그하면 `src/content/images/`에 저장되고 상대 Markdown 링크가 삽입됩니다.

본문을 작성한 뒤 공개할 때만 `published: true`로 바꿉니다. 발행은 자동이 아닙니다. Git으로 commit/push한 뒤 Pages 배포를 확인합니다.

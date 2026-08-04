#!/bin/zsh

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title 새 블로그 글
# @raycast.mode compact

# Optional parameters:
# @raycast.icon ✍️
# @raycast.packageName Ted Song Blog

# Documentation:
# @raycast.description 카테고리와 frontmatter가 채워진 초안을 Obsidian에서 엽니다.

set -euo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "$0")" && pwd)"
BLOG_ROOT="$(cd -- "$SCRIPT_DIRECTORY/.." && pwd)"
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
NODE_BINARY="$(command -v node || true)"

if [[ -z "$NODE_BINARY" ]]; then
  echo "Node.js를 찾지 못했습니다. Raycast 환경의 PATH를 확인하세요."
  exit 1
fi

title=$(/usr/bin/osascript -e 'text returned of (display dialog "제목을 입력하세요." with title "새 블로그 글" default answer "" buttons {"취소", "다음"} default button "다음" cancel button "취소")' 2>/dev/null) || exit 0
[[ -n "$title" ]] || exit 0

category_label=$(/usr/bin/osascript -e 'set selectedCategory to choose from list {"개발", "리뷰", "회고", "투자", "일상", "생각", "커리어", "기타"} with title "새 블로그 글" with prompt "카테고리를 고르세요." default items {"개발"} OK button name "다음" cancel button name "취소" without multiple selections allowed and empty selection allowed' 2>/dev/null) || exit 0
[[ -n "$category_label" && "$category_label" != "false" ]] || exit 0

case "$category_label" in
  개발) category="dev" ;;
  리뷰) category="review" ;;
  회고) category="retrospective" ;;
  투자) category="investment" ;;
  일상) category="daily" ;;
  생각) category="thought" ;;
  커리어) category="career" ;;
  기타) category="other" ;;
  *)
    echo "알 수 없는 카테고리입니다."
    exit 1
    ;;
esac

tags=$(/usr/bin/osascript -e 'text returned of (display dialog "태그를 쉼표로 구분해 입력하세요. 비워도 됩니다." with title "새 블로그 글" default answer "" buttons {"취소", "다음"} default button "다음" cancel button "취소")' 2>/dev/null) || exit 0
description=$(/usr/bin/osascript -e 'text returned of (display dialog "글 목록에 보일 설명을 입력하세요. 비워도 됩니다." with title "새 블로그 글" default answer "" buttons {"취소", "완료"} default button "완료" cancel button "취소")' 2>/dev/null) || exit 0

result=$("$NODE_BINARY" "$BLOG_ROOT/scripts/create-post.mjs" \
  --title "$title" \
  --category "$category" \
  --tags "$tags" \
  --description "$description")
post_path="${result#초안 생성: }"

if [[ ! -f "$post_path" ]]; then
  echo "초안 경로를 찾지 못했습니다."
  exit 1
fi

/usr/bin/open -a "Obsidian" "$post_path"
echo "Obsidian에서 초안 열음: $(basename -- "$post_path")"

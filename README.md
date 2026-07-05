# ScreenStory v3

GitHub Pages용 정적 사이트. 빌드 도구나 Actions 없이 `main` 브랜치의 `/(root)`를 배포하면 된다.

## GitHub Pages

1. 새 GitHub repository 생성
2. 이 폴더 안의 파일을 저장소 최상단에 전부 업로드
3. `Settings → Pages`
4. `Source: Deploy from a branch`
5. `Branch: main`, folder: `/(root)` 선택 후 Save

## 포함 기능

- 배경 사진 업로드
- Apple system font stack (`-apple-system`) 사용
- 알림 추가/삭제, 같은 앱 알림 스택
- 전화 앱에서만 부재중 전화 알림
- 슬라이더와 드래그로 알림 위치 변경
- 미니/전체 음악 재생 화면
- PNG 저장

SF Pro 파일을 프로젝트에 포함하지 않는다. macOS/iOS에서는 시스템 San Francisco가 자동 적용되며, 다른 OS에서는 가까운 시스템 글꼴로 대체된다.

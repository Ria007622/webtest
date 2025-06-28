# 🚀 YOLO Travel - GitHub Pages 배포 완벽 가이드

## 📦 다운로드 파일
**파일명**: `yolo-travel-github-pages.tar.gz`

이 압축 파일에는 GitHub Pages에서 바로 호스팅할 수 있는 모든 파일이 포함되어 있습니다.

## 🔧 GitHub Pages 배포 단계

### 1단계: 파일 다운로드 및 압축 해제
```bash
# 다운로드한 파일 압축 해제
tar -xzf yolo-travel-github-pages.tar.gz
```

### 2단계: GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 저장소 이름: `webtest` (또는 원하는 이름)
3. Public으로 설정

### 3단계: 파일 업로드
```bash
# 압축 해제한 폴더에서 실행
git init
git add .
git commit -m "Initial commit: YOLO Travel site"
git branch -M main
git remote add origin https://github.com/ria007622/webtest.git
git push -u origin main
```

### 4단계: GitHub Pages 활성화
1. 저장소 Settings > Pages로 이동
2. Source를 "GitHub Actions"로 선택
3. 자동으로 배포 시작됨

### 5단계: 배포 완료 확인
- 배포 주소: `https://ria007622.github.io/webtest/Home/`
- Actions 탭에서 배포 상태 확인

## ✨ 사이트 특징

### 🎯 주요 기능
- **여행 스타일 선택**: 힐링, 맛집, 모험, 문화, 자연, 쇼핑
- **예산 계산기**: 실시간 예산 관리 및 차트 시각화
- **여행 후기**: 사용자 리뷰 시스템 (별점 포함)
- **FAQ/고객센터**: 카테고리별 FAQ 및 문의 기능
- **회원 시스템**: 로그인/회원가입 (브라우저 로컬 저장소 기반)

### 🔐 체험 계정
- **아이디**: `demo`
- **비밀번호**: `demo123`

### 💾 데이터 저장 방식
- 모든 데이터는 브라우저의 localStorage에 저장
- 서버 없이 완전한 정적 사이트로 작동
- 브라우저 데이터 삭제 시 저장된 정보도 함께 삭제됨

## 🛠️ 기술 스택

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui 컴포넌트
- **Vite** (빌드 도구)
- **Wouter** (라우팅)
- **LocalStorage** (데이터 저장)

### UI/UX
- 반응형 디자인 (모바일/데스크톱 대응)
- 다크 모드 지원
- 애니메이션 및 인터랙션
- 접근성 고려된 컴포넌트

## 📁 프로젝트 구조
```
├── client/              # 프론트엔드 소스
│   ├── src/
│   │   ├── components/  # 재사용 가능한 컴포넌트
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── lib/         # 유틸리티 및 설정
│   │   └── hooks/       # 커스텀 React 훅
├── .github/workflows/   # GitHub Actions 배포 설정
└── package.json         # 프로젝트 의존성
```

## 🔄 배포 자동화
- GitHub Actions를 통한 자동 배포
- main 브랜치에 push 시 자동으로 빌드 및 배포
- 배포 상태는 Actions 탭에서 확인 가능

## 📞 문제 해결

### 배포가 안 될 때
1. Repository Settings > Pages에서 Source가 "GitHub Actions"로 설정되었는지 확인
2. Actions 탭에서 오류 로그 확인
3. 저장소가 Public으로 설정되었는지 확인

### 사이트 접속이 안 될 때
- 배포 완료까지 2-3분 소요
- 캐시 문제 시 브라우저 새로고침 (Ctrl+F5)

### 로그인이 안 될 때
- 체험 계정: demo / demo123
- 새 계정 생성 후 이용 가능

## 🎉 배포 완료!
모든 단계를 완료하면 https://ria007622.github.io/webtest/Home/ 에서 YOLO Travel 사이트를 확인할 수 있습니다.

---
*이 가이드로 문제가 해결되지 않으면 GitHub Issues나 README 파일을 참고하세요.*